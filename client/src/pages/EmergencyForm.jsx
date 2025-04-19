import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';

function EmergencyForm() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [symptoms, setSymptoms] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/hospitalapi/emergency", {
        name,
        age,
        symptoms,
      });

      toast.success(res.data.message);
      generatePDF(); // ⬅️ Generate and download PDF

      setName('');
      setAge('');
      setSymptoms('');
    } catch (error) {
      toast.error("Error submitting emergency data");
      console.error(error);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Add light cream background for main content
    doc.setFillColor(252, 248, 230); // Light cream for body
    doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');
  
    // Add darker header background for logo
    doc.setFillColor(41, 128, 185); // Professional blue for header
    doc.rect(0, 0, doc.internal.pageSize.width, 45, 'F');
  
    // Set text color to white for header content
    doc.setTextColor(255, 255, 255);
  
    // Logo (add your base64 logo image here)
    var img = new Image();
    img.src = '/1.png'; // Replace with your logo path
    doc.addImage(img, 'png', 85, 5, 40, 15);
  
    // Header text in white
    doc.setFontSize(14);
    doc.text('Emergency E-Patient Report', 105, 30, { align: 'center' });
    doc.setFontSize(10);
    doc.text('Generated from SehatBridge', 105, 36, { align: 'center' });
  
    // Switch to dark text for body content
    doc.setTextColor(44, 62, 80); // Dark blue-grey for better readability
  
    // Body
    doc.setFontSize(12);
    doc.text('Emergency Details', 20, 60);
    doc.setDrawColor(41, 128, 185); // Blue line color
    doc.line(20, 65, 190, 65); // Decorative line under section header

    doc.text(`Name: ${name}`, 20, 75);
    doc.text(`Age: ${age}`, 20, 85);
    doc.text(`Symptoms: ${symptoms}`, 20, 95);
    doc.text(`Date: ${new Date().toLocaleString()}`, 20, 105);

    const pageCount = doc.internal.getNumberOfPages();
    doc.setFontSize(10);
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
  
      // Add footer background
      doc.setFillColor(41, 128, 185);
      doc.rect(0, doc.internal.pageSize.height - 20, doc.internal.pageSize.width, 20, 'F');
  
      // Footer text in white
      doc.setTextColor(255, 255, 255);
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 12,
        { align: 'center' }
      );
      doc.text(
        'Thank you for choosing Our Hospital. Please bring this document on the day of your appointment.\n 2025 SehatBridge. All rights reserved.',
        105,
        doc.internal.pageSize.height - 6,
        { align: 'center' }
      );
    }
    doc.save('emergency-case-report.pdf');
  };

  return (
    <div className="form-container">
      <h2>Emergency Form</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} required />
        <input type="text" placeholder="Reason of Emergency" value={symptoms} onChange={(e) => setSymptoms(e.target.value)} required />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default EmergencyForm;
