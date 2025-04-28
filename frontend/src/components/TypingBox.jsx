// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";

// // Create an axios instance with the correct base URL
// const api = axios.create({
//   baseURL: 'http://localhost:5000'
// });

// const TypingBox = () => {
//   const { user } = useAuth();
//   const [words, setWords] = useState([]);
//   const [typedText, setTypedText] = useState("");
//   const [startTime, setStartTime] = useState(null);
//   const [result, setResult] = useState(null);
//   const [darkMode, setDarkMode] = useState(false);
//   const [isFinished, setIsFinished] = useState(false);
//   const [saveStatus, setSaveStatus] = useState(null); // "success", "error", or null


//   const [content, setContent] = useState('');
//   const [contentType, setContentType] = useState('word');
//   const [difficulty, setDifficulty] = useState('medium');
//   const [wordCount, setWordCount] = useState(15);
//   const [loading, setLoading] = useState(true);
  

//   const fetchWords = async () => {
//     try {
//       const res = await axios.get("/api/words/random");
//       setWords(res.data);
//     } catch (error) {
//       console.error("Failed to load words", error);
//     }
//   };

//   useEffect(() => {
//     fetchWords();
//   }, []);

//   const getTargetSentence = () => {
//     if (!Array.isArray(words)) return "";
//     return words.join(" ");
//   };

//   const handleChange = (e) => {
//     const value = e.target.value;
//     if (!startTime && value.length === 1) {
//       setStartTime(Date.now());
//     }

//     setTypedText(value);

//     // Check if user has typed the complete sentence (may include mistakes)
//     if (value.length === getTargetSentence().length) {
//       calculateResult(value);
//       setIsFinished(true);
//     }
//   };

//   // In the calculateResult function of TypingBox.jsx

// const calculateResult = async (text) => {
//   const endTime = Date.now();
//   const timeTaken = (endTime - startTime) / 60000; // in minutes

//   const wordsTyped = text.trim().split(/\s+/).length;
//   const wpm = Math.round(wordsTyped / timeTaken);

//   let correctChars = 0;
//   const target = getTargetSentence();
//   for (let i = 0; i < text.length && i < target.length; i++) {
//     if (text[i] === target[i]) correctChars++;
//   }
//   const accuracy = Math.round((correctChars / target.length) * 100);

//   const resultData = { 
//     wpm, 
//     accuracy,
//     timeTaken: Math.round(timeTaken * 100) / 100, 
//     text: target,                                
//     date: new Date().toISOString()              
//   };
  
//   setResult(resultData);

//   // Save to DB if logged in
//   if (user && user.token) {
//     try {
//       setSaveStatus("saving");
      
//       // Don't need to add user ID to the payload - it will be extracted from the token
//       console.log('Sending result data:', resultData);

//       const response = await api.post("/api/results/save", resultData, {
//         headers: {
//           Authorization: `Bearer ${user.token}`,
//         },
//       });
      
//       if (response.data.success) {
//         setSaveStatus("success");
//       } else {
//         setSaveStatus("error");
//         console.error("Failed to save result:", response.data.message);
//       }
//     } catch (err) {
//       setSaveStatus("error");
//       console.error("Error saving result:", err);
//       // Log more details about the error
//       if (err.response) {
//         console.error("Response error data:", err.response.data);
//         console.error("Response error status:", err.response.status);
//       }
//     }
//   }

//   setTimeout(() => {
//     setTypedText("");
//     setStartTime(null);
//     setResult(null);
//     setIsFinished(false);
//     setSaveStatus(null);
//     fetchWords();
//   }, 5000);
// };

//   const renderColoredText = () => {
//     const target = getTargetSentence();
//     return target.split("").map((char, i) => {
//       const typedChar = typedText[i];
//       let color = "";

//       if (typedChar == null) {
//         color = darkMode ? "#aaa" : "gray";
//       } else if (typedChar === char) {
//         color = "limegreen";
//       } else {
//         color = "red";
//       }

//       return (
//         <span key={i} style={{ color }}>
//           {char}
//         </span>
//       );
//     });
//   };

//   const renderSaveStatus = () => {
//     if (!user) return <p style={{ color: "orange" }}>Log in to save your results!</p>;
    
