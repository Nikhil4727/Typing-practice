// import React from 'react';
// import { Link } from 'react-router-dom';

// const Navbar = () => {
//   return (
//     <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
//       <div className="text-xl font-bold">Typing Speed App</div>
//       <div className="space-x-4">
//         <Link to="/" className="hover:underline">Home</Link>
//         <Link to="/register" className="hover:underline">Register</Link>
//         <Link to="/login" className="hover:underline">Login</Link>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// const Navbar = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate('/');
//   };

//   return (
//     <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
//       <div className="text-xl font-bold">Typing Speed Master</div>
//       <div className="space-x-4">
//         <Link to="/" className="hover:underline">Practice</Link>
        
//         {user ? (
//           <>
//             <Link to="/dashboard" className="hover:underline">Dashboard</Link>
//             <button 
//               onClick={handleLogout}
//               className="hover:underline bg-transparent border-none text-white cursor-pointer"
//             >
//               Logout
//             </button>
//             <span className="ml-2 text-blue-200">Hi, {user.name}</span>
//           </>
//         ) : (
//           <>
//             <Link to="/register" className="hover:underline">Register</Link>
//             <Link to="/login" className="hover:underline">Login</Link>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


// components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user,loading, logout } = useAuth();
  if (loading) {
    return <div>Loading...</div>;
  }
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
      <div className="text-xl font-bold">Typing Speed Master</div>
      <div className="flex items-center space-x-4 relative">
        <Link to="/" className="hover:underline">Practice</Link>
        
        {user ? (
          <div className="flex items-center">
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-1 hover:underline focus:outline-none"
              >
                <span className="hidden md:inline">Hi, {user.name || user.email}</span>
                <svg 
                  className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <Link 
                    to="/profile" 
                    className="block px-4 py-2 text-gray-800 hover:bg-blue-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link 
                    to="/stats" 
                    className="block px-4 py-2 text-gray-800 hover:bg-blue-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    My Stats
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <Link to="/register" className="hover:underline">Register</Link>
            <Link to="/login" className="hover:underline">Login</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;