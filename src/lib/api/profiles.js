import api from './client';

export const getProfile = async () => {
  try {
    const { data } = await api.get('/profiles');
    return data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const createProfile = async (profileData) => {
  try {
    const { data } = await api.post('/profiles', profileData);
    return data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateBasicInfo = async (id, basicInfo) => {
  try {
    const { data } = await api.put(`/profiles/${id}/basic-info`, basicInfo);
    return data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateExperience = async (id, experience) => {
  try {
    const { data } = await api.put(`/profiles/${id}/experience`, { experience });
    return data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateSkills = async (id, skills) => {
  try {
    const { data } = await api.put(`/profiles/${id}/skills`, { skills });
    return data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateLanguageAssessment = async (id, data) => {
  try {
    const { data: response } = await api.post(`/profiles/${id}/language-assessment`, data);
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const addAssessment = async (id, assessment) => {
  try {
    const { data } = await api.post(`/profiles/${id}/assessment`, assessment);
    return data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteProfile = async () => {
  try {
    const { data } = await api.delete('/profiles');
    return data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateProfile = async (id, profileData) => {
  try {
    const response = await api.put(`/profiles/${id}`, profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Add new function to handle contact center assessment
export const addContactCenterAssessment = async (id, assessment) => {
  try {
    const { data } = await api.post(`/profiles/${id}/contact-center-assessment`, { assessment });
    return data;
  } catch (error) {
    throw error.response?.data || error;
  }
};