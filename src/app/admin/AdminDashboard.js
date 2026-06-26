"use client";

import { useState, useTransition } from "react";
import { updateLeadStatus, deleteLead } from "../actions/contact";

export default function AdminDashboard({ initialLeads = [], courses = [] }) {
  const [leads, setLeads] = useState(initialLeads);
  const [filterCourse, setFilterCourse] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isPending, startTransition] = useTransition();
  const [actionError, setActionError] = useState(null);

  // Stats calculation
  const totalLeads = leads.length;
  const unreadLeads = leads.filter((l) => l.status === "unread").length;
  const contactedLeads = leads.filter((l) => l.status === "contacted").length;

  const handleStatusChange = async (id, newStatus) => {
    setActionError(null);
    startTransition(async () => {
      const res = await updateLeadStatus(id, newStatus);
      if (res.success) {
        setLeads((prev) =>
          prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
        );
      } else {
        setActionError(res.error);
      }
    });
  };

  const handleDeleteLead = async (id) => {
    if (!confirm("Are you sure you want to delete this enquiry? This action cannot be undone.")) {
      return;
    }
    setActionError(null);
    startTransition(async () => {
      const res = await deleteLead(id);
      if (res.success) {
        setLeads((prev) => prev.filter((l) => l.id !== id));
      } else {
        setActionError(res.error);
      }
    });
  };

  // Filtering logic
  const filteredLeads = leads.filter((lead) => {
    const matchCourse = filterCourse === "all" || lead.course === filterCourse;
    const matchStatus = filterStatus === "all" || lead.status === filterStatus;
    return matchCourse && matchStatus;
  });

  const getCourseTitle = (courseId) => {
    return courses.find((c) => c.id === courseId)?.title || courseId;
  };

  return (
    <div className="space-y-8">
      {actionError && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-xl flex items-center gap-2 text-sm">
          <i className="fa-solid fa-circle-exclamation text-base"></i>
          <p>{actionError}</p>
        </div>
      )}

      {/* LEAD ANALYTICS STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Total Enquiries</p>
            <h4 className="text-3xl font-extrabold text-slate-900 mt-1">{totalLeads}</h4>
          </div>
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-xl">
            <i className="fa-solid fa-users"></i>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">New / Unread</p>
            <h4 className="text-3xl font-extrabold text-amber-600 mt-1">{unreadLeads}</h4>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center text-xl animate-pulse">
            <i className="fa-solid fa-envelope-open-text"></i>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Contacted / Replied</p>
            <h4 className="text-3xl font-extrabold text-emerald-600 mt-1">{contactedLeads}</h4>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-xl">
            <i className="fa-solid fa-user-check"></i>
          </div>
        </div>
      </div>

      {/* FILTERS & SEARCH ROW */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <div className="flex flex-col gap-1 w-full sm:w-auto">
            <label className="text-xs font-bold text-gray-400 uppercase">Filter Course</label>
            <select
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 font-medium focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="all">All Courses</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1 w-full sm:w-auto">
            <label className="text-xs font-bold text-gray-400 uppercase">Filter Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 font-medium focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="unread">Unread</option>
              <option value="contacted">Contacted</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-gray-400 font-medium w-full md:w-auto text-right">
          Showing <span className="font-bold text-slate-700">{filteredLeads.length}</span> of{" "}
          <span className="font-bold text-slate-700">{totalLeads}</span> enquiries
        </div>
      </div>

      {/* LEADS LIST / TABLE */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {filteredLeads.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              <i className="fa-solid fa-folder-open"></i>
            </div>
            <h5 className="text-lg font-bold text-slate-800">No Enquiries Found</h5>
            <p className="text-gray-400 text-sm mt-1">
              There are no student leads matches matching your filter constraints.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-100 text-xs font-extrabold text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Student Details</th>
                  <th className="px-6 py-4">Course Requested</th>
                  <th className="px-6 py-4">Submission Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/50 transition duration-150">
                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        <p className="font-bold text-slate-900 text-base">{lead.name}</p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <i className="fa-solid fa-phone text-blue-500"></i> {lead.phone}
                          </span>
                          <span className="flex items-center gap-1">
                            <i className="fa-solid fa-envelope text-blue-500"></i> {lead.email}
                          </span>
                        </div>
                        {lead.message && (
                          <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg text-xs text-gray-600 max-w-md italic mt-2">
                            &ldquo;{lead.message}&rdquo;
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex bg-blue-50 text-blue-700 font-bold px-3 py-1.5 rounded-full text-xs border border-blue-100">
                        {getCourseTitle(lead.course)}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-gray-500">
                      <p className="font-medium">
                        {new Date(lead.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(lead.createdAt).toLocaleTimeString(undefined, {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        disabled={isPending}
                        className={`font-bold px-3 py-1.5 rounded-full text-xs border cursor-pointer focus:outline-none ${
                          lead.status === "unread"
                            ? "bg-amber-50 border-amber-200 text-amber-600"
                            : lead.status === "contacted"
                            ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                            : "bg-gray-100 border-gray-200 text-gray-500"
                        }`}
                      >
                        <option value="unread">Unread</option>
                        <option value="contacted">Contacted</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button
                        onClick={() => handleDeleteLead(lead.id)}
                        disabled={isPending}
                        className="text-rose-500 hover:text-rose-700 font-bold text-sm bg-rose-50 hover:bg-rose-100 p-2 rounded-xl transition cursor-pointer disabled:opacity-50"
                        title="Delete enquiry"
                      >
                        <i className="fa-solid fa-trash-can text-base"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
