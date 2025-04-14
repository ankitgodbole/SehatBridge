from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import numpy as np
from PIL import Image
import tensorflow as tf

app = Flask(__name__)

# Enable CORS globally for all routes
CORS(app)  # Allow cross-origin requests globally

# Load the trained model (make sure to specify the correct path to your model file)
model = tf.keras.models.load_model('model/skindisease.h5')

# Disease information - update this list with the actual diseases and their descriptions/treatment
disease_info = [
    {"name": "Acne", "description": "Acne is a skin condition that occurs when hair follicles are clogged with oil and dead skin cells.", "treatment": "Over-the-counter creams, prescription medications, and lifestyle changes."},
    {"name": "Psoriasis", "description": "Psoriasis is an autoimmune disease that causes skin cells to multiply too quickly, resulting in thick, scaly patches.", "treatment": "Topical treatments, phototherapy, and systemic medications."},
    {"name": "Eczema", "description": "Eczema is a condition that makes the skin red, inflamed, and itchy, often due to an allergic reaction.", "treatment": "Moisturizers, corticosteroids, and antihistamines."},
    {"name": "Melanoma", "description": "Melanoma is a type of skin cancer that develops from pigment-producing cells.", "treatment": "Surgical removal, immunotherapy, chemotherapy, and targeted therapies."},
    {"name": "Rosacea", "description": "Rosacea is a chronic condition that causes redness and visible blood vessels on the face.", "treatment": "Topical medications, oral antibiotics, and laser therapy."}
]

@app.route("/predict-skin", methods=["POST"])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    try:
        # Open the image, resize to 64x64, normalize, and prepare it for prediction
        image = Image.open(file).convert('RGB')
        image = image.resize((64, 64))  # Resize to match model input
        image_array = np.array(image) / 255.0  # Normalize
        processed = np.expand_dims(image_array, axis=0)  # Add batch dimension

        # Predict using the model
        prediction = model.predict(processed)
        predicted_class = int(np.argmax(prediction[0]))  # Get the index of the highest probability

        # Debugging log to see the model's output
        print(f"Model Prediction Output: {prediction[0]}")
        print(f"Predicted Class Index: {predicted_class}")

        # Map the predicted class to the disease name (ensure your model classes are mapped here)
        class_names = ["Acne", "Psoriasis", "Eczema", "Melanoma", "Rosacea"]  # Update this list based on your model's output
        predicted_class_name = class_names[predicted_class]  # Get the name of the predicted class

        # Find the corresponding disease info
        disease = next((d for d in disease_info if d["name"] == predicted_class_name), None)

        if not disease:
            return jsonify({"error": "No matching disease found for predicted class."}), 400

        # Return the prediction details
        return jsonify({
            "prediction": prediction[0].tolist(),  # Return the full prediction array
            "predicted_class": predicted_class,  # Return the predicted class (index)
            "disease_name": disease["name"],  # Include the disease name
            "disease_description": disease["description"],  # Include description
            "disease_treatment": disease["treatment"]  # Include treatment information
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
