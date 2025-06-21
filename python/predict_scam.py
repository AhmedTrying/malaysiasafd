import sys
import json
import joblib
import pandas as pd
import os

def predict_scam(summary, amount_lost, scam_type, state):
    try:
        # Load the trained model and encoders
        model_path = os.path.join(os.path.dirname(__file__), '..', 'models')
        
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
            'Amount Lost': [float(amount_lost)],
            'Scam Type Encoded': [scam_type_encoded],
            'State Encoded': [state_encoded]
        })
        
        # Make prediction
        prediction = pipeline.predict(input_df)[0]
        probability = pipeline.predict_proba(input_df)[0]
        
        # Get confidence (probability of predicted class)
        confidence = probability[1] if prediction == 1 else probability[0]
        
        result = {
            'prediction': 'Scam' if prediction == 1 else 'Non-Scam',
            'confidence': float(confidence),
            'risk_level': 'High' if confidence > 0.8 else 'Medium' if confidence > 0.6 else 'Low'
        }
        
        return result
        
    except Exception as e:
        return {'error': str(e)}

if __name__ == "__main__":
    if len(sys.argv) != 5:
        print(json.dumps({'error': 'Invalid arguments'}))
        sys.exit(1)
    
    summary = sys.argv[1]
    amount_lost = sys.argv[2]
    scam_type = sys.argv[3]
    state = sys.argv[4]
    
    result = predict_scam(summary, amount_lost, scam_type, state)
    print(json.dumps(result))