//     switch (saveStatus) {
//       case "saving":
//         return <p style={{ color: "blue" }}>Saving your results...</p>;
//       case "success":
//         return <p style={{ color: "green" }}>Results saved successfully!</p>;
//       case "error":
//         return <p style={{ color: "red" }}>Failed to save results. Please try again.</p>;
//       default:
//         return null;
//     }
//   };

//   const fetchContent = async () => {
//     setLoading(true);
//     try {
//       let queryParams = { type: contentType, difficulty };
//       if (contentType === 'word') {
//         queryParams.count = wordCount;
//       }
      
//       const response = await axios.get('http://localhost:5000/api/content', { 
//         params: queryParams 
//       });
      
//       setContent(response.data.text);
//     } catch (error) {
//       console.error('Error fetching content:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchContent();
//   }, [contentType, difficulty, wordCount]);


//   return (
//     <div
//       style={{
//         backgroundColor: darkMode ? "#121212" : "#fff",
//         color: darkMode ? "#fff" : "#000",
//         minHeight: "100vh",
//         padding: "2rem",
//         textAlign: "center",
//         transition: "0.3s",
//       }}
//     >
//       <button
//         onClick={() => setDarkMode(!darkMode)}
//         style={{
//           marginBottom: "1rem",
//           padding: "0.5rem 1rem",
//           cursor: "pointer",
//           backgroundColor: darkMode ? "#333" : "#eee",
//           color: darkMode ? "#fff" : "#000",
//           borderRadius: "5px",
//           border: "none",
//         }}
//       >
//         {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
//       </button>

//       {user && (
//         <div style={{ marginBottom: "1rem" }}>
//           <p>Logged in as: <strong>{user.name}</strong></p>
//         </div>
//       )}

//       <div
//         style={{
//           position: "relative",
//           width: "80%",
//           margin: "0 auto",
//           fontSize: "1.5rem",
//           fontFamily: "monospace",
//           textAlign: "left",
//         }}
//       >
//         <div
//           style={{
//             position: "absolute",
//             width: "100%",
//             top: 0,
//             left: 0,
//             pointerEvents: "none",
//             whiteSpace: "pre-wrap",
//           }}
//         >
//           {renderColoredText()}
//         </div>

//         <textarea
//           value={typedText}
//           onChange={handleChange}
//           rows="3"
//           style={{
//             width: "100%",
//             fontSize: "1.5rem",
//             fontFamily: "monospace",
//             backgroundColor: "transparent",
//             color: "transparent",
//             caretColor: darkMode ? "#0f0" : "#000",
//             border: "none",
//             resize: "none",
//             lineHeight: "2rem",
//             outline: "none",
//           }}
//           autoFocus
//           disabled={isFinished}
//         />
//       </div>

//       {result && (
//         <div style={{ 
//           marginTop: "1rem", 
//           padding: "1rem",
//           backgroundColor: darkMode ? "#333" : "#f5f5f5",
//           borderRadius: "8px",
//           display: "inline-block" 
//         }}>
//           <h3 style={{ marginBottom: "0.5rem" }}>Your Results</h3>
//           <p>
//             <strong>WPM:</strong> {result.wpm}
//           </p>
//           <p>
//             <strong>Accuracy:</strong> {result.accuracy}%
//           </p>
//           <p>
//             <strong>Time:</strong> {result.timeTaken.toFixed(2)} minutes
//           </p>
//           {renderSaveStatus()}
//         </div>
//       )}
//     </div>
//   );
// };

// export default TypingBox;




// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";

// const TypingBox = () => {
//   const { user } = useAuth();
//   const [words, setWords] = useState([]);
//   const [typedText, setTypedText] = useState("");
//   const [startTime, setStartTime] = useState(null);
//   const [result, setResult] = useState(null);
//   const [darkMode, setDarkMode] = useState(false);
//   const [isFinished, setIsFinished] = useState(false);

//   const [contentType, setContentType] = useState('punctuation');
//   const [timeLimit, setTimeLimit] = useState(60);
//   const [timer, setTimer] = useState(60);
//   const [timerActive, setTimerActive] = useState(false);

//   const [showTimeDropdown, setShowTimeDropdown] = useState(false);

