import os
import qrcode
from PIL import Image

def main():
    original_image_path = "/home/sathish/Downloads/WhatsApp Image 2026-07-08 at 6.19.28 PM.jpeg"
    output_jpeg_path = "public/certificates/ATS-APD-24-1001.jpeg"
    output_pdf_path = "public/certificates/ATS-APD-24-1001.pdf"
    
    # 1. Load the original certificate JPEG
    if not os.path.exists(original_image_path):
        print(f"Error: Original certificate image not found at {original_image_path}")
        return
        
    print(f"Loading original image: {original_image_path}")
    cert_img = Image.open(original_image_path).convert("RGB")
    
    # 2. Generate the QR code for verification
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
    
    # Resize QR code to fit the gold seal space (approx 90x90 pixels)
    qr_img_resized = qr_img.resize((90, 90), Image.Resampling.LANCZOS)
    
    # 3. Paste the QR code onto the right side of the certificate
    # The image is 1024x718. The stamp is around x=680 to 800.
    # The gold seal / right space is around x=840 to 930. Vertical y=525 to 615.
    paste_x = 840
    paste_y = 525
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
