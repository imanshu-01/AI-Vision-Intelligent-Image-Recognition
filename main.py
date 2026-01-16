from flask import Flask, request, jsonify, send_from_directory
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import os
from PIL import Image

# ------------------ Setup ------------------
app = Flask(__name__, static_folder='static', template_folder='templates')
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# ------------------ CIFAR-10 Classes ------------------
CIFAR10_CLASSES = [
    {"name": "Airplane", "emoji": "✈️", "description": "Flying vehicle", "color": "#f97316"},
    {"name": "Automobile", "emoji": "🚗", "description": "Car", "color": "#10b981"},
    {"name": "Bird", "emoji": "🐦", "description": "Bird", "color": "#8b5cf6"},
    {"name": "Cat", "emoji": "🐱", "description": "Cat", "color": "#ec4899"},
    {"name": "Deer", "emoji": "🦌", "description": "Deer", "color": "#facc15"},
    {"name": "Dog", "emoji": "🐶", "description": "Dog", "color": "#3b82f6"},
    {"name": "Frog", "emoji": "🐸", "description": "Frog", "color": "#22c55e"},
    {"name": "Horse", "emoji": "🐴", "description": "Horse", "color": "#f43f5e"},
    {"name": "Ship", "emoji": "🚢", "description": "Ship", "color": "#0ea5e9"},
    {"name": "Truck", "emoji": "🚚", "description": "Truck", "color": "#14b8a6"}
]

# ------------------ Load Model ------------------
MODEL_PATH = "cifar10_model.h5"
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model not found at {MODEL_PATH}, please train first.")

model = load_model(MODEL_PATH)
print("✅ CIFAR-10 model loaded successfully.")

# ------------------ Routes ------------------
@app.route("/")
def index():
    return send_from_directory('templates', 'index.html')

@app.route("/api/model-info")
def model_info():
    return jsonify({
        "success": True,
        "model_loaded": True,
        "classes": {c["name"]: c for c in CIFAR10_CLASSES},
        "status": "Flask + CIFAR10 Model Running ✅",
        "routes": ["/api/upload", "/api/model-info", "/api/test-prediction"]
    })

@app.route("/api/upload", methods=["POST"])
def upload():
    if "file" not in request.files:
        return jsonify({"success": False, "error": "No file uploaded"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"success": False, "error": "Empty filename"}), 400

    # Save file temporarily
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(file_path)

    # ------------------ Preprocess ------------------
    img = Image.open(file_path).convert("RGB")
    img = img.resize((96, 96))  # Resize for MobileNetV2
    img_array = np.array(img).astype("float32") / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    # ------------------ Predict ------------------
    preds = model.predict(img_array)[0]  # 10 class probabilities
    top_indices = preds.argsort()[::-1][:5]  # Top 5
    top_predictions = []

    for idx in top_indices:
        cls = CIFAR10_CLASSES[idx]
        top_predictions.append({
            "class": cls["name"],
            "emoji": cls["emoji"],
            "confidence": float(round(preds[idx]*100, 2)),
            "color": cls["color"],
            "description": cls["description"]
        })

    all_probabilities = [
        {"class": CIFAR10_CLASSES[i]["name"],
         "probability": float(round(preds[i]*100, 2)),
         "color": CIFAR10_CLASSES[i]["color"]}
        for i in range(len(CIFAR10_CLASSES))
    ]

    return jsonify({
        "success": True,
        "top_predictions": top_predictions,
        "all_probabilities": all_probabilities
    })

@app.route("/api/test-prediction")
def test_prediction():
    # Return a random prediction for testing frontend
    import random
    idx = random.randint(0, 9)
    cls = CIFAR10_CLASSES[idx]
    return jsonify({
        "success": True,
        "prediction": {
            "class": cls["name"],
            "emoji": cls["emoji"],
            "confidence": round(random.uniform(70, 100), 2)
        }
    })

# ------------------ Run ------------------
if __name__ == "__main__":
    app.run(debug=True)
