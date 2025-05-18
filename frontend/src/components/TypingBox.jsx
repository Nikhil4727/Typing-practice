import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { fetchWordsWithFallback } from "../services/wordService";
import getApiBaseUrl from "../config/apiConfig";

const TypingBox = ({ darkMode, setDarkMode }) => {
  const { user } = useAuth();
  const [words, setWords] = useState([]);
  const [typedText, setTypedText] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [result, setResult] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

  const [contentType, setContentType] = useState('word');
  const [timeLimit, setTimeLimit] = useState(60);
  const [timer, setTimer] = useState(60);
  const [timerActive, setTimerActive] = useState(false);
  const [timerDropdownOpen, setTimerDropdownOpen] = useState(false);
  const [timerMode, setTimerMode] = useState(false); // New state for timer option
  
  const [isFullText, setIsFullText] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentProgress, setCurrentProgress] = useState(0);

  // Fetch words function
  const fetchWords = async () => {
    setIsLoading(true);
    try {
      console.log(`Fetching ${contentType} content...`);
      
      let apiUrl = "";
      
      // Use HTTPS for all external APIs to avoid mixed content issues
      if (contentType === "word") {
        apiUrl = "https://random-word-api.vercel.app/api?words=20";
      } else if (contentType === "sentence") {
        apiUrl = "https://metaphorpsum.com/sentences/5"; // Changed to HTTPS
      } else if (contentType === "punctuation") {
        apiUrl = "https://baconipsum.com/api/?type=meat-and-filler&sentences=3";
      } else if (contentType === "number") {
        apiUrl = "https://random-word-api.herokuapp.com/word?number=10";
      }
      
      const response = await axios.get(apiUrl);
      
      if (contentType === "sentence") {
        setIsFullText(true);
        setWords([response.data]);
      } else if (contentType === "punctuation") {
        setIsFullText(true);
        setWords([response.data.join(" ")]);
      } else if (contentType === "number") {
        const numberWords = response.data.map(word => word + Math.floor(Math.random() * 1000));
        setIsFullText(false);
        setWords(numberWords);
      } else if (contentType === "word") {
        setIsFullText(false);
        setWords(response.data);
      }
      
    } catch (error) {
      console.error("Failed to fetch from online API:", error);
      
      console.log("Using fallback data source...");
      const fallbackData = await fetchWordsWithFallback(contentType);
      
      if (fallbackData?.fullText) {
        setIsFullText(true);
        setWords([fallbackData.fullText]);
      } else if (Array.isArray(fallbackData) && fallbackData.length > 0) {
        setIsFullText(false);
        setWords(fallbackData);
      } else {
        setIsFullText(false);
        setWords(["Error loading content"]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWords();
  }, [contentType]);

  const getTargetSentence = () => {
    if (isLoading) return "Loading...";
    
    if (!words || (Array.isArray(words) && words.length === 0)) {
      return "No words available, please try again";
    }
    
    if (isFullText) {
      return words[0] || "";
    }
    
    return words.join(" ");
  };

  const handleChange = (e) => {
    const value = e.target.value;
    if (!startTime && value.length === 1) {
      setStartTime(Date.now());
      // Only start timer if timer mode is active
      if (timerMode) {
        setTimerActive(true);
      }
    }
    setTypedText(value);
    
    // Update progress percentage
    const targetText = getTargetSentence();
    const progress = Math.min(100, Math.round((value.length / targetText.length) * 100));
    setCurrentProgress(progress);

    // Check if user has finished typing
    if (value.length >= targetText.length) {
      calculateResult(value);
      setIsFinished(true);
      setTimerActive(false);
    }
  };

  // Calculate typing results
  const calculateResult = async (text) => {
    const endTime = Date.now();
    const timeTaken = (endTime - startTime) / 60000; // minutes
    const target = getTargetSentence();
    
    // Calculate WPM based on standard 5 characters per word
    const standardWordCount = text.length / 5;
    const wpm = Math.round(standardWordCount / timeTaken);

    // Calculate accuracy
    let correctChars = 0;
    for (let i = 0; i < text.length && i < target.length; i++) {
      if (text[i] === target[i]) correctChars++;
    }
    const accuracy = Math.round((correctChars / target.length) * 100);

    // Calculate characters per second
    const cps = Math.round((text.length / (timeTaken * 60)) * 10) / 10;

    const resultData = {
      wpm,
      accuracy,
      cps,
      timeTaken: Math.round(timeTaken * 100) / 100,
      text: target,
      date: new Date().toISOString()
    };

    setResult(resultData);
    
    // Save result if user is logged in
    if (user && user.token) {
      try {
        const apiBaseUrl = getApiBaseUrl();
        await axios.post(`${apiBaseUrl}/api/results/save`, resultData, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        console.log("Result saved successfully!");
      } catch (error) {
        console.error("Failed to save result", error);
      }
    }
  };

  const resetTest = () => {
    setTypedText("");
    setStartTime(null);
    setResult(null);
    setIsFinished(false);
    setTimer(timeLimit);
    setTimerActive(false);
    setCurrentProgress(0);
    fetchWords();
  };

  const startTest = () => {
    resetTest();
    // Only activate timer if timer mode is enabled
    if (timerMode) {
      setTimerActive(true);
    }
    setStartTime(Date.now());
  };

  // Handle timer countdown
  useEffect(() => {
    let interval = null;
    if (timerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timerActive && timer === 0) {
      clearInterval(interval);
      setIsFinished(true);
      setTimerActive(false);
      calculateResult(typedText);
    }
    return () => clearInterval(interval);
  }, [timerActive, timer]);

  // Format timer display
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  // Render colored text for typing display
  const renderColoredText = () => {
    const target = getTargetSentence();
    
    if (isLoading) {
      return <span>Loading...</span>;
    }

    return target.split("").map((char, i) => {
      const typedChar = typedText[i];
      let color = "";

      if (typedChar == null) {
        color = darkMode ? "#aaa" : "#666";
      } else if (typedChar === char) {
        color = "#4ade80"; // green-400
      } else {
        color = "#f87171"; // red-400
      }

      return (
        <span key={i} style={{ color }}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Top Controls */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
          {/* Content Type Buttons */}
          <div className="flex rounded-lg overflow-hidden">
            {["word", "sentence", "number", "punctuation", "timer"].map((type) => (
              <button
                key={type}
                onClick={() => {
                  if (type === "timer") {
                    setTimerMode(!timerMode);
                  } else {
                    setContentType(type);
                    if (timerMode && type !== "timer") {
                      setTimerActive(false);
                    }
                  }
                }}
                className={`px-4 py-2 transition-colors ${
                  (type === "timer" && timerMode) || (type !== "timer" && contentType === type)
                    ? 'bg-blue-600 text-white'
                    : darkMode 
                      ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {type === "timer" ? "Timer" : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
          
          {/* Timer Dropdown - Only show when timer mode is active */}
          {timerMode && (
            <div className="relative">
              <button
                onClick={() => setTimerDropdownOpen(!timerDropdownOpen)}
                className={`px-4 py-2 rounded-lg flex items-center gap-1 ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                ⏱️ {timeLimit}s
                <svg 
                  className={`w-4 h-4 ml-1 transition-transform ${timerDropdownOpen ? 'transform rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {timerDropdownOpen && (
                <div className={`absolute top-full left-0 mt-1 w-32 rounded-lg overflow-hidden shadow-lg z-10 ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                }`}>
                  {[15, 30, 60, 120].map((time) => (
                    <button
                      key={time}
                      onClick={() => {
                        setTimeLimit(time);
                        setTimer(time);
                        setTimerDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left ${
                        timeLimit === time
                          ? 'bg-blue-600 text-white'
                          : darkMode 
                            ? 'hover:bg-gray-700' 
                            : 'hover:bg-gray-100'
                      }`}
                    >
                      {time}s
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Start/Restart Button */}
          <button
            onClick={startTest}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              timerActive
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {timerActive ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Restart
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Start
              </>
            )}
          </button>
        </div>
        
        {/* Timer Display - Only show when timer mode is active and timer is running */}
        {timerMode && timerActive && (
          <div className="mb-6 flex justify-center">
            <div className={`text-3xl font-bold px-6 py-2 rounded-full ${
              timer <= 10 
                ? 'bg-red-500 text-white animate-pulse' 
                : darkMode 
                  ? 'bg-gray-800' 
                  : 'bg-gray-200'
            }`}>
              {formatTimer(timer)}
            </div>
          </div>
        )}
        
        {/* Progress Bar */}
        <div className="w-full max-w-3xl mx-auto mb-4">
          <div className={`h-2 rounded-full overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
            <div 
              className="h-full bg-blue-500 transition-all duration-300" 
              style={{ width: `${currentProgress}%` }}
            ></div>
          </div>
        </div>
        
        {/* Typing Area */}
        <div className={`relative w-full max-w-3xl mx-auto rounded-lg overflow-hidden ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-300'
        } shadow-lg`}>
          {/* Text to type */}
          <div className="absolute inset-0 p-6 font-mono text-lg pointer-events-none whitespace-pre-wrap">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              renderColoredText()
            )}
          </div>
          
          {/* Text input */}
          <textarea
            value={typedText}
            onChange={handleChange}
            disabled={isFinished || isLoading}
            className={`w-full p-6 font-mono text-lg resize-none outline-none ${
              darkMode ? 'bg-gray-800 caret-green-400' : 'bg-white caret-blue-600'
            } text-transparent`}
            rows={isFullText ? 8 : 5}
            autoFocus
          />
        </div>
        
        {/* Results */}
        {result && (
          <div className={`mt-10 max-w-xl mx-auto rounded-lg overflow-hidden shadow-lg ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6 text-center">Your Results</h2>
              
              <div className="grid grid-cols-3 gap-4">
                {/* WPM */}
                <div className="text-center">
                  <div className={`text-4xl font-bold ${
                    result.wpm > 60 ? 'text-green-500' : result.wpm > 40 ? 'text-blue-500' : 'text-orange-500'
                  }`}>
                    {result.wpm}
                  </div>
                  <div className="text-sm mt-1 opacity-70">WPM</div>
                </div>
                
                {/* Accuracy */}
                <div className="text-center">
                  <div className={`text-4xl font-bold ${
                    result.accuracy > 95 ? 'text-green-500' : result.accuracy > 85 ? 'text-blue-500' : 'text-orange-500'
                  }`}>
                    {result.accuracy}%
                  </div>
                  <div className="text-sm mt-1 opacity-70">Accuracy</div>
                </div>
                
                {/* Time */}
                <div className="text-center">
                  <div className="text-4xl font-bold">
                    {Math.round(result.timeTaken * 60)}s
                  </div>
                  <div className="text-sm mt-1 opacity-70">Time</div>
                </div>
              </div>
              
              {/* CPS */}
              <div className="mt-6 text-center">
                <div className="text-xl">
                  <span className="opacity-70">Characters per second:</span> <span className="font-bold">{result.cps}</span>
                </div>
              </div>
              
              {/* Try Again Button */}
              <div className="mt-6 text-center">
                <button
                  onClick={resetTest}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
              
              {/* Login reminder */}
              {!user && (
                <div className="mt-6 text-center text-sm p-2 rounded bg-yellow-100 text-yellow-800">
                  <p>Log in to save your results and track your progress!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TypingBox;