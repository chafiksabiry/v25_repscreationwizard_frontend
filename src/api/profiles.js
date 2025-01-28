import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const getProfile = async () => {
  const response = await axios.get(
    `${API_URL}/profiles`,
    getAuthHeader()
  );
  return response.data;
};

export const saveProfile = async (profileData) => {
  const response = await axios.post(
    `${API_URL}/profiles`,
    profileData,
    getAuthHeader()
  );
  return response.data;
};

export const deleteProfile = async () => {
  const response = await axios.delete(
    `${API_URL}/profiles`,
    getAuthHeader()
  );
  return response.data;
};