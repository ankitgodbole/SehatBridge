import React, { useState } from 'react';
import axios from 'axios';

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
  const [previewUrl, setPreviewUrl] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
      setResult(null);
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
    formData.append("image", selectedFile);

    try {
      const response = await axios.post("http://localhost:5000/predict-skin", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { disease_name, disease_description, disease_treatment } = response.data;

      const matchedDisease = diseaseInfo.find(
        disease => disease.name.toLowerCase() === disease_name.toLowerCase()
      );

      if (matchedDisease) {
        setResult({
          ...matchedDisease,
          disease_description,
          disease_treatment
        });
      } else {
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
        <div style={styles.resultSection}>
          <img src={previewUrl} alt="Uploaded" style={styles.imagePreview} />
          <h2 style={styles.resultTitle}>{result.name}</h2>
          <p><strong>Description:</strong> {result.disease_description}</p>
          <p><strong>Treatment:</strong> {result.disease_treatment}</p>
          <p><strong>Medicines:</strong> {result.medicine}</p>
          <p><strong>Precautions:</strong> {result.precautions}</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    marginTop: "120px", // changed from 80px to 120px
    padding: "20px",
    maxWidth: "700px",
    marginLeft: "auto",
    marginRight: "auto",
    textAlign: "center",
  },
  title: {
    fontSize: "2em",
    marginBottom: "20px",
  },
  subtitle: {
    marginBottom: "20px",
    fontSize: "1.2em",
    color: "#777",
  },
  uploadSection: {
    marginBottom: "30px",
  },
  button: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "10px 25px",
    border: "none",
    cursor: "pointer",
    marginTop: "10px",
    fontSize: "16px",
    borderRadius: "6px",
  },
  error: {
    color: "red",
    marginTop: "10px",
  },
  resultSection: {
    marginTop: "40px",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "12px",
    boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
    textAlign: "left",
  },
  resultTitle: {
    fontSize: "24px",
    marginBottom: "10px",
    color: "#333",
    textAlign: "center",
  },
  imagePreview: {
    width: "100%",
    maxWidth: "300px",
    height: "auto",
    borderRadius: "10px",
    margin: "0 auto 20px",
    display: "block",
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
  }
};

export default SkinDiseasePredictor;
