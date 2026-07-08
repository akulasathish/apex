"use client";

import { useState, useTransition, useRef } from "react";
import { issueCertificate, revokeCertificate } from "../actions/certificates";

export default function CertificateDashboard({ initialCertificates = [], courses = [] }) {
  const [certs, setCerts] = useState(initialCertificates);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);
  
  // Form fields state
  const [studentName, setStudentName] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  
  const fileInputRef = useRef(null);

  // Filter list
  const filteredCerts = certs.filter((c) =>
    c.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleIssueSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!studentName || !courseTitle || !dateStart || !dateEnd || !photoFile) {
      setFormError("Please fill out all fields and upload a student photo.");
      return;
    }

    const formData = new FormData();
    formData.append("studentName", studentName);
    formData.append("courseTitle", courseTitle);
    formData.append("dateStart", dateStart);
    formData.append("dateEnd", dateEnd);
    formData.append("photoFile", photoFile);

    startTransition(async () => {
      const result = await issueCertificate(formData);
      if (result.success) {
        setFormSuccess(`Certificate generated successfully with ID: ${result.certId}`);
        // Reset form
        setStudentName("");
        setCourseTitle("");
        setDateStart("");
        setDateEnd("");
        setPhotoFile(null);
        setPhotoPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        
        // Refresh local list: prepend a mock record until next full reload
        const newRecord = {
          id: result.certId,
          studentName,
          courseTitle,
          dateStart,
          dateEnd,
          issueDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          photoUrl: photoPreview, // Use temporary preview URL local
          pdfUrl: `https://storage.googleapis.com/apex-certificates-501001/certificates/${result.certId.replace(/\//g, "-")}.pdf`,
          status: "active",
          createdAt: new Date().toISOString()
        };
        setCerts(prev => [newRecord, ...prev]);
      } else {
        setFormError(result.error || "Failed to generate certificate.");
      }
    });
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "revoked" : "active";
    const confirmMsg = currentStatus === "active"
      ? "Are you sure you want to REVOKE this certificate? Employers will see a 'Revoked' status warning when scanning the QR code."
      : "Are you sure you want to RE-ACTIVATE this certificate?";
      
    if (!confirm(confirmMsg)) return;

    startTransition(async () => {
      const result = await revokeCertificate(id, newStatus);
      if (result.success) {
        setCerts(prev =>
          prev.map(c => (c.id === id ? { ...c, status: newStatus } : c))
        );
      } else {
        alert(`Failed to update status: ${result.error}`);
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* LEFT COLUMN: THE GENERATOR FORM */}
      <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6 self-start">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Issue New Certificate</h2>
          <p className="text-xs text-gray-400 mt-1">Fill out the student details and upload their photo to generate a secure credential.</p>
        </div>

        {formError && (
          <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-xl text-xs flex items-center gap-2">
            <i className="fa-solid fa-triangle-exclamation"></i>
            <p>{formError}</p>
          </div>
        )}

        {formSuccess && (
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 p-4 rounded-xl text-xs flex items-center gap-2">
            <i className="fa-solid fa-circle-check"></i>
            <p>{formSuccess}</p>
          </div>
        )}

        <form onSubmit={handleIssueSubmit} className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-extrabold text-gray-500 uppercase">Student Name</label>
            <input
              type="text"
              placeholder="e.g. Dhathri Ramidi"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-extrabold text-gray-500 uppercase">Course Title</label>
            <select
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 cursor-pointer"
              required
            >
              <option value="">Select Course...</option>
              <option value="Advanced Python Programming">Advanced Python Programming</option>
              <option value="Advanced Python Development">Advanced Python Development</option>
              <option value="AWS DevOps Cloud Engineering">AWS DevOps Cloud Engineering</option>
              <option value="Full-Stack Web Development">Full-Stack Web Development</option>
              <option value="Data Science & Artificial Intelligence">Data Science & AI</option>
              {courses.map((c) => (
                <option key={c.id} value={c.title}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-extrabold text-gray-500 uppercase">Start Date</label>
              <input
                type="text"
                placeholder="e.g. Jan 5th, 2025"
                value={dateStart}
                onChange={(e) => setDateStart(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-extrabold text-gray-500 uppercase">End Date</label>
              <input
                type="text"
                placeholder="e.g. June 3rd, 2025"
                value={dateEnd}
                onChange={(e) => setDateEnd(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-extrabold text-gray-500 uppercase">Student Photo</label>
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-gray-50/50 transition cursor-pointer relative">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                ref={fileInputRef}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                required={!photoPreview}
              />
              
              {photoPreview ? (
                <div className="flex items-center gap-4 w-full">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-16 h-20 object-cover rounded-lg border border-gray-200"
                  />
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-800 truncate max-w-[180px]">{photoFile?.name}</p>
                    <p className="text-[10px] text-gray-400">{(photoFile?.size / 1024).toFixed(1)} KB</p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPhotoFile(null);
                        setPhotoPreview(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      className="text-xs text-rose-500 font-bold hover:underline mt-1 block"
                    >
                      Change Photo
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center text-lg">
                    <i className="fa-solid fa-image"></i>
                  </div>
                  <span className="text-xs font-bold text-gray-500">Drag photo here or browse</span>
                  <span className="text-[9px] text-gray-400">Supports JPG, PNG (min 150x150px)</span>
                </>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm py-3 px-4 rounded-xl transition duration-150 shadow-md shadow-blue-500/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isPending ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating Certificate...
              </>
            ) : (
              <>
                <i className="fa-solid fa-wand-magic-sparkles"></i> Generate & Issue Certificate
              </>
            )}
          </button>
        </form>
      </div>

      {/* RIGHT COLUMN: THE CERTIFICATE REGISTRY LIST */}
      <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Issued Registry</h2>
            <p className="text-xs text-gray-400 mt-1">Review, download, or revoke existing credentials live in the registry.</p>
          </div>
          <div className="text-xs font-bold text-gray-400 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full">
            Total: {filteredCerts.length}
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by student name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 font-medium"
          />
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3.5 text-gray-400 text-sm"></i>
        </div>

        {/* LIST CARDS */}
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
          {filteredCerts.length === 0 ? (
            <div className="p-16 text-center border border-dashed border-gray-100 rounded-2xl">
              <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center text-xl mx-auto mb-3">
                <i className="fa-solid fa-stamp"></i>
              </div>
              <h4 className="text-sm font-bold text-slate-800">No Certificates Found</h4>
              <p className="text-xs text-gray-400 mt-0.5">There are no records matching your query.</p>
            </div>
          ) : (
            filteredCerts.map((c) => {
              const isRevoked = c.status === "revoked";
              return (
                <div key={c.id} className={`p-4 border rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition duration-150 ${
                  isRevoked ? "bg-rose-500/5 border-rose-500/20" : "bg-white border-gray-100 hover:border-gray-200 shadow-sm"
                }`}>
                  <div className="flex items-center gap-4">
                    <img
                      src={c.photoUrl || "/favicon.ico"}
                      alt={c.studentName}
                      className={`w-12 h-15 object-cover rounded-lg border ${isRevoked ? "border-rose-300/30 opacity-70" : "border-gray-100"}`}
                      onError={(e) => {
                        e.target.src = "/favicon.ico"; // Fallback if image fails to load
                      }}
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-slate-900 text-sm">{c.studentName}</span>
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                          isRevoked ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-600"
                        }`}>
                          {c.status}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-blue-500">{c.courseTitle}</p>
                      <div className="flex items-center gap-2 text-[10px] text-gray-400 font-medium flex-wrap">
                        <span>ID: <span className="font-mono text-slate-600 bg-gray-50 border border-gray-100 px-1 py-0.2 rounded">{c.id}</span></span>
                        <span>•</span>
                        <span>{c.dateStart} to {c.dateEnd}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {!isRevoked && c.pdfUrl && (
                      <a
                        href={c.pdfUrl}
                        download={`${c.id.replace(/\//g, "-")}.pdf`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-2.5 rounded-xl transition cursor-pointer text-sm font-bold flex items-center justify-center"
                        title="Download PDF"
                      >
                        <i className="fa-solid fa-download"></i>
                      </a>
                    )}
                    
                    <button
                      onClick={() => handleStatusToggle(c.id, c.status)}
                      disabled={isPending}
                      className={`p-2.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 ${
                        isRevoked
                          ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-600"
                          : "bg-rose-50 hover:bg-rose-100 text-rose-600"
                      }`}
                      title={isRevoked ? "Activate Certificate" : "Revoke Certificate"}
                    >
                      {isRevoked ? (
                        <>
                          <i className="fa-solid fa-check"></i> Activate
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-ban"></i> Revoke
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
