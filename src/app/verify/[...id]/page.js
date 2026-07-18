import { supabase } from "../../../lib/supabase";
import fs from "fs/promises";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";

// Look up certificate by ID in Supabase first, then fallback to local JSON file
async function getCertificate(id) {
  try {
    // 1. Query Supabase
    const { data: certs, error } = await supabase
      .from("certificates")
      .select("*")
      .eq("id", id);

    if (error) throw error;

    if (certs && certs.length > 0) {
      const cert = certs[0];
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

    // 2. Fallback to local registry JSON
    const filePath = path.join(process.cwd(), "src/data/certificates.json");
    const fileContent = await fs.readFile(filePath, "utf8");
    const certificates = JSON.parse(fileContent);
    return certificates.find((c) => c.id === id) || null;
  } catch (e) {
    console.error("Error reading certificates:", e);
    return null;
  }
}

export default async function VerifyPage({ params }) {
  const resolvedParams = await params;
  const idArray = resolvedParams.id;
  
  if (!idArray || idArray.length === 0) {
    notFound();
  }

  // Join the route array back to its original ID with slashes
  const id = idArray.join("/");
  const cert = await getCertificate(id);

  if (!cert) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#09090b] text-zinc-300 font-sans px-6">
        <div className="max-w-md w-full text-center bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-xl">
          <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-full flex items-center justify-center text-3xl mx-auto mb-5">
            <i className="fa-solid fa-circle-xmark"></i>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Verification Failed</h1>
          <p className="text-zinc-500 text-sm mt-3 leading-relaxed">
            The certificate ID <span className="font-mono text-rose-400 bg-rose-500/5 px-2 py-0.5 rounded border border-rose-500/10">{id}</span> could not be authenticated or found in the Apex registry.
          </p>
          <div className="mt-8">
            <Link href="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-2xl text-sm transition shadow-lg shadow-blue-600/20">
              Return to Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isActive = cert.status === "active";
  const pdfFilename = cert.id.replace(/\//g, "-") + ".pdf";
  const downloadUrl = cert.pdfUrl || `/certificates/${pdfFilename}`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b] text-zinc-300 font-sans px-6 relative py-12">
      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-80 h-80 bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-xl w-full bg-zinc-900/90 backdrop-blur-md border border-zinc-800 p-8 sm:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
        {/* Top multi-color accent strip */}
        <div className="absolute top-0 left-0 w-full h-1.5 flex">
          <div className="w-1/2 h-full bg-[#0B2540]" />
          <div className="w-1/2 h-full bg-[#00A3A6]" />
        </div>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl mx-auto mb-3 shadow-inner ${
            isActive 
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" 
              : "bg-rose-500/10 border border-rose-500/20 text-rose-400"
          }`}>
            <i className={isActive ? "fa-solid fa-circle-check" : "fa-solid fa-triangle-exclamation"}></i>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            {isActive ? "Credential Authenticated" : "Credential Revoked"}
          </h1>
          <p className="text-xs text-[#00A3A6] font-bold uppercase tracking-widest">ApexTech Software Institute Registry</p>
        </div>

        {/* Dynamic Student Graduation Photo */}
        {isActive && cert.photoUrl && (
          <div className="flex justify-center mt-6">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-zinc-800 p-1 bg-zinc-950 overflow-hidden shadow-xl">
              <img
                src={cert.photoUrl}
                alt={cert.studentName}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
        )}

        {/* Certificate Metadata Table */}
        <div className="mt-8 space-y-4 border-t border-b border-zinc-800/80 py-6 text-sm">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
            <span className="text-zinc-500 font-medium">Graduate Name</span>
            <span className="font-bold text-white text-base">{cert.studentName}</span>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
            <span className="text-zinc-500 font-medium">Certified Curriculum</span>
            <span className="font-bold text-blue-400 text-base">{cert.courseTitle}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
            <span className="text-zinc-500 font-medium">Training Duration</span>
            <span className="font-semibold text-zinc-300">{cert.dateStart} to {cert.dateEnd}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
            <span className="text-zinc-500 font-medium">Certificate ID</span>
            <span className="font-mono text-zinc-300 bg-zinc-950 border border-zinc-800 px-2 py-0.5 rounded text-xs">
              {cert.id}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
            <span className="text-zinc-500 font-medium">Conferred Date</span>
            <span className="font-semibold text-zinc-300">{cert.issueDate}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
            <span className="text-zinc-500 font-medium">Verification Status</span>
            <span className={`inline-flex font-bold px-3 py-1 rounded-full text-xs shadow-sm border ${
              isActive 
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                : "bg-rose-500/10 border-rose-500/20 text-rose-400"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full mr-2 self-center ${isActive ? "bg-emerald-400 animate-pulse" : "bg-rose-400"}`} />
              {cert.status.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-8 space-y-4">
          {isActive ? (
            <a
              href={downloadUrl}
              download={pdfFilename}
              className="w-full inline-flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-2xl transition duration-150 shadow-lg shadow-blue-600/10 text-sm cursor-pointer"
            >
              <i className="fa-solid fa-download mr-2 text-base"></i>Download Certified PDF
            </a>
          ) : (
            <div className="w-full inline-flex justify-center items-center bg-zinc-800 text-zinc-500 font-bold py-3.5 px-4 rounded-2xl text-sm border border-zinc-700 cursor-not-allowed">
              <i className="fa-solid fa-ban mr-2 text-base"></i>Download Unavailable (Revoked)
            </div>
          )}
          
          <div className="text-center">
            <Link href="/" className="text-xs font-semibold text-zinc-500 hover:text-zinc-300 transition">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
