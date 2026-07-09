import { getLeads } from "../actions/contact";
import { getCertificates, logoutAdmin } from "../actions/certificates";
import courses from "../../data/courses.json";
import AdminDashboard from "./AdminDashboard";
import AdminLogin from "./AdminLogin";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.get("admin_logged_in")?.value === "true";

  if (!isLoggedIn) {
    return <AdminLogin />;
  }

  const initialLeads = await getLeads();
  const initialCertificates = await getCertificates();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="apex-logo-container">
            <a href="/" className="flex items-center">
              <img src="/logo.png" alt="ATSI Logo" className="h-12 w-auto object-contain" />
            </a>
          </div>
          
          <div className="flex items-center gap-6">
            <a href="/" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition flex items-center gap-1.5">
              <i className="fa-solid fa-home"></i> View Website
            </a>
            <form action={logoutAdmin}>
              <button type="submit" className="text-sm font-semibold text-rose-500 hover:text-rose-700 transition flex items-center gap-1.5 cursor-pointer">
                <i className="fa-solid fa-right-from-bracket"></i> Sign Out
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* DASHBOARD CONTAINER */}
      <main className="flex-1 py-12 px-6">
        <div className="container mx-auto max-w-6xl space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-6">
            <div>
              <span className="text-xs bg-indigo-100 text-indigo-700 font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border border-indigo-200">
                Staff Control Center
              </span>
              <h1 className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">ApexTech Administration Center</h1>
              <p className="text-gray-500 text-sm mt-1">Review student requests, callback status, and manage the Certificate Registry.</p>
            </div>
          </div>

          {/* Interactive Client Admin Dashboard */}
          <AdminDashboard initialLeads={initialLeads} initialCertificates={initialCertificates} courses={courses} />
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-100 py-6 text-center text-xs text-gray-400">
        <p>&copy; {new Date().getFullYear()} ApexTech CRM Admin Center. Kondapur, Hyderabad.</p>
      </footer>
    </div>
  );
}
