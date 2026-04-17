import axios from "axios";

const FLASK_BACKEND_URL = "http://localhost:5000";

const api = axios.create({
  baseURL: FLASK_BACKEND_URL,
});

// -----------------------------
// Speech Emotion API
// -----------------------------
export const analyzeSpeech = async (audioFile) => {
  const formData = new FormData();

  // Flask expects "audio_file"
  formData.append("audio_file", audioFile);

  const response = await axios.post(
    `${FLASK_BACKEND_URL}/speech`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// -----------------------------
// Text Emotion API
// -----------------------------
export const analyzeText = async (textInput) => {
  const response = await api.post("/text", {
    text_input: textInput,
  });

  return response.data;
};

export default api;