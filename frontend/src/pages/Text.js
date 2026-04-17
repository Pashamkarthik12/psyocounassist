import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import { FileText, Send, Download, Loader, AlertCircle } from 'lucide-react';
import { analyzeText } from '../services/api';

const Text = () => {
  const [textInput, setTextInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!textInput.trim()) {
      setError('Please enter some text to analyze');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await analyzeText(textInput);
      setResult(data);
      
      // Save to localStorage for dashboard
      const analyses = JSON.parse(localStorage.getItem('textAnalyses') || '[]');
      analyses.push({
        type: 'text',
        emotion: data.emotion,
        confidence: data.confidence,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('textAnalyses', JSON.stringify(analyses));
    } catch (err) {
      console.error('Error analyzing text:', err);
      setError('Failed to analyze text. Please ensure the Flask backend is running at http://localhost:5000');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (result && result.pdf_file) {
      const link = document.createElement('a');
      link.href = `http://localhost:5000${result.pdf_file}`;
      link.download = 'text_emotion_report.pdf';
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-green-50 to-emerald-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-green-100 to-green-200 p-4 rounded-full">
                <FileText className="w-10 h-10 text-green-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Text Emotion Recognition</h1>
            <p className="text-gray-600">Enter text to analyze its emotional tone and sentiment</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Enter Your Text
                </label>
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="w-full h-48 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition resize-none"
                  placeholder="Type or paste the text you want to analyze for emotional content..."
                  data-testid="text-input-area"
                />
                <p className="text-sm text-gray-500 mt-2">
                  {textInput.length} characters
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start" data-testid="text-error-message">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2 mt-0.5" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !textInput.trim()}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                data-testid="text-submit-btn"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing Text...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Predict Emotion
                  </>
                )}
              </button>
            </form>
          </div>

          {result && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Analysis Results</h2>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6">
                  <p className="text-sm text-gray-600 mb-2">Input Text</p>
                  <p className="text-gray-800" data-testid="text-input-display">{result.user_text}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                    <p className="text-sm text-gray-600 mb-2">Detected Emotion</p>
                    <p className="text-3xl font-bold text-green-700" data-testid="text-emotion-result">
                      {result.emotion}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6">
                    <p className="text-sm text-gray-600 mb-2">Confidence Score</p>
                    <p className="text-3xl font-bold text-emerald-700" data-testid="text-confidence-result">
                      {result.confidence.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">AI Recommendations</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6" data-testid="text-recommendations">
                  <p className="text-gray-700 whitespace-pre-wrap">{result.llm_output}</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Detailed Psychological Documentation</h3>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6" data-testid="text-documentation">
                  <p className="text-gray-700 whitespace-pre-wrap">{result.report_text}</p>
                </div>

                {result.pdf_file && (
                  <button
                    onClick={handleDownload}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center"
                    data-testid="text-download-btn"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download Full Report (PDF)
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Text;
