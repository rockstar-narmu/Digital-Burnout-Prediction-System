from flask import Flask, request, jsonify
import joblib
import pandas as pd

app = Flask(__name__)

# Load trained model
model = joblib.load("burnout_model.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    # Convert to dataframe
    df = pd.DataFrame([data])

    prediction = model.predict(df)[0]

    # Map numeric to label
    label_map = {
        0: "low",
        1: "medium",
        2: "high"
    }

    return jsonify({
        "burnoutLevel": label_map[int(prediction)]
    })

if __name__ == "__main__":
    app.run(port=8000)
