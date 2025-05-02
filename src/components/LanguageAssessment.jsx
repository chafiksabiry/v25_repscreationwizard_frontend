import React, { useState, useRef, useEffect } from 'react';
import { getPassage } from '../utils/passageManager';
import { analyzeRecordingVertex, uploadRecording } from '../lib/api/vertex';
import OpenAI from 'openai';
import { useProfile } from '../hooks/useProfile';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

function LanguageAssessment({ language, onComplete, onExit }) {
  const { profile, loading: profileLoading, error: profileError, updateLanguageAssessment } = useProfile();
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [passage, setPassage] = useState(null);
  const [passageError, setPassageError] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [previousScores, setPreviousScores] = useState([]);
  const [languageCode, setLanguageCode] = useState(null);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  useEffect(() => {
    // Load reading passage when component mounts
    const loadPassage = async () => {
      try {
        setIsTranslating(true);
        setPassageError(null);
        const passageData = await getPassage(language);
        setPassage(passageData);
        setLanguageCode(passageData.code);
      } catch (error) {
        console.error('Error loading passage:', error);
        setPassageError(error.message);
        setPassage(null);
      } finally {
        setIsTranslating(false);
      }
    };

    loadPassage();
  }, [language]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
      };

      mediaRecorder.current.start();
      setRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please ensure you have granted permission.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.stop();
      setRecording(false);
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const analyzeRecording = async () => {
    setAnalyzing(true);
    try {
      // Simulate AI analysis with GPT-3
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a language assessment expert. Analyze the following reading passage and provide a detailed assessment with scores and feedback in the following JSON format:
            {
              "pronunciation": {
                "score": number (1-10),
                "feedback": "string"
              },
              "fluency": {
                "score": number (1-10),
                "feedback": "string"
              },
              "comprehension": {
                "score": number (1-10),
                "feedback": "string"
              },
              "vocabulary": {
                "score": number (1-10),
                "feedback": "string"
              },
              "overall": {
                "score": number (1-100),
                "feedback": "string"
              },
              "language_code": "string"
            }`
          },
          {
            role: "user",
            content: `Reading passage: ${passage.text}\nSimulate assessment for ${language} language proficiency.`
          }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      });

      const assessmentResults = JSON.parse(response.choices[0].message.content);
      // Add language code to results
      assessmentResults.language_code = languageCode;
      console.log('assessmentResults :', assessmentResults);
      setResults(assessmentResults);
      console.log('previousScores', previousScores);
      setPreviousScores(prev => [...prev, assessmentResults.overall.score]);

      // Increment attempts
      setAttempts(prev => prev + 1);
    } catch (error) {
      console.error('Error analyzing recording:', error);
      alert('Error analyzing recording. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  // Analyze recording using vertex : API Google
  const analyzeAudio = async () => {
    setAnalyzing(true);
    try {
      const formData = new FormData();
      // Append the audio blob to FormData
      const file = new File([audioBlob], `audio-${Date.now()}.opus`, { type: "audio/opus" });
      console.log('file :', file);
      formData.append('file', file);
      formData.append('destinationName', `audio-${Date.now()}.opus`);
      
      // Use the updated uploadRecording function
      const uploadResponse = await uploadRecording(formData);
      console.log('Upload response:', uploadResponse);
      
      // Get the file URI from the response
      const fileUri = uploadResponse.data.fileUri;
      
      // Prepare data for vertex analysis
      const analysisData = {
        "fileUri": fileUri,
        "textToCompare": passage?.text,
        "language": language
      };
      
      // Use the updated analyzeRecordingVertex function
      const vertexResponse = await analyzeRecordingVertex(analysisData);
      console.log("Vertex response:", vertexResponse);
      
      // Keep the original Vertex response format
      // Only add language_code if it doesn't exist
      if (!vertexResponse.language_code) {
        vertexResponse.language_code = languageCode;
      }
      
      // Set results to the original Vertex response
      setResults(vertexResponse);
      
      // Store the overall score for comparison if it exists
      if (vertexResponse.overall && vertexResponse.overall.score !== undefined) {
        setPreviousScores(prev => [...prev, vertexResponse.overall.score]);
      }
      
      // Increment attempts
      setAttempts(prev => prev + 1);
    } catch (error) {
      console.error('Error analyzing recording with Vertex API:', error);
      
      // Fallback to OpenAI if Vertex API fails
      try {
        console.log('Attempting to fallback to OpenAI analysis...');
        await analyzeRecording();
      } catch (fallbackError) {
        console.error('Fallback analysis also failed:', fallbackError);
        alert('Error analyzing recording. Please try again.');
      }
    } finally {
      setAnalyzing(false);
    }
  };

  const mapScoreToCEFR = (score) => {
    if (score >= 95) return 'C2';
    if (score >= 80) return 'C1';
    if (score >= 65) return 'B2';
    if (score >= 50) return 'B1';
    if (score >= 35) return 'A2';
    return 'A1';
  };

  const showScoreComparison = () => {
    if (previousScores.length <= 1) return null;

    const lastScore = previousScores[previousScores.length - 1];
    const previousScore = previousScores[previousScores.length - 2];
    const difference = lastScore - previousScore;
    const isImprovement = difference > 0;

    return (
      <div className={`mt-4 p-3 rounded-lg ${isImprovement ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
        <p className="font-medium">
          {isImprovement
            ? `Improvement: +${difference.toFixed(1)} points from your previous attempt!`
            : `This attempt: ${difference.toFixed(1)} points difference from previous.`}
        </p>
      </div>
    );
  };

  const retakeAssessment = () => {
    setAudioBlob(null);
    setResults(null);
    // Don't reset previousScores or attempts - we want to track these
  };

  const completeAssessment = () => {
    if (results && onComplete) {
      onComplete(results);
    }
  };

  const handleExit = () => {
    if (onExit) {
      onExit();
    }
  };

  // If still loading passage translation
  if (isTranslating) {
    return (
      <div className="text-center py-12">
        <div className="animate-pulse mb-4">
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
        <p className="text-gray-600">Preparing {language} assessment...</p>
      </div>
    );
  }

  // If there was an error loading the passage
  if (passageError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <h3 className="text-red-600 text-lg font-semibold mb-2">Error Loading Assessment</h3>
        <p className="text-gray-700 mb-4">{passageError}</p>
        <button
          onClick={handleExit}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div>
      {!results ? (
        // Assessment taking UI
        <>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {passage?.title}
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Read the following passage aloud in {language}. Click "Start Recording" when ready.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-gray-800 leading-relaxed">{passage?.text}</p>
            </div>
          </div>

          <div className="flex flex-col items-center mb-6">
            {!audioBlob ? (
              <button
                onClick={recording ? stopRecording : startRecording}
                className={`px-6 py-3 rounded-full text-white font-medium flex items-center ${recording ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                disabled={isTranslating}
              >
                {recording ? (
                  <>
                    <span className="h-3 w-3 rounded-full bg-white animate-pulse mr-2"></span>
                    Stop Recording
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2a2 2 0 00-2 2v6a2 2 0 104 0V4a2 2 0 00-2-2z" />
                      <path d="M14 8a1 1 0 00-2 0v2a2 2 0 01-2 2 2 2 0 01-2-2V8a1 1 0 10-2 0v2a4 4 0 004 4h.5a.5.5 0 01.5.5v.5h-2a1 1 0 100 2h6a1 1 0 100-2h-2v-.5a.5.5 0 01.5-.5h.5a4 4 0 004-4V8a1 1 0 00-2 0z" />
                    </svg>
                    Start Recording
                  </>
                )}
              </button>
            ) : (
              <div className="space-y-4 w-full">
                <div className="flex justify-center">
                  <audio controls src={URL.createObjectURL(audioBlob)} className="w-full max-w-md"></audio>
                </div>
                <div className="flex justify-center space-x-3">
                  <button
                    onClick={() => setAudioBlob(null)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Record Again
                  </button>
                  <button
                    onClick={analyzeAudio}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    disabled={analyzing}
                  >
                    {analyzing ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analyzing...
                      </span>
                    ) : (
                      'Submit Recording'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="text-center">
            <button
              onClick={handleExit}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Exit Assessment
            </button>
          </div>
        </>
      ) : (
        // Results display UI
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-blue-50 text-blue-600 mb-4">
              <span className="text-4xl font-bold">{results.overall?.score || 0}</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              {results.overall?.score >= 70 ? 'Great job!' : 'Good effort!'}
            </h2>
            <p className="text-gray-600">
              Your CEFR level: <span className="font-semibold">{mapScoreToCEFR(results.overall?.score || 0)}</span>
            </p>
            {showScoreComparison()}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-800 mb-2">Completeness</h3>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Score</span>
                <span className="font-bold text-blue-600">{results.completeness?.score || 0}/100</span>
              </div>
              <p className="text-sm text-gray-700">{results.completeness?.feedback || "No completeness assessment available"}</p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-800 mb-2">Fluency</h3>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Score</span>
                <span className="font-bold text-blue-600">{results.fluency?.score || 0}/100</span>
              </div>
              <p className="text-sm text-gray-700">{results.fluency?.feedback || "No fluency assessment available"}</p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-800 mb-2">Proficiency</h3>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Score</span>
                <span className="font-bold text-blue-600">{results.proficiency?.score || 0}/100</span>
              </div>
              <p className="text-sm text-gray-700">{results.proficiency?.feedback || "No proficiency assessment available"}</p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200 col-span-1">
              <h3 className="font-medium text-gray-800 mb-2">Language Match</h3>
              <p className="text-sm text-gray-700">
                {results.languageOrTextMismatch 
                  ? "The language spoken doesn't match the expected language or the text was not read correctly."
                  : "The language spoken matches the expected language."}
              </p>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-2">Overall Assessment</h3>
            <div className="space-y-2">
              {results.overall?.areasForImprovement && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Areas for Improvement:</h4>
                  <p className="text-gray-700">{results.overall.areasForImprovement}</p>
                </div>
              )}
              {results.overall?.strengths && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Strengths:</h4>
                  <p className="text-gray-700">{results.overall.strengths}</p>
                </div>
              )}
              {!results.overall?.areasForImprovement && !results.overall?.strengths && (
                <p className="text-gray-700">No detailed assessment available.</p>
              )}
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={retakeAssessment}
              className="px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Retake Assessment
            </button>

            <div className="space-x-3">
              <button
                onClick={handleExit}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Exit
              </button>

              <button
                onClick={completeAssessment}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Save Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LanguageAssessment;