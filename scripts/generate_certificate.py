import os
import sys
import argparse
import warnings
from datetime import datetime
from fpdf import FPDF

# Suppress FPDF2 deprecation warnings regarding new_x/new_y parameter transitions
warnings.filterwarnings("ignore", category=DeprecationWarning)

class ApexCertificatePDF(FPDF):
    def __init__(self, logo_path, *args, **kwargs):
        # Set orientation to landscape, unit to mm, format A4 (297mm x 210mm)
        super().__init__(orientation="L", unit="mm", format="A4", *args, **kwargs)
        self.logo_path = logo_path

    def draw_code39(self, x, y, code, height=12, width_narrow=0.35, ratio=2.5):
        """
        Draws a Code 39 barcode directly onto the PDF using vector rectangles.
        No external libraries required.
        """
        # Code 39 pattern mapping for characters
        # Each character consists of 9 elements (5 bars, 4 spaces).
        # '0' = narrow, '1' = wide. Index 0, 2, 4, 6, 8 are bars; 1, 3, 5, 7 are spaces.
        encodings = {
            '0': '000110100', '1': '100100001', '2': '001100001', '3': '101100000',
            '4': '000110001', '5': '100110000', '6': '001110000', '7': '000100101',
            '8': '100100100', '9': '001100100', 'A': '100001001', 'B': '001001001',
            'C': '101001000', 'D': '000011001', 'E': '100011000', 'F': '001011000',
            'G': '000001101', 'H': '100001100', 'I': '001001100', 'J': '000011100',
            'K': '100000011', 'L': '001000011', 'M': '101000010', 'N': '000010011',
            'O': '100010010', 'P': '001010010', 'Q': '000000111', 'R': '100000110',
            'S': '001000110', 'T': '000010110', 'U': '110000001', 'V': '011000001',
            'W': '111000000', 'X': '010010001', 'Y': '110010000', 'Z': '011010000',
            '-': '010000101', '.': '110000100', ' ': '011000100', '*': '010010100',
            '$': '010101000', '/': '010100010', '+': '010001010', '%': '000101010'
        }
        
        code = code.upper()
        if not code.startswith('*'):
            code = '*' + code
        if not code.endswith('*'):
            code = code + '*'
            
        curr_x = x
        w_narrow = width_narrow
        w_wide = width_narrow * ratio
        
        # Draw barcode bars
        self.set_fill_color(0, 0, 0)
        for char in code:
            if char not in encodings:
                continue
            pattern = encodings[char]
            for i, val in enumerate(pattern):
                is_bar = (i % 2 == 0)
                is_wide = (val == '1')
                w = w_wide if is_wide else w_narrow
                
                if is_bar:
                    self.rect(curr_x, y, w, height, 'F')
                
                curr_x += w
            
            # Inter-character gap
            curr_x += w_narrow

    def build_certificate(self, student_name, course_name, completion_date, cert_id):
        self.alias_nb_pages()
        self.add_page()
        
        # ----------------------------------------------------
        # 1. PREMIUM BACKGROUND & DOUBLE BORDER
        # ----------------------------------------------------
        # Soft cream/off-white background
        self.set_fill_color(250, 249, 246)
        self.rect(0, 0, 297, 210, 'F')
        
        # Outer thick border - Navy Blue (#0B2540)
        self.set_draw_color(11, 37, 64)
        self.set_line_width(1.5)
        self.rect(10, 10, 277, 190)
        
        # Inner thin border - Gold (#D4AF37)
        self.set_draw_color(212, 175, 55)
        self.set_line_width(0.6)
        self.rect(12, 12, 273, 186)
        
        # Corner accent flourishes (Gold)
        flourish_size = 8
        # Top-Left
        self.line(12, 12 + flourish_size, 12 + flourish_size, 12)
        # Top-Right
        self.line(285 - flourish_size, 12, 285, 12 + flourish_size)
        # Bottom-Left
        self.line(12, 198 - flourish_size, 12 + flourish_size, 198)
        # Bottom-Right
        self.line(285 - flourish_size, 198, 285, 198 - flourish_size)

        # ----------------------------------------------------
        # 2. INSTITUTIONAL HEADER & BRANDING
        # ----------------------------------------------------
        # Company Logo (Placed at top-center)
        logo_w = 28
        logo_h = 28
        logo_x = (297 - logo_w) / 2
        if os.path.exists(self.logo_path):
            self.image(self.logo_path, logo_x, 18, logo_w)
        
        # Institution Name
        self.set_y(48)
        self.set_font("helvetica", "B", 18)
        self.set_text_color(11, 37, 64) # Navy Blue
        self.cell(0, 7, "APEX TECH SOFTWARE INSTITUTE", ln=True, align="C")
        
        # Credentials Subtitle
        self.set_font("helvetica", "I", 9)
        self.set_text_color(0, 163, 166) # Technical Teal
        self.cell(0, 4.5, "Regd. No. TS/HYD/1094/2026 | ISO 9001:2015 Certified | A Grade Accredited Training Center", ln=True, align="C")
        
        # Divider Line
        self.set_draw_color(226, 232, 240)
        self.set_line_width(0.4)
        self.line(80, 62, 217, 62)

        # ----------------------------------------------------
        # 3. CERTIFICATE TITLE
        # ----------------------------------------------------
        self.set_y(67)
        self.set_font("times", "BI", 24)
        self.set_text_color(212, 175, 55) # Gold
        self.cell(0, 8, "CERTIFICATE OF COMPLETION", ln=True, align="C")
        
        # ----------------------------------------------------
        # 4. RECIPIENT & ACHIEVEMENT TEXT
        # ----------------------------------------------------
        self.set_y(80)
        self.set_font("times", "I", 12.5)
        self.set_text_color(100, 116, 139) # Slate-500
        self.cell(0, 6, "This is proudly presented to", ln=True, align="C")
        
        # Student Name (Large and prominent)
        self.set_y(90)
        self.set_font("helvetica", "B", 26)
        self.set_text_color(11, 37, 64) # Navy Blue
        self.cell(0, 12, student_name.upper(), ln=True, align="C")
        
        # Underline for name
        self.set_draw_color(11, 37, 64)
        self.set_line_width(0.7)
        self.line(70, 103, 227, 103)
        
        # Completion description
        self.set_y(108)
        self.set_font("times", "I", 12.5)
        self.set_text_color(100, 116, 139)
        self.cell(0, 6, "for successfully completing the advanced industry curriculum and practical laboratory labs for", ln=True, align="C")
        
        # Course Name (Large, Bold Teal)
        self.set_y(116)
        self.set_font("helvetica", "B", 18)
        self.set_text_color(0, 163, 166) # Teal
        self.cell(0, 10, course_name, ln=True, align="C")
        
        # Date and accreditation
        self.set_y(128)
        self.set_font("times", "I", 11.5)
        self.set_text_color(100, 116, 139)
        self.cell(0, 6, f"Conferred on {completion_date} at Hyderabad, India", ln=True, align="C")

        # ----------------------------------------------------
        # 5. FOOTER SECTION: SIGNATURE & BARCODE VERIFICATION
        # ----------------------------------------------------
        # Divider Line
        self.line(20, 142, 277, 142)
        
        # Left Block: Authorized Signature
        sig_y = 148
        self.set_xy(30, sig_y)
        self.set_font("times", "BI", 14)
        self.set_text_color(11, 37, 64)
        # Mocking a cursive hand-signature
        self.cell(60, 6, "Sathish Akula", ln=True, align="C")
        
        # Signature Underline
        self.set_draw_color(148, 163, 184)
        self.set_line_width(0.3)
        self.line(30, sig_y + 7, 90, sig_y + 7)
        
        self.set_xy(30, sig_y + 8)
        self.set_font("helvetica", "B", 8)
        self.set_text_color(100, 116, 139)
        self.cell(60, 4, "DIRECTOR & HEAD OF ACADEMICS", ln=True, align="C")
        
        # Right Block: Barcode Verification
        # Let's calculate x-pos for barcode to center it under the right column
        barcode_x = 175
        barcode_y = 148
        
        # Draw the vector Code 39 barcode
        self.draw_code39(barcode_x, barcode_y, cert_id, height=12, width_narrow=0.25)
        
        # Draw human-readable ID below barcode
        self.set_xy(barcode_x, barcode_y + 13)
        self.set_font("courier", "B", 9)
        self.set_text_color(0, 0, 0)
        # Standard barcode print has asterisks on boundary
        self.cell(60, 4, f"* {cert_id} *", ln=True, align="C")
        
        # Scan to verify notice
        self.set_xy(barcode_x - 10, barcode_y + 17)
        self.set_font("helvetica", "I", 7.5)
        self.set_text_color(148, 163, 184)
        self.cell(80, 3, "Credential authentication barcode. Scan or visit portal to verify.", ln=True, align="C")

