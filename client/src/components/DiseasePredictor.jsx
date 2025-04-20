import React, { useState } from 'react';
import axios from 'axios';

const DiseasePredictor = () => {
  const [name, setName] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/predict-disease', {
        symptoms: symptoms.split(',').map(s => s.trim())
      });
      setResult(response.data);
    } catch (err) {
      setError('Prediction failed. Check the server and inputs.');
    }
  };

  const styles = {
    container: {
      marginTop:"120px",
      maxWidth: '520px',
      margin: '60px auto',
      padding: '30px 25px',
      background: '#f0f4f8',
      borderRadius: '16px',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
      fontFamily: 'Segoe UI, sans-serif',
    },
    title: {
      textAlign: 'center',
      fontSize: '28px',
      color: '#2c3e50',
      marginBottom: '24px',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '18px',
    },
    label: {
      fontWeight: '600',
      color: '#34495e',
    },
    input: {
      padding: '12px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      fontSize: '15px',
    },
    inputFocus: {
      borderColor: '#3498db',
      boxShadow: '0 0 6px rgba(52, 152, 219, 0.4)',
      outline: 'none',
    },
    button: {
      backgroundColor: '#3498db',
      color: 'white',
      border: 'none',
      padding: '14px',
      fontSize: '16px',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'background 0.3s ease',
    },
    resultBox: {
      marginTop: '30px',
      padding: '20px',
      borderRadius: '12px',
      background: '#eafaf1',
      border: '1px solid #2ecc71',
      color: '#2c3e50',
    },
    resultTitle: {
      marginBottom: '12px',
      color: '#27ae60',
    },
    errorMessage: {
      marginTop: '20px',
      color: '#e74c3c',
      fontWeight: 'bold',
      textAlign: 'center',
    },
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h1 style={styles.title}>🩺 Disease Prediction Form</h1>

        <label style={styles.label}>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
            required
          />
        </label>

        <label style={styles.label}>
          Symptoms (comma separated):
          <input
            type="text"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="e.g. fever, cough, headache"
            style={styles.input}
            required
          />
        </label>

        <button type="submit" style={styles.button}>🔍 Predict Disease</button>
      </form>

      {result && (
        <div style={styles.resultBox}>
          <h3 style={styles.resultTitle}>🧾 Prediction Result</h3>
          <p><strong>Name:</strong> {name}</p>
          <p><strong>Disease:</strong> {result.disease_name}</p>
          <p><strong>Description:</strong> {result.disease_description}</p>
          <p><strong>Treatment:</strong> {result.disease_treatment}</p>
        </div>
      )}

      {error && <p style={styles.errorMessage}>{error}</p>}
    </div>
  );
};

export default DiseasePredictor;