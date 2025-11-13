import sys
import json
import numpy as np
import tensorflow as tf

# Load the trained model
model = tf.keras.models.load_model(r"D:\Project\Diabetes Preditor\src\model.h5")

def evaluate(input_data):
    input_array = np.array([input_data])  # Convert to NumPy array
    prediction = model.predict(input_array)
    return prediction[0][0]  # Return the first output value

if __name__ == "__main__":
    input_json = json.loads(sys.argv[1])  # Get input from Node.js
    result = evaluate(input_json)
    print(result)  # Send output to Node.js
