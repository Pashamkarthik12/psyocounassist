import os
import numpy as np
import librosa
import pickle
import tensorflow as tf
from flask import Flask, request, jsonify
from flask_cors import CORS


# 🔥 Create app FIRST
app = Flask(__name__)
CORS(app)
os.makedirs("static/uploads", exist_ok=True)
UPLOAD_FOLDER = "static/uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


import os
from google import genai

# Read API key from environment variable
GEMINI_API_KEY = os.getenv("GOOGLE_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("GOOGLE_API_KEY environment variable not set!")

client = genai.Client(api_key=GEMINI_API_KEY)




# -------------------------
# Load Emotion Model
# -------------------------

model = tf.keras.models.load_model("speech_model.keras")

mean = np.load("mean.npy")
std = np.load("std.npy")

with open("label_encoder.pkl","rb") as f:
    encoder = pickle.load(f)

# -------------------------
# Gemini LLM Functions
# -------------------------

def generate_llm_recommendations(emotion, confidence):

    prompt = f"""
    You are a supportive AI wellness assistant.

    Detected Emotion: {emotion}
    Confidence: {confidence}%

    Give ONLY 3-4 short actionable recommendations.
    Each recommendation should be 1-2 lines maximum.
    Use bullet points.
    Keep it simple and practical.
    Do NOT generate a full report.
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash-lite",
        contents=prompt
    )

    return response.text


def generate_llm_report(emotion, confidence):

    prompt = f"""
    Generate a detailed mental wellness documentation report.

    Emotion Detected: {emotion}
    Confidence Level: {confidence}%

    Structure it clearly with headings:

    1. Emotional Summary
    2. Psychological Interpretation
    3. Detailed Coping Strategies
    4. Daily Action Plan
    5. Long-Term Recommendations
    6. Encouragement Note

    Make it professional and structured like a formal report.
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash-lite",
        contents=prompt
    )

    report = response.text
    report = report.replace("**","")
    report = report.replace("---","")
    return report


# -------------------------
# PDF Generator
# -------------------------

from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch


def generate_pdf_from_llm(report_text):

    file_path = "static/emotion_report.pdf"
    doc = SimpleDocTemplate(file_path)
    elements = []
    styles = getSampleStyleSheet()

    for line in report_text.split("\n"):
        elements.append(Paragraph(line, styles["Normal"]))
        elements.append(Spacer(1, 0.2 * inch))

    doc.build(elements)

    return file_path


# -------------------------
# Feature Extraction
# -------------------------

def extract_features(audio, sr=22050, n_mels=128, max_len=130):

    mel = librosa.feature.melspectrogram(
        y=audio,
        sr=sr,
        n_mels=n_mels
    )

    log_mel = librosa.power_to_db(mel)

    if log_mel.shape[1] < max_len:

        pad = max_len - log_mel.shape[1]

        log_mel = np.pad(
            log_mel,
            ((0,0),(0,pad)),
            mode="constant"
        )

    else:
        log_mel = log_mel[:, :max_len]

    return log_mel

from collections import Counter



def predict_emotion(file):

    audio, sr = librosa.load(file, sr=22050)

    # remove silence
    audio,_ = librosa.effects.trim(audio, top_db=25)

    # normalize
    audio = librosa.util.normalize(audio)

    log_mel = extract_features(audio)

    log_mel = (log_mel - mean) / (std + 1e-6)

    log_mel = log_mel[np.newaxis, ..., np.newaxis]

    pred = model.predict(log_mel, verbose=0)

    index = np.argmax(pred)

    confidence = float(np.max(pred))

    emotion = encoder.inverse_transform([index])[0]

    return emotion, round(confidence*100,2)
# -------------------------
# Load Text Emotion Model
# -------------------------

from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

# Load saved model
text_tokenizer = AutoTokenizer.from_pretrained("text_emotion_model")
text_model = AutoModelForSequenceClassification.from_pretrained("text_emotion_model")

# Load label encoder
with open("text_label_encoder.pkl", "rb") as f:
    text_encoder = pickle.load(f)


def predict_text_emotion(text):

    inputs = text_tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=160
    )

    with torch.no_grad():
        outputs = text_model(**inputs)

    probs = torch.nn.functional.softmax(outputs.logits, dim=1)
    pred_class = torch.argmax(probs, dim=1).item()

    emotion = text_encoder.inverse_transform([pred_class])[0]
    confidence = probs[0][pred_class].item() * 100

    return emotion, round(confidence, 2)

def clean_markdown(text):
    text = text.replace("**", "")
    text = text.replace("#", "")
    text = text.replace("*", "•")
    text = text.replace("---", "")
    return text


# -------------------------
# Flask Route
# -------------------------

@app.route("/speech", methods=["POST"])
def speech_emotion():

    file = request.files.get("audio_file")

    if not file:
        return jsonify({"error": "No audio file uploaded"}), 400

    filepath = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
    file.save(filepath)

    emotion, confidence = predict_emotion(filepath)

    try:
        llm_output = clean_markdown(generate_llm_recommendations(emotion, confidence))
    except:
        llm_output = "AI recommendations temporarily unavailable."

    try:
        report_text = clean_markdown(generate_llm_report(emotion, confidence))
    except:
        report_text = "Psychological report generation temporarily unavailable."

    pdf_file = generate_pdf_from_llm(report_text)

    return jsonify({
        "emotion": emotion,
        "confidence": confidence,
        "audio_file": "/" + filepath,
        "llm_output": llm_output,
        "report_text": report_text,
        "pdf_file": "/" + pdf_file
    })

@app.route("/text", methods=["POST"])
def text_emotion():

    data = request.get_json()
    user_text = data.get("text_input")

    if not user_text:
        return jsonify({"error": "No text provided"}), 400

    emotion, confidence = predict_text_emotion(user_text)

    try:
        llm_output = clean_markdown(generate_llm_recommendations(emotion, confidence))
    except:
        llm_output = "AI recommendations temporarily unavailable."

    try:
        report_text = clean_markdown(generate_llm_report(emotion, confidence))
    except:
        report_text = "Psychological report generation temporarily unavailable."

    pdf_file = generate_pdf_from_llm(report_text)

    return jsonify({
        "user_text": user_text,
        "emotion": emotion,
        "confidence": confidence,
        "llm_output": llm_output,
        "report_text": report_text,
        "pdf_file": "/" + pdf_file
    })

if __name__ == "__main__":
    app.run(debug=True)