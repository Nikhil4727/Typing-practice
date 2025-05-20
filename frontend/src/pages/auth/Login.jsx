
// src/pages/auth/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import getApiBaseUrl from '../../config/apiConfig';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const apiUrl = getApiBaseUrl();
      console.log("Sending login data:", formData);

      const res = await axios.post(`${apiUrl}/api/auth/login`, {
        email: formData.email,
        password: formData.password,
      });

      console.log('Login response:', res.data);

      if (res.data.token) {
        const userData = {
          id: res.data.userId,
          name: res.data.username,
          token: res.data.token,
        };

        login(userData);
        setMessage('Login successful! Redirecting...');
        setTimeout(() => navigate('/'), 1500);
      } else {
        setError('Invalid response from server');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.response) {
        setError(err.response.data.message || 'Login failed');
      } else if (err.request) {
        setError('No response from the server');
      } else {
        setError('Error during request setup');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 text-white font-semibold rounded-md transition ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
        {message && <p className="text-green-600 mt-4 text-center">{message}</p>}
      </div>
    </div>
  );
};

export default Login;
