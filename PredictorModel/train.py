from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
from preprocess import preprocess
import pickle



X_train, y_train, X_test, y_test, scaler = preprocess()

#  Define the model
model = Sequential([
    Dense(16, activation="relu", input_shape=(X_train.shape[1],)),
    Dense(8, activation="relu"),
    Dense(1, activation="sigmoid")  # Sigmoid for binary classification
])

# Compile the model
model.compile(optimizer="adam",
              loss="binary_crossentropy",
              metrics=["accuracy"])

# Print model summary
model.summary()

# Train the model only once
history = model.fit(X_train, y_train, epochs=50, batch_size=16, validation_data=(X_test, y_test))

# Save the trained model
model.save("./model/diabetes_model.h5")  # Saves the entire model

# Save the scaler object
with open("scaler.pkl", "wb") as f:
    pickle.dump(scaler, f)

print("Model and scaler saved successfully!")

