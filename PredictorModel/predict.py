import numpy as np
import pickle
import tensorflow as tf
from tensorflow import keras

# Load the trained model
loaded_model = keras.models.load_model("./model/diabetes_model.h5")

# Load the scaler
with open("scaler.pkl", "rb") as f:
    scaler = pickle.load(f)

def get_user_input():
    print("\nEnter your medical details:")
    pregnancies = float(input("Pregnancies: "))
    glucose = float(input("Glucose Level: "))
    blood_pressure = float(input("Blood Pressure: "))
    skin_thickness = float(input("Skin Thickness: "))
    insulin = float(input("Insulin Level: "))
    bmi = float(input("BMI: "))
    dpf = float(input("Diabetes Pedigree Function: "))
    age = float(input("Age: "))

    # Convert input into a NumPy array and normalize
    user_data = np.array([[pregnancies, glucose, blood_pressure, skin_thickness,
                           insulin, bmi, dpf, age]])
    user_data = scaler.transform(user_data)  # Normalize using the loaded scaler

    return user_data

# Get user input
user_data = get_user_input()

# Predict
prediction = loaded_model.predict(user_data)

# Show result
result = "Positive" if prediction[0][0] > 0.5 else "Negative"
print(f"\nDiabetes Prediction: {result}")
