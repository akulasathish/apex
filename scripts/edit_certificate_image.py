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
    # Use the backup media copy of the original WhatsApp JPEG image
    original_image_path = "/home/sathish/.gemini/antigravity-cli/brain/945b84e0-8df5-4fc5-80da-5c062790cb61/.tempmediaStorage/media_945b84e0-8df5-4fc5-80da-5c062790cb61_1783515334723.jpg"
    output_jpeg_path = "public/certificates/ATS-APD-24-1001.jpeg"
    output_pdf_path = "public/certificates/ATS-APD-24-1001.pdf"
    
    # Fonts
    font_path_bold = "/usr/share/fonts/liberation/LiberationSans-Bold.ttf"
    
    if not os.path.exists(original_image_path):
        print(f"Error: Original certificate image not found at {original_image_path}")
        return
        
    print(f"Loading original image: {original_image_path}")
    cert_img = Image.open(original_image_path).convert("RGB")
    
    # 1. Seamless texture patch covering of course title (no stamp here)
    left_patch_course = cert_img.crop((150, 100, 420, 140))
    right_patch_course = cert_img.crop((600, 100, 870, 140))
    cert_img.paste(left_patch_course, (242, 413))
    cert_img.paste(right_patch_course, (512, 413))
    
    # 2. Smart pixel-level erase for the dates region (preserves blue stamp pixels)
    x_start, y_start = 240, 492
    x_end, y_end = 780, 530
    w = x_end - x_start
    h = y_end - y_start
    
    # Crop a clean background patch of the same size from the top-left (y=100)
    bg_patch = cert_img.crop((150, 100, 150 + w, 100 + h))
    
    print("Erasing old dates while preserving the blue stamp...")
    for y in range(y_start, y_end):
        for x in range(x_start, x_end):
            r, g, b = cert_img.getpixel((x, y))
            # Determine if it's the blue stamp ink (dominant blue channel)
            is_blue = (b > r + 15) and (b > g + 10) and (b > 60)
            if not is_blue:
                # Replace with clean background texture pixel
                bg_pixel = bg_patch.getpixel((x - x_start, y - y_start))
                cert_img.putpixel((x, y), bg_pixel)
                
    # 3. Draw corrected text lines using true-type font
    draw = ImageDraw.Draw(cert_img)
    font_course = ImageFont.truetype(font_path_bold, 25.5)
    font_dates = ImageFont.truetype(font_path_bold, 20)
    
    # Draw corrected course title: "ADVANCED PYTHON DEVELOPMENT"
    draw_centered_text(draw, "ADVANCED PYTHON DEVELOPMENT", 416, font_course, fill=(15, 23, 42))
    
    # Draw corrected date range: "JAN 5TH, 2025 to JUNE 3RD, 2025."
    draw_centered_text(draw, "JAN 5TH, 2025 to JUNE 3RD, 2025.", 498, font_dates, fill=(15, 23, 42))
    
    # 4. Generate and paste the verification QR Code on the right side
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
    
    # 5. Save the modified JPEG
    os.makedirs(os.path.dirname(output_jpeg_path), exist_ok=True)
    cert_img.save(output_jpeg_path, "JPEG", quality=95)
    print(f"Modified JPEG saved to: {output_jpeg_path}")
    
    # 6. Convert the modified image directly to PDF to maintain 100% visual fidelity
    cert_img.save(output_pdf_path, "PDF", resolution=100.0)
    print(f"Final PDF compiled and saved to: {output_pdf_path}")
    print("Verification certificate edit complete!")

if __name__ == "__main__":
    main()
