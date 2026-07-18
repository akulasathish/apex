"use server";

import fs from "fs/promises";
import path from "path";
import { sql } from "@vercel/postgres";
import { put, del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import QRCode from "qrcode";

// Native PDF Generator in JavaScript
async function generateCertificatePdfBuffer({ studentName, courseTitle, dateStart, dateEnd, certId, photoBuffer, photoType }) {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  // Load custom fonts
  const fontPathBold = path.join(process.cwd(), "scripts/fonts/LiberationSans-Bold.ttf");
  const fontPathSerifItalic = path.join(process.cwd(), "scripts/fonts/LiberationSerif-BoldItalic.ttf");

  const fontBoldBytes = await fs.readFile(fontPathBold);
  const fontSerifItalicBytes = await fs.readFile(fontPathSerifItalic);

  const fontSansBold = await pdfDoc.embedFont(fontBoldBytes);
  const fontSerifItalic = await pdfDoc.embedFont(fontSerifItalicBytes);

  // Load the background template image
  const templatePath = path.join(process.cwd(), "scripts/certificate_template.jpg");
  const templateBytes = await fs.readFile(templatePath);
  const templateImage = await pdfDoc.embedJpg(templateBytes);

  // Add page of template size: 1232 x 864
  const page = pdfDoc.addPage([1232, 864]);

  // Draw background image
  page.drawImage(templateImage, {
    x: 0,
    y: 0,
    width: 1232,
    height: 864,
  });

  const textColor = rgb(15/255, 23/255, 42/255);

  // 1. Draw Student Name (centered) Y: 410, size: 36
  const sName = studentName.toUpperCase();
  const nameWidth = fontSerifItalic.widthOfTextAtSize(sName, 36);
  const nameX = (1232 - nameWidth) / 2;
  const nameY = 864 - 410 - 36;
  page.drawText(sName, {
    x: nameX,
    y: nameY,
    size: 36,
    font: fontSerifItalic,
    color: textColor,
  });

  // 2. Draw Course Title (centered) Y: 505, size: 28
  const cTitle = courseTitle.toUpperCase();
  const courseWidth = fontSansBold.widthOfTextAtSize(cTitle, 28);
  const courseX = (1232 - courseWidth) / 2;
  const courseY = 864 - 505 - 28;
  page.drawText(cTitle, {
    x: courseX,
    y: courseY,
    size: 28,
    font: fontSansBold,
    color: textColor,
  });

  // 3. Draw Dates (centered) Y: 625, size: 22
  const datesText = `${dateStart.toUpperCase()} TO ${dateEnd.toUpperCase()}.`;
  const datesWidth = fontSansBold.widthOfTextAtSize(datesText, 22);
  const datesX = (1232 - datesWidth) / 2;
  const datesY = 864 - 625 - 22;
  page.drawText(datesText, {
    x: datesX,
    y: datesY,
    size: 22,
    font: fontSansBold,
    color: textColor,
  });

  // 4. Draw Certificate ID Y: 750, size: 17
  const idX = 230;
  const idY = 864 - 750 - 17;
  page.drawText(certId, {
    x: idX,
    y: idY,
    size: 17,
    font: fontSansBold,
    color: textColor,
  });

  // 5. Draw Student Photo (if provided)
  if (photoBuffer) {
    let embeddedPhoto;
    if (photoType && (photoType.includes("png") || photoType.includes("PNG"))) {
      embeddedPhoto = await pdfDoc.embedPng(photoBuffer);
    } else {
      embeddedPhoto = await pdfDoc.embedJpg(photoBuffer);
    }

    // Coordinates: X: 118, Y: 342, W: 155, H: 176
    page.drawImage(embeddedPhoto, {
      x: 118,
      y: 864 - 342 - 176,
      width: 155,
      height: 176,
    });

    // Draw border frame rectangle outline X: 117, Y: 341, W: 157, H: 178
    page.drawRectangle({
      x: 117,
      y: 864 - 341 - 178,
      width: 157,
      height: 178,
      borderColor: textColor,
      borderWidth: 1,
    });
  }

  // 6. Generate and Draw QR Code: X: 1005, Y: 602, size: 100x100
  const verificationUrl = `https://apextechsoftwareinstitute.com/verify/${certId}`;
  const qrBuffer = await QRCode.toBuffer(verificationUrl, { margin: 1, width: 100 });
  const qrImage = await pdfDoc.embedPng(qrBuffer);
  page.drawImage(qrImage, {
    x: 1005,
    y: 864 - 602 - 100,
    width: 100,
    height: 100,
  });

  // Serialize to PDF bytes
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
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
      contentType: photoFile.type || "image/jpeg",
      addRandomSuffix: false,
      allowOverwrite: true
    });

    // 3. Compile PDF in memory using pure JS (pdf-lib)
    console.log(`Compiling PDF for ${studentName} (${certId})...`);
    const pdfBuffer = await generateCertificatePdfBuffer({
      studentName,
      courseTitle,
      dateStart,
      dateEnd,
      certId,
      photoBuffer,
      photoType: photoFile.type
    });

    // 4. Upload the compiled PDF to Vercel Blob
    const pdfPath = `certificates/${fileId}.pdf`;
    const { url: pdfUrl } = await put(pdfPath, pdfBuffer, {
      access: "public",
      contentType: "application/pdf",
      addRandomSuffix: false,
      allowOverwrite: true
    });

    // 5. Save the certificate registry record to Vercel Postgres
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

    revalidatePath("/admin");
    return { success: true, certId };
  } catch (error) {
    console.error("Error issuing certificate:", error);
    return { success: false, error: error.message };
  }
}

