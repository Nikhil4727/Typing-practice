// import React, { useState } from 'react';
// import axios from 'axios';

// const Login = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [message, setMessage] = useState('');

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setMessage('');
//     setLoading(true);

//     try {
//       const res = await axios.post('http://localhost:5000/api/auth/login', {
//         email: formData.email,
//         password: formData.password,
//       });

//       setMessage(`Login successful! Welcome ${res.data.username}`);
//       // Optionally: save token in localStorage/sessionStorage if using auth token
//       // localStorage.setItem('token', res.data.token);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Login failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-md rounded-lg">
//       <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           required
//           value={formData.email}
//           onChange={handleChange}
//           className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           required
//           value={formData.password}
//           onChange={handleChange}
//           className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />

//         <button
//           type="submit"
//           disabled={loading}
//           className={`w-full py-2 text-white font-semibold rounded-md ${
//             loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
//           }`}
//         >
//           {loading ? 'Logging in...' : 'Login'}
//         </button>
//       </form>

//       {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
//       {message && <p className="text-green-600 mt-4 text-center">{message}</p>}
//     </div>
//   );
// };

// export default Login;



// pages/auth/Login.js








// import React, { useState } from 'react';
// import axios from 'axios';
// import { useAuth } from '../../context/AuthContext';
// import { useNavigate } from 'react-router-dom';

// const Login = () => {
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [message, setMessage] = useState('');

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setMessage('');
//     setLoading(true);
  
//     try {
//       const res = await axios.post('http://localhost:5000/api/auth/login', {
//         email: formData.email,
//         password: formData.password,
//       });
  
//       console.log('Login response:', res.data); // Keep this for debugging
  
//       if (res.data.userId) {  // Check for userId instead of user object
//         // Create user object from response
//         const userData = {
//           id: res.data.userId,
//           name: res.data.username,
//           token: res.data.token
//           // Add other required user fields
//         };
        
//         login(userData);
//         setMessage('Login successful! Redirecting...');
//         setTimeout(() => navigate('/'), 1500);
//       } else {
//         setError('Invalid response from server');
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || err.message || 'Login failed');
//     } finally {
//       setLoading(false);
//     }
//   };
//   return (
//     <div className="max-w-md mx-auto mt-20 p-6 bg-red shadow-md rounded-lg">
//       <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           required
//           value={formData.email}
//           onChange={handleChange}
//           className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           required
//           value={formData.password}
//           onChange={handleChange}
//           className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />

//         <button
//           type="submit"
//           disabled={loading}
//           className={`w-full py-2 text-white font-semibold rounded-md ${
//             loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
//           }`}
//         >
//           {loading ? 'Logging in...' : 'Login'}
//         </button>
//       </form>

//       {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
//       {message && <p className="text-green-600 mt-4 text-center">{message}</p>}
//     </div>
//   );
// };

// export default Login;











// pages/auth/Login.js
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
    console.log("Sending login data:", formData); // Log formData instead

    const res = await axios.post(`${apiUrl}/api/auth/login`, {
      email: formData.email, // Access email from formData
      password: formData.password, // Access password from formData
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
      // Server returned an error response
      setError(err.response.data.message || 'Login failed');
    } else if (err.request) {
      // No response received from the server
      setError('No response from the server');
    } else {
      // General Axios error
      setError('Error during request setup');
    }
  } finally {
    setLoading(false);
  }
};


  
  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          value={formData.password}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 text-white font-semibold rounded-md ${
            loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
      {message && <p className="text-green-600 mt-4 text-center">{message}</p>}
    </div>
  );
};

export default Login;