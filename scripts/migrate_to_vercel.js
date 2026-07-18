/**
 * Migration Script: GCP Firestore/Storage ➔ Vercel Postgres/Blob
 * 
 * Before running this script:
 * 1. Temporarily re-enable billing in GCP Console so the data suspension is lifted.
 * 2. Run 'gcloud auth application-default login' in your local terminal.
 * 3. Create a '.env.local' file in the root with:
 *    POSTGRES_URL="your_vercel_postgres_connection_string"
 *    BLOB_READ_WRITE_TOKEN="your_vercel_blob_read_write_token"
 * 4. Run: 'node scripts/migrate_to_vercel.js'
 */

const { Firestore } = require("@google-cloud/firestore");
const { Storage } = require("@google-cloud/storage");
const { createClient } = require("@vercel/postgres");
const { put } = require("@vercel/blob");
const dotenv = require("dotenv");
const path = require("path");

// Load local environment variables
dotenv.config({ path: path.join(process.cwd(), ".env.local") });
dotenv.config({ path: path.join(process.cwd(), ".env") });

const db = new Firestore({ projectId: "apex-501001" });
const storage = new Storage({ projectId: "apex-501001" });
const gcpBucket = storage.bucket("apex-certificates-501001");

async function migrate() {
  const vercelDb = createClient({
    connectionString: process.env.POSTGRES_URL
  });

  try {
    await vercelDb.connect();
    console.log("Connected successfully to Vercel Postgres.");

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      throw new Error("BLOB_READ_WRITE_TOKEN is missing in environment variables.");
    }

    console.log("Fetching all active certificates from Google Cloud Firestore...");
    const snapshot = await db.collection("certificates").get();
    
    if (snapshot.empty) {
      console.log("No certificates found in Firestore.");
      return;
    }

    console.log(`Found ${snapshot.size} certificate records to migrate. Starting file transfer...`);

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const certId = data.id;
      const fileId = certId.replace(/\//g, "-");

      console.log(`\n-----------------------------------------`);
      console.log(`Processing Certificate: ${certId} (${data.studentName})`);

      // 1. Download and migrate profile photo
      let newPhotoUrl = data.photoUrl;
      if (data.photoUrl && data.photoUrl.includes("storage.googleapis.com")) {
        const photoPath = data.photoUrl.split('/').slice(-2).join('/'); // e.g. "photos/file-id.jpg"
        console.log(`Downloading photo from GCS: ${photoPath}`);
        
        try {
          const [photoBuffer] = await gcpBucket.file(photoPath).download();
          console.log(`Uploading photo to Vercel Blob...`);
          const { url: photoBlobUrl } = await put(photoPath, photoBuffer, {
            access: "public",
            token: process.env.BLOB_READ_WRITE_TOKEN
          });
          newPhotoUrl = photoBlobUrl;
          console.log(`Photo uploaded. New URL: ${newPhotoUrl}`);
        } catch (err) {
          console.error(`Failed to migrate photo for ${certId}:`, err.message);
        }
      }

      // 2. Download and migrate PDF
      let newPdfUrl = data.pdfUrl;
      if (data.pdfUrl && data.pdfUrl.includes("storage.googleapis.com")) {
        const pdfPath = data.pdfUrl.split('/').slice(-2).join('/'); // e.g. "certificates/file-id.pdf"
        console.log(`Downloading PDF from GCS: ${pdfPath}`);
        
        try {
          const [pdfBuffer] = await gcpBucket.file(pdfPath).download();
          console.log(`Uploading PDF to Vercel Blob...`);
          const { url: pdfBlobUrl } = await put(pdfPath, pdfBuffer, {
            access: "public",
            token: process.env.BLOB_READ_WRITE_TOKEN
          });
          newPdfUrl = pdfBlobUrl;
          console.log(`PDF uploaded. New URL: ${newPdfUrl}`);
        } catch (err) {
          console.error(`Failed to migrate PDF for ${certId}:`, err.message);
        }
      }

      // 3. Save migrated certificate to Vercel Postgres database
      console.log(`Saving record to Vercel Postgres...`);
      await vercelDb.query(`
        INSERT INTO certificates (id, student_name, course_title, date_start, date_end, issue_date, photo_url, pdf_url, status, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (id) DO UPDATE SET
          student_name = EXCLUDED.student_name,
          course_title = EXCLUDED.course_title,
          date_start = EXCLUDED.date_start,
          date_end = EXCLUDED.date_end,
          issue_date = EXCLUDED.issue_date,
          photo_url = EXCLUDED.photo_url,
          pdf_url = EXCLUDED.pdf_url,
          status = EXCLUDED.status,
          created_at = EXCLUDED.created_at
      `, [
        certId,
        data.studentName,
        data.courseTitle,
        data.dateStart,
        data.dateEnd,
        data.issueDate,
        newPhotoUrl,
        newPdfUrl,
        data.status || "active",
        data.createdAt || new Date().toISOString()
      ]);
      
      console.log(`Successfully migrated record for ${certId}!`);
    }

    console.log(`\n=========================================`);
    console.log("Migration complete!");

  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await vercelDb.end();
  }
}

migrate();
