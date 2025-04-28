import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Profile = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalTests: 0,
    averageWpm: 0,
    averageAccuracy: 0,
    bestWpm: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/results/summary', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch user stats', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserStats();
    }
  }, [user]);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Profile</h2>
      
      <div className="mb-6 flex items-center">
        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
          {user?.name?.charAt(0) || user?.email?.charAt(0) || '?'}
        </div>
        <div>
          <p className="text-xl font-semibold">{user?.name || 'User'}</p>
          <p className="text-gray-600">{user?.email}</p>
        </div>
      </div>
      
      <h3 className="text-lg font-medium mb-2">Typing Statistics Summary</h3>
      {loading ? (
        <p>Loading stats...</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-gray-600 text-sm">Total Tests</p>
            <p className="text-xl font-bold">{stats.totalTests}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-gray-600 text-sm">Avg. WPM</p>
            <p className="text-xl font-bold">{stats.averageWpm.toFixed(1)}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-gray-600 text-sm">Avg. Accuracy</p>
            <p className="text-xl font-bold">{stats.averageAccuracy.toFixed(1)}%</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-gray-600 text-sm">Best WPM</p>
            <p className="text-xl font-bold">{stats.bestWpm}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;