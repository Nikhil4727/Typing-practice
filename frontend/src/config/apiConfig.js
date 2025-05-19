// config/apiConfig.js

const getApiBaseUrl = () => {
  // Check if we're in development or production
  const isDev = process.env.NODE_ENV !== 'production';
  
  // Use localhost URL in development, deployed URL in production
  return isDev 
    ? 'http://localhost:5000' 
    : 'https://typing-practice-1.onrender.com'; // Replace with your actual backend URL when deployed
};

export default getApiBaseUrl;