import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ContactCenterAssessment from '../components/ContactCenterAssessment';
import { useAssessment } from '../context/AssessmentContext';
import { isAuthenticated, returnToParentApp } from '../utils/authUtils';

function ContactCenterAssessmentPage() {
  const { skillId } = useParams();
  const { contactCenterSkills, setCurrentAssessmentType } = useAssessment();
  
  // Find the skill category based on skillId
  const findSkillCategory = () => {
    for (const categoryGroup of contactCenterSkills) {
      const foundSkill = categoryGroup.skills.find(skill => skill.id === skillId);
      if (foundSkill) {
        return {
          category: categoryGroup.category,
          skill: foundSkill
        };
      }
    }
    return { category: 'Unknown', skill: { id: skillId, name: skillId } };
  };
  
  const { category, skill } = findSkillCategory();
  
  // Set current assessment type and check authentication
  useEffect(() => {
    setCurrentAssessmentType('contact-center');
    
    // Check if the user is authenticated
    if (!isAuthenticated() && import.meta.env.VITE_RUN_MODE !== 'standalone') {
      console.warn('No authentication data found. Using demo mode.');
      // You can add logic to redirect to login here if needed
    }
  }, [setCurrentAssessmentType]);
  
  const handleComplete = (results) => {
    console.log('Assessment completed:', results);
    // You can add navigation or other logic after completion
  };
  
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-indigo-700 px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">
              {category}: {skill.name} Assessment
            </h1>
            <button 
              onClick={returnToParentApp}
              className="px-4 py-2 bg-white text-indigo-700 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              Exit
            </button>
          </div>
          
          <div className="p-6">
            <ContactCenterAssessment 
              skillId={skillId}
              category={category}
              skillName={skill.name}
              onComplete={handleComplete}
              onExit={returnToParentApp}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactCenterAssessmentPage; 