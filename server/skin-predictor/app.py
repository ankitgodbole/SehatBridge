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
    # Skin diseases
    {
        "name": "Acne",
        "description": "Acne is a skin condition that occurs when hair follicles are clogged with oil and dead skin cells.",
        "treatment": "Over-the-counter creams, prescription medications, and lifestyle changes."
    },
    {
        "name": "Psoriasis",
        "description": "Psoriasis is an autoimmune disease that causes skin cells to multiply too quickly, resulting in thick, scaly patches.",
        "treatment": "Topical treatments, phototherapy, and systemic medications."
    },
    {
        "name": "Eczema",
        "description": "Eczema causes the skin to become red, inflamed, and itchy, often due to an allergic reaction.",
        "treatment": "Moisturizers, corticosteroids, and antihistamines."
    },
    {
        "name": "Melanoma",
        "description": "Melanoma is a serious form of skin cancer that develops from pigment-producing cells.",
        "treatment": "Surgical removal, immunotherapy, chemotherapy, and targeted therapies."
    },
    {
        "name": "Rosacea",
        "description": "Rosacea is a chronic condition that causes facial redness and visible blood vessels.",
        "treatment": "Topical medications, oral antibiotics, and laser therapy."
    },
    {
        "name": "Dermatitis",
        "description": "Dermatitis refers to inflammation of the skin causing redness, swelling, and itching.",
        "treatment": "Avoiding triggers, using anti-inflammatory creams, and moisturizing regularly."
    },
    {
        "name": "Vitiligo",
        "description": "Vitiligo is a skin condition that causes loss of pigment, resulting in white patches.",
        "treatment": "Topical corticosteroids, light therapy, and skin grafting in some cases."
    },
    {
        "name": "Hives",
        "description": "Hives are red, itchy welts triggered by allergic reactions or other stimuli.",
        "treatment": "Antihistamines, avoiding allergens, and corticosteroids for severe cases."
    },

    # General diseases
    {
        "name": "Common Cold",
        "description": "A viral infection affecting the upper respiratory tract, causing sneezing, congestion, and a sore throat.",
        "treatment": "Rest, hydration, decongestants, and over-the-counter medications."
    },
    {
        "name": "Flu",
        "description": "Influenza is a contagious respiratory illness caused by influenza viruses.",
        "treatment": "Antiviral drugs, rest, and hydration."
    },
    {
        "name": "Tonsillitis",
        "description": "Tonsillitis is inflammation of the tonsils caused by viruses or bacteria.",
        "treatment": "Antibiotics (if bacterial), rest, pain relievers, and warm fluids."
    },
    {
        "name": "Allergic Rhinitis",
        "description": "An allergic reaction causing sneezing, runny nose, and watery eyes.",
        "treatment": "Antihistamines, nasal sprays, and avoiding allergens."
    },
    {
        "name": "Dengue",
        "description": "A mosquito-borne viral disease causing high fever, rash, and muscle pain.",
        "treatment": "Fluids, rest, and pain relievers (avoid NSAIDs)."
    },
    {
        "name": "Anemia",
        "description": "A condition in which there is a deficiency of red cells or hemoglobin in the blood.",
        "treatment": "Iron supplements, dietary changes, and treating underlying causes."
    },
    {
        "name": "Food Poisoning",
        "description": "Illness caused by consuming contaminated food or water.",
        "treatment": "Hydration, rest, and in some cases antibiotics or antidiarrheals."
    },
    {
        "name": "Gastroenteritis",
        "description": "Inflammation of the stomach and intestines, typically caused by a viral or bacterial infection.",
        "treatment": "Fluids, rest, and a bland diet."
    },
    {
        "name": "Cholera",
        "description": "A bacterial disease causing severe diarrhea and dehydration, usually spread through water.",
        "treatment": "Oral rehydration salts (ORS), antibiotics, and IV fluids."
    },
    {
        "name": "Migraine",
        "description": "A neurological condition characterized by intense headaches often accompanied by nausea or sensitivity to light.",
        "treatment": "Pain relievers, triptans, rest, and avoiding triggers."
    },
    {
        "name": "Malaria",
        "description": "A life-threatening disease transmitted by mosquitoes infected with Plasmodium parasites.",
        "treatment": "Antimalarial medications and hospitalization in severe cases."
    },
    {
        "name": "Asthma",
        "description": "A chronic condition that affects the airways, causing difficulty in breathing.",
        "treatment": "Inhalers, bronchodilators, and avoiding triggers."
    },
    {
        "name": "Pneumonia",
        "description": "An infection that inflames air sacs in one or both lungs, which may fill with fluid.",
        "treatment": "Antibiotics, cough medicine, and hospitalization if severe."
    },
    {
        "name": "Chikungunya",
        "description": "A viral disease transmitted by mosquitoes causing fever and joint pain.",
        "treatment": "Rest, hydration, and pain relievers."
    }
]


symptom_disease_mapping = {
    # Skin-related
    "redness": "Rosacea",
    "scaly patches": "Psoriasis",
    "itching": "Eczema",
    "cystic acne": "Acne",
    "pigmented moles": "Melanoma",
    "inflammation": "Dermatitis",
    "white patches": "Vitiligo",
    "welts": "Hives",
    "flaky skin": "Psoriasis",
    "dry skin": "Eczema",
    "facial flushing": "Rosacea",
    "blistering": "Dermatitis",
    "skin peeling": "Eczema",
    "sudden red bumps": "Hives",

    # General medical symptoms
    "fever": "Common Cold",
    "cough": "Flu",
    "sore throat": "Tonsillitis",
    "runny nose": "Allergic Rhinitis",
    "body ache": "Dengue",
    "fatigue": "Anemia",
    "nausea": "Food Poisoning",
    "vomiting": "Gastroenteritis",
    "diarrhea": "Cholera",
    "headache": "Migraine",
    "chills": "Malaria",
    "breathlessness": "Asthma",
    "chest pain": "Pneumonia",
    "joint pain": "Chikungunya"
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