//   const fetchWords = async () => {
//     try {
//       const res = await axios.get("/api/words/random");
//       setWords(res.data);
//     } catch (error) {
//       console.error("Failed to load words", error);
//     }
//   };

//   useEffect(() => {
//     fetchWords();
//   }, []);

//   const getTargetSentence = () => {
//     if (!Array.isArray(words)) return "";
//     return words.join(" ");
//   };

//   const handleChange = (e) => {
//     const value = e.target.value;
//     if (!startTime && value.length === 1) {
//       setStartTime(Date.now());
//       setTimerActive(true);
//     }
//     setTypedText(value);

//     if (value.length === getTargetSentence().length) {
//       calculateResult(value);
//       setIsFinished(true);
//       setTimerActive(false);
//     }
//   };

//   const handleTimeChange = (seconds) => {
//     setTimeLimit(seconds);
//     setTimer(seconds);
//     setTimerActive(true);
//     setStartTime(Date.now());
//     setShowTimeDropdown(false); // Close dropdown after selecting
//   };

//   const handleContentTypeChange = (type) => {
//     setContentType(type);
//     fetchWords();
//   };

//   const calculateResult = async (text) => {
//     const endTime = Date.now();
//     const timeTaken = (endTime - startTime) / 60000;

//     const wordsTyped = text.trim().split(/\s+/).length;
//     const wpm = Math.round(wordsTyped / timeTaken);

//     let correctChars = 0;
//     const target = getTargetSentence();
//     for (let i = 0; i < text.length && i < target.length; i++) {
//       if (text[i] === target[i]) correctChars++;
//     }
//     const accuracy = Math.round((correctChars / target.length) * 100);

//     const resultData = {
//       wpm,
//       accuracy,
//       timeTaken: Math.round(timeTaken * 100) / 100,
//       text: target,
//       date: new Date().toISOString()
//     };

//     setResult(resultData);
//     setTimeout(() => resetTest(), 4000);
//   };

//   const resetTest = () => {
//     setTypedText("");
//     setStartTime(null);
//     setResult(null);
//     setIsFinished(false);
//     setTimer(timeLimit);
//     setTimerActive(false);
//     fetchWords();
//   };

//   useEffect(() => {
//     let interval = null;
//     if (timerActive && timer > 0) {
//       interval = setInterval(() => {
//         setTimer((prev) => prev - 1);
//       }, 1000);
//     } else if (timer === 0) {
//       clearInterval(interval);
//       setIsFinished(true);
//       setTimerActive(false);
//       calculateResult(typedText);
//     }
//     return () => clearInterval(interval);
//   }, [timerActive, timer]);

//   const renderColoredText = () => {
//     const target = getTargetSentence();
//     return target.split("").map((char, i) => {
//       const typedChar = typedText[i];
//       let color = "";

//       if (typedChar == null) {
//         color = darkMode ? "#aaa" : "gray";
//       } else if (typedChar === char) {
//         color = "limegreen";
//       } else {
//         color = "red";
//       }

//       return (
//         <span key={i} style={{ color }}>
//           {char}
//         </span>
//       );
//     });
//   };

//   return (
//     <div
//       style={{
//         backgroundColor: darkMode ? "#121212" : "#fff",
//         color: darkMode ? "#fff" : "#000",
//         minHeight: "100vh",
//         padding: "2rem",
//         textAlign: "center",
//         transition: "0.3s",
//       }}
//     >
//       {/* Top Options Row */}
//       <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "2rem" }}>
//         {/* Dark Mode Toggle */}
//         <button
//           onClick={() => setDarkMode(!darkMode)}
//           style={{
//             padding: "0.5rem 1rem",
//             backgroundColor: darkMode ? "#333" : "#eee",
//             color: darkMode ? "#fff" : "#000",
//             borderRadius: "5px",
//             border: "none",
//             cursor: "pointer",
//           }}
//         >
//           {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
//         </button>

