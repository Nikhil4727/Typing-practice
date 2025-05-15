// // src/services/wordService.ts
// import axios from "axios";

// export async function fetchWordsWithFallback(contentType: string) {
//   try {
//     let externalUrl = "";

//     if (contentType === "quote") {
//       externalUrl = "https://api.quotable.io/random";
//     } else if (contentType === "word") {
//       externalUrl = "https://random-word-api.herokuapp.com/word?number=20";
//     }
//     // For number/punctuation, we can fallback directly (no good external API available)
    
//     if (externalUrl) {
//       const externalRes = await axios.get(externalUrl);

//       if (contentType === "quote") {
//         return { fullText: externalRes.data.content }; // API returns { content: "..." }
//       } else if (contentType === "word") {
//         return externalRes.data; // Already an array
//       }
//     }
//   } catch (error) {
//     console.error("External API failed, using internal database instead", error);
//   }

//   // Fallback: Internal backend API
//   try {
//     const internalRes = await axios.get(`/api/words/random?type=${contentType}`);
//     return internalRes.data;
//   } catch (internalError) {
//     console.error("Internal API also failed", internalError);
//     return ["Failed to load content"];
//   }
// }



// src/services/wordService.ts
import axios from "axios";
import getApiBaseUrl from "../config/apiConfig";

export async function fetchWordsWithFallback(contentType: string) {
  try {
    let externalUrl = "";

    // Use HTTPS for all external APIs to avoid mixed content issues
    if (contentType === "quote") {
      externalUrl = "https://api.quotable.io/random";
    } else if (contentType === "word") {
      externalUrl = "https://random-word-api.herokuapp.com/word?number=20";
    } else if (contentType === "sentence") {
      // Use HTTPS version instead of HTTP
      externalUrl = "https://metaphorpsum.com/sentences/5";
    } else if (contentType === "punctuation") {
      externalUrl = "https://baconipsum.com/api/?type=meat-and-filler&sentences=3";
    }
    // For number/punctuation, we can fallback directly if not handled above
    
    if (externalUrl) {
      try {
        const externalRes = await axios.get(externalUrl);

        if (contentType === "quote") {
          return { fullText: externalRes.data.content }; // API returns { content: "..." }
        } else if (contentType === "word") {
          return externalRes.data; // Already an array
        } else if (contentType === "sentence") {
          return { fullText: externalRes.data };
        } else if (contentType === "punctuation") {
          return { fullText: Array.isArray(externalRes.data) ? externalRes.data.join(" ") : externalRes.data };
        }
      } catch (apiError) {
        console.error(`Error with ${contentType} API:`, apiError);
        // Continue to fallback if external API fails
      }
    }
  } catch (error) {
    console.error("External API failed, using internal database instead", error);
  }

  // Fallback: Internal backend API
  try {
    const apiBaseUrl = getApiBaseUrl();
    const internalRes = await axios.get(`${apiBaseUrl}/api/words/random?type=${contentType}`);
    return internalRes.data;
  } catch (internalError) {
    console.error("Internal API also failed", internalError);
    return contentType === "sentence" || contentType === "punctuation" 
      ? { fullText: "Failed to load content. Please try again." }
      : ["Failed to load content"];
  }
}