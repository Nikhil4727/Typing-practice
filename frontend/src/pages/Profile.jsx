import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Profile = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalTests: 0,
    avgWpm: 0,
    avgAccuracy: 0,
    bestWpm: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const res = await axios.get('https://typing-practice-1.onrender.com/api/results/stats', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setStats(res.data.stats || res.data);
      } catch (err) {
        console.error('Failed to fetch user stats', err);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.token) {
      fetchUserStats();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800 dark:text-gray-100">Profile</h2>

        <div className="mb-8 flex items-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mr-6">
            {user?.name?.charAt(0) || user?.email?.charAt(0) || '?'}
          </div>
          <div>
            <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {user?.name || user?.username || 'User'}
            </p>
            <p className="text-gray-700 dark:text-gray-300">{user?.email}</p>
          </div>
        </div>

        <h3 className="text-xl font-medium mb-4 text-gray-800 dark:text-gray-100">Typing Statistics Summary</h3>
        {loading ? (
          <p className="text-gray-600 dark:text-gray-400">Loading stats...</p>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            {[
              { label: 'Total Tests', value: stats.totalTests },
              { label: 'Avg. WPM', value: (stats.avgWpm || 0).toFixed(1) },
              { label: 'Avg. Accuracy', value: `${(stats.avgAccuracy || 0).toFixed(1)}%` },
              { label: 'Best WPM', value: stats.bestWpm }
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-100 dark:bg-gray-700 p-4 rounded shadow-sm">
                <p className="text-gray-700 dark:text-gray-300 text-sm">{label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
