import os
import sys
import argparse
import warnings
import math
import qrcode
from datetime import datetime
from fpdf import FPDF

# Suppress FPDF2 deprecation warnings
warnings.filterwarnings("ignore", category=DeprecationWarning)

class ApexClassicCertificate(FPDF):
    def __init__(self, logo_path, photo_path=None, *args, **kwargs):
        # Landscape A4: 297mm x 210mm
        super().__init__(orientation="L", unit="mm", format="A4", *args, **kwargs)
        self.logo_path = logo_path
        self.photo_path = photo_path

    def draw_code39(self, x, y, code, height=10, width_narrow=0.25, ratio=2.5):
        """
        Draws a Code 39 barcode directly onto the PDF using vector rectangles.
        """
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
        
        self.set_fill_color(11, 37, 64) # Navy blue ink for barcode matching design
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
            curr_x += w_narrow

    def draw_vintage_borders(self):
        # Draw solid soft-textured background color (matches parchment)
        self.set_fill_color(252, 251, 247)
        self.rect(0, 0, 297, 210, 'F')
        
        # Outer thin Navy border
        self.set_draw_color(11, 37, 64)
        self.set_line_width(0.5)
        self.rect(6, 6, 285, 198, 'D')
        
        # Inner thick Navy border with classic indented corners
        self.set_line_width(1.3)
        # Top
        self.line(20, 9, 277, 9)
        # Bottom
        self.line(20, 201, 277, 201)
        # Left
        self.line(9, 20, 9, 190)
        # Right
        self.line(288, 20, 288, 190)
        
        # Outer indents
        self.line(20, 9, 20, 20)
        self.line(20, 20, 9, 20)
        self.line(277, 9, 277, 20)
        self.line(277, 20, 288, 20)
        self.line(20, 201, 20, 190)
        self.line(20, 190, 9, 190)
        self.line(277, 201, 277, 190)
        self.line(277, 190, 288, 190)

        # Second parallel inner thin line (1.5mm offset for double-bordered look)
        self.set_line_width(0.3)
        # Top
        self.line(21.5, 10.5, 275.5, 10.5)
        # Bottom
        self.line(21.5, 199.5, 275.5, 199.5)
        # Left
        self.line(10.5, 21.5, 10.5, 188.5)
        # Right
        self.line(286.5, 21.5, 286.5, 188.5)
        
        # Inner indents
        self.line(21.5, 10.5, 21.5, 21.5)
        self.line(21.5, 21.5, 10.5, 21.5)
        self.line(275.5, 10.5, 275.5, 21.5)
        self.line(275.5, 21.5, 286.5, 21.5)
        self.line(21.5, 199.5, 21.5, 188.5)
        self.line(21.5, 188.5, 10.5, 188.5)
        self.line(275.5, 199.5, 275.5, 188.5)
        self.line(275.5, 188.5, 286.5, 188.5)

    def draw_rubber_stamp(self, cx, cy):
        self.set_draw_color(11, 37, 64)
        self.set_line_width(0.4)
        # Outer stamp circle (22mm diameter)
        self.ellipse(cx - 11, cy - 11, 22, 22, 'D')
        # Inner stamp circle (16mm diameter)
        self.ellipse(cx - 8, cy - 8, 16, 16, 'D')
        
        # Stamp Text details
        self.set_text_color(11, 37, 64)
        self.set_font("helvetica", "B", 4)
        
        # Top half
        self.set_xy(cx - 11, cy - 6)
        self.cell(22, 2, "APEX TECH", align="C", ln=True)
        self.set_x(cx - 11)
        self.cell(22, 2, "SOFTWARE INST.", align="C", ln=True)
        
        # Center Vertical (Hyderabad)
        self.set_font("times", "B", 5)
        self.set_xy(cx - 11, cy - 1.5)
        self.cell(22, 3, "Hyderabad", align="C", ln=True)
        
        # Bottom half
        self.set_font("helvetica", "B", 4.2)
        self.set_xy(cx - 11, cy + 2.5)
        self.cell(22, 2.5, "* HYDERABAD *", align="C")

    def draw_gold_seal(self, cx, cy):
        # Main gold base circle
        self.set_fill_color(225, 190, 85) # Golden yellow
        self.ellipse(cx - 11, cy - 11, 22, 22, 'F')
        
        # Serrated effect outer border (draw 36 small overlapping circles for serrations)
        self.set_fill_color(212, 175, 55) # Darker gold
        for i in range(36):
            angle = i * (2 * math.pi / 36)
            sx = cx + 10.5 * math.cos(angle)
            sy = cy + 10.5 * math.sin(angle)
            self.ellipse(sx - 1.2, sy - 1.2, 2.4, 2.4, 'F')
            
        # Inner lighter gold layer
        self.set_fill_color(250, 220, 120)
        self.ellipse(cx - 9, cy - 9, 18, 18, 'F')
        
        # Inner decorative circle line
        self.set_draw_color(180, 140, 30)
        self.set_line_width(0.35)
        self.ellipse(cx - 7, cy - 7, 14, 14, 'D')
        
        # Center Star coordinates
        R = 4
        r = 1.8
        points = []
        for i in range(10):
            angle = i * math.pi / 5 - math.pi / 2
            rad = R if i % 2 == 0 else r
            px = cx + rad * math.cos(angle)
            py = cy + rad * math.sin(angle)
            points.append((px, py))
            
        # Draw 5-pointed star
        self.set_draw_color(180, 140, 30)
        self.set_line_width(0.4)
        for i in range(10):
            p1 = points[i]
            p2 = points[(i + 1) % 10]
            self.line(p1[0], p1[1], p2[0], p2[1])

    def generate_pdf(self, student_name, course_title, date_start, date_end, cert_id, output_path):
        self.alias_nb_pages()
        self.add_page()
        
        # 1. Vintage Borders
        self.draw_vintage_borders()
        
        # 2. Top-Center Circular Logo
        logo_size = 22
        logo_x = (297 - logo_size) / 2
        if os.path.exists(self.logo_path):
            self.image(self.logo_path, logo_x, 15, logo_size, logo_size)
            
        # 3. Headers
        self.set_y(41)
        self.set_font("helvetica", "B", 18.5)
        self.set_text_color(11, 37, 64) # Navy Blue
        self.cell(0, 6, "APEX TECH SOFTWARE INSTITUTE", align="C", ln=True)
        
        self.set_y(48)
        self.set_font("helvetica", "", 8.5)
        self.set_text_color(11, 37, 64)
        self.cell(0, 4, "apextechsoftwareinstitute.com", align="C", ln=True)
        
        self.set_y(57)
        self.set_font("times", "B", 18)
        self.set_text_color(30, 41, 59) # Slate Dark
        self.cell(0, 6, "CERTIFICATE OF COMPLETION", align="C", ln=True)
        
        self.set_y(65)
        self.set_font("times", "I", 10)
        self.set_text_color(71, 85, 105)
        self.cell(0, 5, "THIS IS TO CERTIFY THAT", align="C", ln=True)
        
        # 4. Student Name (Large Serif Italic)
        self.set_y(73)
        self.set_font("times", "BI", 26)
        self.set_text_color(11, 37, 64)
        self.cell(0, 10, student_name.upper(), align="C", ln=True)
        
        # 5. Course Complete Description
        self.set_y(86)
        self.set_font("times", "I", 11.5)
        self.set_text_color(71, 85, 105)
        self.cell(0, 5, "has successfully completed the rigorous course titled", align="C", ln=True)
        
        # Course Name (Large Bold Sans-serif)
        self.set_y(93)
        self.set_font("helvetica", "B", 15)
        self.set_text_color(15, 23, 42)
        self.cell(0, 7, course_title.upper(), align="C", ln=True)
        
        # Period descriptor
        self.set_y(102)
        self.set_font("times", "I", 11.5)
        self.set_text_color(71, 85, 105)
        self.cell(0, 5, "demonstrating proficiency and dedication during the period from", align="C", ln=True)
        
        # Date range
        self.set_y(109)
        self.set_font("helvetica", "B", 13.5)
        self.set_text_color(15, 23, 42)
        date_range_str = f"{date_start.upper()} TO {date_end.upper()}."
        self.cell(0, 6, date_range_str, align="C", ln=True)
        
        # 6. Framed Student Photo (Left-aligned)
        photo_x = 24
        photo_y = 66
        photo_w = 34
        photo_h = 42
        
        if self.photo_path and os.path.exists(self.photo_path):
            # Render photo image
            self.image(self.photo_path, photo_x, photo_y, photo_w, photo_h)
            # Render black frame outline around photo
            self.set_draw_color(0, 0, 0)
            self.set_line_width(0.3)
            self.rect(photo_x, photo_y, photo_w, photo_h, 'D')
        else:
            # Placeholder box
            self.set_fill_color(243, 244, 246) # Light grey bg
            self.rect(photo_x, photo_y, photo_w, photo_h, 'F')
            self.set_draw_color(156, 163, 175) # Border
            self.set_line_width(0.25)
            self.rect(photo_x, photo_y, photo_w, photo_h, 'D')
            # Text inside placeholder
            self.set_xy(photo_x, photo_y + 16)
            self.set_font("helvetica", "I", 7)
            self.set_text_color(156, 163, 175)
            self.cell(photo_w, 4, "[ STUDENT PHOTO ]", align="C", ln=True)
            self.set_x(photo_x)
            self.cell(photo_w, 4, "PLACEHOLDER", align="C")

        # 7. Verification Text (Bottom-Left)
        self.set_xy(photo_x, 168)
        self.set_font("times", "B", 10.5) # Using Times-like serif font as shown in the image
        self.set_text_color(15, 23, 42)
        self.cell(100, 5, f"Certificate ID: {cert_id}", align="L")
        
        # 8. Signatures, Stamp & QR Code (Bottom-Right)
        # Signature
        sig_x = 135
        sig_y = 152
        self.set_xy(sig_x, sig_y)
        self.set_font("times", "BI", 13)
        self.set_text_color(11, 37, 64)
        self.cell(50, 5, "Sai Charan", align="C", ln=True)
        
        # Signature Line
        self.set_draw_color(148, 163, 184)
        self.set_line_width(0.25)
        self.line(135, sig_y + 5, 185, sig_y + 5)
        
        # Signature Title
        self.set_xy(sig_x, sig_y + 6)
        self.set_font("helvetica", "", 7.5)
        self.set_text_color(71, 85, 105)
        self.cell(50, 4, "Sai Charan,", align="C", ln=True)
        self.set_x(sig_x)
        self.cell(50, 3, "CEO", align="C")
        
        # Blue Rubber Stamp
        self.draw_rubber_stamp(cx=212, cy=157)
        
        # QR Code for instant validation scan
        qr_x = 248
        qr_y = 149
        qr_size = 16
        qr_temp_path = "public/certificates/temp_qr.png"
        
        try:
            # Construct verification URL
            verify_url = f"https://apex-web-app-967134820705.us-central1.run.app/verify/{cert_id}"
            
            # Generate QR Code image
            qr = qrcode.QRCode(version=1, box_size=10, border=1)
            qr.add_data(verify_url)
            qr.make(fit=True)
            qr_img = qr.make_image(fill_color="black", back_color="white")
            
            # Ensure folder exists and save
            os.makedirs(os.path.dirname(qr_temp_path), exist_ok=True)
            qr_img.save(qr_temp_path)
            
            # Place in PDF
            self.image(qr_temp_path, qr_x, qr_y, qr_size, qr_size)
        except Exception as e:
            print(f"Warning: Failed to generate QR code: {e}")
            # Fallback border placeholder if QR generation fails
            self.set_draw_color(156, 163, 175)
            self.set_line_width(0.2)
            self.rect(qr_x, qr_y, qr_size, qr_size, 'D')

        # Output the PDF file
        self.output(output_path)
        
        # Clean up temp QR image
        if os.path.exists(qr_temp_path):
            try:
                os.remove(qr_temp_path)
            except:
                pass

