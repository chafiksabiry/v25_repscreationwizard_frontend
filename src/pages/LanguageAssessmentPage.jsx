import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LanguageAssessment from '../components/LanguageAssessment';
import { useAssessment } from '../context/AssessmentContext';
import { isAuthenticated, returnToParentApp, getLanguageIsoCode } from '../utils/authUtils';
import Notification from '../components/Notification';

function LanguageAssessmentPage() {
  const { language } = useParams();
  const { setCurrentAssessmentType, saveLanguageAssessment, setUserId } = useAssessment();
  const [notification, setNotification] = useState(null);
  
  // Set assessment type and check authentication on mount
  useEffect(() => {
    setCurrentAssessmentType('language');
    
    // Check if the user is authenticated
    if (!isAuthenticated() && import.meta.env.VITE_RUN_MODE !== 'standalone') {
      console.warn('No authentication data found. Using demo mode.');
      // You can add logic to redirect to login here if needed
    }
    
    // Try to get the language ISO code ahead of time
    const isoCode = getLanguageIsoCode(language);
    console.log(`Language: ${language}, ISO code: ${isoCode || 'unknown (will be determined by API)'}`);
  }, [setCurrentAssessmentType, language]);
  
  // Helper function to convert score to CEFR level - copied from LanguageAssessment component
  const mapScoreToCEFR = (score) => {
    if (score >= 95) return 'C2';
    if (score >= 80) return 'C1';
    if (score >= 65) return 'B2';
    if (score >= 50) return 'B1';
    if (score >= 35) return 'A2';
    return 'A1';
  };
  
  const handleComplete = async (results) => {
    console.log('Assessment completed:', results);
    
    // Get the language from the URL parameter
    const languageParam = decodedLanguage;
    
    // Get the ISO code for the language
    const isoCode = getLanguageIsoCode(languageParam) || results.language_code;
    
    // Get the CEFR level from the results for proficiency
    const proficiency = mapScoreToCEFR(results.overall.score);
    
    // Save results to the assessment context with the required parameters
    const success = await saveLanguageAssessment(languageParam, proficiency, results, isoCode);
    
    if (success) {
      setNotification({
        message: 'Assessment results saved successfully!',
        type: 'success'
      });
      
      // Set a brief timeout to allow the user to see the success notification before redirecting
      setTimeout(() => {
        returnToParentApp();
      }, 2000);
    } else {
      setNotification({
        message: 'Results saved locally but could not be sent to server',
        type: 'warning'
      });
    }
  };
  
  // Decode URI component in case the language contains special characters
  const decodedLanguage = React.useMemo(() => {
    try {
      return decodeURIComponent(language || 'English');
    } catch (e) {
      console.error('Error decoding language parameter:', e);
      return 'English';
    }
  }, [language]);
  
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-blue-700 px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">
              {decodedLanguage} Assessment
            </h1>
            <button 
              onClick={returnToParentApp}
              className="px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Exit
            </button>
          </div>
          
          <div className="p-6">
            <LanguageAssessment 
              language={decodedLanguage} 
              onComplete={handleComplete}
              onExit={returnToParentApp}
            />
          </div>
        </div>
      </div>
      
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          duration={5000}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}

export default LanguageAssessmentPage; 