from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)

# Enable CORS globally for all routes
CORS(app)  # Allow cross-origin requests globally

# Disease information - updated with actual diseases and their descriptions/treatment
disease_info = [
    {"name": "Acne", "description": "Acne is a skin condition that occurs when hair follicles are clogged with oil and dead skin cells.", "treatment": "Over-the-counter creams, prescription medications, and lifestyle changes."},
    {"name": "Psoriasis", "description": "Psoriasis is an autoimmune disease that causes skin cells to multiply too quickly, resulting in thick, scaly patches.", "treatment": "Topical treatments, phototherapy, and systemic medications."},
    {"name": "Eczema", "description": "Eczema is a condition that makes the skin red, inflamed, and itchy, often due to an allergic reaction.", "treatment": "Moisturizers, corticosteroids, and antihistamines."},
    {"name": "Melanoma", "description": "Melanoma is a type of skin cancer that develops from pigment-producing cells.", "treatment": "Surgical removal, immunotherapy, chemotherapy, and targeted therapies."},
    {"name": "Rosacea", "description": "Rosacea is a chronic condition that causes redness and visible blood vessels on the face.", "treatment": "Topical medications, oral antibiotics, and laser therapy."},
    {"name": "Common Cold", "description": "A viral infection of the upper respiratory tract that leads to symptoms like a runny nose, cough, and fever.", "treatment": "Rest, hydration, over-the-counter decongestants, and pain relievers."},
    {"name": "Flu", "description": "A contagious respiratory illness caused by influenza viruses, often involving fever, cough, and body aches.", "treatment": "Rest, antiviral medications, fluids, and fever relievers."},
    {"name": "COVID-19", "description": "A contagious disease caused by the SARS-CoV-2 virus, symptoms can range from mild to severe, including fever, cough, and difficulty breathing.", "treatment": "Hospitalization for severe cases, oxygen therapy, antiviral treatments, and vaccines."}
]

# Predefined symptom-to-disease mapping (rule-based approach) - added more symptoms
symptom_disease_mapping = {
    "redness": "Rosacea",
    "scaly patches": "Psoriasis",
    "itching": "Eczema",
    "cystic acne": "Acne",
    "pigmented moles": "Melanoma",
    "runny nose": "Common Cold",
    "cough": "Common Cold",  # Can be used for both Common Cold and Flu
    "fever": "Flu",  # Fever is a common symptom of both Flu and COVID-19
    "body aches": "Flu",
    "shortness of breath": "COVID-19",
    "difficulty breathing": "COVID-19",
    "sore throat": "Common Cold",  # Could also be associated with COVID-19 or Flu
    "fatigue": "COVID-19",  # Fatigue is a common symptom in many diseases, including COVID-19
}

@app.route("/predict-skin", methods=["POST"])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    try:
        # As we're now working with rule-based symptoms, you would not need to process the image
        # This part could be removed for simplicity, as we no longer predict based on image.
        return jsonify({"error": "Image-based prediction is not implemented in rule-based version."}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/predict-disease", methods=["POST"])
def predictd():
    data = request.get_json()

    # Print the received data for debugging
    print(f"Received data: {data}")

    symptoms = data.get('symptoms', [])

    # Debugging: Print the symptoms
    print(f"Symptoms received: {symptoms}")

    # Join the symptoms into a string for matching
    symptom_input = ', '.join(symptoms).lower()

    # Try to match the symptoms to a disease
    predicted_disease = symptom_disease_mapping.get(symptom_input)

    if predicted_disease is None:
        return jsonify({"error": "Symptoms not recognized. Please consult a doctor."}), 400

    # Find the corresponding disease info
    disease = next((d for d in disease_info if d["name"] == predicted_disease), None)

    if not disease:
        return jsonify({"error": "No matching disease found for predicted class."}), 400

    # Return the disease details
    return jsonify({
        "disease_name": disease["name"],  # Include the disease name
        "disease_description": disease["description"],  # Include description
        "disease_treatment": disease["treatment"]  # Include treatment information
    })


if __name__ == "__main__":
    app.run(debug=True)
