from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
from PIL import Image
import numpy as np
import io

app = Flask(__name__)
CORS(app)

# Load your trained Keras model
model = load_model("model/skindisease.h5")  # Path to your model

# Labels your model predicts
class_labels = ['Acne', 'Psoriasis', 'Eczema', 'Melanoma', 'Rosacea']

# Disease info
disease_info = [
    {"name": "Acne", "description": "Acne is a skin condition that occurs when hair follicles are clogged with oil and dead skin cells.", "treatment": "Over-the-counter creams, prescription medications, and lifestyle changes."},
    {"name": "Psoriasis", "description": "Psoriasis is an autoimmune disease that causes skin cells to multiply too quickly, resulting in thick, scaly patches.", "treatment": "Topical treatments, phototherapy, and systemic medications."},
    {"name": "Eczema", "description": "Eczema is a condition that makes the skin red, inflamed, and itchy, often due to an allergic reaction.", "treatment": "Moisturizers, corticosteroids, and antihistamines."},
    {"name": "Melanoma", "description": "Melanoma is a type of skin cancer that develops from pigment-producing cells.", "treatment": "Surgical removal, immunotherapy, chemotherapy, and targeted therapies."},
    {"name": "Rosacea", "description": "Rosacea is a chronic condition that causes redness and visible blood vessels on the face.", "treatment": "Topical medications, oral antibiotics, and laser therapy."}
]

# Symptom-based rule-based disease mapping
symptom_disease_mapping = {
    "redness": "Rosacea",
    "scaly patches": "Psoriasis",
    "itching": "Eczema",
    "cystic acne": "Acne",
    "pigmented moles": "Melanoma"
}

@app.route('/predict-skin', methods=['POST'])
def predict_skin():
    try:
        # Check for uploaded file
        if 'image' not in request.files:
            return jsonify({"error": "No file part"}), 400

        file = request.files['image']
        if file.filename == '':
            return jsonify({"error": "No selected image file"}), 400

        # Load and preprocess image
        image = Image.open(file.stream).convert("RGB")
        print("[INFO] Original image size:", image.size)

        image = image.resize((64, 64))  # Match model input shape
        image_array = img_to_array(image) / 255.0
        image_array = np.expand_dims(image_array, axis=0)

        print("[INFO] Preprocessed image shape:", image_array.shape)

        # Make prediction
        predictions = model.predict(image_array)
        print("[INFO] Model raw predictions:", predictions)

        predicted_index = np.argmax(predictions)
        predicted_label = class_labels[predicted_index]

        print("[INFO] Predicted label:", predicted_label)

        # Match prediction with known disease info
        disease = next((d for d in disease_info if d["name"].lower() == predicted_label.lower()), None)

        if disease:
            return jsonify({
                "disease_name": disease["name"],
                "disease_description": disease["description"],
                "disease_treatment": disease["treatment"]
            })
        else:
            return jsonify({
                "disease_name": predicted_label,
                "disease_description": "No description available for this condition.",
                "disease_treatment": "Consult a dermatologist for further guidance."
            })

    except Exception as e:
        import traceback
        traceback.print_exc()  # Print full traceback to console
        return jsonify({"error": "There was an error during prediction. Please try again."}), 500


# Reintroducing the /predict-disease route
@app.route("/predict-disease", methods=["POST"])
def predict_disease():
    data = request.get_json()
    symptoms = data.get('symptoms', [])

    # Convert list to lowercase strings
    symptom_input = ', '.join(symptoms).lower()

    # Match rule-based disease
    predicted_disease = symptom_disease_mapping.get(symptom_input)

    if not predicted_disease:
        return jsonify({"error": "Symptoms not recognized. Please consult a doctor."}), 400

    disease = next((d for d in disease_info if d["name"] == predicted_disease), None)

    if not disease:
        return jsonify({"error": "No matching disease found for predicted class."}), 400

    return jsonify({
        "disease_name": disease["name"],
        "disease_description": disease["description"],
        "disease_treatment": disease["treatment"]
    })

if __name__ == "__main__":
    app.run(debug=True)
