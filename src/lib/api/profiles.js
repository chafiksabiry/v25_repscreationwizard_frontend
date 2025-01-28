import api from './client';

export const getProfile = async () => {
  try {
    const { data } = await api.get('/profiles');
    return data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const saveProfile = async (profileData) => {
  try {
    const { data } = await api.post('/profiles', profileData);
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