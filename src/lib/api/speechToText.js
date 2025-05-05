import api from './client';

/**
 * Transcribe audio to text
 * @param {Blob} audioBlob - The audio recording blob
 * @returns {Promise<{transcription: string}>} - The transcribed text
 */
export const transcribeAudio = async (audioBlob) => {
  try {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    
    const response = await api.post('/speech-to-text/transcribe', formData);
    return response.data;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw error;
  }
};

/**
 * Transcribe long audio file to text using file URI
 * @param {Object} data - Object containing fileUri and languageCode
 * @param {string} data.fileUri - The URI of the uploaded audio file
 * @param {string} data.languageCode - The language code (e.g., 'en-US')
 * @returns {Promise<{transcription: string}>} - The transcribed text
 */
export const transcribeLongAudio = async (data) => {
  try {
    console.log('Sending transcription request to /speechToText/transcribe:', data);
    const response = await api.post('/speechToText/transcribe', data);
    console.log('Transcription response received:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error transcribing long audio:', error);
    throw error;
  }
};