def main():
    parser = argparse.ArgumentParser(description="Generate Apex Tech Software Institute completion certificates based on classic image template.")
    parser.add_argument("-s", "--student", default="Dhathri Ramidi", help="Name of the student")
    parser.add_argument("-c", "--course", default="Advanced Python Programming", help="Name of the course completed")
    parser.add_argument("-ds", "--date-start", default="December 5th, 2025", help="Course start date description")
    parser.add_argument("-de", "--date-end", default="June 9th, 2026", help="Course end date description")
    parser.add_argument("-i", "--id", default="ATS/APD/24/1001", help="Certificate ID")
    parser.add_argument("-p", "--photo", default=None, help="Path to student's face photo (JPEG/PNG)")
    parser.add_argument("-o", "--output", default="public/certificates/certificate_sample.pdf", help="Output path for the compiled PDF")
    
    args = parser.parse_args()
    
    # Defaults
    logo_path = "public/logo_backup.png" # Using backup original square logo if available
    if not os.path.exists(logo_path):
        logo_path = "public/logo.png"
        
    print(f"Generating classic certificate for: {args.student}")
    print(f"Course: {args.course}")
    print(f"Certificate ID: {args.id}")
    print(f"Photo: {args.photo}")
    print(f"Output: {args.output}")
    
    pdf = ApexClassicCertificate(logo_path=logo_path, photo_path=args.photo)
    pdf.generate_pdf(
        student_name=args.student,
        course_title=args.course,
        date_start=args.date_start,
        date_end=args.date_end,
        cert_id=args.id,
        output_path=args.output
    )
    print("Certificate successfully generated!")

if __name__ == "__main__":
    main()
