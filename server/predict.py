import sys
import json
import joblib
import pandas as pd
import warnings
from sklearn.feature_extraction.text import CountVectorizer, TfidfTransformer

warnings.filterwarnings("ignore")

# Load the model
knn = joblib.load('./model/knn.pkl')

# Load vocabulary
df = pd.read_csv('./Medical_dataset/tfidfsymptoms.csv')
vocab = list(df.columns)[:132]  # ❗ Adjust to expected size, make sure it matches the training size

# Create vectorizer (use the same vocabulary as the one used during training)
count_vect = CountVectorizer(vocabulary=vocab)
tfidf_transformer = TfidfTransformer()

# Fit the tfidf_transformer once, not every time you make a prediction
tfidf_transformer.fit(count_vect.transform(['']))  # Fit with an empty input

# Preprocess
def preprocess_symptoms(symptoms):
    return [sym.strip().lower().replace('_', ' ') for sym in symptoms]

# Predict
def predict_disease(symptom_input):
    symptoms = preprocess_symptoms(symptom_input.split(','))
    input_text = ' '.join(symptoms)

    # Transform the input text using the count vectorizer
    count_matrix = count_vect.transform([input_text])
    
    # Use transform, not fit_transform
    X = tfidf_transformer.transform(count_matrix)

    # Check if feature size matches the model's expected input
    if X.shape[1] != knn.n_features_in_:
        return {"error": f"Feature size mismatch. X has {X.shape[1]} features, expected {knn.n_features_in_}."}

    prediction = knn.predict(X)
    disease = prediction[0]

    return {
        "disease": disease,
        "description": f"{disease} is a predicted condition based on your symptoms.",
        "precautions": ["Drink fluids", "Rest", "Consult a physician"]
    }

# Entry point
if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No symptoms provided"}))
        sys.exit(1)

    try:
        symptom_input = sys.argv[1]
        result = predict_disease(symptom_input)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
