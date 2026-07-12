"use client";

import { useState, useEffect } from "react";

export default function PromoPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has already dismissed the popup in this session
    const hasSeenPromo = sessionStorage.getItem("hasSeenPromo");
    if (!hasSeenPromo) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000); // 1 second delay
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("hasSeenPromo", "true");
  };

  const handleAction = () => {
    setIsOpen(false);
    sessionStorage.setItem("hasSeenPromo", "true");
    
    // Smooth scroll to contact form
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
      
      // Auto-focus name field and select AWS course
      setTimeout(() => {
        const nameInput = document.getElementById("name");
        if (nameInput) nameInput.focus();
        
        const courseSelect = document.getElementById("course");
        if (courseSelect) {
          courseSelect.value = "aws-devops";
          // Trigger change event if React state needs it
          const event = new Event("change", { bubbles: true });
          courseSelect.dispatchEvent(event);
        }
      }, 800);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[99999] flex items-center justify-center p-4 transition-all duration-300">
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-blue-950 border border-blue-500/30 rounded-3xl p-6 md:p-8 max-w-md w-full relative shadow-2xl transition-all transform scale-100 text-white">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-all text-xl focus:outline-none w-8 h-8 flex items-center justify-center rounded-full bg-slate-800/50 hover:bg-slate-800"
          aria-label="Close promotion"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        {/* Hot Offer Badge */}
        <span className="inline-flex bg-orange-600/20 text-orange-400 border border-orange-500/30 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest mb-4">
          🔥 Limited Seats Offer
        </span>

        {/* Header Text */}
        <h3 className="text-2xl md:text-3xl font-black tracking-tight mb-2">
          AWS &amp; DevOps Cloud Training
        </h3>
        
        <p className="text-gray-300 text-sm mb-5 leading-relaxed">
          Launch your IT career with our flagship cloud programs. Get 100% practical lab training and gain production-level skills with industry-standard labs.
        </p>

        {/* Price Displays */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col justify-center">
            <span className="text-[10px] text-orange-400 uppercase tracking-wider font-bold">AWS Training</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-white">₹4,999</span>
              <span className="text-xs text-gray-500 line-through">₹12,000</span>
            </div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col justify-center">
            <span className="text-[10px] text-blue-400 uppercase tracking-wider font-bold">AWS &amp; DevOps Program</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-white">₹7,999</span>
              <span className="text-xs text-gray-500 line-through">₹18,000</span>
            </div>
          </div>
        </div>

        {/* Features List */}
        <ul className="space-y-3 mb-6 text-sm">
          <li className="flex items-center text-gray-200">
            <i className="fa-solid fa-circle-check text-orange-500 mr-2.5"></i>
            <span>Industry-Grade Capstone Projects</span>
          </li>
          <li className="flex items-center text-gray-200">
            <i className="fa-solid fa-circle-check text-orange-500 mr-2.5"></i>
            <span>100% Practical &amp; Lab-Based Batch</span>
          </li>
          <li className="flex items-center text-gray-200">
            <i className="fa-solid fa-circle-check text-orange-500 mr-2.5"></i>
            <span>Offline (Kondapur, Hyd) &amp; Online Options</span>
          </li>
        </ul>

        {/* Action Button */}
        <button
          onClick={handleAction}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg hover:shadow-blue-500/20 active:scale-[0.98] flex items-center justify-center space-x-2 text-base"
        >
          <i className="fa-solid fa-bolt"></i>
          <span>Claim Offer / Enquire Now</span>
        </button>

        <p className="text-center text-[10px] text-gray-500 mt-3 font-medium">
          *Offer valid for the first 20 registrations only.
        </p>
      </div>
    </div>
  );
}
