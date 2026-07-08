"use server";

import fs from "fs/promises";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import { db, bucket } from "../../lib/gcp";
import { revalidatePath } from "next/cache";

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
    const snapshot = await db.collection("certificates").count().get();
    const count = snapshot.data().count;
    const serialNumber = 1001 + count; // Start from 1001
    
    // Construct course code (APP for Programming, APD for Development/others)
    let courseCode = "APD";
    if (courseTitle.toLowerCase().includes("programming")) {
      courseCode = "APP";
    } else if (courseTitle.toLowerCase().includes("devops") || courseTitle.toLowerCase().includes("cloud")) {
      courseCode = "ADO";
    }
    
    const year = new Date().getFullYear().toString().slice(-2); // e.g. "26"
    const certId = `ATS/${courseCode}/${year}/${serialNumber}`;
    const fileId = certId.replace(/\//g, "-");

    // 2. Upload student profile photo to Google Cloud Storage
    const photoBuffer = Buffer.from(await photoFile.arrayBuffer());
    const photoExt = photoFile.name.split(".").pop() || "jpg";
    const photoPath = `photos/${fileId}.${photoExt}`;
    
    const photoFileRef = bucket.file(photoPath);
    await photoFileRef.save(photoBuffer, {
      contentType: photoFile.type || "image/jpeg",
      metadata: { cacheControl: "public, max-age=31536000" }
    });
    
    const photoUrl = `https://storage.googleapis.com/apex-certificates-501001/${photoPath}`;

    // 3. Write photo to a temporary local path so the Python script can read it
    const tempPhotoPath = `/tmp/${fileId}-photo.${photoExt}`;
    await fs.writeFile(tempPhotoPath, photoBuffer);

    // 4. Run the Python script to draw the certificate PDF
    const tempPdfPath = `/tmp/${fileId}.pdf`;
    
    // Format dynamic values safely for the shell command
    const sName = sanitizeShellArg(studentName);
    const cTitle = sanitizeShellArg(courseTitle);
    const dStart = sanitizeShellArg(dateStart);
    const dEnd = sanitizeShellArg(dateEnd);
    
    const cmd = `python3 scripts/edit_certificate_image.py -s "${sName}" -c "${cTitle}" -ds "${dStart}" -de "${dEnd}" -i "${certId}" -p "${tempPhotoPath}" -o "${tempPdfPath}"`;
    
    console.log(`Executing PDF compiler command: ${cmd}`);
    await execAsync(cmd);

    // 5. Read the generated PDF and upload it to Google Cloud Storage
    const pdfBuffer = await fs.readFile(tempPdfPath);
    const pdfPath = `certificates/${fileId}.pdf`;
    
    const pdfFileRef = bucket.file(pdfPath);
    await pdfFileRef.save(pdfBuffer, {
      contentType: "application/pdf",
      metadata: { cacheControl: "public, max-age=31536000" }
    });
    
    const pdfUrl = `https://storage.googleapis.com/apex-certificates-501001/${pdfPath}`;

    // 6. Save the certificate registry record to Firestore database
    const issueDateString = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
    
    const certRecord = {
      id: certId,
      studentName,
      courseTitle,
      dateStart,
      dateEnd,
      issueDate: issueDateString,
      photoUrl,
      pdfUrl,
      status: "active",
      createdAt: new Date().toISOString()
    };
    
    await db.collection("certificates").doc(fileId).set(certRecord);

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
    const snapshot = await db.collection("certificates").orderBy("createdAt", "desc").get();
    const certs = [];
    snapshot.forEach(doc => {
      certs.push(doc.data());
    });
    return certs;
  } catch (error) {
    console.error("Error retrieving certificates:", error);
    return [];
  }
}

export async function revokeCertificate(id, newStatus) {
  try {
    const fileId = id.replace(/\//g, "-");
    await db.collection("certificates").doc(fileId).update({
      status: newStatus
    });
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error revoking certificate:", error);
    return { success: false, error: error.message };
  }
}
