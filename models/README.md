# Models Directory

This directory should contain your trained ML model files:

- `scam_model.pkl` - The trained scikit-learn pipeline
- `le_scam_type.pkl` - Label encoder for scam types
- `le_state.pkl` - Label encoder for Malaysian states

## Setup Instructions

1. Train your model using the provided `scam_detector.py` script
2. Copy the generated `.pkl` files to this directory
3. Ensure the Python environment has the required dependencies installed

## Dependencies

Make sure you have the following Python packages installed:
- scikit-learn
- pandas
- joblib
- numpy
