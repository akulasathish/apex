import os
import qrcode
from PIL import Image, ImageDraw, ImageFont

def draw_centered_text(draw, text, y, font, fill=(15, 23, 42)):
    # Calculate bounding box to center the text horizontally on a 1024px width image
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    x = (1024 - text_width) / 2
    draw.text((x, y), text, font=font, fill=fill)

def main():
    original_image_path = "/home/sathish/Downloads/WhatsApp Image 2026-07-08 at 6.19.28 PM.jpeg"
    output_jpeg_path = "public/certificates/ATS-APD-24-1001.jpeg"
    output_pdf_path = "public/certificates/ATS-APD-24-1001.pdf"
    
    # Fonts
    font_path_bold = "/usr/share/fonts/liberation/LiberationSans-Bold.ttf"
    
    if not os.path.exists(original_image_path):
        print(f"Error: Original certificate image not found at {original_image_path}")
        return
        
    print(f"Loading original image: {original_image_path}")
    cert_img = Image.open(original_image_path).convert("RGB")
    
    # 1. Seamless texture patch covering of old text lines (bypassing center logo)
    # We crop 270px wide patches from top-left and top-right (avoiding logo at x=450-570)
    # and paste them side-by-side to cover the 540px wide text area (x=242 to x=782)
    
    # Patch for Course Title (height: 40px)
    left_patch_course = cert_img.crop((150, 100, 420, 140))
    right_patch_course = cert_img.crop((600, 100, 870, 140))
    cert_img.paste(left_patch_course, (242, 413))
    cert_img.paste(right_patch_course, (512, 413))
    
    # Patch for Dates (height: 36px)
    left_patch_dates = cert_img.crop((150, 100, 420, 136))
    right_patch_dates = cert_img.crop((600, 100, 870, 136))
    cert_img.paste(left_patch_dates, (242, 494))
    cert_img.paste(right_patch_dates, (512, 494))
    
    # 2. Draw corrected text lines using true-type font on top of the seamless patches
    draw = ImageDraw.Draw(cert_img)
    font_course = ImageFont.truetype(font_path_bold, 25.5)
    font_dates = ImageFont.truetype(font_path_bold, 20)
    
    # Draw corrected course title: "ADVANCED PYTHON DEVELOPMENT"
    draw_centered_text(draw, "ADVANCED PYTHON DEVELOPMENT", 416, font_course, fill=(15, 23, 42))
    
    # Draw corrected date range: "JAN 5TH, 2025 to JUNE 3RD, 2025."
    draw_centered_text(draw, "JAN 5TH, 2025 to JUNE 3RD, 2025.", 498, font_dates, fill=(15, 23, 42))
    
    # 3. Generate and paste the verification QR Code on the right side
    cert_id = "ATS/APD/24/1001"
    verify_url = f"https://apex-web-app-967134820705.us-central1.run.app/verify/{cert_id}"
    print(f"Generating QR code for: {verify_url}")
    
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=1,
    )
    qr.add_data(verify_url)
    qr.make(fit=True)
    
    # Create QR image
    qr_img = qr.make_image(fill_color="black", back_color="white")
    
    # Resize QR code to fit the stamp/margins (90x90 pixels)
    qr_img_resized = qr_img.resize((90, 90), Image.Resampling.LANCZOS)
    
    # Paste QR Code on the right of the stamp
    paste_x = 836
    paste_y = 535
    print(f"Pasting QR code at coordinates: ({paste_x}, {paste_y})")
    cert_img.paste(qr_img_resized, (paste_x, paste_y))
    
    # 4. Save the modified JPEG
    os.makedirs(os.path.dirname(output_jpeg_path), exist_ok=True)
    cert_img.save(output_jpeg_path, "JPEG", quality=95)
    print(f"Modified JPEG saved to: {output_jpeg_path}")
    
    # 5. Convert the modified image directly to PDF to maintain 100% visual fidelity
    cert_img.save(output_pdf_path, "PDF", resolution=100.0)
    print(f"Final PDF compiled and saved to: {output_pdf_path}")
    print("Verification certificate edit complete!")

if __name__ == "__main__":
    main()
