import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import LanguageAssessment from '../components/LanguageAssessment';
import { useAssessment } from '../context/AssessmentContext';
import { isAuthenticated, returnToParentApp, getLanguageIsoCode } from '../utils/authUtils';

function LanguageAssessmentPage() {
  const { language } = useParams();
  const { setCurrentAssessmentType, saveLanguageAssessment, setUserId } = useAssessment();
  
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
  
  const handleComplete = (results) => {
    console.log('Assessment completed:', results);
    
    // Get the ISO code from results
    const langCode = results.language_code || getLanguageIsoCode(language) || 'unknown';
    
    // Save results to the assessment context
    saveLanguageAssessment(langCode, results);
    
    // Optional: navigate or show completion screen
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
    </div>
  );
}

export default LanguageAssessmentPage; 