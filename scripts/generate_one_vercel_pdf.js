const fs = require("fs").promises;
const path = require("path");
const { PDFDocument, rgb } = require("pdf-lib");
const fontkit = require("@pdf-lib/fontkit");
const QRCode = require("qrcode");

async function generate() {
  try {
    const studentName = "DHATHRI RAMIDI";
    const courseTitle = "ADVANCED PYTHON PROGRAMMING";
    const dateStart = "JAN 5TH, 2025";
    const dateEnd = "JUNE 3RD, 2025";
    const certId = "ATS/APP/26/1014";
    const photoPath = path.join(__dirname, "../public/certificates/photos/ATS-APP-26-1014.jpg");
    const templatePath = path.join(__dirname, "certificate_template.jpg");
    const fontPathBold = path.join(__dirname, "fonts/LiberationSans-Bold.ttf");
    const fontPathSerifItalic = path.join(__dirname, "fonts/LiberationSerif-BoldItalic.ttf");
    const outputPath = "/home/sathish/Downloads/ATS-APP-26-1014-New.pdf";

    console.log("Initializing PDF Document...");
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

    // Load fonts
    const fontBoldBytes = await fs.readFile(fontPathBold);
    const fontSerifItalicBytes = await fs.readFile(fontPathSerifItalic);
    const fontSansBold = await pdfDoc.embedFont(fontBoldBytes);
    const fontSerifItalic = await pdfDoc.embedFont(fontSerifItalicBytes);

    // Load template image
    const templateBytes = await fs.readFile(templatePath);
    const templateImage = await pdfDoc.embedJpg(templateBytes);

    const page = pdfDoc.addPage([1232, 864]);
    page.drawImage(templateImage, { x: 0, y: 0, width: 1232, height: 864 });

    const textColor = rgb(15/255, 23/255, 42/255);

    // 1. Draw Student Name (centered)
    const nameWidth = fontSerifItalic.widthOfTextAtSize(studentName.toUpperCase(), 36);
    const nameX = (1232 - nameWidth) / 2;
    page.drawText(studentName.toUpperCase(), {
      x: nameX,
      y: 864 - 410 - 36,
      size: 36,
      font: fontSerifItalic,
      color: textColor
    });

    // 2. Draw Course Title (centered)
    const courseWidth = fontSansBold.widthOfTextAtSize(courseTitle.toUpperCase(), 28);
    const courseX = (1232 - courseWidth) / 2;
    page.drawText(courseTitle.toUpperCase(), {
      x: courseX,
      y: 864 - 505 - 28,
      size: 28,
      font: fontSansBold,
      color: textColor
    });

    // 3. Draw Dates (centered)
    const datesText = `${dateStart.toUpperCase()} TO ${dateEnd.toUpperCase()}.`;
    const datesWidth = fontSansBold.widthOfTextAtSize(datesText, 22);
    const datesX = (1232 - datesWidth) / 2;
    page.drawText(datesText, {
      x: datesX,
      y: 864 - 625 - 22,
      size: 22,
      font: fontSansBold,
      color: textColor
    });

    // 4. Draw Certificate ID
    page.drawText(certId, {
      x: 230,
      y: 864 - 750 - 17,
      size: 17,
      font: fontSansBold,
      color: textColor
    });

    // 5. Draw Student Photo
    console.log("Loading student photo from public folders...");
    const photoBuffer = await fs.readFile(photoPath);
    const embeddedPhoto = await pdfDoc.embedJpg(photoBuffer);
    page.drawImage(embeddedPhoto, {
      x: 118,
      y: 864 - 342 - 176,
      width: 155,
      height: 176
    });

    // Draw border frame outline around photo
    page.drawRectangle({
      x: 117,
      y: 864 - 341 - 178,
      width: 157,
      height: 178,
      borderColor: textColor,
      borderWidth: 1
    });

    // 6. Generate and Draw QR Code pointing to custom domain (which you link to Vercel)
    const verificationUrl = `https://apextechsoftwareinstitute.com/verify/${certId}`;
    console.log(`Generating QR Code pointing to Vercel URL: ${verificationUrl}`);
    const qrBuffer = await QRCode.toBuffer(verificationUrl, { margin: 1, width: 100 });
    const qrImage = await pdfDoc.embedPng(qrBuffer);
    page.drawImage(qrImage, {
      x: 1005,
      y: 864 - 602 - 100,
      width: 100,
      height: 100
    });

    // Save and write PDF file
    console.log(`Saving PDF to: ${outputPath}`);
    const pdfBytes = await pdfDoc.save();
    await fs.writeFile(outputPath, pdfBytes);
    console.log("PDF generated successfully!");

  } catch (error) {
    console.error("Failed to generate PDF:", error);
  }
}

generate();
