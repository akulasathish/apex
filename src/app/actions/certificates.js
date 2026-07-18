"use server";

import fs from "fs/promises";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import { sql } from "@vercel/postgres";
import { put, del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const execAsync = promisify(exec);

// Helper to sanitize dynamic string arguments for shell safety
function sanitizeShellArg(str) {
  return str.replace(/(["\\])/g, "\\$1");
}

export async function issueCertificate(formData) {
  try {
    const studentName = formData.get("studentName")?.toString().trim();
    const courseTitle = formData.get("courseTitle")?.toString().trim();
    const dateStart = formData.get("dateStart")?.toString().trim();
    const dateEnd = formData.get("dateEnd")?.toString().trim();
    const photoFile = formData.get("photoFile");

    // Simple validation
    if (!studentName || !courseTitle || !dateStart || !dateEnd || !photoFile) {
      return { success: false, error: "All fields are required, including the student photo." };
    }

    // 1. Calculate the next sequential Certificate ID number
    const { rows } = await sql`SELECT COUNT(*)::int as count FROM certificates`;
    const count = rows[0]?.count || 0;
    const serialNumber = 1001 + count; // Start from 1001
    
    // Construct course code (APP for Programming, ADO for DevOps/Cloud, APD for others)
    let courseCode = "APD";
    if (courseTitle.toLowerCase().includes("programming")) {
      courseCode = "APP";
    } else if (courseTitle.toLowerCase().includes("devops") || courseTitle.toLowerCase().includes("cloud")) {
      courseCode = "ADO";
    }
    
    const year = new Date().getFullYear().toString().slice(-2); // e.g. "26"
    const certId = `ATS/${courseCode}/${year}/${serialNumber}`;
    const fileId = certId.replace(/\//g, "-");

    // 2. Upload student profile photo to Vercel Blob
    const photoBuffer = Buffer.from(await photoFile.arrayBuffer());
    const photoExt = photoFile.name.split(".").pop() || "jpg";
    const photoPath = `photos/${fileId}.${photoExt}`;
    
    const { url: photoUrl } = await put(photoPath, photoBuffer, {
      access: "public",
      contentType: photoFile.type || "image/jpeg"
    });

    // 3. Write photo to a temporary local path so the Python script can read it
    const tempPhotoPath = `/tmp/${fileId}-photo.${photoExt}`;
    await fs.writeFile(tempPhotoPath, photoBuffer);

    // 4. Run the Python script to draw the certificate PDF
    const tempPdfPath = `/tmp/${fileId}.pdf`;
    
    const sName = sanitizeShellArg(studentName);
    const cTitle = sanitizeShellArg(courseTitle);
    const dStart = sanitizeShellArg(dateStart);
    const dEnd = sanitizeShellArg(dateEnd);
    
    const cmd = `python3 scripts/edit_certificate_image.py -s "${sName}" -c "${cTitle}" -ds "${dStart}" -de "${dEnd}" -i "${certId}" -p "${tempPhotoPath}" -o "${tempPdfPath}"`;
    
    console.log(`Executing PDF compiler command: ${cmd}`);
    await execAsync(cmd);

    // 5. Read the generated PDF and upload it to Vercel Blob
    const pdfBuffer = await fs.readFile(tempPdfPath);
    const pdfPath = `certificates/${fileId}.pdf`;
    
    const { url: pdfUrl } = await put(pdfPath, pdfBuffer, {
      access: "public",
      contentType: "application/pdf"
    });

    // 6. Save the certificate registry record to Vercel Postgres
    const issueDateString = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
    
    await sql`
      INSERT INTO certificates (id, student_name, course_title, date_start, date_end, issue_date, photo_url, pdf_url, status, created_at)
      VALUES (
        ${certId},
        ${studentName},
        ${courseTitle},
        ${dateStart},
        ${dateEnd},
        ${issueDateString},
        ${photoUrl},
        ${pdfUrl},
        'active',
        ${new Date().toISOString()}
      )
    `;

    // 7. Cleanup temporary local files
    await fs.unlink(tempPhotoPath).catch(() => {});
    await fs.unlink(tempPdfPath).catch(() => {});

    revalidatePath("/admin");
    return { success: true, certId };
  } catch (error) {
    console.error("Error issuing certificate:", error);
    return { success: false, error: error.message };
  }
}

export async function getCertificates() {
  try {
    const { rows } = await sql`
      SELECT * FROM certificates ORDER BY created_at DESC
    `;

    return rows.map(cert => ({
      ...cert,
      studentName: cert.student_name,
      courseTitle: cert.course_title,
      dateStart: cert.date_start,
      dateEnd: cert.date_end,
      issueDate: cert.issue_date,
      photoUrl: cert.photo_url,
      pdfUrl: cert.pdf_url,
      createdAt: cert.created_at
    }));
  } catch (error) {
    console.error("Error retrieving certificates:", error);
    return [];
  }
}

export async function revokeCertificate(id, newStatus) {
  try {
    await sql`
      UPDATE certificates
      SET status = ${newStatus}
      WHERE id = ${id}
    `;

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error revoking certificate:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteCertificate(id) {
  try {
    const { rows } = await sql`
      SELECT * FROM certificates WHERE id = ${id}
    `;
    
    if (rows.length === 0) {
      return { success: false, error: "Certificate not found." };
    }

    const data = rows[0];
    
    // 1. Delete PDF from Vercel Blob
    if (data.pdf_url) {
      await del(data.pdf_url).catch(err => console.warn(`Failed to delete PDF from Blob: ${err.message}`));
    }
    
    // 2. Delete Photo from Vercel Blob
    if (data.photo_url) {
      await del(data.photo_url).catch(err => console.warn(`Failed to delete Photo from Blob: ${err.message}`));
    }
    
    // 3. Delete Document from Vercel Postgres
    await sql`
      DELETE FROM certificates WHERE id = ${id}
    `;
    
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error deleting certificate:", error);
    return { success: false, error: error.message };
  }
}

export async function loginAdmin(email, password) {
  try {
    const docId = email.toLowerCase().trim();
    
    // Fetch admin from Vercel Postgres
    const { rows } = await sql`
      SELECT * FROM admins WHERE email = ${docId}
    `;
    let admin = rows[0];

    // Auto-seed if admins table has no records matching
    if (!admin) {
      const { rows: allAdmins } = await sql`
        SELECT email FROM admins LIMIT 1
      `;
      
      if (allAdmins.length === 0) {
        // Table is empty, seed default
        await sql`
          INSERT INTO admins (email, password)
          VALUES ('saicharan@apextechsoftware.com', '8686113435@Akula')
        `;

        if (docId === "saicharan@apextechsoftware.com") {
          admin = {
            email: "saicharan@apextechsoftware.com",
            password: "8686113435@Akula"
          };
        }
      }
    }

    if (!admin || admin.password !== password) {
      return { success: false, error: "Invalid email or password." };
    }

    const cookieStore = await cookies();
    cookieStore.set("admin_logged_in", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/"
    });

    return { success: true };
  } catch (error) {
    console.error("Error logging in:", error);
    return { success: false, error: error.message };
  }
}

export async function logoutAdmin() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("admin_logged_in");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error logging out:", error);
    return { success: false, error: error.message };
  }
}
