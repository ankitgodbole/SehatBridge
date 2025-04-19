const express = require('express');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const router = express.Router();
const Emergency = require('../models/Emergency');

router.post('/emergency', async (req, res) => {
  try {
    const { name, age, symptoms } = req.body;

    // Save to database
    const newEntry = new Emergency({ name, age, symptoms });
    await newEntry.save();

    // Generate PDF
    const doc = new PDFDocument();
    const filePath = path.join(__dirname, `../pdfs/${Date.now()}_emergency.pdf`);
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    // Design the PDF
    doc.fontSize(18).text('Emergency Case Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Name: ${name}`);
    doc.text(`Age: ${age}`);
    doc.text(`Symptoms: ${symptoms}`);
    doc.text(`Date: ${new Date().toLocaleString()}`);

    doc.end();

    writeStream.on('finish', () => {
      console.log(`PDF saved to ${filePath}`);
    });

    res.status(201).json({ message: 'Emergency data saved and PDF generated.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to save emergency data.' });
  }
});

module.exports = router;
