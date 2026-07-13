import { notFound } from "next/navigation";
import courses from "../../../data/courses.json";
import ContactForm from "../../components/ContactForm";

export async function generateStaticParams() {
  return courses.map((course) => ({
    id: course.id,
  }));
}

const HIDE_PRICES = true;

export default async function CoursePage({ params }) {
  const { id } = await params;
  const course = courses.find((c) => c.id === id);

  if (!course) {
    notFound();
  }

  // Create a client-side download utility for text syllabus
  const textSyllabus = `
==================================================
APEX TECH SOFTWARE INSTITUTE - COURSE SYLLABUS
==================================================
Course: ${course.title}
Duration: ${course.duration}
Level: ${course.level}
--------------------------------------------------

COURSE SYLLABUS DETAILS:
${course.syllabus
  .map(
    (mod) => `
* ${mod.module}
  Topics Covered:
  ${mod.topics.map((t) => `  - ${t}`).join("\n")}
`
  )
  .join("\n")}

--------------------------------------------------
Contact ApexTech Software Institute, Kondapur, Hyderabad
Phone: +91 8977696937 | Email: hr@apextechsoftwareinstitute.com
==================================================
`;

  return (
    <>
      {/* HEADER & NAVIGATION */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
          <div className="apex-logo-container">
            <a href="/" className="flex items-center">
              <img src="/logo.png" alt="ATSI Logo" className="h-12 w-auto object-contain" />
            </a>
          </div>
          <nav className="flex flex-wrap justify-center gap-x-6 md:gap-x-8 gap-y-2 font-medium">
            <a href="/" className="text-gray-600 hover:text-blue-600 transition">Home</a>
            <a href="/#courses" className="text-blue-600 hover:text-blue-700 font-semibold">Courses</a>
            <a href="/#about" className="text-gray-600 hover:text-blue-600 transition">Why Us</a>
            <a href="/#contact" className="text-gray-600 hover:text-blue-600 transition">Contact</a>
          </nav>
          <div className="flex items-center space-x-4">
            <a href="tel:+918977696937" className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition shadow-sm hover:shadow-blue-500/10 flex items-center gap-2">
              <i className="fa-solid fa-phone"></i>
              <span>Call Now</span>
            </a>
          </div>
        </div>
      </header>

      {/* HERO / BREADCRUMBS BANNER */}
      <section className="bg-gradient-to-r from-slate-900 to-blue-950 text-white py-16 px-6 relative">
        <div className="container mx-auto max-w-6xl">
          {/* Breadcrumbs */}
          <nav className="text-sm text-gray-400 mb-4 flex items-center space-x-2">
            <a href="/" className="hover:text-blue-400 transition">Home</a>
            <i className="fa-solid fa-chevron-right text-[10px]"></i>
            <a href="/#courses" className="hover:text-blue-400 transition">Courses</a>
            <i className="fa-solid fa-chevron-right text-[10px]"></i>
            <span className="text-gray-200">{course.title}</span>
          </nav>

          <div className="space-y-4">
            <span className={`inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${course.id === 'aws-devops' ? 'bg-orange-600' : 'bg-blue-600'} text-white`}>
              {course.badge}
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">{course.title} Program Curriculum</h1>
            <p className="text-lg text-gray-300 max-w-3xl leading-relaxed">{course.description}</p>
            
            <div className="flex flex-wrap gap-4 md:gap-8 pt-2 text-sm">
              <div className="flex items-center gap-2 text-gray-300 bg-slate-800/60 px-4 py-2 rounded-xl border border-slate-700/50">
                <i className="fa-solid fa-calendar-day text-blue-400 text-base"></i>
                <span className="font-semibold">Duration:</span> {course.duration}
              </div>
              <div className="flex items-center gap-2 text-gray-300 bg-slate-800/60 px-4 py-2 rounded-xl border border-slate-700/50">
                <i className="fa-solid fa-graduation-cap text-teal-400 text-base"></i>
                <span className="font-semibold">Skill Level:</span> {course.level}
              </div>
              <div className="flex items-center gap-2 text-gray-300 bg-slate-800/60 px-4 py-2 rounded-xl border border-slate-700/50">
                <i className="fa-solid fa-certificate text-yellow-400 text-base"></i>
                <span>Industry Certificate Provided</span>
              </div>
            </div>

            {course.prices && !HIDE_PRICES && (
              <div className="pt-6 flex flex-col sm:flex-row gap-6">
                {course.prices.map((price, pIdx) => (
                  <div key={pIdx} className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-6 flex flex-col justify-center min-w-[250px]">
                    <span className="text-sm text-blue-300 font-black uppercase tracking-wider">{price.label}</span>
                    <span className="text-4xl font-black text-white mt-2">{price.amount}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* MAIN COURSE LAYOUT */}
      <main className="py-16 px-6 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            
            {/* Left 2 Columns: Curriculum Syllabus */}
            <div className="lg:col-span-2 space-y-8">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                <i className="fa-solid fa-list-ol text-blue-500"></i>
                Detailed Course Syllabus
              </h2>

              <div className="space-y-6">
                {course.syllabus.map((mod, modIdx) => (
                  <div key={modIdx} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition">
                    <div className="bg-slate-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                      <h3 className="font-extrabold text-slate-900 text-lg md:text-xl">
                        {mod.module}
                      </h3>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-bold">
                        Phase {modIdx + 1}
                      </span>
                    </div>
                    <div className="p-6">
                      <ul className="space-y-4">
                        {mod.topics.map((topic, topicIdx) => (
                          <li key={topicIdx} className="flex items-start gap-3 text-gray-700">
                            <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 text-sm font-bold border border-emerald-100 mt-0.5">
                              ✓
                            </span>
                            <span className="text-base leading-relaxed">{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Sidebar (Form & Highlights) */}
            <div className="space-y-8 lg:sticky lg:top-28">
              {/* Syllabus Action Card */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-2xl text-white shadow-xl border border-blue-500/10">
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <i className="fa-solid fa-file-pdf"></i> Download Official Syllabus
                </h3>
                <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                  Get a comprehensive offline PDF of this syllabus containing all lesson outcomes, lab assignments, and prerequisites.
                </p>
                
                {/* On-the-fly Syllabus Text Generator */}
                <a
                  href={course.id === "sap-erp" ? "/brochures/sap-course-brochure.pdf" : `data:text/plain;charset=utf-8,${encodeURIComponent(textSyllabus)}`}
                  download={course.id === "sap-erp" ? "SAP_ERP_Core_Program_ApexTech.pdf" : `${course.id}_curriculum_syllabus.txt`}
                  className="w-full bg-white hover:bg-slate-100 text-slate-900 font-bold py-3.5 px-6 rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <i className="fa-solid fa-download text-lg"></i>
                  <span>Download Curriculum</span>
                </a>
              </div>

              {/* Course Highlights Checklist */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <h4 className="font-extrabold text-slate-900 text-lg">Course Key Highlights</h4>
                <ul className="space-y-3">
                  {course.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-gray-700 text-sm">
                      <i className="fa-solid fa-circle-check text-green-500 mt-1 text-base"></i>
                      <span className="leading-relaxed font-semibold">{highlight}</span>
                    </li>
                  ))}
                  <li className="flex items-start gap-2.5 text-gray-700 text-sm">
                    <i className="fa-solid fa-circle-check text-green-500 mt-1 text-base"></i>
                    <span className="leading-relaxed font-semibold">100% Practical Hands-on Sandbox Labs</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-gray-700 text-sm">
                    <i className="fa-solid fa-circle-check text-green-500 mt-1 text-base"></i>
                    <span className="leading-relaxed font-semibold">Mock Technical Interviews & Resume Auditing</span>
                  </li>
                </ul>
              </div>

              {/* Course Inquiry Form */}
              <div>
                <ContactForm courses={courses} defaultCourse={course.id} />
              </div>
            </div>

          </div>

          {/* BACK TO HOME ACTION */}
          <div className="mt-12 text-center">
            <a href="/#courses" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700 hover:underline">
              <i className="fa-solid fa-arrow-left"></i>
              <span>Back to All Courses</span>
            </a>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-white py-12 px-6">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 gap-4 text-center md:text-left">
          <p>&copy; {new Date().getFullYear()} apextechsoftwareinstitute.com. All rights reserved.</p>
          <p className="max-w-md">Your tech journey starts here — Apex Tech Software Institute, Kondapur, Hyderabad. Join a batch today. Your future self will thank you.</p>
        </div>
      </footer>
    </>
  );
}
