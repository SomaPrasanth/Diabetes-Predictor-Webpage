import tensorflowjs as tfjs
import tensorflow as tf

# Load the trained model
model = tf.keras.models.load_model(".model/diabetes_model.h5")

# Convert and save as TensorFlow.js format
tfjs.converters.save_keras_model(model, "model_json/")
