# scam_detector.py

# Import libraries
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

# Load dataset
df = pd.read_csv('Dataset - Scam and non scam cases.csv')

# Clean data
df = df[df['Summary'].notnull()]  # Keep rows with Summary
df['Amount Lost'] = pd.to_numeric(df['Amount Lost'].astype(str).str.replace(r'[^\d]', '', regex=True), errors='coerce').fillna(0)

# Encode categorical columns
le_scam_type = LabelEncoder()
le_state = LabelEncoder()

df['Scam Type'] = df['Scam Type'].fillna('Unknown')
df['State'] = df['State'].fillna('Unknown')

df['Scam Type Encoded'] = le_scam_type.fit_transform(df['Scam Type'])
df['State Encoded'] = le_state.fit_transform(df['State'])

# Target column
y = df['Scam_NonScam']

# Features
X_combined = df[['Summary', 'Amount Lost', 'Scam Type Encoded', 'State Encoded']]

# TF-IDF Vectorizer for Summary
tfidf_vectorizer = TfidfVectorizer(stop_words='english', max_features=500)

# Column Transformer
preprocessor = ColumnTransformer([
    ('tfidf', tfidf_vectorizer, 'Summary'),
    ('amount', StandardScaler(), ['Amount Lost']),
    ('scam_type', 'passthrough', ['Scam Type Encoded']),
    ('state', 'passthrough', ['State Encoded'])
])

# Pipeline
pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('classifier', LogisticRegression(max_iter=1000, class_weight='balanced'))
])

# Split data
X_train, X_test, y_train, y_test = train_test_split(X_combined, y, test_size=0.2, random_state=42)

# Train model
pipeline.fit(X_train, y_train)

# Evaluate model
y_pred = pipeline.predict(X_test)

print("Accuracy:", accuracy_score(y_test, y_pred))
print("\nClassification Report:\n", classification_report(y_test, y_pred))
print("\nConfusion Matrix:\n", confusion_matrix(y_test, y_pred))

# Prediction function
def predict_is_scam(summary_text, amount_lost=0, scam_type='Unknown', state='Unknown'):
    # Encode Scam Type
    if scam_type in le_scam_type.classes_:
        scam_type_encoded = le_scam_type.transform([scam_type])[0]
    else:
        scam_type_encoded = 0  # fallback to Unknown

    # Encode State
    if state in le_state.classes_:
        state_encoded = le_state.transform([state])[0]
    else:
        state_encoded = 0  # fallback to Unknown

    # Prepare input dataframe
    input_df = pd.DataFrame({
        'Summary': [summary_text],
        'Amount Lost': [amount_lost],
        'Scam Type Encoded': [scam_type_encoded],
        'State Encoded': [state_encoded]
    })

    # Perform prediction
    prediction = pipeline.predict(input_df)[0]
    proba = pipeline.predict_proba(input_df)[0][1]  # probability of being Scam

    return prediction, proba

# Example usage
if __name__ == "__main__":
    summary_example = "The victim was contacted by a fake investment company offering high returns."
    prediction, confidence = predict_is_scam(summary_example, amount_lost=20000, scam_type='Investment Scam', state='Selangor')

    print("\nExample Prediction:")
    print(f"Summary: {summary_example}")
    print(f"Prediction: {'Scam' if prediction == 1 else 'Non-Scam'}")
    print(f"Confidence: {confidence * 100:.2f}%")

    # Save the model and encoders after training and testing
    joblib.dump(pipeline, 'scam_model.pkl')
    joblib.dump(le_scam_type, 'le_scam_type.pkl')
    joblib.dump(le_state, 'le_state.pkl')

