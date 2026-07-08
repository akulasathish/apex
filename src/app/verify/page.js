"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function VerifyIndexPage() {
  const [certId, setCertId] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!certId.trim()) return;
    
    // Redirect to the dynamic verification route
    // Clean up spaces or trailing slashes to prevent route errors
    const cleanedId = certId.trim().replace(/^\/|\/$/g, "");
    router.push(`/verify/${cleanedId}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b] text-zinc-300 font-sans px-6 relative py-12">
      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full bg-zinc-900/90 backdrop-blur-md border border-zinc-800 p-8 sm:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
        {/* Top multi-color accent strip */}
        <div className="absolute top-0 left-0 w-full h-1.5 flex">
          <div className="w-1/2 h-full bg-[#0B2540]" />
          <div className="w-1/2 h-full bg-[#00A3A6]" />
        </div>

        <div className="text-center space-y-3">
          <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-2xl mx-auto mb-3">
            <i className="fa-solid fa-shield-halved"></i>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Credential Verification</h1>
          <p className="text-sm text-zinc-400">
            Verify the authenticity of an ApexTech Software Institute certificate.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-2">
            <label htmlFor="cert-id" className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
              Enter Certificate ID
            </label>
            <div className="relative">
              <input
                id="cert-id"
                type="text"
                value={certId}
                onChange={(e) => setCertId(e.target.value)}
                placeholder="e.g. ATS/APD/23/0789"
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-white text-sm font-semibold tracking-wide placeholder-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-150"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600">
                <i className="fa-solid fa-barcode text-lg"></i>
              </div>
            </div>
            <p className="text-[11px] text-zinc-500 italic leading-relaxed">
              If focused, you can scan the certificate barcode to auto-fill the field.
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-2xl transition duration-150 shadow-lg shadow-blue-600/10 text-sm cursor-pointer"
          >
            Verify Credential
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="text-xs font-semibold text-zinc-500 hover:text-zinc-300 transition">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
