import React, { useState } from 'react';
import axios from 'axios';

// Sample Disease Data
const diseaseInfo = [
  {
    name: "Acne",
    description: "Acne is a common skin condition that causes pimples, blackheads, and cysts.",
    treatment: "Use benzoyl peroxide, salicylic acid, and retinoids. Severe cases may need oral antibiotics or isotretinoin.",
    medicine: "Benzac AC, Retin-A, Accutane, Doxycycline",
    precautions: "Avoid greasy cosmetics, don't pop pimples, wash your face twice daily."
  },
  {
    name: "Psoriasis",
    description: "A chronic autoimmune disorder that leads to thick, red, scaly skin patches.",
    treatment: "Topical corticosteroids, phototherapy, and biologics like adalimumab.",
    medicine: "Clobetasol, Methotrexate, Humira",
    precautions: "Keep skin moisturized, avoid stress and smoking."
  },
  {
    name: "Eczema",
    description: "A condition that causes the skin to become inflamed, itchy, and cracked.",
    treatment: "Use moisturizers, corticosteroids, antihistamines.",
    medicine: "Hydrocortisone, Cetirizine, Dupilumab",
    precautions: "Avoid allergens, use mild soaps and moisturizers."
  },
  {
    name: "Melanoma",
    description: "A serious form of skin cancer originating from melanocytes.",
    treatment: "Surgical excision, immunotherapy, targeted therapy.",
    medicine: "Keytruda, Opdivo, Dabrafenib",
    precautions: "Limit sun exposure, use SPF 50+, perform regular skin exams."
  },
  {
    name: "Rosacea",
    description: "A chronic skin condition causing redness and visible blood vessels on the face.",
    treatment: "Topical antibiotics, oral medications, laser therapy.",
    medicine: "Metrogel, Doxycycline, Mirvaso",
    precautions: "Avoid spicy food, alcohol, and extreme temperatures."
  }
];

const SkinDiseasePredictor = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setError(null);
      setResult(null); // Reset previous result
    } else {
      setError("Please upload a valid image file.");
    }
  };
  

  const handlePredict = async () => {
    if (!selectedFile) {
      setError("Please select a file to predict.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post("http://localhost:5000/predict-skin", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // try {
      //   const response = await axios.post("https://sehatbridge.onrender.com/predict-skin", formData, {
      //     headers: { "Content-Type": "multipart/form-data" },
      //   });

      const { predicted_class, prediction } = response.data;
      const predictedInfo = diseaseInfo[predicted_class];

      // Check if result is already set before updating it
      if (predictedInfo) {
        setResult({
          ...predictedInfo,
          predictedClass: predicted_class,
          probability: (prediction[predicted_class] * 100).toFixed(2)
        });

      } 
      else {
        setError("Unknown disease predicted.");
      
      }
    } catch (err) {
      console.error("Prediction error:", err);
      setError("There was an error during prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Skin Disease Predictor</h1>
      <p style={styles.subtitle}>
        Upload an image and our AI model will predict the disease with high accuracy and provide medical advice.
      </p>
  
      <div style={styles.uploadSection}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button onClick={handlePredict} disabled={loading} style={styles.button}>
          {loading ? "Predicting..." : "Predict"}
        </button>
        {error && <p style={styles.error}>{error}</p>}
      </div>
  
      {selectedFile && result && (
        <div style={styles.resultWrapper}>
          <div style={styles.previewCard}>
            <h3 style={styles.sectionTitle}>Uploaded Image</h3>
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Skin Condition"
              style={styles.image}
            />
          </div>
  
          <div style={styles.resultCard}>
            <h2 style={styles.predictedTitle}>{`🩺 ${result.name}`}</h2>
            <p><strong>🔢 Probability:</strong> <span style={styles.highlight}>{result.probability}%</span></p>
            <p><strong>📖 Description:</strong> {result.description}</p>
            <p><strong>💊 Treatment:</strong> {result.treatment}</p>
            <p><strong>🧴 Medicines:</strong> {result.medicine}</p>
            <p><strong>⚠️ Precautions:</strong> {result.precautions}</p>
          </div>
        </div>
      )}
  
      {/* <div style={styles.animationSection}>
        <svg xmlns="" width="100" height="100" viewBox="0 0 100 100" style={styles.animationSVG}>
          <circle cx="50" cy="50" r="40" stroke="#3498db" strokeWidth="4" fill="none" />
          <circle cx="50" cy="50" r="35" stroke="#9b59b6" strokeWidth="4" fill="none" strokeDasharray="10,5" strokeDashoffset="0" />
        </svg>
      </div> */}
    </div>
  );
};  
// Styles for the component
const styles = {
  container: {
    padding: "40px",
    fontFamily: "Arial, sans-serif",
    maxWidth: "900px",
    margin: "auto",
    backgroundColor: "#ecf0f1",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    position: "relative",
  },

  resultWrapper: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: "30px",
    marginTop: "40px",
  },
  
  previewCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    textAlign: "center",
    minWidth: "320px",
  },
  
  resultCard: {
    flex: 1.2,
    backgroundColor: "#fefefe",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
    minWidth: "320px",
    borderLeft: "6px solid #3498db",
  },
  
  predictedTitle: {
    color: "#e74c3c",
    fontSize: "24px",
    marginBottom: "15px",
    fontWeight: "600",
  },
  
  sectionTitle: {
    fontSize: "20px",
    marginBottom: "15px",
    fontWeight: "500",
    color: "#2c3e50",
  },
  
  highlight: {
    color: "#2ecc71",
    fontWeight: "600",
  },
  
  resultBox: {
    flex: "1",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    minWidth: "300px",
  },
  previewContainer: {
    flex: "1",
    textAlign: "center",
    minWidth: "300px",
  },
  

  title: {
    textAlign: "center",
    fontSize: "36px",
    color: "#2C3E50",
    marginBottom: "20px",
    fontWeight: "600",
  },
  subtitle: {
    textAlign: "center",
    color: "#7F8C8D",
    marginBottom: "30px",
    fontSize: "18px",
  },
  uploadSection: {
    textAlign: "center",
    marginBottom: "20px",
  },
  button: {
    padding: "12px 24px",
    backgroundColor: "#2980B9",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "15px",
  },

  image: {
    width: "350px",
    borderRadius: "10px",
    marginTop: "15px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },
   error: {
    color: "red",
    marginTop: "15px",
    fontSize: "14px",
  },
  animationSection: {
    display: "flex",
    justifyContent: "center",
    marginTop: "40px",
  },
  animationSVG: {
    animation: "rotate 2s linear infinite",
  },
  infoBox: {
    backgroundColor: "#ffffff",
    padding: "20px",
    marginTop: "30px",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },
};

export default SkinDiseasePredictor;
