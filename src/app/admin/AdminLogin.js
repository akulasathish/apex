"use client";

import { useState, useTransition } from "react";
import { loginAdmin } from "../actions/certificates";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    startTransition(async () => {
      const result = await loginAdmin(email, password);
      if (result.success) {
        // Successful login will refresh the page and cookie, showing the dashboard
        window.location.reload();
      } else {
        setError(result.error || "Invalid credentials.");
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b] text-zinc-300 font-sans px-6 relative py-12">
      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full bg-zinc-900/90 backdrop-blur-md border border-zinc-800 p-8 sm:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
        {/* Top accent strip */}
        <div className="absolute top-0 left-0 w-full h-1.5 flex">
          <div className="w-1/2 h-full bg-[#0B2540]" />
          <div className="w-1/2 h-full bg-[#00A3A6]" />
        </div>

        {/* Brand Header */}
        <div className="text-center space-y-2 mb-8">
          <img src="/logo.png" alt="Logo" className="h-14 w-auto mx-auto object-contain mb-4" />
          <h1 className="text-xl font-extrabold text-white tracking-tight">Staff Authentication</h1>
          <p className="text-xs text-[#00A3A6] font-bold uppercase tracking-widest">ApexTech Administration Portal</p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-xs flex items-center gap-2 mb-6">
            <i className="fa-solid fa-circle-exclamation text-base"></i>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <input
                type="email"
                placeholder="saicharan@apextechsoftware.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-blue-500 text-white font-medium"
                required
                disabled={isPending}
              />
              <i className="fa-solid fa-envelope absolute left-3.5 top-3.5 text-zinc-500 text-sm"></i>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider">Password</label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-blue-500 text-white font-medium"
                required
                disabled={isPending}
              />
              <i className="fa-solid fa-lock absolute left-3.5 top-3.5 text-zinc-500 text-sm"></i>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm py-3 px-4 rounded-xl transition duration-150 shadow-lg shadow-blue-600/10 flex items-center justify-center gap-2 cursor-pointer mt-6 disabled:opacity-50"
          >
            {isPending ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying Credentials...
              </>
            ) : (
              <>
                <i className="fa-solid fa-right-to-bracket"></i> Sign In to Dashboard
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-8">
          <a href="/" className="text-xs font-semibold text-zinc-500 hover:text-zinc-300 transition">
            <i className="fa-solid fa-arrow-left mr-1"></i> Return to main site
          </a>
        </div>
      </div>
    </div>
  );
}