function mapCertRow(cert) {
  return {
    ...cert,
    studentName: cert.student_name,
    courseTitle: cert.course_title,
    dateStart: cert.date_start,
    dateEnd: cert.date_end,
    issueDate: cert.issue_date,
    photoUrl: cert.photo_url,
    pdfUrl: cert.pdf_url,
    createdAt: cert.created_at
  };
}

export async function getCertificates() {
  try {
    // 1. Fetch from Postgres
    const { rows } = await sql`
      SELECT * FROM certificates ORDER BY created_at DESC
    `;

    // 2. Read fallback JSON file
    const filePath = path.join(process.cwd(), "src/data/certificates.json");
    let fallbackCerts = [];
    try {
      const fileContent = await fs.readFile(filePath, "utf8");
      fallbackCerts = JSON.parse(fileContent);
    } catch (err) {
      console.warn("Could not read fallback JSON:", err.message);
    }

    // 3. Find if any fallback certs are missing in the database
    const dbIds = new Set(rows.map(r => r.id));
    const missingCerts = fallbackCerts.filter(c => !dbIds.has(c.id));

    if (missingCerts.length > 0) {
      console.log(`Syncing ${missingCerts.length} missing certificates from JSON fallback to Postgres...`);
      for (const cert of missingCerts) {
        const photoUrl = cert.photoUrl || "";
        const pdfUrl = cert.pdfUrl || "";
        
        await sql`
          INSERT INTO certificates (id, student_name, course_title, date_start, date_end, issue_date, photo_url, pdf_url, status, created_at)
          VALUES (
            ${cert.id},
            ${cert.studentName},
            ${cert.courseTitle},
            ${cert.dateStart},
            ${cert.dateEnd},
            ${cert.issueDate},
            ${photoUrl},
            ${pdfUrl},
            ${cert.status || "active"},
            ${new Date().toISOString()}
          )
          ON CONFLICT (id) DO NOTHING
        `;
      }
      
      // Re-fetch to return the updated database list
      const { rows: updatedRows } = await sql`
        SELECT * FROM certificates ORDER BY created_at DESC
      `;
      return updatedRows.map(mapCertRow);
    }

    return rows.map(mapCertRow);
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
