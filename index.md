<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ApexTech Software Institute | Leading IT Training Institute</title>
    <!-- Tailwind CSS for modern, responsive styling -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- FontAwesome for icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
  html {
    scroll-behavior: smooth;
  }
  .apex-logo-container {
    display: inline-flex;
    align-items: center;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: transparent; /* Seamless on your navbar */
    padding: 10px;
    user-select: none;
  }

  .apex-logo-icon {
    width: 65px; /* Adjust size of the logo icon here */
    height: 65px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .apex-logo-icon svg {
    width: 100%;
    height: 100%;
  }

  .apex-logo-text {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .apex-brand-main {
    font-size: 44px;
    font-weight: 800;
    color: #0A2540; /* Deep Navy Blue */
    line-height: 0.95;
    letter-spacing: 1.5px;
  }

  .apex-brand-sub {
    font-size: 11.5px;
    font-weight: 700;
    color: #00A3A6; /* Technical Teal */
    letter-spacing: 1.8px;
    margin-top: 4px;
    white-space: nowrap;
  }
</style>
</head>
<body class="bg-gray-50 font-sans text-gray-800">

    <!-- HEADER & NAVIGATION -->
    <header class="bg-white shadow-md sticky top-0 z-50">
        <div class="container mx-auto px-6 py-4 flex justify-between items-center">
            <div class="apex-logo-container gap-3">
  <!-- Left Side: Logo Image -->
  <img src="logo.png" alt="Apex Tech Logo" class="h-16 w-16 object-contain">


  <!-- Right Side: Brand Typography -->
  <div class="apex-logo-text">
    <div class="apex-brand-main">APEX</div>
    <div class="apex-brand-sub">TECH SOFTWARE INSTITUTE</div>
  </div>

</div>
            <nav class="hidden md:flex space-x-8 font-medium">
                <a href="#home" class="text-blue-600 hover:text-blue-700">Home</a>
                <a href="#courses" class="text-gray-600 hover:text-blue-600 transition">Courses</a>
                <a href="#about" class="text-gray-600 hover:text-blue-600 transition">Why Us</a>
                <a href="#contact" class="text-gray-600 hover:text-blue-600 transition">Contact</a>
            </nav>
            <div class="hidden md:flex items-center space-x-4">
                <a href="tel:+918977696937" class="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition shadow-sm">
                    <i class="fa-solid fa-phone mr-2"></i>Call Now
                </a>
            </div>
        </div>
    </header>

    <!-- HERO SECTION -->
    <section id="home" class="bg-gradient-to-r from-slate-900 to-blue-900 text-white py-20 px-6">
        <div class="container mx-auto flex flex-col md:flex-row items-center justify-between">
            <div class="md:w-full space-y-6 text-center md:text-left mb-10 md:mb-0">
                <span class="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-full text-sm font-semibold uppercase tracking-wider">
                    Accelerate Your IT Career
                </span>
                <h1 class="text-[2.15rem] md:text-[3.55rem] font-extrabold leading-tight">
                    Launch Your IT Career with <span class="text-blue-400">Industry-Focused Training</span>
                </h1>
                <p class="text-lg text-gray-300 max-w-xl">
                    Master the skills that top employers demand. Our industry-aligned curriculum and hands-on approach ensure you're ready for the real world from day one.
                </p>
                <div class="pt-4 flex flex-col sm:flex-row justify-center md:justify-start gap-4">
                    <a href="#contact" class="bg-blue-500 text-white text-center px-8 py-3 rounded-lg font-bold hover:bg-blue-600 transition shadow-lg">
                        Enquire Today
                    </a>
                    <a href="#courses" class="border border-gray-400 text-center px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-slate-900 transition">
                        Explore Courses
                    </a>
                </div>
            </div>
        </div>
    </section>

    <!-- INTRODUCTORY WHY US SECTION -->
    <section class="py-16 bg-white px-6 border-b border-gray-100">
        <div class="container mx-auto max-w-4xl text-center">
            <h2 class="text-3xl font-bold text-slate-900 mb-8">Empowering Your Tech Journey</h2>
            <p class="text-xl text-gray-700 leading-relaxed italic mb-6">
                "At Apex Tech Software Institute, we don't just teach technology—we build careers."
            </p>
            <p class="text-lg text-gray-600 leading-relaxed">
                Our industry-focused training, hands-on projects, expert mentors, real-world case studies, and personalized career guidance help students gain practical skills that employers value. With dedicated placement assistance, interview preparation, resume building, and continuous professional development, we empower learners to confidently transition into successful IT careers and thrive in today's competitive technology landscape. 
            </p>
            <div class="mt-8 font-bold text-blue-600 text-xl">
                Apex Tech is where ambition meets opportunity and learning transforms into success.
            </div>
        </div>
    </section>

    <!-- FLAGSHIP COURSE HIGHLIGHT (AWS & DEVOPS) -->
    <section class="py-16 bg-white px-6">
        <div class="container mx-auto">
            <div class="bg-blue-50 rounded-2xl p-8 md:p-12 border border-blue-100 flex flex-col lg:flex-row items-center justify-between">
                <div class="lg:w-2/3 space-y-4 mb-6 lg:mb-0">
                    <span class="bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold uppercase">Trending & Flagship</span>
                    <h2 class="text-3xl font-bold text-slate-900">Advanced AWS & DevOps Program</h2>
                    <p class="text-gray-600 text-lg">
                        Become a cloud professional. Our comprehensive training program covers everything from core AWS cloud infrastructure to advanced DevOps automation pipelines.
                    </p>
                    <div class="grid grid-cols-2 gap-4 pt-2 font-medium text-gray-700">
                        <div><i class="fa-solid fa-check text-green-500 mr-2"></i>CI/CD Pipelines (Jenkins, GitHub Actions)</div>
                        <div><i class="fa-solid fa-check text-green-500 mr-2"></i>Infrastructure as Code (Terraform)</div>
                        <div><i class="fa-solid fa-check text-green-500 mr-2"></i>Containerization (Docker & Kubernetes)</div>
                        <div><i class="fa-solid fa-check text-green-500 mr-2"></i>AWS Certified Cloud Practitioner & SysOps</div>
                    </div>
                </div>
                <div class="lg:w-1/4 text-center lg:text-right">
                    <a href="#contact" class="inline-block bg-slate-900 text-white font-bold px-8 py-4 rounded-xl hover:bg-slate-800 transition shadow-md">
                        Get Syllabus Details
                    </a>
                </div>
            </div>
        </div>
    </section>

    <!-- ALL MAJOR IT COURSES SECTION -->
    <section id="courses" class="py-16 bg-gray-50 px-6">
        <div class="container mx-auto">
            <div class="text-center max-w-2xl mx-auto mb-12">
                <h2 class="text-3xl font-bold text-slate-900 mb-4">All Major IT Courses We Offer</h2>
                <p class="text-gray-600">Whether you're a fresher, a graduate, or switching careers — we have a course built exactly for where you are right now.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <!-- Course 1: AWS & DevOps -->
                <div class="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 flex flex-col justify-between">
                    <div>
                        <div class="w-12 h-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center text-xl font-bold mb-4">
                            <i class="fa-brands fa-aws"></i>
                        </div>
                        <h3 class="text-xl font-bold mb-2 text-slate-800">AWS & DevOps</h3>
                        <p class="text-gray-600 text-sm mb-4">Master cloud engineering, automated deployments, containerization, and server monitoring with global best practices.</p>
                        <a href="aws_devops_curriculum_page.html" class="text-blue-600 font-semibold text-sm hover:underline mt-2 inline-block">
                            View Full Curriculum <i class="fa-solid fa-arrow-right ml-1"></i>
                        </a>
                    </div>

                </div>

                <!-- Course 2: Full Stack Dev -->
                <div class="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 flex flex-col justify-between">
                    <div>
                        <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-xl font-bold mb-4">
                            <i class="fa-solid fa-laptop-code"></i>
                        </div>
                        <h3 class="text-xl font-bold mb-2 text-slate-800">Full Stack Web Development</h3>
                        <p class="text-gray-600 text-sm mb-4">Build powerful web applications. Includes Frontend (HTML, CSS, JavaScript, React) and Backend architectures (Node.js/Python, Databases).</p>
                    </div>

                </div>

                <!-- Course 3: Data Science -->
                <div class="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 flex flex-col justify-between">
                    <div>
                        <div class="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center text-xl font-bold mb-4">
                            <i class="fa-solid fa-chart-pie"></i>
                        </div>
                        <h3 class="text-xl font-bold mb-2 text-slate-800">Data Science & AI</h3>
                        <p class="text-gray-600 text-sm mb-4">Dive deep into data analysis, statistical modeling, Machine Learning algorithms, and artificial intelligence integration.</p>
                    </div>

                </div>

                <!-- Course 4: Python -->
                <div class="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 flex flex-col justify-between">
                    <div>
                        <div class="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center text-xl font-bold mb-4">
                            <i class="fa-brands fa-python"></i>
                        </div>
                        <h3 class="text-xl font-bold mb-2 text-slate-800">Python Programming</h3>
                        <p class="text-gray-600 text-sm mb-4">Perfect for absolute beginners. Learn foundational coding, object-oriented principles, scripting, and automation.</p>
                    </div>

                </div>

                <!-- Course 5: Cyber Security -->
                <div class="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 flex flex-col justify-between">
                    <div>
                        <div class="w-12 h-12 bg-red-100 text-red-600 rounded-lg flex items-center justify-center text-xl font-bold mb-4">
                            <i class="fa-solid fa-shield-halved"></i>
                        </div>
                        <h3 class="text-xl font-bold mb-2 text-slate-800">Cyber Security & Ethical Hacking</h3>
                        <p class="text-gray-600 text-sm mb-4">Understand digital defense. Learn network security, vulnerability assessment, penetration testing, and risk management mitigation.</p>
                    </div>

                </div>

                <!-- Course 6: Software Testing -->
                <div class="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 flex flex-col justify-between">
                    <div>
                        <div class="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center text-xl font-bold mb-4">
                            <i class="fa-solid fa-bug-slash"></i>
                        </div>
                        <h3 class="text-xl font-bold mb-2 text-slate-800">Software Testing (QA)</h3>
                        <p class="text-gray-600 text-sm mb-4">Master both Manual and Automation testing frameworks using industry standards like Selenium, Java, and API Testing tools.</p>
                    </div>

                </div>
            </div>
        </div>
    </section>

    <!-- WHY CHOOSE US SECTION -->
    <section id="about" class="py-20 bg-white px-6">
        <div class="container mx-auto">
            <div class="flex flex-col lg:flex-row items-center gap-12">
                <div class="lg:w-1/2 space-y-6">
                    <span class="text-blue-600 font-bold uppercase tracking-widest text-sm">Empowering Your Future</span>
                    <h2 class="text-4xl font-extrabold text-slate-900 leading-tight">Why Choose Apex Tech Software Institute?</h2>
                    <p class="text-gray-600 text-lg leading-relaxed">
                        At Apex Tech Software Institute, we don't just teach technology—we build careers. Our mission is to bridge the gap between academic learning and industry requirements, empowering learners to confidently transition into successful IT careers.
                    </p>
                    <p class="text-gray-600 text-lg leading-relaxed">
                        Apex Tech is where ambition meets opportunity and learning transforms into success. We provide the tools, the guidance, and the environment you need to thrive in today's competitive technology landscape.
                    </p>
                    <div class="pt-4">
                        <a href="#contact" class="inline-flex items-center text-blue-600 font-bold hover:text-blue-700 transition">
                            Start Your Journey Today <i class="fa-solid fa-arrow-right ml-2"></i>
                        </a>
                    </div>
                </div>

                <div class="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <!-- Feature 1 -->
                    <div class="p-6 bg-blue-50 rounded-2xl border border-blue-100 hover:shadow-md transition">
                        <div class="w-12 h-12 bg-white text-blue-600 rounded-xl flex items-center justify-center shadow-sm mb-4 text-xl">
                            <i class="fa-solid fa-user-tie"></i>
                        </div>
                        <h4 class="font-bold text-slate-900 mb-2">Expert Mentors</h4>
                        <p class="text-sm text-gray-600">Learn from industry veterans who bring real-world experience and professional insights to the classroom.</p>
                    </div>

                    <!-- Feature 2 -->
                    <div class="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-md transition">
                        <div class="w-12 h-12 bg-white text-teal-600 rounded-xl flex items-center justify-center shadow-sm mb-4 text-xl">
                            <i class="fa-solid fa-laptop-code"></i>
                        </div>
                        <h4 class="font-bold text-slate-900 mb-2">Hands-on Projects</h4>
                        <p class="text-sm text-gray-600">Gain practical skills through intensive, project-based training that simulates real industry challenges.</p>
                    </div>

                    <!-- Feature 3 -->
                    <div class="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-md transition">
                        <div class="w-12 h-12 bg-white text-orange-600 rounded-xl flex items-center justify-center shadow-sm mb-4 text-xl">
                            <i class="fa-solid fa-briefcase"></i>
                        </div>
                        <h4 class="font-bold text-slate-900 mb-2">Placement Support</h4>
                        <p class="text-sm text-gray-600">Dedicated assistance with interview prep, resume building, and connections to top tech employers.</p>
                    </div>

                    <!-- Feature 4 -->
                    <div class="p-6 bg-blue-50 rounded-2xl border border-blue-100 hover:shadow-md transition">
                        <div class="w-12 h-12 bg-white text-indigo-600 rounded-xl flex items-center justify-center shadow-sm mb-4 text-xl">
                            <i class="fa-solid fa-chart-line"></i>
                        </div>
                        <h4 class="font-bold text-slate-900 mb-2">Real-world Case Studies</h4>
                        <p class="text-sm text-gray-600">Analyze and solve complex scenarios that professionals face daily in the technology sector.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- CONTACT & FOOTER SECTION -->
    <section id="contact" class="py-16 bg-slate-900 text-white px-6">
        <div class="container mx-auto">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-12 border-b border-gray-800 pb-12">
                <div class="space-y-6">
                    <h2 class="text-3xl font-bold">Connect With Us</h2>
                    <p class="text-gray-400 max-w-md">
                        Let's Launch Your Tech Career <br/><br/>
                        One conversation. Endless possibilities.<br/>
                        Reach out — we respond immediately.
                    </p>
                    <div class="space-y-4">
                        <div class="flex items-center space-x-4">
                            <div class="w-10 h-10 bg-blue-600/20 text-blue-400 rounded-lg flex items-center justify-center">
                                <i class="fa-solid fa-phone"></i>
                            </div>
                            <div>
                                <p class="text-xs text-gray-400 uppercase">Call or WhatsApp</p>
                                <a href="tel:+918977696937" class="text-lg font-bold hover:text-blue-400 transition">+91 8977696937</a>
                                </div>
                                </div>

                                <div class="flex items-center space-x-4">
                                <div class="w-10 h-10 bg-blue-600/20 text-blue-400 rounded-lg flex items-center justify-center">
                                <i class="fa-solid fa-envelope"></i>
                                </div>
                                <div>
                                <p class="text-xs text-gray-400 uppercase">Email Address</p>
                                <a href="mailto:hr@apextechsoftwareinstitute.com" class="text-lg font-bold hover:text-blue-400 transition">hr@apextechsoftwareinstitute.com</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <div class="bg-slate-800 p-8 rounded-xl border border-slate-700/50 space-y-8">
                        <div class="space-y-6">
                            <h3 class="text-xl font-bold mb-4">Why Students Choose Apex</h3>
                            <p class="text-gray-300 mb-2">We don't just teach software — we shape careers. Real trainers. Real projects. Real jobs. Your background doesn't matter. Your ambition does.</p>
                        </div>

                        <div class="space-y-6">
                            <h3 class="text-xl font-bold mb-4">Our Training Highlights</h3>
                            <p class="text-gray-300 mb-4">Built for the real world. Every lesson, every project, every mock interview — designed to get you placed, not just passed.</p>
                            <ul class="space-y-3 text-gray-300">
                                <li class="flex items-start"><i class="fa-solid fa-circle-check text-blue-500 mt-1 mr-3 text-sm"></i> 100% Practical & Lab-Based Learning</li>
                                <li class="flex items-start"><i class="fa-solid fa-circle-check text-blue-500 mt-1 mr-3 text-sm"></i> Real-time Projects & Case Studies</li>
                                <li class="flex items-start"><i class="fa-solid fa-circle-check text-blue-500 mt-1 mr-3 text-sm"></i> Mock Interviews & Resume Preparation support</li>
                                <li class="flex items-start"><i class="fa-solid fa-circle-check text-blue-500 mt-1 mr-3 text-sm"></i> Flexible Weekday and Weekend Batches</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div class="pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
                <p>&copy; 2026 apextechsoftwareinstitute.com. All rights reserved.</p>
                <p class="mt-2 md:mt-0">Your tech journey starts here — Apex Tech Software Institute, Kondapur, Hyderabad. Join a batch today. Your future self will thank you.</p>
            </div>
        </div>
    </section>

</body>
</html>