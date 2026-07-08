import os
import argparse
import qrcode
from PIL import Image, ImageDraw, ImageFont

def draw_centered_text(draw, text, y, font, fill=(15, 23, 42)):
    # Calculate bounding box to center the text horizontally on a 1024px width image
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    x = (1024 - text_width) / 2
    draw.text((x, y), text, font=font, fill=fill)

def main():
    parser = argparse.ArgumentParser(description="Dynamically edit the classic certificate template with student details, photo, and verification QR code.")
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
    
    # 1. Seamless texture patch covering of old course title (no stamp here)
    left_patch_course = cert_img.crop((150, 100, 420, 140))
    right_patch_course = cert_img.crop((600, 100, 870, 140))
    cert_img.paste(left_patch_course, (242, 413))
    cert_img.paste(right_patch_course, (512, 413))
    
    # 2. Smart pixel-level erase for the dates region (preserves blue stamp pixels)
    x_start, y_start = 240, 492
    x_end, y_end = 780, 530
    w = x_end - x_start
    h = y_end - y_start
    
    # Construct a clean bg_patch of size (w, h) by merging logo-free left and right patches
    bg_patch = Image.new("RGB", (w, h))
    left_bg = cert_img.crop((150, 100, 420, 100 + h))    # width 270
    right_bg = cert_img.crop((600, 100, 870, 100 + h))  # width 270
    bg_patch.paste(left_bg, (0, 0))
    bg_patch.paste(right_bg, (270, 0))
    
    for y in range(y_start, y_end):
        for x in range(x_start, x_end):
            r, g, b = cert_img.getpixel((x, y))
            # Determine if it's the blue stamp ink (dominant blue channel)
            is_blue = (b > r + 15) and (b > g + 10) and (b > 60)
            if not is_blue:
                # Replace with clean background texture pixel from the logo-free patch
                bg_pixel = bg_patch.getpixel((x - x_start, y - y_start))
                cert_img.putpixel((x, y), bg_pixel)
                
    # 3. Erase the old Certificate ID and draw the new one
    # Bounding box of ID: x = 200 to 450, y = 620 to 650
    draw = ImageDraw.Draw(cert_img)
    font_path_bold = "/usr/share/fonts/liberation/LiberationSans-Bold.ttf"
    if not os.path.exists(font_path_bold):
        font_path_bold = "DejaVuSans-Bold.ttf" # Fallback if run on other machines
        
    font_id = ImageFont.truetype(font_path_bold, 15)
    
    # Erase old ID
    id_bg_patch = cert_img.crop((150, 100, 400, 130)) # width 250, height 30
    cert_img.paste(id_bg_patch, (170, 622))
    
    # Draw new ID
    id_text = f"Certificate ID: {args.id}"
    draw.text((70, 625), id_text, font=font_id, fill=(15, 23, 42))

    # 4. Erase the old student name and draw the new one
    # Bounding box of name: x = 240 to 780, y = 330 to 380
    name_bg_patch_left = cert_img.crop((150, 100, 420, 150)) # width 270, height 50
    name_bg_patch_right = cert_img.crop((600, 100, 870, 150)) # width 270, height 50
    cert_img.paste(name_bg_patch_left, (242, 335))
    cert_img.paste(name_bg_patch_right, (512, 335))
    
    # For name, we use Times/Serif Italic-like style to match original template
    font_path_serif_italic = "/usr/share/fonts/liberation/LiberationSerif-BoldItalic.ttf"
    font_name = ImageFont.truetype(font_path_serif_italic, 32)
    # Draw the student's name in UPPERCASE to match the template style
    draw_centered_text(draw, args.student.upper(), 340, font_name, fill=(15, 23, 42))
    
    # 5. Draw corrected course and dates text lines using true-type font
    font_course = ImageFont.truetype(font_path_bold, 25.5)
    font_dates = ImageFont.truetype(font_path_bold, 20)
    
    # Draw course title (uppercase)
    draw_centered_text(draw, args.course.upper(), 416, font_course, fill=(15, 23, 42))
    
    # Draw dates
    dates_text = f"{args.date_start} to {args.date_end}."
    draw_centered_text(draw, dates_text, 498, font_dates, fill=(15, 23, 42))
    
    # 6. If custom student photo is provided, resize and paste it inside the photo box
    if args.photo and os.path.exists(args.photo):
        print(f"Loading student photo: {args.photo}")
        photo_img = Image.open(args.photo).convert("RGB")
        # Resize to fit the inner photo box (approx 120 width x 146 height)
        photo_resized = photo_img.resize((120, 146), Image.Resampling.LANCZOS)
        # Paste inside the black double border of the photo frame
        cert_img.paste(photo_resized, (103, 290))
        
    # 7. Generate and paste the verification QR Code on the right side
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
    qr_img_resized = qr_img.resize((90, 90), Image.Resampling.LANCZOS)
    
    paste_x = 836
    paste_y = 535
    cert_img.paste(qr_img_resized, (paste_x, paste_y))
    
    # 8. Save the modified JPEG
    # Save a copy as JPEG next to the PDF if needed, or save directly to PDF
    output_dir = os.path.dirname(args.output)
    if output_dir:
        os.makedirs(output_dir, exist_ok=True)
        
    # Compile directly to PDF to preserve high resolution vector wrapper
    cert_img.save(args.output, "PDF", resolution=100.0)
    print(f"Success: Certificate generated and saved to: {args.output}")

if __name__ == "__main__":
    main()
