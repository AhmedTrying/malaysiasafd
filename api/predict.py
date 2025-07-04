import json
import joblib
import os
import pandas as pd

def handler(request):
    try:
        if request.method != "POST":
            return {
                "statusCode": 405,
                "body": json.dumps({"error": "Method not allowed"}),
                "headers": {"Content-Type": "application/json"}
            }

        body = request.json()
        summary = body.get("summary", "")
        amount_lost = float(body.get("amountLost", 0))
        scam_type = body.get("scamType", "Unknown")
        state = body.get("state", "Unknown")

        # Load model and encoders
        model_path = os.path.join(os.path.dirname(__file__), 'models')
        pipeline = joblib.load(os.path.join(model_path, 'scam_model.pkl'))
        le_scam_type = joblib.load(os.path.join(model_path, 'le_scam_type.pkl'))
        le_state = joblib.load(os.path.join(model_path, 'le_state.pkl'))

        # Encode categorical variables
        if scam_type in le_scam_type.classes_:
            scam_type_encoded = le_scam_type.transform([scam_type])[0]
        else:
            scam_type_encoded = 0  # fallback to first class

        if state in le_state.classes_:
            state_encoded = le_state.transform([state])[0]
        else:
            state_encoded = 0  # fallback to first class

        # Prepare input dataframe
        input_df = pd.DataFrame({
            'Summary': [summary],
            'Amount Lost': [amount_lost],
            'Scam Type Encoded': [scam_type_encoded],
            'State Encoded': [state_encoded]
        })

        # Make prediction
        prediction = pipeline.predict(input_df)[0]
        probability = pipeline.predict_proba(input_df)[0]
        confidence = probability[1] if prediction == 1 else probability[0]

        result = {
            'prediction': 'Scam' if prediction == 1 else 'Non-Scam',
            'confidence': float(confidence),
            'risk_level': 'High' if confidence > 0.8 else 'Medium' if confidence > 0.6 else 'Low'
        }

        return {
            "statusCode": 200,
            "body": json.dumps(result),
            "headers": {"Content-Type": "application/json"}
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)}),
            "headers": {"Content-Type": "application/json"}
        } 