// src/services/wordService.ts
import axios from "axios";

export async function fetchWordsWithFallback(contentType: string) {
  try {
    let externalUrl = "";

    if (contentType === "quote") {
      externalUrl = "https://api.quotable.io/random";
    } else if (contentType === "word") {
      externalUrl = "https://random-word-api.herokuapp.com/word?number=20";
    }
    // For number/punctuation, we can fallback directly (no good external API available)
    
    if (externalUrl) {
      const externalRes = await axios.get(externalUrl);

      if (contentType === "quote") {
        return { fullText: externalRes.data.content }; // API returns { content: "..." }
      } else if (contentType === "word") {
        return externalRes.data; // Already an array
      }
    }
  } catch (error) {
    console.error("External API failed, using internal database instead", error);
  }

  // Fallback: Internal backend API
  try {
    const internalRes = await axios.get(`/api/words/random?type=${contentType}`);
    return internalRes.data;
  } catch (internalError) {
    console.error("Internal API also failed", internalError);
    return ["Failed to load content"];
  }
}
