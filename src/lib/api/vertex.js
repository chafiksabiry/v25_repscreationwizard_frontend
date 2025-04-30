import api, { apiMultipart } from './client';

/**
 * Upload a recording for processing
 * @param {FormData} formData - Form data containing the audio file
 * @returns {Promise<{data: {fileUri: string}}>} - The URL of the uploaded recording
 */
export const uploadRecording = async (analyzeData) => {
    try {
        const responseData = await apiMultipart.post('/vertex/audio/upload', analyzeData);
        return responseData;
    } catch (error) {
        throw error.response?.data || error;
    }
};

/**
 * Analyze recording using Vertex AI
 * @param {Object} data - The analysis parameters
 * @param {string} data.fileUri - The URI of the uploaded file
 * @param {string} data.textToCompare - The text to compare the audio against
 * @returns {Promise<Object>} - The analysis results
 */
export const analyzeRecordingVertex = async (analyzeData) => {
    try {
        const responseData = await api.post('/vertex/language/evaluate', analyzeData);
        return responseData.data.candidates[0].content.parts[0].text;
    } catch (error) {
        throw error.response?.data || error;
    }
};

/**
 * Analyze contact center skills using Vertex AI
 * @param {Object} params - The analysis parameters
 * @param {string} params.skillId - The ID of the skill to analyze
 * @param {string} params.text - The text to analyze
 * @param {string} [params.audioUrl] - Optional URL of an audio recording
 * @returns {Promise<Object>} - The analysis results
 */
export const analyzeContentCenterSkill = async (analyzeData) => {
    try {
        const responseData = await api.post('/vertex/contactCenter/evaluate', analyzeData);
        return responseData;
    } catch (error) {
        throw error.response?.data || error;
    }
};