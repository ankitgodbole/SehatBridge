from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin  # Import both CORS and cross_origin
import numpy as np
from PIL import Image
import io
import tensorflow as tf
from keras.models import load_model

app = Flask(__name__)
CORS(app)  # Enable CORS for the whole app

# Load your trained Keras model
model = load_model("model/skindisease.h5")  # updated filename here

# Skin disease information (same as the frontend)
disease_info = [
    {
        "name": "Acne",
        "description": "Acne is a common skin condition that causes pimples, blackheads, and cysts.",
        "treatment": "Topical treatments like benzoyl peroxide, salicylic acid, and oral medications can help manage acne."
    },
    {
        "name": "Psoriasis",
        "description": "Psoriasis is a chronic autoimmune condition that causes rapid skin cell turnover, leading to scaly patches.",
        "treatment": "Topical treatments like corticosteroids, phototherapy, and systemic medications like methotrexate can be prescribed."
    },
    {
        "name": "Eczema",
        "description": "Eczema is a condition that makes the skin red, inflamed, and itchy.",
        "treatment": "Moisturizing ointments, corticosteroid creams, and antihistamines may be recommended to reduce symptoms."
    },
    {
        "name": "Melanoma",
        "description": "Melanoma is a type of skin cancer that develops from pigment-producing cells called melanocytes.",
        "treatment": "Surgical removal of the tumor, followed by immunotherapy or targeted therapy, is common treatment."
    },
    {
        "name": "Rosacea",
        "description": "Rosacea is a skin condition that causes redness and visible blood vessels on the face.",
        "treatment": "Topical treatments such as metronidazole and oral antibiotics like doxycycline can help manage symptoms."
    }
]

@app.route("/predict-skin", methods=["POST"])
@cross_origin()  # Allow cross-origin requests for this route
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

        # Fetch disease information based on the predicted class
        disease = disease_info[predicted_class]

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
