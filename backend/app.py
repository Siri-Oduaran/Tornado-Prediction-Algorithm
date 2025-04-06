from flask import Flask, request, jsonify
import tensorflow as tf
from tensorflow.keras.models import load_model
import numpy as np
from PIL import Image
import io

app = Flask(__name__)
model = load_model('model/tornado_model.h5')

def preprocess_image(image):
    image = image.resize((224, 224))
    image = np.array(image)
    image = np.expand_dims(image, axis=0)
    return image

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400
    
    file = request.files['image']
    image = Image.open(io.BytesIO(file.read()))
    processed_image = preprocess_image(image)

    prediction = model.predict(processed_image)
    probability = prediction[0][0] * 100
    signatures = ["Hook Echo", "Rotation"]  # Example signatures

    return jsonify({
        'probability': probability,
        'signatures': signatures
    })

if __name__ == '__main__':
    app.run(debug=True)
