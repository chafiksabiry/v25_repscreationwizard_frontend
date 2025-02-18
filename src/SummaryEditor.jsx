import React, { useState, useEffect } from 'react';
import AssessmentDialog from './components/AssessmentDialog';
import { useProfile } from './hooks/useProfile';
import openaiClient from './lib/ai/openaiClient';

function SummaryEditor({ profileData, generatedSummary, setGeneratedSummary, onProfileUpdate }) {
  const { profile, loading: profileLoading, error: profileError, updateBasicInfo, updateExperience, updateSkills, updateProfileData } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  console.log("generatedSummary : ", generatedSummary);
  const [editedSummary, setEditedSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profileData);
  const [tempLanguage, setTempLanguage] = useState({ language: '', proficiency: 'Intermediate' });
  const [tempIndustry, setTempIndustry] = useState('');
  const [tempCompany, setTempCompany] = useState('');
  const [showAssessment, setShowAssessment] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    languages: '',
    industries: '',
    companies: '',
    name: '',
    location: '',
    email: '',
    phone: '',
    currentRole: '',
    yearsExperience: ''
  });


  useEffect(() => {
    if (generatedSummary) {
      setEditedSummary(generatedSummary);
    }
  }, [generatedSummary]);

  useEffect(() => {
    if (profileData) {
      setEditedProfile(profileData);
    }
  }, [profileData]);

  const validateProfile = () => {
    const errors = {};

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Phone validation regex - accepts various formats with optional country code
    const phoneRegex = /^\+?[\d\s-]{10,}$/;

    // Validate languages (at least one required)
    if (!editedProfile.personalInfo.languages?.length) {
      errors.languages = 'At least one language is required';
    }

    // Validate name
    if (!editedProfile.personalInfo.name?.trim()) {
      errors.name = 'Name is required';
    }

    // Validate location
    if (!editedProfile.personalInfo.location?.trim()) {
      errors.location = 'Location is required';
    }

    // Validate email
    if (!editedProfile.personalInfo.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(editedProfile.personalInfo.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Validate phone
    if (!editedProfile.personalInfo.phone?.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(editedProfile.personalInfo.phone.replace(/\s+/g, ''))) {
      errors.phone = 'Please enter a valid phone number';
    }

    // Validate current role
    if (!editedProfile.professionalSummary.currentRole?.trim()) {
      errors.currentRole = 'Current role is required';
    }

    // Validate years of experience
    if (!editedProfile.professionalSummary.yearsOfExperience?.trim()) {
      errors.yearsExperience = 'Years of experience is required';
    }

    // Validate industries (at least one required)
    if (!editedProfile.professionalSummary.industries?.length) {
      errors.industries = 'At least one industry is required';
    }

    // Validate notable companies (at least one required)
    if (!editedProfile.professionalSummary.notableCompanies?.length) {
      errors.companies = 'At least one notable company is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle profile updates from AssessmentDialog
  const handleAssessmentUpdate = (updatedProfile) => {
    setEditedProfile(updatedProfile);
    if (onProfileUpdate) {
      onProfileUpdate(updatedProfile);
    }
  };

  /*  const handleProfileChange = async (field, value) => {
     try {
       // Update the profile state immediately
       const updatedPersonalInfo = {
         ...editedProfile.personalInfo,
         [field]: value
       };
 
       const updatedProfile = {
         ...editedProfile,
         personalInfo: updatedPersonalInfo
       };
 
       setEditedProfile(updatedProfile);
 
       // Show validation error if field is empty
       if (!value.trim()) {
         setValidationErrors(prev => ({
           ...prev,
           [field]: `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
         }));
       } else {
         // Clear validation error if field has value
         setValidationErrors(prev => ({
           ...prev,
           [field]: ''
         }));
 
         // Update backend
         await updateBasicInfo(editedProfile._id, updatedPersonalInfo);
       }
     } catch (error) {
       console.error('Error updating profile:', error);
     }
   }; */
  const handleProfileChanges = async (field, value) => {
    try {
      // Update the profile state immediately
      const updatedPersonalInfo = {
        ...editedProfile.personalInfo,
        [field]: value
      };

      const updatedProfile = {
        ...editedProfile,
        personalInfo: updatedPersonalInfo
      };

      setEditedProfile(updatedProfile);

      // Validation rules
      const validations = {
        name: (val) => val.trim() ? '' : 'Name is required',
        location: (val) => val.trim() ? '' : 'Location is required',
        email: (val) => {
          if (!val.trim()) return 'Email is required';
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(val) ? '' : 'Please enter a valid email address';
        },
        phone: (val) => {
          if (!val.trim()) return 'Phone is required';
          const phoneRegex = /^\+?[\d\s-]{10,}$/;
          return phoneRegex.test(val) ? '' : 'Please enter a valid phone number';
        }
      };

      // Get the appropriate validation function or use a default one
      const validateField = validations[field] || ((val) => val.trim() ? '' : `${field.charAt(0).toUpperCase() + field.slice(1)} is required`);

      // Run validation
      const validationError = validateField(value);

      // Update validation errors
      setValidationErrors(prev => ({
        ...prev,
        [field]: validationError
      }));
      console.log('validation error :', validationError)
      // Only update backend if there are no validation errors
      if (!validationError && value.trim()) {
        await updateBasicInfo(editedProfile._id, updatedPersonalInfo);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleProfileChange = async (field, value) => {
    try {
      // Update the profile state immediately for UI responsiveness
      const updatedPersonalInfo = {
        ...editedProfile.personalInfo,
        [field]: value
      };
  
      const updatedProfile = {
        ...editedProfile,
        personalInfo: updatedPersonalInfo
      };
  
      setEditedProfile(updatedProfile);
  
      // Validation rules
      const validations = {
        name: (val) => val.trim() ? '' : 'Name is required',
        location: (val) => val.trim() ? '' : 'Location is required',
        email: (val) => {
          if (!val.trim()) return 'Email is required';
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(val) ? '' : 'Please enter a valid email address';
        },
        phone: (val) => {
          if (!val.trim()) return 'Phone is required';
          const phoneRegex = /^\+?[\d\s-]{10,}$/;
          return phoneRegex.test(val) ? '' : 'Please enter a valid phone number';
        }
      };
  
      // Get the appropriate validation function or use a default one
      const validateField = validations[field] || ((val) => val.trim() ? '' : `${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
  
      // Run validation
      const validationError = validateField(value);
  
      // Update validation errors state
      setValidationErrors(prev => ({
        ...prev,
        [field]: validationError
      }));
  
      // Only update backend if there are no validation errors AND all required fields are filled
      const requiredFields = ['name', 'location', 'email', 'phone'];
      const currentValues = {
        ...editedProfile.personalInfo,
        [field]: value
      };
  
      // Check if all required fields are valid
      const allFieldsValid = requiredFields.every(fieldName => {
        const fieldValue = currentValues[fieldName];
        const fieldValidation = validations[fieldName] || ((val) => val.trim() ? '' : 'Required');
        return !fieldValidation(fieldValue);
      });
  
      if (allFieldsValid) {
        await updateBasicInfo(editedProfile._id, updatedPersonalInfo);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      // Optionally revert the UI state if the update fails
      setEditedProfile(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo
        }
      }));
    }
  };
  
  const addIndustry = async () => {
    if (tempIndustry.trim()) {
      try {
        const updatedIndustries = [
          ...(editedProfile.professionalSummary.industries || []),
          tempIndustry
        ];
        console.log("updated industries :", updatedIndustries);
        await updateProfileData(editedProfile._id, {
          professionalSummary: {
            ...editedProfile.professionalSummary,
            industries: updatedIndustries
          }
        });

        setEditedProfile(prev => ({
          ...prev,
          professionalSummary: {
            ...prev.professionalSummary,
            industries: updatedIndustries
          }
        }));

        setTempIndustry('');
      } catch (error) {
        console.error('Error adding industry:', error);
      }
    }
  };

  const removeIndustry = async (index) => {
    try {
      const updatedIndustries = editedProfile.professionalSummary.industries.filter((_, i) => i !== index);

      await updateProfileData(editedProfile._id, {
        professionalSummary: {
          ...editedProfile.professionalSummary,
          industries: updatedIndustries
        }
      });

      setEditedProfile(prev => ({
        ...prev,
        professionalSummary: {
          ...prev.professionalSummary,
          industries: updatedIndustries
        }
      }));
    } catch (error) {
      console.error('Error removing industry:', error);
    }
  };

  const addCompany = async () => {
    if (tempCompany.trim()) {
      try {
        const updatedCompanies = [
          ...(editedProfile.professionalSummary.notableCompanies || []),
          tempCompany
        ];

        await updateProfileData(editedProfile._id, {
          professionalSummary: {
            ...editedProfile.professionalSummary,
            notableCompanies: updatedCompanies
          }
        });

        setEditedProfile(prev => ({
          ...prev,
          professionalSummary: {
            ...prev.professionalSummary,
            notableCompanies: updatedCompanies
          }
        }));

        setTempCompany('');
      } catch (error) {
        console.error('Error adding company:', error);
      }
    }
  };

  const removeCompany = async (index) => {
    try {
      const updatedCompanies = editedProfile.professionalSummary.notableCompanies.filter((_, i) => i !== index);

      await updateProfileData(editedProfile._id, {
        professionalSummary: {
          ...editedProfile.professionalSummary,
          notableCompanies: updatedCompanies
        }
      });

      setEditedProfile(prev => ({
        ...prev,
        professionalSummary: {
          ...prev.professionalSummary,
          notableCompanies: updatedCompanies
        }
      }));
    } catch (error) {
      console.error('Error removing company:', error);
    }
  };

  const addLanguage = async () => {
    console.log('editedProfile : ', editedProfile);
    if (!tempLanguage.language.trim()) {
      setValidationErrors(prev => ({
        ...prev,
        languages: 'Language name is required'
      }));
      return;
    }
    try {
      const updatedLanguages = [
        ...editedProfile.personalInfo.languages,
        { ...tempLanguage }
      ];

      await updateBasicInfo(editedProfile._id, {
        ...editedProfile.personalInfo,
        languages: updatedLanguages
      });

      setEditedProfile(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          languages: updatedLanguages
        }
      }));

      setTempLanguage({ language: '', proficiency: 'Intermediate' });
      setValidationErrors(prev => ({ ...prev, languages: '' }));
    } catch (error) {
      console.error('Error adding language:', error);
    }
  };

  const removeLanguage = async (index) => {
    console.log('editedProfile : ', editedProfile);
    try {
      if (editedProfile.personalInfo.languages.length <= 1) {
        setValidationErrors(prev => ({
          ...prev,
          languages: 'At least one language is required'
        }));
        return;
      }
      const updatedLanguages = editedProfile.personalInfo.languages.filter((_, i) => i !== index);

      await updateBasicInfo(editedProfile._id, {
        ...editedProfile.personalInfo,
        languages: updatedLanguages
      });

      setEditedProfile(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          languages: updatedLanguages
        }
      }));
    } catch (error) {
      console.error('Error removing language:', error);
    }
  };

  const regenerateSummary = async () => {
    try {
      setLoading(true);
      const response = await openaiClient.createChatCompletion([
        {
          role: "system",
          content: `You are a professional CV writer with a knack for creating engaging, memorable summaries. Create a compelling professional summary that follows the REPS framework while maintaining a confident, energetic tone:
          - Role: Current position and career focus (with a touch of personality)
          - Experience: Years and experience and key industries (highlight the journey)
          - Projects: Notable achievements and contributions (make them shine)
          - Skills: Core technical and professional competencies (show expertise with style)
          
          Keep the summary concise, impactful, and achievement-oriented while letting the person's unique value proposition shine through.`
        },
        {
          role: "user",
          content: `Create a fresh, engaging REPS summary based on this profile data: ${JSON.stringify(editedProfile)}`
        }
      ]);

      const newSummary = response.choices[0].message.content;
      setGeneratedSummary(newSummary);
      setEditedSummary(newSummary);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to regenerate summary:', error);
    } finally {
      setLoading(false);
    }
  };

  const pushToRepsProfile = () => {
    if (validateProfile()) {
      setShowAssessment(true);
    } else {
      // Scroll to the first error
      const firstError = Object.keys(validationErrors)[0];
      const errorElement = document.getElementById(`error-${firstError}`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
    //setShowAssessment(true);
  };

  // Render validation error message
  const renderError = (error, id) => {
    if (!error) return null;
    return (
      <div id={`error-${id}`} className="text-red-600 text-sm mt-1 flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {error}
      </div>
    );
  };

  const renderSkillSection = (title, skills) => (
    <div className="mb-6 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
        {title === 'Technical Skills' && '🔧'}
        {title === 'Professional Skills' && '💼'}
        {title === 'Soft Skills' && '🤝'}
        <span className="ml-2">{title}</span>
      </h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 text-gray-700 rounded-full text-sm font-medium border border-gray-200 hover:shadow-md transition-shadow duration-200"
          >
            {typeof skill === 'string' ? skill : `${skill.skill} (${skill.level}%)`}
          </span>
        ))}
      </div>
    </div>
  );

  const renderExperienceSection = () => (
    <div className="mb-8 space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Professional Experience</h3>
        {editedProfile.experience?.map((role, index) => (
          <div key={index} className="mb-6 last:mb-0">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-lg font-semibold text-gray-800">{role.title}</h4>
                <p className="text-gray-600">{role.company}</p>
              </div>
              <div className="text-sm text-gray-500">
                {role.startDate} - {role.endDate || 'Present'}
              </div>
            </div>
            <ul className="mt-3 space-y-2">
              {role.responsibilities?.map((resp, idx) => (
                <li key={idx} className="text-gray-700 flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  {resp}
                </li>
              ))}
            </ul>
            {role.achievements?.length > 0 && (
              <div className="mt-3">
                <h5 className="text-sm font-semibold text-gray-700 mb-2">Key Achievements:</h5>
                <ul className="space-y-1">
                  {role.achievements.map((achievement, idx) => (
                    <li key={idx} className="text-gray-700 flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {editingProfile ? (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Industry Expertise</h3>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {editedProfile.professionalSummary?.industries?.map((industry, index) => (
                  <div key={index} className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
                    <span className="text-sm font-medium text-gray-700">{industry}</span>
                    <button
                      onClick={() => removeIndustry(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tempIndustry}
                  onChange={(e) => setTempIndustry(e.target.value)}
                  className="flex-1 p-2 border rounded-md"
                  placeholder="Add an industry"
                />
                <button
                  onClick={addIndustry}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Notable Companies</h3>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {editedProfile.professionalSummary?.notableCompanies?.map((company, index) => (
                  <div key={index} className="flex items-center gap-2 bg-purple-50 px-3 py-1 rounded-full">
                    <span className="text-sm font-medium text-gray-700">{company}</span>
                    <button
                      onClick={() => removeCompany(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tempCompany}
                  onChange={(e) => setTempCompany(e.target.value)}
                  className="flex-1 p-2 border rounded-md"
                  placeholder="Add a company"
                />
                <button
                  onClick={addCompany}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Industry Expertise</h3>
            <div className="flex flex-wrap gap-2">
              {editedProfile.professionalSummary?.industries?.map((industry, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-50 text-gray-700 rounded-full text-sm font-medium"
                >
                  {industry}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Notable Companies</h3>
            <div className="flex flex-wrap gap-2">
              {editedProfile.professionalSummary?.notableCompanies?.map((company, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-purple-50 text-gray-700 rounded-full text-sm font-medium"
                >
                  {company}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      <div className="p-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Your Professional Story ✨</h2>
            <button
              onClick={() => {
                if (!editingProfile) {
                  setValidationErrors(prev => ({ ...prev, languages: '' }));
                }
                setEditingProfile(!editingProfile)
              }}
              className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
            >
              {editingProfile ? '💾 Save Profile' : '✏️ Edit Profile'}
            </button>
          </div>

          {/* Profile Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {editingProfile ? (
              <>
                <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">👤 Name</h3>
                  <input
                    type="text"
                    value={editedProfile.personalInfo.name}
                    onChange={(e) => handleProfileChange('name', e.target.value)}
                    className="w-full p-2 border rounded-md bg-white/50"
                    placeholder="Enter your name"
                  />
                  {renderError(validationErrors.name, 'name')}
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">📍 Location</h3>
                  <input
                    type="text"
                    value={editedProfile.personalInfo.location}
                    onChange={(e) => handleProfileChange('location', e.target.value)}
                    className="w-full p-2 border rounded-md bg-white/50"
                    placeholder="Enter your location"
                  />
                  {renderError(validationErrors.location, 'location')}
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">📧 Email</h3>
                  <input
                    type="email"
                    value={editedProfile.personalInfo.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                    className="w-full p-2 border rounded-md bg-white/50"
                    placeholder="Enter your email"
                  />
                  {renderError(validationErrors.email, 'email')}
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">📱 Phone</h3>
                  <input
                    type="tel"
                    value={editedProfile.personalInfo.phone}
                    onChange={(e) => handleProfileChange('phone', e.target.value)}
                    className="w-full p-2 border rounded-md bg-white/50"
                    placeholder="Enter your phone number"
                  />
                  {renderError(validationErrors.phone, 'phone')}
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl col-span-2">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">🌍 Languages</h3>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {editedProfile.personalInfo.languages.map((lang, index) => (
                        <div key={index} className="flex items-center gap-2 bg-white/50 px-3 py-1 rounded-full">
                          <span className="text-sm font-medium text-gray-700">
                            {`${lang.language} (${lang.proficiency})`}
                          </span>
                          <button
                            onClick={() => removeLanguage(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    {renderError(validationErrors.languages, 'languages')}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={tempLanguage.language}
                        onChange={(e) => setTempLanguage(prev => ({ ...prev, language: e.target.value }))}
                        className="flex-1 p-2 border rounded-md bg-white/50"
                        placeholder="Add a language"
                      />
                      <select
                        value={tempLanguage.proficiency}
                        onChange={(e) => setTempLanguage(prev => ({ ...prev, proficiency: e.target.value }))}
                        className="p-2 border rounded-md bg-white/50"
                      >
                        <option>Basic</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                        <option>Native</option>
                      </select>
                      <button
                        onClick={addLanguage}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">👤 Name</h3>
                  <p className="text-xl font-semibold text-gray-800">{editedProfile.personalInfo.name || 'Not specified'}</p>
                  {renderError(validationErrors.name, 'name')}
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">📍 Location</h3>
                  <p className="text-xl font-semibold text-gray-800">{editedProfile.personalInfo.location || 'Not specified'}</p>
                  {renderError(validationErrors.location, 'location')}
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">📧 Email</h3>
                  <p className="text-xl font-semibold text-gray-800">{editedProfile.personalInfo.email || 'Not specified'}</p>
                  {renderError(validationErrors.email, 'email')}
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">📱 Phone</h3>
                  <p className="text-xl font-semibold text-gray-800">{editedProfile.personalInfo.phone || 'Not specified'}</p>
                  {renderError(validationErrors.phone, 'phone')}
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">🌍 Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {editedProfile.personalInfo.languages.map((lang, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-white/50 text-gray-700 rounded-full text-sm font-medium"
                      >
                        {`${lang.language} (${lang.proficiency})`}
                      </span>
                    ))}
                  </div>
                  {/* {renderError(validationErrors.languages, 'languages')} */}
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">⭐ Experience</h3>
                  <p className="text-xl font-semibold text-gray-800">{editedProfile.professionalSummary.yearsOfExperience || 'Not specified'}</p>
                  {renderError(validationErrors.yearsExperience, 'yearsExperience')}
                </div>
              </>
            )}
          </div>

          {/* Experience Section */}
          {renderExperienceSection()}

          {/* Skills Sections */}
          <div className="space-y-6">
            {renderSkillSection('Technical Skills', editedProfile.skills.technical)}
            {renderSkillSection('Professional Skills', editedProfile.skills.professional)}
            {renderSkillSection('Soft Skills', editedProfile.skills.soft)}
          </div>

          {/* Summary Section */}
          <div className="mt-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Professional Summary</h3>
            {isEditing ? (
              <div className="space-y-4">
                <textarea
                  value={editedSummary}
                  onChange={(e) => setEditedSummary(e.target.value)}
                  className="w-full h-64 p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Edit your professional summary..."
                />
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setEditedSummary(generatedSummary);
                      setIsEditing(false);
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setGeneratedSummary(editedSummary);
                      setIsEditing(false);
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl">
                  <p className="text-gray-800 whitespace-pre-line text-lg leading-relaxed">{generatedSummary}</p>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="absolute top-4 right-4 p-2 text-gray-500 hover:text-blue-600 bg-white rounded-full shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end space-x-4">
            <button
              onClick={regenerateSummary}
              disabled={loading}
              className="px-6 py-3 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 disabled:opacity-50 transition-colors duration-200"
            >
              {loading ? '✨ Working Magic...' : '🔄 Regenerate Summary'}
            </button>
            <button
              onClick={pushToRepsProfile}
              className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors duration-200 flex items-center gap-2"
            >
              <span>🚀 Confirm REPS Qualifications</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <AssessmentDialog
        isOpen={showAssessment}
        onClose={() => setShowAssessment(false)}
        languages={editedProfile.personalInfo.languages}
        profileData={editedProfile}
        onProfileUpdate={handleAssessmentUpdate}
      />
    </div>
  );
}

export default SummaryEditor;