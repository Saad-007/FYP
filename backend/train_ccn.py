import numpy as np
import tensorflow as tf
from sklearn.model_selection import train_test_split

print("⏳ Loading dataset...")
X = np.load('X_training_data_FYP.npy')
Y = np.load('Y_training_labels_FYP.npy')

print("⚙️ Processing images...")
X = X.reshape(-1, 28, 28, 1).astype('float32')
X = X / 255.0  

X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=0.2, random_state=42)

print("🧠 Building Custom CNN Architecture...")
model = tf.keras.Sequential([
    tf.keras.layers.Input(shape=(28, 28, 1)), # 👈 Warning fix kar di
    tf.keras.layers.Conv2D(32, (3,3), activation='relu'),
    tf.keras.layers.MaxPooling2D(2, 2),
    tf.keras.layers.Conv2D(64, (3,3), activation='relu'),
    tf.keras.layers.MaxPooling2D(2, 2),
    tf.keras.layers.Flatten(),
    tf.keras.layers.Dense(128, activation='relu'),
    tf.keras.layers.Dropout(0.5), 
    tf.keras.layers.Dense(len(np.unique(Y)), activation='softmax')
])

model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

print("🚀 Training started (This will take ~2 minutes)...")
model.fit(X_train, Y_train, epochs=10, validation_data=(X_test, Y_test), batch_size=64)

print("💾 Exporting model to Standard TensorFlow format...")
# Keras 3 ka naya aur safe tareeqa model save karne ka
model.export('my_saved_model')

print("🎉 MUBARAK HO! Model 'my_saved_model' folder mein save ho gaya hai!")
print("Ab terminal mein tfjs_converter wali command chalayen!")