//         {/* Content Type Buttons */}
//         {["punctuation", "number", "quote"].map((type) => (
//           <button
//             key={type}
//             onClick={() => handleContentTypeChange(type)}
//             style={{
//               padding: "0.5rem 1rem",
//               backgroundColor: contentType === type ? "#007bff" : "#ccc",
//               color: "#fff",
//               border: "none",
//               borderRadius: "5px",
//               cursor: "pointer",
//             }}
//           >
//             {type.charAt(0).toUpperCase() + type.slice(1)}
//           </button>
//         ))}

//         {/* Time Dropdown */}
//         <div style={{ position: "relative" }}>
//           <button
//             onClick={() => setShowTimeDropdown(!showTimeDropdown)}
//             style={{
//               padding: "0.5rem 1rem",
//               backgroundColor: "#28a745",
//               color: "#fff",
//               border: "none",
//               borderRadius: "5px",
//               cursor: "pointer",
//             }}
//           >
//             ⏱️ {timeLimit}s
//           </button>
//           {showTimeDropdown && (
//             <div style={{
//               position: "absolute",
//               top: "100%",
//               left: 0,
//               backgroundColor: "#fff",
//               border: "1px solid #ccc",
//               borderRadius: "5px",
//               overflow: "hidden",
//               marginTop: "0.5rem",
//               zIndex: 5,
//             }}>
//               {[15, 30, 60, 120].map((time) => (
//                 <div
//                   key={time}
//                   onClick={() => handleTimeChange(time)}
//                   style={{
//                     padding: "0.5rem 1rem",
//                     backgroundColor: "#eee",
//                     borderBottom: "1px solid #ddd",
//                     cursor: "pointer",
//                     color: "#000",
//                   }}
//                 >
//                   {time}s
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Reload Button */}
//         <button
//           onClick={resetTest}
//           style={{
//             padding: "0.5rem 1rem",
//             backgroundColor: "#ff5722",
//             color: "white",
//             border: "none",
//             borderRadius: "5px",
//             cursor: "pointer",
//           }}
//         >
//           🔄 Reload
//         </button>
//       </div>

//       {/* Timer */}
//       {timerActive && (
//         <div style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>
//           ⏱️ {timer}s
//         </div>
//       )}

//       {/* Typing Area */}
//       <div
//         style={{
//           position: "relative",
//           width: "80%",
//           margin: "0 auto",
//           fontSize: "1.5rem",
//           fontFamily: "monospace",
//           textAlign: "left",
//         }}
//       >
//         <div
//           style={{
//             position: "absolute",
//             width: "100%",
//             top: 0,
//             left: 0,
//             pointerEvents: "none",
//             whiteSpace: "pre-wrap",
//           }}
//         >
//           {renderColoredText()}
//         </div>

//         <textarea
//           value={typedText}
//           onChange={handleChange}
//           rows="5"
//           style={{
//             width: "100%",
//             height: "150px",
//             backgroundColor: "transparent",
//             color: darkMode ? "#fff" : "#000",
//             border: "2px solid #ccc",
//             fontSize: "1.5rem",
//             fontFamily: "monospace",
//             resize: "none",
//             padding: "1rem",
//           }}
//           disabled={isFinished}
//         />
//       </div>

//       {/* Result */}
//       {result && (
//         <div style={{ marginTop: "2rem" }}>
//           <h2>Result:</h2>
//           <p>WPM: {result.wpm}</p>
//           <p>Accuracy: {result.accuracy}%</p>
//           <p>Time Taken: {result.timeTaken} minutes</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TypingBox;


import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { fetchWordsWithFallback } from "../services/wordService"; 

