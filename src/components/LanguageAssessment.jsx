import React, { useState, useRef, useEffect } from 'react';
import { getReadingPassage } from '../utils/languageUtils';
import { analyzeRecordingVertex, uploadRecording } from '../lib/api/vertex';
import OpenAI from 'openai';
import { gapi } from "gapi-script";
import axios from "axios";
//const keys = require('../../qauth2.keys.json');


const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

//console.log("QAuth2 keys : ", keys);

function LanguageAssessment({ language, onComplete }) {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [passage, setPassage] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [previousScores, setPreviousScores] = useState([]);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  useEffect(() => {
    // Load reading passage when component mounts
    try {
      const passageData = getReadingPassage(language);
      setPassage(passageData);
    } catch (error) {
      console.error(error);
    }
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
              }
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
      console.log('assessmentResults :', assessmentResults);
      setResults(assessmentResults);
      console.log('previousScores', previousScores);
      setPreviousScores(prev => [...prev, assessmentResults.overall.score]);
    } catch (error) {
      console.error('Error analyzing recording:', error);
      alert('Error analyzing recording. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  // Analyze recording using veretx : API Google
  const analyzeAudio = async () => {
    setAnalyzing(true);
    try {
      const formData = new FormData();
      // Append the audio blob to FormData
      const file = new File([audioBlob], `audio-${Date.now()}.opus`, { type: "audio/opus" });
      console.log('file :', file);
      formData.append('file', file);
      formData.append('destinationName', `audio-${Date.now()}.opus`);
      const res = await uploadRecording(formData);
      console.log('fileUri blob : ', res);
      const data = {
        "fileUri": res.data.fileUri,
        "textToCompare": passage?.text,
      }
      const response = await analyzeRecordingVertex(data);
      console.log("Deno :", response);
      const assessmentResults = response;
      setResults(assessmentResults);
      setPreviousScores(prev => [...prev, assessmentResults.overall.score]);
    } catch (error) {
      console.error('Error analyzing recording:', error);
      alert('Error analyzing recording. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const showScoreComparison = () => {
    if (previousScores.length <= 1) return null;

    const previousScore = previousScores[previousScores.length - 2];
    const currentScore = previousScores[previousScores.length - 1];
    const difference = currentScore - previousScore;

    return (
      <div className="mt-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Previous attempt:</span>
          <span className="font-medium">{previousScore}/100</span>
          <span className={`${difference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ({difference >= 0 ? '+' : ''}{difference} points)
          </span>
        </div>
      </div>
    );
  };

  const retakeAssessment = () => {
    setAudioBlob(null);
    setResults(null);
    setAttempts(prev => prev + 1);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-semibold text-gray-800">
          {language} Language Assessment
        </h4>
        {attempts > 0 && (
          <span className="text-sm text-gray-500">
            Attempt {attempts + 1}
          </span>
        )}
      </div>

      <div className="space-y-6">
        {/* Reading Passage */}
        <div className="p-6 bg-blue-50 rounded-xl">
          <h5 className="text-lg font-medium text-blue-900 mb-3">Reading Passage</h5>
          <p className="text-blue-800 whitespace-pre-line">{passage?.text}</p>
        </div>

        {/* Recording Controls */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <button
              onClick={recording ? stopRecording : startRecording}
              className={`px-6 py-3 rounded-full font-medium flex items-center gap-2 ${recording
                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                }`}
            >
              {recording ? (
                <>
                  <span className="animate-pulse">⚫</span>
                  Stop Recording
                </>
              ) : (
                <>
                  🎤 Start Recording
                </>
              )}
            </button>
          </div>

          {audioBlob && !analyzing && (
            <div className="flex flex-col items-center gap-4">
              <audio controls src={URL.createObjectURL(audioBlob)} className="w-full max-w-md" />
              <div className="flex gap-4">
                <button
                  onClick={() => setAudioBlob(null)}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Record Again
                </button>
                <button
                  onClick={analyzeAudio}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700"
                >
                  Analyze Recording
                </button>
              </div>
            </div>
          )}

          {analyzing && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Analyzing your language proficiency...</p>
            </div>
          )}
        </div>

        {/* Results Section */}
        {results && (
          <div className="space-y-6">
            {/* Conditionally render the first section based on languageOrTextMismatch */}
            {results.languageOrTextMismatch !== true &&
              Object.entries(results).map(
                ([category, data]) =>
                  category !== 'overall' &&
                  category !== 'languageOrTextMismatch' &&
                  category !== 'languageCheck' && (
                    <div key={category} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h5 className="text-sm font-medium text-gray-700 capitalize">{category}</h5>
                        <span className="text-sm font-semibold text-blue-600">{(data == null) ? 0 : data.score}/100</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                          style={{ width: `${(data == null) ? 0 : data.score}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-600">{(data == null) ? "" : data.feedback}</p>
                    </div>
                  )
              )}

            {/* Overall Assessment Section */}
            <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
              <div className="flex justify-between items-center mb-4">
                <h5 className="text-lg font-semibold text-gray-900">Overall Assessment</h5>
                <span className="text-2xl font-bold text-blue-600">{results.overall.score}/100</span>
              </div>
              <p className="text-gray-800">
                {results.languageOrTextMismatch === true
                  ? results.overall.areasForImprovement
                  : results.overall.strengths}
              </p>
              {showScoreComparison()}
            </div>

            {/* Buttons Section */}
            <div className="flex justify-between">
              <button
                onClick={retakeAssessment}
                className="px-6 py-3 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
              >
                Retake Assessment
              </button>
              <button
                onClick={() => onComplete(results)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 flex items-center gap-2"
              >
                Approve & Continue
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* {results && (
          <div className="space-y-6">
            {Object.entries(results).map(([category, data]) => (
              category !== 'overall' && category !== 'languageCheck' && (
                <div key={category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h5 className="text-sm font-medium text-gray-700 capitalize">{category}</h5>
                    <span className="text-sm font-semibold text-blue-600">{data.score}/100</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                      style={{ width: `${data.score}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600">{data.feedback}</p>
                </div>
              )
            ))}

            <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
              <div className="flex justify-between items-center mb-4">
                <h5 className="text-lg font-semibold text-gray-900">Overall Assessment</h5>
                <span className="text-2xl font-bold text-blue-600">{results.overall.overall}/100</span>
              </div>
              <p className="text-gray-800">{(results.languageOrTextMismatch === true) ? results.overall.strengths : results.overall.areasForImprovement}</p>
              {showScoreComparison()}
            </div>

            <div className="flex justify-between">
              <button
                onClick={retakeAssessment}
                className="px-6 py-3 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
              >
                Retake Assessment
              </button>
              <button
                onClick={() => onComplete(results)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 flex items-center gap-2"
              >
                Approve & Continue
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}

export default LanguageAssessment;