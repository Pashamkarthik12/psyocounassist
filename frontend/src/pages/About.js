import React from 'react';
import Navigation from '../components/Navigation';
import { Brain, Sparkles, Shield, Zap, Users, Target } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-green-50 to-emerald-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-br from-teal-100 to-green-100 p-6 rounded-full">
                <Brain className="w-16 h-16 text-teal-600" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-gray-800 mb-4">About PsyCounAssist</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Full-Cycle AI-Powered Psychological Counseling Assistant
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Purpose</h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              PsyCounAssist is an innovative AI-powered platform designed to provide accessible, 
              comprehensive emotional analysis and psychological support. Our system leverages 
              cutting-edge artificial intelligence to analyze emotions from both speech and text, 
              offering professional-grade insights and recommendations.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              We aim to bridge the gap between technology and mental wellness, making psychological 
              counseling assistance available to everyone who needs it. Our platform serves as a 
              supplementary tool for mental health awareness and emotional understanding.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Technologies Used</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-teal-100 p-2 rounded-lg mt-1">
                    <Zap className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">Machine Learning Models</h3>
                    <p className="text-gray-600 text-sm">
                      Advanced neural networks trained on emotional speech patterns and text sentiment analysis
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 p-2 rounded-lg mt-1">
                    <Sparkles className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">Natural Language Processing</h3>
                    <p className="text-gray-600 text-sm">
                      State-of-the-art NLP algorithms for understanding emotional context in text
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg mt-1">
                    <Brain className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">AI-Powered Recommendations</h3>
                    <p className="text-gray-600 text-sm">
                      Large Language Models providing personalized psychological insights and guidance
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-purple-100 p-2 rounded-lg mt-1">
                    <Shield className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">Flask Backend</h3>
                    <p className="text-gray-600 text-sm">
                      Robust Python Flask framework handling all emotion analysis processing
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-pink-100 p-2 rounded-lg mt-1">
                    <Users className="w-5 h-5 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">React Frontend</h3>
                    <p className="text-gray-600 text-sm">
                      Modern, responsive user interface built with React and Tailwind CSS
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-orange-100 p-2 rounded-lg mt-1">
                    <Target className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">Audio Processing</h3>
                    <p className="text-gray-600 text-sm">
                      Advanced speech analysis algorithms for emotion detection from voice recordings
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Key Features</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-6 border border-teal-200">
                <h3 className="font-bold text-teal-800 text-lg mb-2">Speech Emotion Analysis</h3>
                <p className="text-gray-700 text-sm">
                  Upload audio files (.wav format) and receive detailed emotional analysis with confidence scores, 
                  AI-generated recommendations, and comprehensive psychological reports.
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                <h3 className="font-bold text-green-800 text-lg mb-2">Text Emotion Recognition</h3>
                <p className="text-gray-700 text-sm">
                  Input any text and discover the underlying emotional tone. Get detailed sentiment analysis, 
                  professional recommendations, and downloadable psychological documentation.
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                <h3 className="font-bold text-blue-800 text-lg mb-2">Comprehensive Reports</h3>
                <p className="text-gray-700 text-sm">
                  Every analysis generates a detailed PDF report containing emotion detection results, 
                  confidence metrics, AI recommendations, and professional psychological documentation.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                <h3 className="font-bold text-purple-800 text-lg mb-2">User Dashboard</h3>
                <p className="text-gray-700 text-sm">
                  Track your analysis history with comprehensive statistics including total analyses performed, 
                  emotion distribution patterns, and generated reports count.
                </p>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-6 border border-pink-200">
                <h3 className="font-bold text-pink-800 text-lg mb-2">AI-Powered Insights</h3>
                <p className="text-gray-700 text-sm">
                  Leverage advanced AI technology to receive personalized recommendations and professional 
                  psychological guidance based on detected emotions.
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
                <h3 className="font-bold text-orange-800 text-lg mb-2">Professional Interface</h3>
                <p className="text-gray-700 text-sm">
                  Clean, modern, and responsive design optimized for mental wellness applications. 
                  Suitable for demonstrations, research, and educational purposes.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-teal-500 to-green-500 rounded-2xl shadow-xl p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">PSYCOUNASSIST</h2>
            <p className="text-teal-50 text-lg mb-6">
              PsyCounAssist represents the culmination of research in artificial intelligence, 
              machine learning, and mental health technology. This system demonstrates the practical 
              application of AI in psychological counseling and emotional wellness support.
            </p>
            <div className="flex justify-center space-x-4">
              <a
                href="/home"
                className="bg-white text-teal-600 px-8 py-3 rounded-lg font-semibold hover:bg-teal-50 transition shadow-lg"
              >
                Get Started
              </a>
              <a
                href="/dashboard"
                className="bg-teal-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-800 transition border-2 border-white"
              >
                View Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
