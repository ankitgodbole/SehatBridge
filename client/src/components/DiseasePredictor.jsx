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
      // Making sure to split symptoms correctly and sending the request to the backend
      const response = await axios.post('http://localhost:5000/predict-disease', {
        symptoms: symptoms.split(',').map(s => s.trim())  // Handling the symptoms array
      });
      
      // Setting the result if the backend response is successful
      setResult(response.data);
    } catch (err) {
      // In case of an error, update the error state
      setError('Prediction failed. Check the server and inputs.');
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </label>
        <label>
          Symptoms (comma separated):
          <input 
            type="text" 
            value={symptoms} 
            onChange={(e) => setSymptoms(e.target.value)} 
            placeholder="e.g. fever, cough, headache"
            required 
          />
        </label>
        <button type="submit">Predict Disease</button>
      </form>

      {result && (
        <div className="result">
          <h3>Prediction Result</h3>
          <p><strong>Name:</strong> {result.disease_name}</p>
          <p><strong>Description:</strong> {result.disease_description}</p>
          <p><strong>Treatment:</strong> {result.disease_treatment}</p>
        </div>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default DiseasePredictor;
