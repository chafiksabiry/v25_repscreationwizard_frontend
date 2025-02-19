import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ImportDialog from './ImportDialog';
import SummaryEditor from './SummaryEditor';
import LinkedInCallback from './LinkedInCallback';
import RepsProfile from './components/REPSProfile'
import { Navigate } from 'react-router-dom';
import api from './lib/api/client';

function App() {
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    personalInfo: {
      name: '',
      location: '',
      languages: [],
      email: '',
      phone: '',
      linkedin: '',
      website: ''
    },
    professionalSummary: {
      yearsOfExperience: '',
      currentRole: '',
      industries: [],
      keyExpertise: [],
      notableCompanies: []
    },
    skills: {
      technical: [],
      professional: [],
      soft: []
    },
    experience: [],
    achievements: []
  });
  const [generatedSummary, setGeneratedSummary] = useState('');

  useEffect(() => {
    const initializeToken = async () => {
      // Check if token exists
      /*       const existingToken = localStorage.getItem('token');
            if (existingToken) {
              console.log("token already exists in local storage : ", existingToken)
              return;
            } */

      try {
        // Generate a temporary userId if not exists
        let userId = null;
        if (!localStorage.getItem('userId')) {
          console.log("set a new userId")
          localStorage.setItem('userId', "67a22959828197bb180caa59");
        }
        userId = localStorage.getItem('userId');

        // Generate token
        const { data } = await api.post('/auth/generate-token', {
          userId: userId
        });

        console.log("tokenResult : ", data)
        if (data?.token) {
          localStorage.setItem('token', data.token);
        }
      } catch (error) {
        console.error('Failed to initialize token:', error.message);
      }
    };

    initializeToken();
  }, []);


  const handleProfileData = (data) => {
    const { generatedSummary, ...profileInfo } = data;
    setProfileData(profileInfo);
    setGeneratedSummary(generatedSummary || '');
  };

  return (
    <Router>
      <Routes>
        <Route path="/linkedin-callback" element={<LinkedInCallback />} />
        <Route path="/reps-profile" element={<RepsProfile />} />
        <Route
          path="/profile-wizard"
          element={
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <div className="flex items-center justify-center mb-6">
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-25"></div>
                      <h1 className="relative bg-white px-8 py-4 rounded-lg text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                        HARX REPS Profile Wizard ✨
                      </h1>
                    </div>
                  </div>
                  <p className="text-xl text-gray-600 mb-4">
                    Transform your CV into a captivating professional story
                  </p>
                  <p className="text-sm text-gray-500 max-w-xl mx-auto">
                    Powered by AI magic 🪄 | REPS Framework: Role • Experience • Projects • Skills
                  </p>
                </div>

                {!profileData.personalInfo.name ? (
                  <div className="text-center py-12 bg-white rounded-2xl shadow-xl border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                    <div className="relative">
                      <div className="bg-gradient-to-br from-blue-100 to-purple-100 w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center">
                        <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Stand Out?</h3>
                      <p className="text-gray-600 max-w-sm mx-auto mb-8">
                        Connect with LinkedIn or upload your CV to create your personalized professional summary
                      </p>
                      <button
                        onClick={() => setIsImportOpen(true)}
                        className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all duration-200 hover:scale-105"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Let's Get Started
                      </button>
                      <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-gray-500">
                        <span>🚀 Instant Analysis</span>
                        <span>•</span>
                        <span>✨ AI-Powered</span>
                        <span>•</span>
                        <span>🔒 Secure</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <SummaryEditor
                    profileData={profileData}
                    generatedSummary={generatedSummary}
                    setGeneratedSummary={setGeneratedSummary}
                    onProfileUpdate={handleProfileData}
                  />
                )}

                <ImportDialog
                  isOpen={isImportOpen}
                  onClose={() => setIsImportOpen(false)}
                  onImport={handleProfileData}
                />
              </div>
            </div>
          }
        />
        <Route path="*" element={<Navigate to="/profile-wizard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;