import os
import sys
from fpdf import FPDF

class SAPBrochurePDF(FPDF):
    def __init__(self, logo_path, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.logo_path = logo_path

    def header(self):
        # Header layout
        if os.path.exists(self.logo_path):
            # The horizontal logo (1294 x 768) with ~1.68 aspect ratio
            # Position it elegantly on the top-left of the header
            self.image(self.logo_path, 10, 6, 32, 16)
        
        self.set_font("helvetica", "B", 15)
        self.set_text_color(15, 23, 42) # Slate-900 (Dark Slate)
        self.set_xy(45, 7)
        self.cell(0, 6, "APEX TECH SOFTWARE INSTITUTE", ln=True)
        
        self.set_font("helvetica", "", 8)
        self.set_text_color(100, 116, 139) # Slate-500
        self.set_x(45)
        self.cell(0, 4, "Kondapur, Hyderabad, Telangana | +91 8977696937 | www.apextechsoftwareinstitute.com", ln=True)
        
        # Elegant blue accent rule line under header
        self.set_draw_color(37, 99, 235) # Blue-600
        self.set_line_width(0.75)
        self.line(10, 25, 200, 25)
        
        # Top spacing for page body
        self.set_y(31)

    def footer(self):
        # Line from 18mm from bottom
        self.set_y(-18)
        self.set_draw_color(226, 232, 240) # Slate-200
        self.set_line_width(0.5)
        self.line(10, self.get_y(), 200, self.get_y())
        
        # Footer text
        self.set_y(-15)
        self.set_font("helvetica", "", 8)
        self.set_text_color(148, 163, 184) # Slate-400
        self.cell(100, 5, "Contact: +91 8977696937 | hr@apextechsoftwareinstitute.com", ln=False)
        self.cell(0, 5, f"Page {self.page_no()}/{{nb}}", align="R", ln=True)

def generate_sap_pdf(output_path, logo_path):
    pdf = SAPBrochurePDF(logo_path=logo_path, orientation="P", unit="mm", format="A4")
    pdf.alias_nb_pages()
    pdf.add_page()
    
    # 1. Main Title Banner Block
    pdf.set_fill_color(30, 41, 59) # Slate-800 (#1E293B)
    pdf.rect(10, 30, 190, 28, 'F')
    
    pdf.set_xy(15, 34)
    pdf.set_font("helvetica", "B", 16)
    pdf.set_text_color(255, 255, 255) # White
    pdf.cell(0, 8, "SAP ERP ENTERPRISE CORE PROGRAM", ln=True)
    
    pdf.set_x(15)
    pdf.set_font("helvetica", "B", 9)
    pdf.set_text_color(147, 197, 253) # Light Blue
    pdf.cell(0, 4, "12-WEEK INTENSIVE TRAINING, REAL-TIME PROJECTS & PLACEMENT PROGRAM", ln=True)
    
    # 2. Course Quick Metadata Grid
    pdf.set_y(65)
    pdf.set_fill_color(248, 250, 252) # Slate-50 (#F8FAFC)
    pdf.set_draw_color(241, 245, 249) # Slate-100
    pdf.rect(10, 62, 190, 18, 'DF')
    
    pdf.set_xy(12, 64)
    pdf.set_font("helvetica", "B", 9)
    pdf.set_text_color(30, 41, 59)
    pdf.cell(45, 5, "Duration: 12 Weeks", ln=False)
    pdf.cell(50, 5, "Level: Beginner to Advanced", ln=False)
    pdf.cell(50, 5, "Mode: Classroom & Online", ln=False)
    pdf.cell(0, 5, "Job Placement: 100% Support", ln=True)
    
    pdf.set_x(12)
    pdf.set_font("helvetica", "", 8)
    pdf.set_text_color(100, 116, 139)
    pdf.cell(45, 4, "(3 Hours/Day, Mon-Fri)", ln=False)
    pdf.cell(50, 4, "(No prior coding needed)", ln=False)
    pdf.cell(50, 4, "(Live Interactive Labs)", ln=False)
    pdf.cell(0, 4, "(Resume prep & mock interviews)", ln=True)
    
    # 3. Course Introduction
    pdf.set_y(85)
    pdf.set_font("helvetica", "B", 12)
    pdf.set_text_color(30, 64, 175) # Blue-700
    pdf.cell(0, 6, "Program Overview", ln=True)
    
    pdf.set_font("helvetica", "", 9.5)
    pdf.set_text_color(71, 85, 105) # Slate-600
    intro_text = (
        "Enterprise Resource Planning (ERP) is the backbone of modern large-scale business operations. "
        "SAP is the undisputed global leader in ERP software, used by over 90% of Forbes Global 2000 companies. "
        "At Apex Tech Software Institute, our SAP core program is meticulously designed by industry experts to "
        "transform ambitious learners into job-ready SAP consultants. Through high-impact practical hands-on labs, "
        "you will master SAP configuration, database operations, business process mappings, and real-time enterprise workflows."
    )
    pdf.multi_cell(0, 5, intro_text)
    
    # 4. What is SAP FICO & MM? (Key Modules covered)
    pdf.set_y(120)
    pdf.set_font("helvetica", "B", 12)
    pdf.set_text_color(30, 64, 175)
    pdf.cell(0, 6, "Core SAP Modules Covered in Depth", ln=True)
    
    # Left Column: SAP FICO
    pdf.set_xy(10, 128)
    pdf.set_fill_color(239, 246, 255) # Blue-50
    pdf.set_draw_color(191, 219, 254) # Blue-200
    pdf.rect(10, 127, 92, 44, 'DF')
    pdf.set_xy(12, 129)
    pdf.set_font("helvetica", "B", 10)
    pdf.set_text_color(30, 58, 138) # Blue-900
    pdf.cell(0, 5, "SAP FICO (Financials & Controlling)", ln=True)
    pdf.set_x(12)
    pdf.set_font("helvetica", "", 8.5)
    pdf.set_text_color(71, 85, 105)
    fico_text = (
        "- General Ledger (G/L) Accounting\n"
        "- Accounts Payable & Receivable (AP/AR)\n"
        "- Asset Accounting & Cost Center setup\n"
        "- Profitability Analysis (CO-PA) reporting\n"
        "- Month-end close & financial statement integrations"
    )
    pdf.multi_cell(88, 4.5, fico_text)
    
    # Right Column: SAP MM
    pdf.set_xy(108, 128)
    pdf.set_fill_color(240, 253, 250) # Teal-50
    pdf.set_draw_color(153, 246, 228) # Teal-200
    pdf.rect(108, 127, 92, 44, 'DF')
    pdf.set_xy(110, 129)
    pdf.set_font("helvetica", "B", 10)
    pdf.set_text_color(15, 118, 110) # Teal-700
    pdf.cell(0, 5, "SAP MM (Materials Management)", ln=True)
    pdf.set_x(110)
    pdf.set_font("helvetica", "", 8.5)
    pdf.set_text_color(71, 85, 105)
    mm_text = (
        "- Procurement & Purchasing Cycle (P2P)\n"
        "- Inventory Management & Stock Transfers\n"
        "- Master Data setup (Material & Vendor)\n"
        "- Valuation & Invoice Verification processes\n"
        "- Integration with Sales (SD) & Finance (FI)"
    )
    pdf.multi_cell(88, 4.5, mm_text)
    
    # 5. Spacing for Page 2
    pdf.add_page()
    
    pdf.set_y(32)
    pdf.set_font("helvetica", "B", 12)
    pdf.set_text_color(30, 64, 175)
    pdf.cell(0, 6, "Why Study SAP at Apex Tech Software Institute?", ln=True)
    
    reasons = [
        {"title": "Senior Consultants as Mentors: ", "desc": "Learn config tricks directly from active SAP Solution Architects."},
        {"title": "24/7 Access to SAP GUI Sandbox: ", "desc": "Configure plants and ledgers on the official live SAP sandbox servers."},
        {"title": "Real Case Studies: ", "desc": "Build and map a fictitious global logistics firm from the ground up."},
        {"title": "Placement Fast-Track: ", "desc": "Direct interviews with top SAP system integrators in India."}
    ]
    
    pdf.set_font("helvetica", "", 9.5)
    for res in reasons:
        pdf.set_x(12)
        pdf.set_font("helvetica", "B", 9.5)
        pdf.set_text_color(30, 41, 59)
        pdf.cell(pdf.get_string_width(res["title"]) + 2, 5, res["title"], ln=False)
        pdf.set_font("helvetica", "", 9.5)
        pdf.set_text_color(71, 85, 105)
        pdf.cell(0, 5, res["desc"], ln=True)
    
    pdf.ln(5)
    pdf.set_font("helvetica", "B", 12)
    pdf.set_text_color(30, 64, 175)
    pdf.cell(0, 6, "Comprehensive Training Syllabus", ln=True)
    
    modules = [
        {
            "num": "M1", "title": "SAP ERP Foundations & Navigation",
            "topics": [
                "Introduction to ERP systems & SAP GUI Navigation basics",
                "Understanding Org Structures: Client, Company Code, Plant, and Storage Locations",
                "Master Data Concepts: Material Master, Vendor Master, General Ledger Accounts",
                "Transaction mapping workflows, document concepts, and SAP core T-Codes"
            ],
            "color": (240, 253, 250), "border": (204, 251, 241), "text": (13, 148, 136)
        },
        {
            "num": "M2", "title": "SAP Financial Accounting (FI) Configuration",
            "topics": [
                "Financial Global Settings: Fiscal Year Variant, Posting Periods, Chart of Accounts",
                "General Ledger Configuration: Accounts creation, document posting, and journals",
                "Accounts Payable (AP) and Accounts Receivable (AR) integration setups",
                "Integration with Materials Management: Automatic Account Determination (OBYC)"
            ],
            "color": (239, 246, 255), "border": (219, 234, 254), "text": (37, 99, 235)
        },
        {
            "num": "M3", "title": "SAP Materials Management (MM) Flow",
            "topics": [
                "Procurement Process setup: Requisitions (PR), Quotations, Purchase Orders (PO)",
                "Inventory Control: Goods Receipt (GR), Goods Issue, Physical stock transfers",
                "Logistics Invoice Verification (LIV) and credit memo configurations",
                "Special procurement cycles: Subcontracting, Consignments, and Pipeline flows"
            ],
            "color": (245, 243, 255), "border": (233, 213, 255), "text": (124, 58, 237)
        },
        {
            "num": "M4", "title": "Live Enterprise Project & Interview Prep",
            "topics": [
                "Live Enterprise Simulation: Designing and configuring a company from scratch in SAP",
                "System integration testing: End-to-end P2P Cycle with automatic ledger mapping",
                "Resume design boot camp: Structuring experience for SAP Consultant and Analyst positions",
                "Technical mock interviews, SAP Certification guidelines, and job reference listings"
            ],
            "color": (255, 247, 237), "border": (254, 215, 170), "text": (194, 65, 12)
        }
    ]
    
    curr_y = 42
    for mod in modules:
        pdf.set_fill_color(*mod["color"])
        pdf.set_draw_color(*mod["border"])
        pdf.rect(10, curr_y, 190, 36, 'DF')
        
        pdf.set_xy(13, curr_y + 2)
        pdf.set_font("helvetica", "B", 10.5)
        pdf.set_text_color(*mod["text"])
        pdf.cell(0, 5, f"{mod['num']}: {mod['title']}", ln=True)
        
        pdf.set_font("helvetica", "", 8.5)
        pdf.set_text_color(51, 65, 85) # Slate-700
        for topic in mod["topics"]:
            pdf.set_x(15)
            pdf.cell(3, 4.5, chr(149), ln=False) # Bullet point bullet character
            pdf.cell(0, 4.5, topic, ln=True)
            
        curr_y += 39
        
    # 6. Call-to-action bottom panel
    pdf.set_y(198)
    pdf.set_fill_color(30, 41, 59) # Slate-800
    pdf.rect(10, 198, 190, 24, 'F')
    
    pdf.set_xy(15, 201)
    pdf.set_font("helvetica", "B", 11)
    pdf.set_text_color(255, 255, 255)
    pdf.cell(0, 5, "Join the Next SAP Batch - Admissions Open!", ln=True)
    
    pdf.set_x(15)
    pdf.set_font("helvetica", "", 8.5)
    pdf.set_text_color(203, 213, 225) # Slate-300
    pdf.cell(0, 4, "Weekday and Weekend batches starting soon. Contact our admissions team to secure your seat.", ln=True)
    
    pdf.set_x(15)
    pdf.set_font("helvetica", "B", 9)
    pdf.set_text_color(59, 130, 246) # Blue-500
    pdf.cell(0, 5, "Call or WhatsApp: +91 8977696937  |  Email: hr@apextechsoftwareinstitute.com", ln=True)

    # Save PDF
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    pdf.output(output_path)
    print(f"Success! PDF brochure saved to: {output_path}")

if __name__ == "__main__":
    generate_sap_pdf(
        output_path="/home/sathish/Desktop/apex/public/brochures/sap-course-brochure.pdf",
        logo_path="/home/sathish/Desktop/apex/public/logo.png"
    )
