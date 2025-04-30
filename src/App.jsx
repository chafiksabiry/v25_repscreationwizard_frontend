import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LanguageAssessmentPage from './pages/LanguageAssessmentPage';
import ContactCenterAssessmentPage from './pages/ContactCenterAssessmentPage';
import { AssessmentProvider } from './context/AssessmentContext';
import { initializeAuth } from './utils/authUtils';

function App() {
  // Initialize authentication on component mount
  useEffect(() => {
    const { userId, token } = initializeAuth();
    console.log('Authentication initialized:', userId ? 'User authenticated' : 'No user ID');
  }, []);
  
  return (
    <AssessmentProvider>
      <Router>
        <Routes>
          {/* Language assessment route */}
          <Route path="/assessment/language/:language" element={<LanguageAssessmentPage />} />
          
          {/* Contact center assessment route */}
          <Route path="/assessment/contact-center/:skillId" element={<ContactCenterAssessmentPage />} />
          
          {/* Redirects */}
          <Route path="/" element={<Navigate to="/assessment/language/English" replace />} />
          <Route path="*" element={<Navigate to="/assessment/language/English" replace />} />
        </Routes>
      </Router>
    </AssessmentProvider>
  );
}

export default App;