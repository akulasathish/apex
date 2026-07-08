import os
import argparse
import qrcode
from PIL import Image, ImageDraw, ImageFont

def draw_centered_text(draw, text, y, font, fill=(15, 23, 42)):
    # Center the text horizontally on the 1232px wide image canvas
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    x = (1232 - text_width) / 2
    draw.text((x, y), text, font=font, fill=fill)

def main():
    parser = argparse.ArgumentParser(description="Dynamically draw certificate details onto the clean 1232x864 template image.")
    parser.add_argument("-s", "--student", required=True, help="Name of the student")
    parser.add_argument("-c", "--course", required=True, help="Course title")
    parser.add_argument("-ds", "--date-start", required=True, help="Course start date description")
    parser.add_argument("-de", "--date-end", required=True, help="Course end date description")
    parser.add_argument("-i", "--id", required=True, help="Certificate ID")
    parser.add_argument("-p", "--photo", default=None, help="Path to student face photo (optional)")
    parser.add_argument("-o", "--output", required=True, help="Path to output PDF file")
    parser.add_argument("-u", "--url-host", default="https://apex-web-app-967134820705.us-central1.run.app", help="Verification server URL host")
    
    args = parser.parse_args()
    
    template_path = "scripts/certificate_template.jpg"
    if not os.path.exists(template_path):
        template_path = os.path.join(os.path.dirname(__file__), "certificate_template.jpg")
        
    if not os.path.exists(template_path):
        print(f"Error: Certificate template image not found at {template_path}")
        return
        
    print(f"Loading template: {template_path}")
    cert_img = Image.open(template_path).convert("RGB")
    
    draw = ImageDraw.Draw(cert_img)
    
    # Load fonts
    font_path_bold = "/usr/share/fonts/liberation/LiberationSans-Bold.ttf"
    if not os.path.exists(font_path_bold):
        font_path_bold = "DejaVuSans-Bold.ttf" # Fallback if run on other machines
        
    font_path_serif_italic = "/usr/share/fonts/liberation/LiberationSerif-BoldItalic.ttf"
    if not os.path.exists(font_path_serif_italic):
        font_path_serif_italic = "DejaVuSerif-BoldItalic.ttf"
        
    font_name = ImageFont.truetype(font_path_serif_italic, 36)
    font_course = ImageFont.truetype(font_path_bold, 28)
    font_dates = ImageFont.truetype(font_path_bold, 22)
    font_id = ImageFont.truetype(font_path_bold, 17)
    
    # 1. Draw the student's name in UPPERCASE (Serif Italic) centered vertically at Y: 410
    draw_centered_text(draw, args.student.upper(), 410, font_name, fill=(15, 23, 42))
    
    # 2. Draw course title in UPPERCASE (Sans-Serif Bold) centered vertically at Y: 505
    draw_centered_text(draw, args.course.upper(), 505, font_course, fill=(15, 23, 42))
    
    # 3. Draw dates (Sans-Serif Bold) centered vertically at Y: 625
    dates_text = f"{args.date_start.upper()} TO {args.date_end.upper()}."
    draw_centered_text(draw, dates_text, 625, font_dates, fill=(15, 23, 42))
    
    # 4. Draw Certificate ID next to the label (starts at X: 230, Y: 765)
    draw.text((230, 765), args.id, font=font_id, fill=(15, 23, 42))
    
    # 5. If custom student photo is provided, resize and paste it inside the photo box (X: 118, Y: 342, W: 155, H: 176)
    if args.photo and os.path.exists(args.photo):
        print(f"Loading student photo: {args.photo}")
        photo_img = Image.open(args.photo).convert("RGB")
        photo_resized = photo_img.resize((155, 176), Image.Resampling.LANCZOS)
        cert_img.paste(photo_resized, (118, 342))
        
    # 6. Generate and paste the verification QR Code on the right side (X: 1005, Y: 602, Size: 100x100)
    verify_url = f"{args.url_host}/verify/{args.id}"
    print(f"Generating QR code for: {verify_url}")
    
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=1,
    )
    qr.add_data(verify_url)
    qr.make(fit=True)
    
    qr_img = qr.make_image(fill_color="black", back_color="white")
    qr_img_resized = qr_img.resize((100, 100), Image.Resampling.LANCZOS)
    cert_img.paste(qr_img_resized, (1005, 602))
    
    # 7. Save the modified image directly to PDF (keeps full-bleed classic style)
    output_dir = os.path.dirname(args.output)
    if output_dir:
        os.makedirs(output_dir, exist_ok=True)
        
    cert_img.save(args.output, "PDF", resolution=100.0)
    print(f"Success: Certificate generated and saved to: {args.output}")

if __name__ == "__main__":
    main()