def main():
    parser = argparse.ArgumentParser(description="Generate Apex Tech Software Institute completion certificates.")
    parser.add_argument("-s", "--student", default="Sathish Akula", help="Name of the student")
    parser.add_argument("-c", "--course", default="Advanced AWS & DevOps Program", help="Name of the course completed")
    parser.add_argument("-d", "--date", default=None, help="Conferred date (default: today)")
    parser.add_argument("-i", "--id", default=None, help="Certificate verification ID")
    parser.add_argument("-o", "--output", default="public/certificates/certificate_sample.pdf", help="Output path for the compiled PDF")
    
    args = parser.parse_args()
    
    # Defaults
    logo_path = "public/logo.png"
    
    date_str = args.date
    if not date_str:
        date_str = datetime.now().strftime("%B %d, %Y")
        
    cert_id = args.id
    if not cert_id:
        # Generate a unique pseudo-random ID
        import random
        num = random.randint(10000, 99999)
        year = datetime.now().year
        cert_id = f"APEX-{year}-{num}"
        
    # Ensure output directory exists
    out_dir = os.path.dirname(args.output)
    if out_dir and not os.path.exists(out_dir):
        os.makedirs(out_dir)
        
    print(f"Generating certificate for: {args.student}")
    print(f"Course: {args.course}")
    print(f"Certificate ID: {cert_id}")
    print(f"Output location: {args.output}")
    
    pdf = ApexCertificatePDF(logo_path=logo_path)
    pdf.build_certificate(args.student, args.course, date_str, cert_id)
    pdf.output(args.output)
    print("Certificate successfully generated!")

if __name__ == "__main__":
    main()
