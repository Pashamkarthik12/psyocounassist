import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { Mic, FileText, Brain, Sparkles } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-green-50 to-emerald-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-teal-100 to-green-100 p-6 rounded-full">
              <Brain className="w-16 h-16 text-teal-600" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Welcome to <span className="text-teal-600">PsyCounAssist</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Full-Cycle AI-Powered Psychological Counseling Assistant
          </p>
          <p className="text-gray-500 mt-2">
            Analyze emotions through speech and text with advanced AI technology
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div
            onClick={() => navigate('/speech')}
            className="bg-white rounded-2xl shadow-xl p-8 cursor-pointer transform hover:scale-105 transition-all hover:shadow-2xl border-2 border-transparent hover:border-teal-400"
            data-testid="home-speech-card"
          >
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-br from-teal-100 to-teal-200 p-5 rounded-full">
                <Mic className="w-12 h-12 text-teal-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
              Speech Emotion Analysis
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Upload audio files and let our AI analyze the emotional content of speech patterns.
              Get detailed insights and professional recommendations.
            </p>
            <div className="flex items-center justify-center space-x-2 text-teal-600">
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold">Start Speech Analysis</span>
            </div>
          </div>

          <div
            onClick={() => navigate('/text')}
            className="bg-white rounded-2xl shadow-xl p-8 cursor-pointer transform hover:scale-105 transition-all hover:shadow-2xl border-2 border-transparent hover:border-green-400"
            data-testid="home-text-card"
          >
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-br from-green-100 to-green-200 p-5 rounded-full">
                <FileText className="w-12 h-12 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
              Text Emotion Analysis
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Input text and discover the underlying emotional tone. Receive comprehensive
              psychological documentation and guidance.
            </p>
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold">Start Text Analysis</span>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-3xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              How It Works
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <div className="bg-teal-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="font-bold text-teal-600">1</span>
                </div>
                <p className="font-medium">Upload or Input</p>
                <p className="text-xs mt-1">Share audio or text data</p>
              </div>
              <div>
                <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="font-bold text-green-600">2</span>
                </div>
                <p className="font-medium">AI Analysis</p>
                <p className="text-xs mt-1">Advanced emotion detection</p>
              </div>
              <div>
                <div className="bg-emerald-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="font-bold text-emerald-600">3</span>
                </div>
                <p className="font-medium">Get Insights</p>
                <p className="text-xs mt-1">Receive detailed reports</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
