import axios from "axios";
import getApiBaseUrl from "../config/apiConfig";

export async function fetchWordsWithFallback(contentType) {
  const apiBaseUrl = getApiBaseUrl();

  try {
    const res = await axios.get(`${apiBaseUrl}/api/words/random?type=${contentType}`);
    return res.data;
  } catch (error) {
    console.error("❌ Failed to fetch from internal MongoDB:", error);
    return contentType === "sentence" || contentType === "punctuation"
      ? { fullText: "Error loading content" }
      : ["Error loading content"];
  }
}
