import courses from "../data/courses.json";
import ContactForm from "./components/ContactForm";

export default function Home() {
  const aiFeatures = [
    { text: "Google Cloud AI Ecosystem Focus", icon: "fa-solid fa-rocket", color: "text-red-400" },
    { text: "Gemini 1.5 Pro & Flash Integration", icon: "fa-solid fa-brain", color: "text-blue-400" },
    { text: "Vertex AI Studio Prompt Tuning", icon: "fa-solid fa-microchip", color: "text-teal-400" },
    { text: "Retrieval-Augmented Generation (RAG)", icon: "fa-solid fa-magnifying-glass", color: "text-amber-400" },
    { text: "Agentic Workflows & Multi-Tool Calling", icon: "fa-solid fa-diagram-project", color: "text-indigo-400" },
    { text: "Vertex AI Vector Search & Embeddings", icon: "fa-solid fa-database", color: "text-purple-400" },
    { text: "BigQuery ML Student Success Prediction", icon: "fa-solid fa-chart-line", color: "text-emerald-400" },
    { text: "MLOps & GenAIOps Pipelines", icon: "fa-solid fa-gears", color: "text-pink-400" },
    { text: "Enterprise AI Safety & Output Filters", icon: "fa-solid fa-shield-halved", color: "text-sky-400" }
  ];

  return (
    <>
      {/* GOOGLE CLOUD AI-FIRST MARQUEE TICKER */}
      <div className="w-full bg-slate-950 text-white border-b border-blue-500/10 py-3 overflow-hidden relative z-50 flex items-center select-none">
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none"></div>
        
        <div className="animate-marquee whitespace-nowrap flex items-center gap-12 text-xs font-bold uppercase tracking-wider">
          {/* First Render */}
          {aiFeatures.map((item, idx) => (
            <div key={`ai-f-1-${idx}`} className="flex items-center gap-3.5 mx-2">
              <i className={`${item.icon} ${item.color} text-sm`}></i>
              <span className="text-gray-200">{item.text}</span>
              <span className="text-blue-500/40 text-xs">•</span>
            </div>
          ))}
          {/* Second Render for Infinite Loop */}
          {aiFeatures.map((item, idx) => (
            <div key={`ai-f-2-${idx}`} className="flex items-center gap-3.5 mx-2">
              <i className={`${item.icon} ${item.color} text-sm`}></i>
              <span className="text-gray-200">{item.text}</span>
              <span className="text-blue-500/40 text-xs">•</span>
            </div>
          ))}
        </div>
      </div>

      {/* HEADER & NAVIGATION */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
          <div className="apex-logo-container">
            <a href="/" className="flex items-center">
              <img src="/logo.png" alt="ATSI Logo" className="h-16 w-auto object-contain" />
            </a>
          </div>
          
          <nav className="flex space-x-6 md:space-x-8 font-medium">
            <a href="#home" className="text-blue-600 hover:text-blue-700">Home</a>
            <a href="#courses" className="text-gray-600 hover:text-blue-600 transition">Courses</a>
            <a href="#about" className="text-gray-600 hover:text-blue-600 transition">Why Us</a>
            <a href="#contact" className="text-gray-600 hover:text-blue-600 transition">Contact</a>
          </nav>
          
          <div className="hidden lg:flex items-center space-x-4">
            <a href="tel:+918977696937" className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition shadow-sm hover:shadow-blue-500/10 flex items-center gap-2">
              <i className="fa-solid fa-phone"></i>
              <span>Call Now</span>
            </a>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section id="home" className="bg-gradient-to-r from-slate-900 via-slate-850 to-blue-950 text-white py-24 px-6 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl -ml-20 -mb-20"></div>

        <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between relative z-10 gap-12 lg:gap-8">
          {/* Left Side: Text Copy & Call-to-actions */}
          <div className="lg:w-7/12 space-y-6 text-center lg:text-left mb-10 lg:mb-0">
            <span className="inline-flex bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
              ⚡ GOOGLE CLOUD AI ECOSYSTEM COHORT
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
              Launch Your Cloud & <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">GenAI Career with Hands-On Labs</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto lg:mx-0">
              Master Vertex AI, Gemini 1.5, AWS DevOps, and Cyber Security. Gain real-world experience inside live Google Cloud sandboxes and build production-grade enterprise software.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <a href="#contact" className="bg-blue-500 hover:bg-blue-600 text-white text-center px-8 py-3.5 rounded-xl font-bold transition shadow-lg hover:shadow-blue-500/20">
                Enquire Today
              </a>
              <a href="#courses" className="border border-gray-500 text-center px-8 py-3.5 rounded-xl font-bold hover:bg-white hover:text-slate-900 transition">
                Explore Courses
              </a>
            </div>
          </div>

          {/* Right Side: Active Cohorts & GCP Live Sandbox Tracker Dashboard */}
          <div className="lg:w-5/12 w-full max-w-md mx-auto">
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
              {/* Subtle background card glows */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
              
              {/* Card Header */}
              <div className="flex justify-between items-center mb-5 border-b border-slate-800 pb-3.5">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs uppercase tracking-widest font-extrabold text-gray-400">Live Academy Tracker</span>
                </div>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2.5 py-0.5 rounded-full font-bold">Active Cohorts</span>
              </div>

              {/* Course Cohorts List (Scrollable to save space and look extremely premium!) */}
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                {/* Cohort 1: GCP & AI */}
                <div className="p-3 rounded-xl bg-slate-850/60 border border-slate-800/80 hover:border-blue-500/20 transition group">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-blue-400 transition">Google Cloud & GenAI</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5 font-medium">Vertex AI • Gemini 1.5 • RAG</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-blue-400">10 Enrolled</span>
                      <p className="text-[9px] text-emerald-400 mt-0.5 font-medium">Labs Active ●</p>
                    </div>
                  </div>
                </div>

                {/* Cohort 2: AWS & DevOps */}
                <div className="p-3 rounded-xl bg-slate-850/60 border border-slate-800/80 hover:border-orange-500/20 transition group">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-orange-400 transition">Advanced AWS & DevOps</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5 font-medium">Terraform • Docker • CI/CD Pipelines</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-orange-400">15 Enrolled</span>
                      <p className="text-[9px] text-emerald-400 mt-0.5 font-medium">Labs Active ●</p>
                    </div>
                  </div>
                </div>

                {/* Cohort 3: Cyber Security */}
                <div className="p-3 rounded-xl bg-slate-850/60 border border-slate-800/80 hover:border-red-500/20 transition group">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-red-400 transition">Cyber Security & Ethical Hacking</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5 font-medium">VAPT • Kali Linux • Wireshark</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-red-400">20 Enrolled</span>
                      <p className="text-[9px] text-emerald-400 mt-0.5 font-medium">Lab Drills ●</p>
                    </div>
                  </div>
                </div>

                {/* Cohort 4: GCP MLOps (SUGGESTED HIGH IMPACT!) */}
                <div className="p-3 rounded-xl bg-slate-850/60 border border-slate-800/80 hover:border-teal-500/20 transition group">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-teal-400 transition">MLOps & GenAIOps on GCP</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5 font-medium">Vertex Pipelines • BigQuery ML • Cloud Build</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-teal-400">8 Enrolled</span>
                      <p className="text-[9px] text-emerald-400 mt-0.5 font-medium">Pipelines Active ●</p>
                    </div>
                  </div>
                </div>

                {/* Cohort 5: Data Science & AI (SUGGESTED HIGH IMPACT!) */}
                <div className="p-3 rounded-xl bg-slate-850/60 border border-slate-800/80 hover:border-purple-500/20 transition group">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-purple-400 transition">Data Science & AI (ML)</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5 font-medium">Python • Scikit-Learn • TensorFlow</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-purple-400">12 Enrolled</span>
                      <p className="text-[9px] text-emerald-400 mt-0.5 font-medium">Training ●</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Google Cloud Sandbox Stats (Strategic Value Addition!) */}
              <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between text-center">
                <div>
                  <span className="text-lg font-black text-white">45+</span>
                  <p className="text-[9px] uppercase tracking-widest text-gray-400 mt-1">Active GCP Sandboxes</p>
                </div>
                <div className="h-8 w-px bg-slate-800"></div>
                <div>
                  <span className="text-lg font-black text-white">8.5K+</span>
                  <p className="text-[9px] uppercase tracking-widest text-gray-400 mt-1">Gemini API Requests</p>
                </div>
                <div className="h-8 w-px bg-slate-800"></div>
                <div>
                  <span className="text-lg font-black text-white">92%</span>
                  <p className="text-[9px] uppercase tracking-widest text-gray-400 mt-1">Lab Success Rate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTRODUCTORY WHY US SECTION */}
      <section className="py-20 bg-white px-6 border-b border-gray-100">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">Empowering Your Tech Journey</h2>
          <p className="text-xl text-gray-700 leading-relaxed italic mb-8 border-l-4 border-blue-500 pl-4 max-w-3xl mx-auto text-left sm:text-center">
            &ldquo;At Apex Tech Software Institute, we don&apos;t just teach technology—we build careers.&rdquo;
          </p>
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto text-justify sm:text-center">
            Our industry-focused training, hands-on projects, expert mentors, real-world case studies, and personalized career guidance help students gain practical skills that employers value. With dedicated placement assistance, interview preparation, resume building, and continuous professional development, we empower learners to confidently transition into successful IT careers and thrive in today&apos;s competitive technology landscape. 
          </p>
          <div className="mt-8 font-bold text-blue-600 text-xl">
            Apex Tech is where ambition meets opportunity and learning transforms into success.
          </div>
        </div>
      </section>

      {/* FLAGSHIP COURSE HIGHLIGHT (AWS & DEVOPS) */}
      <section className="py-16 bg-white px-6">
        <div className="container mx-auto">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50/50 rounded-3xl p-8 md:p-12 border border-blue-100 flex flex-col lg:flex-row items-center justify-between shadow-sm">
            <div className="lg:w-2/3 space-y-5 mb-6 lg:mb-0">
              <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm shadow-blue-500/10">
                Trending & Flagship
              </span>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Advanced AWS & DevOps Program</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Become a cloud professional. Our comprehensive training program covers everything from core AWS cloud infrastructure to advanced DevOps automation pipelines.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 font-medium text-gray-700">
                <div className="flex items-center"><i className="fa-solid fa-circle-check text-green-500 mr-2.5 text-base"></i>CI/CD Pipelines (Jenkins, GitHub Actions)</div>
                <div className="flex items-center"><i className="fa-solid fa-circle-check text-green-500 mr-2.5 text-base"></i>Infrastructure as Code (Terraform)</div>
                <div className="flex items-center"><i className="fa-solid fa-circle-check text-green-500 mr-2.5 text-base"></i>Containerization (Docker & Kubernetes)</div>
                <div className="flex items-center"><i className="fa-solid fa-circle-check text-green-500 mr-2.5 text-base"></i>AWS Certified Cloud Practitioner & SysOps</div>
              </div>
            </div>
            <div className="lg:w-1/4 text-center lg:text-right w-full sm:w-auto">
              <a href="/courses/aws-devops" className="inline-block w-full sm:w-auto bg-slate-900 text-white text-center font-bold px-8 py-4 rounded-xl hover:bg-slate-850 transition shadow-md hover:scale-[1.02] active:scale-[0.98]">
                View Full Curriculum
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ALL MAJOR IT COURSES SECTION */}
      <section id="courses" className="py-20 bg-gray-50 px-6">
        <div className="container mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">All Major IT Courses We Offer</h2>
            <p className="text-gray-600 text-lg">Whether you&apos;re a fresher, a graduate, or switching careers — we have a course built exactly for where you are right now.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div key={course.id} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition duration-300 border border-gray-100 flex flex-col justify-between group">
                <div>
                  <div className={`w-12 h-12 ${course.bgIcon} rounded-xl flex items-center justify-center text-xl font-bold mb-6 shadow-sm`}>
                    <i className={course.icon}></i>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-slate-800 tracking-tight group-hover:text-blue-600 transition">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                    {course.description}
                  </p>
                </div>
                <div className="border-t border-gray-100 pt-5 mt-auto flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                    <i className="fa-solid fa-clock text-blue-400"></i> {course.duration}
                  </span>
                  <a href={`/courses/${course.id}`} className="text-blue-600 font-bold text-sm hover:text-blue-700 hover:underline flex items-center gap-1.5 transition">
                    <span>View Curriculum</span>
                    <i className="fa-solid fa-arrow-right text-xs group-hover:translate-x-1 transition duration-300"></i>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APEX AI LABS - PROPRIETARY AI TECHNOLOGY SHOWCASE */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 text-white px-6 relative overflow-hidden">
        {/* Decorative glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
              Google Cloud Powered Proprietary AI Labs
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
              Apex AI Labs: Educational Technology
            </h2>
            <p className="text-gray-400 text-lg">
              At Apex Tech Software Institute, we don&apos;t just teach cloud and artificial intelligence — we build our own custom AI systems on Google Cloud infrastructure. Explore our proprietary EdTech solutions below.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Project 1: Apex Smart-Tutor */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 hover:border-blue-500/40 transition duration-300 shadow-xl relative group flex flex-col justify-between">
              <div>
                <span className="absolute top-4 right-6 text-xs bg-blue-500/20 text-blue-300 font-semibold px-3 py-1 rounded-full border border-blue-500/30">
                  Adaptive Learning
                </span>
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-blue-400 rounded-2xl flex items-center justify-center text-2xl font-bold mb-6 border border-blue-500/20">
                  <i className="fa-solid fa-robot"></i>
                </div>
                <h3 className="text-2xl font-bold mb-4 tracking-tight text-white group-hover:text-blue-400 transition">
                  Apex Smart-Tutor
                </h3>
                <p className="text-gray-400 text-base mb-6 leading-relaxed">
                  Our proprietary, RAG-enabled artificial intelligence mentor integrates directly into the student portal. Leveraging deep reasoning models, it offers students personalized 24/7 assistance, interactive curriculum queries, code reviews, and automatic lecture summaries.
                </p>
                <div className="space-y-3.5 mb-8">
                  <div className="flex items-start text-sm text-gray-300">
                    <i className="fa-solid fa-circle-check text-emerald-400 mt-1 mr-3"></i>
                    <span><strong>Gemini 1.5 Pro integration:</strong> Complete code reasoning and multi-turn educational coaching.</span>
                  </div>
                  <div className="flex items-start text-sm text-gray-300">
                    <i className="fa-solid fa-circle-check text-emerald-400 mt-1 mr-3"></i>
                    <span><strong>Contextual Grounding:</strong> Vector search over entire textbooks and classroom notes via Vertex AI Vector Search.</span>
                  </div>
                  <div className="flex items-start text-sm text-gray-300">
                    <i className="fa-solid fa-circle-check text-emerald-400 mt-1 mr-3"></i>
                    <span><strong>Serverless Hosting:</strong> Sub-second dynamic scaling and low API latency on Cloud Run.</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-800/80 pt-6 mt-auto">
                <p className="text-xs uppercase tracking-widest font-semibold text-slate-500 mb-3">Google Cloud Stack:</p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-blue-950 text-blue-300 px-2.5 py-1.5 rounded-lg border border-blue-900/50 font-medium">Gemini Pro API</span>
                  <span className="text-xs bg-blue-950 text-blue-300 px-2.5 py-1.5 rounded-lg border border-blue-900/50 font-medium">Vertex AI Vector Search</span>
                  <span className="text-xs bg-blue-950 text-blue-300 px-2.5 py-1.5 rounded-lg border border-blue-900/50 font-medium">Cloud Run</span>
                  <span className="text-xs bg-blue-950 text-blue-300 px-2.5 py-1.5 rounded-lg border border-blue-900/50 font-medium">Cloud Storage</span>
                </div>
              </div>
            </div>

            {/* Project 2: Apex AI Placement Matcher */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 hover:border-teal-500/40 transition duration-300 shadow-xl relative group flex flex-col justify-between">
              <div>
                <span className="absolute top-4 right-6 text-xs bg-teal-500/20 text-teal-300 font-semibold px-3 py-1 rounded-full border border-teal-500/30">
                  Career Analytics
                </span>
                <div className="w-14 h-14 bg-gradient-to-br from-teal-500/20 to-emerald-500/20 text-teal-400 rounded-2xl flex items-center justify-center text-2xl font-bold mb-6 border border-teal-500/20">
                  <i className="fa-solid fa-briefcase"></i>
                </div>
                <h3 className="text-2xl font-bold mb-4 tracking-tight text-white group-hover:text-teal-400 transition">
                  AI Talent Matcher & Placement Engine
                </h3>
                <p className="text-gray-400 text-base mb-6 leading-relaxed">
                  Our advanced data recommendation platform bridges the gap between student graduation and immediate professional employment. The system processes student portfolios and matches them in real-time against active corporate tech listings.
                </p>
                <div className="space-y-3.5 mb-8">
                  <div className="flex items-start text-sm text-gray-300">
                    <i className="fa-solid fa-circle-check text-emerald-400 mt-1 mr-3"></i>
                    <span><strong>Predictive Placement Analytics:</strong> Classification algorithms trained directly in BigQuery ML.</span>
                  </div>
                  <div className="flex items-start text-sm text-gray-300">
                    <i className="fa-solid fa-circle-check text-emerald-400 mt-1 mr-3"></i>
                    <span><strong>Skill Mapping Feature Store:</strong> Low-latency user profile features and skill ratings in Vertex AI.</span>
                  </div>
                  <div className="flex items-start text-sm text-gray-300">
                    <i className="fa-solid fa-circle-check text-emerald-400 mt-1 mr-3"></i>
                    <span><strong>Interactive BI Reports:</strong> Complete executive visualization of graduate analytics built using Looker Studio.</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-800/80 pt-6 mt-auto">
                <p className="text-xs uppercase tracking-widest font-semibold text-slate-500 mb-3">Google Cloud Stack:</p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-teal-950 text-teal-300 px-2.5 py-1.5 rounded-lg border border-teal-900/50 font-medium">BigQuery ML</span>
                  <span className="text-xs bg-teal-950 text-teal-300 px-2.5 py-1.5 rounded-lg border border-teal-900/50 font-medium">Vertex AI Feature Store</span>
                  <span className="text-xs bg-teal-950 text-teal-300 px-2.5 py-1.5 rounded-lg border border-teal-900/50 font-medium">Looker Studio</span>
                  <span className="text-xs bg-teal-950 text-teal-300 px-2.5 py-1.5 rounded-lg border border-teal-900/50 font-medium">Cloud SQL (pgvector)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US SECTION */}
      <section id="about" className="py-24 bg-white px-6">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 space-y-6">
              <span className="text-blue-600 font-bold uppercase tracking-widest text-xs inline-block bg-blue-50 px-3 py-1 rounded-full">
                Empowering Your Future
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight">Why Choose Apex Tech Software Institute?</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                At Apex Tech Software Institute, we don&apos;t just teach technology—we build careers. Our mission is to bridge the gap between academic learning and industry requirements, empowering learners to confidently transition into successful IT careers.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Apex Tech is where ambition meets opportunity and learning transforms into success. We provide the tools, the guidance, and the environment you need to thrive in today&apos;s competitive technology landscape.
              </p>
              <div className="pt-4">
                <a href="#contact" className="inline-flex items-center text-blue-600 font-bold hover:text-blue-700 hover:underline text-lg">
                  Start Your Journey Today <i className="fa-solid fa-arrow-right ml-2.5"></i>
                </a>
              </div>
            </div>

            <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Feature 1 */}
              <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 hover:shadow-md transition">
                <div className="w-12 h-12 bg-white text-blue-600 rounded-xl flex items-center justify-center shadow-sm mb-4 text-xl">
                  <i className="fa-solid fa-user-tie"></i>
                </div>
                <h4 className="font-bold text-slate-900 mb-2">Expert Mentors</h4>
                <p className="text-sm text-gray-600">Learn from industry veterans who bring real-world experience and professional insights to the classroom.</p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-md transition">
                <div className="w-12 h-12 bg-white text-teal-600 rounded-xl flex items-center justify-center shadow-sm mb-4 text-xl">
                  <i className="fa-solid fa-laptop-code"></i>
                </div>
                <h4 className="font-bold text-slate-900 mb-2">Hands-on Projects</h4>
                <p className="text-sm text-gray-600">Gain practical skills through intensive, project-based training that simulates real industry challenges.</p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-md transition">
                <div className="w-12 h-12 bg-white text-orange-600 rounded-xl flex items-center justify-center shadow-sm mb-4 text-xl">
                  <i className="fa-solid fa-briefcase"></i>
                </div>
                <h4 className="font-bold text-slate-900 mb-2">Placement Support</h4>
                <p className="text-sm text-gray-600">Dedicated assistance with interview prep, resume building, and connections to top tech employers.</p>
              </div>

              {/* Feature 4 */}
              <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 hover:shadow-md transition">
                <div className="w-12 h-12 bg-white text-indigo-600 rounded-xl flex items-center justify-center shadow-sm mb-4 text-xl">
                  <i className="fa-solid fa-chart-line"></i>
                </div>
                <h4 className="font-bold text-slate-900 mb-2">Real-world Case Studies</h4>
                <p className="text-sm text-gray-600">Analyze and solve complex scenarios that professionals face daily in the technology sector.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT & FOOTER SECTION */}
      <section id="contact" className="py-20 bg-slate-900 text-white px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 border-b border-gray-800 pb-16">
            <div className="space-y-6">
              <span className="inline-block bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
                Get in touch
              </span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Connect With Us</h2>
              <p className="text-gray-400 text-lg leading-relaxed max-w-md">
                Let&apos;s Launch Your Tech Career <br/><br/>
                One conversation. Endless possibilities.<br/>
                Reach out — we respond immediately.
              </p>
              
              <div className="space-y-6 pt-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-600/20 text-blue-400 rounded-xl flex items-center justify-center text-lg shadow-sm border border-blue-500/10">
                    <i className="fa-solid fa-phone"></i>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Call or WhatsApp</p>
                    <a href="tel:+918977696937" className="text-xl font-bold hover:text-blue-400 transition">+91 8977696937</a>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-600/20 text-blue-400 rounded-xl flex items-center justify-center text-lg shadow-sm border border-blue-500/10">
                    <i className="fa-solid fa-envelope"></i>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Email Address</p>
                    <a href="mailto:hr@apextechsoftwareinstitute.com" className="text-xl font-bold hover:text-blue-400 transition">hr@apextechsoftwareinstitute.com</a>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-600/20 text-blue-400 rounded-xl flex items-center justify-center text-lg shadow-sm border border-blue-500/10">
                    <i className="fa-solid fa-location-dot"></i>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Location</p>
                    <p className="text-lg font-bold text-gray-200">Kondapur, Hyderabad, Telangana</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-850 rounded-2xl border border-slate-800/80 space-y-4 max-w-md">
                <h4 className="font-bold text-white text-lg">Our Training Highlights</h4>
                <ul className="space-y-2.5 text-sm text-gray-300">
                  <li className="flex items-start"><i className="fa-solid fa-circle-check text-blue-400 mt-1 mr-3 text-xs"></i> 100% Practical & Lab-Based Learning</li>
                  <li className="flex items-start"><i className="fa-solid fa-circle-check text-blue-400 mt-1 mr-3 text-xs"></i> Real-time Projects & Case Studies</li>
                  <li className="flex items-start"><i className="fa-solid fa-circle-check text-blue-400 mt-1 mr-3 text-xs"></i> Mock Interviews & Resume Preparation</li>
                  <li className="flex items-start"><i className="fa-solid fa-circle-check text-blue-400 mt-1 mr-3 text-xs"></i> Flexible Weekday and Weekend Batches</li>
                </ul>
              </div>
            </div>

            <div>
              {/* Dynamic Contact Form Component */}
              <ContactForm courses={courses} />
            </div>
          </div>

          <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 gap-4 text-center md:text-left">
            <p>&copy; {new Date().getFullYear()} apextechsoftwareinstitute.com. All rights reserved.</p>
            <p className="max-w-md">Your tech journey starts here — Apex Tech Software Institute, Kondapur, Hyderabad. Join a batch today. Your future self will thank you.</p>
          </div>
        </div>
      </section>
    </>
  );
}
