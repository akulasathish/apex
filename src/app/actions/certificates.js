"use server";

import fs from "fs/promises";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import { supabase } from "../../lib/supabase";
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
    const { count, error: countErr } = await supabase
      .from("certificates")
      .select("*", { count: "exact", head: true });

    if (countErr) throw countErr;
    
    const serialNumber = 1001 + (count || 0); // Start from 1001
    
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

    // 2. Upload student profile photo to Supabase Storage bucket
    const photoBuffer = Buffer.from(await photoFile.arrayBuffer());
    const photoExt = photoFile.name.split(".").pop() || "jpg";
    const photoPath = `photos/${fileId}.${photoExt}`;
    
    const { error: photoUploadErr } = await supabase.storage
      .from("certificates")
      .upload(photoPath, photoBuffer, {
        contentType: photoFile.type || "image/jpeg",
        upsert: true
      });

    if (photoUploadErr) throw photoUploadErr;
    
    const { data: { publicUrl: photoUrl } } = supabase.storage
      .from("certificates")
      .getPublicUrl(photoPath);

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

    // 5. Read the generated PDF and upload it to Supabase Storage
    const pdfBuffer = await fs.readFile(tempPdfPath);
    const pdfPath = `certificates/${fileId}.pdf`;
    
    const { error: pdfUploadErr } = await supabase.storage
      .from("certificates")
      .upload(pdfPath, pdfBuffer, {
        contentType: "application/pdf",
        upsert: true
      });

    if (pdfUploadErr) throw pdfUploadErr;
    
    const { data: { publicUrl: pdfUrl } } = supabase.storage
      .from("certificates")
      .getPublicUrl(pdfPath);

    // 6. Save the certificate registry record to Supabase database
    const issueDateString = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
    
    const certRecord = {
      id: certId,
      student_name: studentName,
      course_title: courseTitle,
      date_start: dateStart,
      date_end: dateEnd,
      issue_date: issueDateString,
      photo_url: photoUrl,
      pdf_url: pdfUrl,
      status: "active",
      created_at: new Date().toISOString()
    };
    
    const { error: dbErr } = await supabase
      .from("certificates")
      .insert([certRecord]);

    if (dbErr) throw dbErr;

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
    const { data, error } = await supabase
      .from("certificates")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (data || []).map(cert => ({
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
    const { error } = await supabase
      .from("certificates")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error revoking certificate:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteCertificate(id) {
  try {
    const { data: certs, error: fetchErr } = await supabase
      .from("certificates")
      .select("*")
      .eq("id", id);

    if (fetchErr) throw fetchErr;
    if (!certs || certs.length === 0) {
      return { success: false, error: "Certificate not found." };
    }

    const data = certs[0];
    
    // 1. Delete PDF from Supabase Storage
    if (data.pdf_url) {
      const pdfPath = data.pdf_url.split('/').slice(-2).join('/');
      await supabase.storage.from("certificates").remove([pdfPath]).catch(err => console.warn(`Failed to delete PDF from storage: ${err.message}`));
    }
    
    // 2. Delete Photo from Supabase Storage
    if (data.photo_url) {
      const photoPath = data.photo_url.split('/').slice(-2).join('/');
      await supabase.storage.from("certificates").remove([photoPath]).catch(err => console.warn(`Failed to delete Photo from storage: ${err.message}`));
    }
    
    // 3. Delete Document from Supabase Database
    const { error: deleteErr } = await supabase
      .from("certificates")
      .delete()
      .eq("id", id);

    if (deleteErr) throw deleteErr;
    
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
    
    // Fetch admin from Supabase
    let { data: admin, error } = await supabase
      .from("admins")
      .select("*")
      .eq("email", docId)
      .maybeSingle();

    if (error) throw error;

    // Auto-seed if admins table has no records matching
    if (!admin) {
      const { data: allAdmins, error: checkErr } = await supabase
        .from("admins")
        .select("email")
        .limit(1);
      
      if (checkErr) throw checkErr;
      
      if (!allAdmins || allAdmins.length === 0) {
        // Table is empty, seed default
        const { error: seedErr } = await supabase
          .from("admins")
          .insert([
            {
              email: "saicharan@apextechsoftware.com",
              password: "8686113435@Akula"
            }
          ]);
        if (seedErr) throw seedErr;

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
