import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LanguageAssessment from '../components/LanguageAssessment';
import { useAssessment } from '../context/AssessmentContext';

function LanguageAssessmentPage() {
  const { language } = useParams();
  const navigate = useNavigate();
  const { setCurrentAssessmentType } = useAssessment();
  
  // Just pass the language name directly to the assessment component
  // OpenAI will handle determining the ISO code
  
  const handleComplete = (results) => {
    console.log('Assessment completed:', results);
    // You can add navigation or other logic after completion
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
          <div className="bg-gray-700 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">
              {decodedLanguage} Assessment
            </h1>
          </div>
          
          <div className="p-6">
            <LanguageAssessment 
              language={decodedLanguage} 
              onComplete={handleComplete}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LanguageAssessmentPage; 