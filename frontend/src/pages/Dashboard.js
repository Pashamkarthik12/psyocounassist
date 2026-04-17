import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import { BarChart3, Mic, FileText, FileCheck, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    speechCount: 0,
    textCount: 0,
    totalReports: 0,
    emotionDistribution: {},
  });

  useEffect(() => {
    // Load analyses from localStorage
    const speechAnalyses = JSON.parse(localStorage.getItem('speechAnalyses') || '[]');
    const textAnalyses = JSON.parse(localStorage.getItem('textAnalyses') || '[]');
    
    const allAnalyses = [...speechAnalyses, ...textAnalyses];
    
    // Count emotion distribution
    const emotionDist = {};
    allAnalyses.forEach(analysis => {
      const emotion = analysis.emotion;
      emotionDist[emotion] = (emotionDist[emotion] || 0) + 1;
    });
    
    setStats({
      speechCount: speechAnalyses.length,
      textCount: textAnalyses.length,
      totalReports: allAnalyses.length,
      emotionDistribution: emotionDist,
    });
  }, []);

  const getEmotionColor = (emotion) => {
    const colors = {
      happy: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      sad: 'bg-blue-100 text-blue-700 border-blue-300',
      angry: 'bg-red-100 text-red-700 border-red-300',
      fear: 'bg-purple-100 text-purple-700 border-purple-300',
      neutral: 'bg-gray-100 text-gray-700 border-gray-300',
      disgust: 'bg-green-100 text-green-700 border-green-300',
      surprise: 'bg-pink-100 text-pink-700 border-pink-300',
    };
    return colors[emotion?.toLowerCase()] || 'bg-teal-100 text-teal-700 border-teal-300';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-green-50 to-emerald-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-teal-100 to-green-100 p-4 rounded-full">
                <BarChart3 className="w-10 h-10 text-teal-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">User Dashboard</h1>
            <p className="text-gray-600">Track your emotion analysis history and insights</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6" data-testid="dashboard-speech-count">
              <div className="flex items-center justify-between mb-3">
                <Mic className="w-8 h-8 text-teal-600" />
                <div className="bg-teal-100 px-3 py-1 rounded-full">
                  <p className="text-2xl font-bold text-teal-700">{stats.speechCount}</p>
                </div>
              </div>
              <p className="text-gray-600 font-medium">Speech Analyses</p>
              <p className="text-xs text-gray-500 mt-1">Total audio analyses completed</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6" data-testid="dashboard-text-count">
              <div className="flex items-center justify-between mb-3">
                <FileText className="w-8 h-8 text-green-600" />
                <div className="bg-green-100 px-3 py-1 rounded-full">
                  <p className="text-2xl font-bold text-green-700">{stats.textCount}</p>
                </div>
              </div>
              <p className="text-gray-600 font-medium">Text Analyses</p>
              <p className="text-xs text-gray-500 mt-1">Total text analyses completed</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6" data-testid="dashboard-total-reports">
              <div className="flex items-center justify-between mb-3">
                <FileCheck className="w-8 h-8 text-purple-600" />
                <div className="bg-purple-100 px-3 py-1 rounded-full">
                  <p className="text-2xl font-bold text-purple-700">{stats.totalReports}</p>
                </div>
              </div>
              <p className="text-gray-600 font-medium">Reports Generated</p>
              <p className="text-xs text-gray-500 mt-1">Total psychological reports</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6" data-testid="dashboard-emotion-types">
              <div className="flex items-center justify-between mb-3">
                <TrendingUp className="w-8 h-8 text-orange-600" />
                <div className="bg-orange-100 px-3 py-1 rounded-full">
                  <p className="text-2xl font-bold text-orange-700">
                    {Object.keys(stats.emotionDistribution).length}
                  </p>
                </div>
              </div>
              <p className="text-gray-600 font-medium">Emotion Types</p>
              <p className="text-xs text-gray-500 mt-1">Unique emotions detected</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Emotion Distribution Summary</h2>
            
            {Object.keys(stats.emotionDistribution).length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-gray-500">No analyses yet. Start by analyzing speech or text emotions!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(stats.emotionDistribution)
                  .sort(([, a], [, b]) => b - a)
                  .map(([emotion, count]) => {
                    const percentage = ((count / stats.totalReports) * 100).toFixed(1);
                    return (
                      <div key={emotion} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`px-4 py-1 rounded-full border ${getEmotionColor(emotion)}`}>
                              <span className="font-semibold capitalize">{emotion}</span>
                            </div>
                            <span className="text-gray-600 text-sm">{count} occurrence{count !== 1 ? 's' : ''}</span>
                          </div>
                          <span className="font-bold text-gray-700">{percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-teal-500 to-green-500 h-3 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          <div className="mt-8 bg-gradient-to-r from-teal-500 to-green-500 rounded-2xl shadow-xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-3">Keep Tracking Your Emotional Wellness</h3>
            <p className="text-teal-50 mb-4">
              Regular emotion analysis helps in understanding patterns and improving mental health awareness.
              Continue using PsyCounAssist for comprehensive psychological insights.
            </p>
            <div className="flex space-x-4">
              <a
                href="/speech"
                className="bg-white text-teal-600 px-6 py-2 rounded-lg font-semibold hover:bg-teal-50 transition"
              >
                Analyze Speech
              </a>
              <a
                href="/text"
                className="bg-white text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-green-50 transition"
              >
                Analyze Text
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
