import { useState, useEffect } from 'react';
import { getProfile, saveProfile, deleteProfile } from '../lib/api/profiles';

export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getProfile();
        setProfile(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (localStorage.getItem('token')) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const handleSaveProfile = async (profileData) => {
    try {
      setLoading(true);
      const updatedProfile = await saveProfile(profileData);
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (err) {
      console.error('Error saving profile:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProfile = async () => {
    try {
      setLoading(true);
      await deleteProfile();
      setProfile(null);
    } catch (err) {
      console.error('Error deleting profile:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    error,
    saveProfile: handleSaveProfile,
    deleteProfile: handleDeleteProfile
  };
};