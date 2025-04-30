import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AssessmentContext = createContext();

export const useAssessment = () => useContext(AssessmentContext);

export const AssessmentProvider = ({ children }) => {
  const [assessmentResults, setAssessmentResults] = useState({
    languages: {},
    contactCenter: {}
  });
  
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [returnUrl, setReturnUrl] = useState('/');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentAssessmentType, setCurrentAssessmentType] = useState(null);
  
  // Initialize auth data from localStorage on mount
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedToken = localStorage.getItem('token');
    const storedReturnUrl = localStorage.getItem('returnUrl');
    
    if (storedUserId) setUserId(storedUserId);
    if (storedToken) setToken(storedToken);
    if (storedReturnUrl) setReturnUrl(storedReturnUrl);
    
    // In standalone mode, use the env variables
    if (import.meta.env.VITE_RUN_MODE === 'standalone') {
      setUserId(import.meta.env.VITE_STANDALONE_USER_ID || storedUserId);
      setToken(import.meta.env.VITE_STANDALONE_TOKEN || storedToken);
    }
    
    // We can also check URL parameters for these values
    const params = new URLSearchParams(window.location.search);
    const urlUserId = params.get('userId');
    const urlToken = params.get('token');
    const urlReturnUrl = params.get('returnUrl');
    
    if (urlUserId) {
      setUserId(urlUserId);
      localStorage.setItem('userId', urlUserId);
    }
    
    if (urlToken) {
      setToken(urlToken);
      localStorage.setItem('token', urlToken);
    }
    
    if (urlReturnUrl) {
      setReturnUrl(urlReturnUrl);
      localStorage.setItem('returnUrl', urlReturnUrl);
    }
  }, []);
  
  // Configure axios with the authentication token
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);
  
  // Sample language options
  const languageOptions = [
    { id: 'en', language: 'English' },
    { id: 'fr', language: 'French' },
    { id: 'es', language: 'Spanish' },
    { id: 'de', language: 'German' },
    { id: 'ar', language: 'Arabic' }
  ];
  
  // Sample contact center skills
  const contactCenterSkills = [
    { 
      category: 'Communication',
      skills: [
        { id: 'active-listening', name: 'Active Listening' },
        { id: 'clear-speech', name: 'Clear Speech' },
        { id: 'empathy', name: 'Empathy' },
        { id: 'tone-management', name: 'Tone Management' }
      ]
    },
    {
      category: 'Problem Solving',
      skills: [
        { id: 'issue-analysis', name: 'Issue Analysis' },
        { id: 'solution-finding', name: 'Solution Finding' },
        { id: 'decision-making', name: 'Decision Making' },
        { id: 'resource-utilization', name: 'Resource Utilization' }
      ]
    },
    {
      category: 'Customer Service',
      skills: [
        { id: 'service-orientation', name: 'Service Orientation' },
        { id: 'conflict-resolution', name: 'Conflict Resolution' },
        { id: 'product-knowledge', name: 'Product Knowledge' },
        { id: 'quality-assurance', name: 'Quality Assurance' }
      ]
    }
  ];
  
  // Save a language assessment result
  const saveLanguageAssessment = async (languageId, results) => {
    if (!userId) {
      console.error('Cannot save assessment: No user ID provided');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      setAssessmentResults(prev => ({
        ...prev,
        languages: {
          ...prev.languages,
          [languageId]: results
        }
      }));
      
      // Call API to save results to backend
      if (import.meta.env.VITE_API_URL) {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/assessments/language`, {
          userId,
          languageId,
          results
        });
        
        console.log('Assessment saved to backend:', response.data);
      }
    } catch (err) {
      console.error('Error saving language assessment:', err);
      setError('Failed to save assessment results');
    } finally {
      setLoading(false);
    }
  };
  
  // Save a contact center skill assessment result
  const saveContactCenterAssessment = async (skillId, category, results) => {
    if (!userId) {
      console.error('Cannot save assessment: No user ID provided');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      setAssessmentResults(prev => ({
        ...prev,
        contactCenter: {
          ...prev.contactCenter,
          [skillId]: {
            category,
            ...results
          }
        }
      }));
      
      // Call API to save results to backend
      if (import.meta.env.VITE_API_URL) {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/assessments/contact-center`, {
          userId,
          skillId,
          category,
          results
        });
        
        console.log('Contact center assessment saved to backend:', response.data);
      }
    } catch (err) {
      console.error('Error saving contact center assessment:', err);
      setError('Failed to save assessment results');
    } finally {
      setLoading(false);
    }
  };
  
  // Reset the current assessment state when closing dialog
  const resetAssessment = () => {
    setCurrentAssessmentType(null);
    setError(null);
    setLoading(false);
  };
  
  // Check if all assessments for a category are completed
  const isAssessmentCategoryComplete = (category) => {
    if (category === 'language') {
      // Determine if all required language assessments are completed
      // For now, we'll just check if at least one language is assessed
      return Object.keys(assessmentResults.languages).length > 0;
    } else if (category === 'contact-center') {
      // Determine if all required contact center assessments are completed
      // For now, we'll just check if at least one skill is assessed
      return Object.keys(assessmentResults.contactCenter).length > 0;
    }
    return false;
  };
  
  // Handle exit/return to parent application
  const exitToParentApp = () => {
    window.location.href = returnUrl;
  };
  
  return (
    <AssessmentContext.Provider value={{
      assessmentResults,
      languageOptions,
      contactCenterSkills,
      currentAssessmentType,
      setCurrentAssessmentType,
      saveLanguageAssessment,
      saveContactCenterAssessment,
      isAssessmentCategoryComplete,
      loading,
      setLoading,
      error,
      setError,
      userId,
      setUserId,
      token,
      setToken,
      returnUrl,
      setReturnUrl,
      resetAssessment,
      exitToParentApp
    }}>
      {children}
    </AssessmentContext.Provider>
  );
}; 