const TypingBox = () => {
  const { user } = useAuth();
  const [words, setWords] = useState([]);
  const [typedText, setTypedText] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [result, setResult] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const [contentType, setContentType] = useState('punctuation');
  const [timeLimit, setTimeLimit] = useState(60);
  const [timer, setTimer] = useState(60);
  const [timerActive, setTimerActive] = useState(false);

  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [isFullText, setIsFullText] = useState(false); // Track if we're using a sentence/quote
  const [isLoading, setIsLoading] = useState(true);
  // const fetchWords = async () => {
  //   setIsLoading(true);
  //   try {
  //     const response = await axios.get(`/api/words/random?type=${contentType}`);
  //     const data = response.data;
  
  //     if (data?.fullText) {
  //       // If backend sent full sentence (quote, punctuation, number)
  //       setIsFullText(true);
  //       setWords([data.fullText]);
  //     } else if (Array.isArray(data) && data.length > 0) {
  //       // If backend sent array of words
  //       setIsFullText(false);
  //       setWords(data);
  //     } else {
  //       // Fallback if somehow data is weird
  //       setIsFullText(false);
  //       setWords(["Error loading content"]);
  //       console.warn("Unexpected API response:", data);
  //     }
  //   } catch (error) {
  //     console.error("Failed to fetch words:", error);
  //     setIsFullText(false);
  //     setWords(["Error fetching words"]);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };



  // Import new service

  const fetchWords = async () => {
    setIsLoading(true);
  
    try {
      console.log("Attempting to fetch words from the online API...");
      
      // Try fetching from real online API
      const onlineResponse = await axios.get("https://api.quotable.io/random"); // for full sentences
      console.log("Successfully fetched from online API:", onlineResponse.data);
  
      const data = onlineResponse.data;
  
      if (data?.content) {
        setIsFullText(true);
        setWords([data.content]);
      } else if (Array.isArray(data) && data.length > 0) {
        setIsFullText(false);
        setWords(data);
      } else {
        setIsFullText(false);
        setWords(["Error loading online content"]);
        console.warn("Unexpected data format from online API:", data);
      }
  
    } catch (error) {
      console.error("Failed to fetch from online API:", error);
  
      console.log("Falling back to fetching words from database...");
      const fallbackData = await fetchWordsWithFallback(contentType);
      console.log("Fetched from fallback (database):", fallbackData);
  
      if (fallbackData?.fullText) {
        setIsFullText(true);
        setWords([fallbackData.fullText]);
      } else if (Array.isArray(fallbackData) && fallbackData.length > 0) {
        setIsFullText(false);
        setWords(fallbackData);
      } else {
        setIsFullText(false);
        setWords(["Error loading database content"]);
        console.warn("Unexpected data format from fallback:", fallbackData);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  
  

  useEffect(() => {
    fetchWords();
  }, [contentType]); // Refetch when content type changes

  const getTargetSentence = () => {
    if (isLoading) return "Loading...";
  
    if (!words || (Array.isArray(words) && words.length === 0)) {
      return "No words available, please try again";
    }
  
    if (isFullText) {
      // When fullText is returned from backend
      return words[0] || "";
    }
  
    return words.join(" ");
  };
  

  const handleChange = (e) => {
    const value = e.target.value;
    if (!startTime && value.length === 1) {
      setStartTime(Date.now());
      setTimerActive(true);
    }
    setTypedText(value);

    // Check if the user has finished typing all the text
    const targetText = getTargetSentence();
    if (value.length >= targetText.length) {
      calculateResult(value);
      setIsFinished(true);
      setTimerActive(false);
    }
  };

  const handleTimeChange = (seconds) => {
    setTimeLimit(seconds);
    setTimer(seconds);
    setTimerActive(false); // Reset timer state
    setShowTimeDropdown(false); // Close dropdown after selecting
  };

  const handleContentTypeChange = (type) => {
    setContentType(type);
    resetTest(); // Reset the test when changing content type
  };

  const calculateResult = async (text) => {
    const endTime = Date.now();
    const timeTaken = (endTime - startTime) / 60000;

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

    const resultData = {
      wpm,
      accuracy,
      timeTaken: Math.round(timeTaken * 100) / 100,
      text: target,
      date: new Date().toISOString()
    };

    setResult(resultData);
    
    // Save result to user history if user is logged in
    if (user && user.token) {
      try {
        await axios.post("/api/results/save", resultData, {
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
    fetchWords();
  };

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

  const renderColoredText = () => {
    const target = getTargetSentence();
    console.log("Rendering colored text with target:", target);
    
    if (isLoading) {
      return <span>Loading...</span>;
    }

    return target.split("").map((char, i) => {
      const typedChar = typedText[i];
      let color = "";

      if (typedChar == null) {
        color = darkMode ? "#aaa" : "gray";
      } else if (typedChar === char) {
        color = "limegreen";
      } else {
        color = "red";
      }

      return (
        <span key={i} style={{ color }}>
          {char}
        </span>
      );
    });
  };

  const startTest = () => {
    resetTest();
    setTimerActive(true);
    setStartTime(Date.now());
  };

  return (
    <div
      style={{
        backgroundColor: darkMode ? "#121212" : "#fff",
        color: darkMode ? "#fff" : "#000",
        minHeight: "100vh",
        padding: "2rem",
        textAlign: "center",
        transition: "0.3s",
      }}
    >
      {/* Top Options Row */}
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "2rem" }}>
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: darkMode ? "#333" : "#eee",
            color: darkMode ? "#fff" : "#000",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer",
          }}
        >
          {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
        </button>

        {/* Content Type Buttons */}
        {["punctuation", "number", "quote", "word"].map((type) => (
          <button
            key={type}
            onClick={() => handleContentTypeChange(type)}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: contentType === type ? "#007bff" : (darkMode ? "#333" : "#eee"),
              color: contentType === type ? "#fff" : (darkMode ? "#fff" : "#000"),
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {type === "word" ? "Words" : type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}

        {/* Time Dropdown */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowTimeDropdown(!showTimeDropdown)}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            ⏱️ {timeLimit}s
          </button>
          {showTimeDropdown && (
            <div style={{
              position: "absolute",
              top: "100%",
              left: 0,
              backgroundColor: darkMode ? "#333" : "#fff",
              border: "1px solid #ccc",
              borderRadius: "5px",
              overflow: "hidden",
              marginTop: "0.5rem",
              zIndex: 5,
            }}>
              {[15, 30, 60, 120].map((time) => (
                <div
                  key={time}
                  onClick={() => handleTimeChange(time)}
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: darkMode ? "#444" : "#eee",
                    borderBottom: "1px solid #ddd",
                    cursor: "pointer",
                    color: darkMode ? "#fff" : "#000",
                  }}
                >
                  {time}s
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Start/Reload Button */}
        <button
          onClick={startTest}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: timerActive ? "#ff5722" : "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {timerActive ? "🔄 Restart" : "▶️ Start"}
        </button>
      </div>

      {/* Timer */}
      {timerActive && (
        <div style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>
          ⏱️ {timer}s
        </div>
      )}

      {/* Typing Area */}
      <div
        style={{
          position: "relative",
          width: "80%",
          margin: "0 auto",
          fontSize: "1.5rem",
          fontFamily: "monospace",
          textAlign: "left",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "100%",
            top: 0,
            left: 0,
            pointerEvents: "none",
            whiteSpace: "pre-wrap",
            padding: "1rem",
          }}
        >
          {isLoading ? (
            <span style={{ color: darkMode ? "#aaa" : "gray" }}>Loading...</span>
          ) : (
            renderColoredText()
          )}
        </div>

        <textarea
          value={typedText}
          onChange={handleChange}
          rows={isFullText ? "8" : "5"} // More rows for sentences/quotes
          style={{
            width: "100%",
            height: isFullText ? "200px" : "150px",
            backgroundColor: "transparent",
            color: "transparent",
            caretColor: darkMode ? "#fff" : "#000",
            border: "2px solid #ccc",
            fontSize: "1.5rem",
            fontFamily: "monospace",
            resize: "none",
            padding: "1rem",
          }}
          disabled={isFinished || isLoading}
          autoFocus
        />
      </div>

      {/* Result */}
      {result && (
        <div style={{ 
          marginTop: "2rem", 
          padding: "1rem", 
          backgroundColor: darkMode ? "#222" : "#f5f5f5",
          borderRadius: "10px",
          maxWidth: "600px",
          margin: "2rem auto"
        }}>
          <h2 style={{ marginBottom: "1rem" }}>Result:</h2>
          <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap" }}>
            <div>
              <h3 style={{ fontSize: "2rem", margin: "0" }}>{result.wpm}</h3>
              <p>WPM</p>
            </div>
            <div>
              <h3 style={{ fontSize: "2rem", margin: "0" }}>{result.accuracy}%</h3>
              <p>Accuracy</p>
            </div>
            <div>
              <h3 style={{ fontSize: "2rem", margin: "0" }}>{Math.round(result.timeTaken * 60)}s</h3>
              <p>Time Taken</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TypingBox;