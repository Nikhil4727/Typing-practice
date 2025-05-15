// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useAuth } from '../context/AuthContext';

// const Stats = () => {
//   const { user } = useAuth();
//   const [stats, setStats] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState('all'); // 'all', 'week', 'month'

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const res = await axios.get(`http://localhost:5000/api/results/stats`, {
//           headers: { Authorization: `Bearer ${user.token}` }
//         });
//         setStats(res.data);
//       } catch (err) {
//         console.error('Failed to fetch stats', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (user) {
//       fetchStats();
//     }
//   }, [user, filter]);

//   // Calculate progress compared to previous test
//   const getProgressIndicator = (current, previous) => {
//     if (!previous) return null;
    
//     const diff = current - previous;
//     if (diff > 0) {
//       return <span className="text-green-500 ml-1">↑ {diff.toFixed(1)}</span>;
//     } else if (diff < 0) {
//       return <span className="text-red-500 ml-1">↓ {Math.abs(diff).toFixed(1)}</span>;
//     }
//     return <span className="text-gray-500 ml-1">→</span>;
//   };

//   return (
//     <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-semibold">Your Typing Stats</h2>
//         <div className="flex space-x-2">
//           <button 
//             className={`px-3 py-1 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
//             onClick={() => setFilter('all')}
//           >
//             All Time
//           </button>
//           <button 
//             className={`px-3 py-1 rounded ${filter === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
//             onClick={() => setFilter('month')}
//           >
//             This Month
//           </button>
//           <button 
//             className={`px-3 py-1 rounded ${filter === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
//             onClick={() => setFilter('week')}
//           >
//             This Week
//           </button>
//         </div>
//       </div>
      
//       {loading ? (
//         <div className="flex justify-center">
//           <p>Loading your stats...</p>
//         </div>
//       ) : stats.length > 0 ? (
//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="py-3 px-4 border-b">Date</th>
//                 <th className="py-3 px-4 border-b">WPM</th>
//                 <th className="py-3 px-4 border-b">Accuracy</th>
//                 <th className="py-3 px-4 border-b">Time</th>
//                 <th className="py-3 px-4 border-b">Text</th>
//               </tr>
//             </thead>
//             <tbody>
//               {stats.map((stat, index) => {
//                 const prevStat = index < stats.length - 1 ? stats[index + 1] : null;
//                 return (
//                   <tr key={index} className="hover:bg-gray-50">
//                     <td className="py-3 px-4 border-b">
//                       {new Date(stat.date || stat.createdAt).toLocaleDateString()}
//                     </td>
//                     <td className="py-3 px-4 border-b text-center font-medium">
//                       {stat.wpm}
//                       {getProgressIndicator(stat.wpm, prevStat?.wpm)}
//                     </td>
//                     <td className="py-3 px-4 border-b text-center">
//                       {stat.accuracy}%
//                       {getProgressIndicator(stat.accuracy, prevStat?.accuracy)}
//                     </td>
//                     <td className="py-3 px-4 border-b text-center">
//                       {stat.timeTaken ? `${stat.timeTaken.toFixed(2)}s` : '-'}
//                     </td>
//                     <td className="py-3 px-4 border-b truncate max-w-xs">
//                       {stat.text ? 
//                         (stat.text.length > 30 ? `${stat.text.substring(0, 30)}...` : stat.text) 
//                         : '-'}
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <div className="text-center py-10">
//           <p className="text-gray-500">No stats available yet. Complete some typing tests to see your progress!</p>
//           <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
//             Start a Typing Test
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Stats;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Stats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'week', 'month'

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Changed endpoint to fetch history instead of stats since we need individual results
        const res = await axios.get(`http://localhost:5000/api/results/history`, {
          headers: { Authorization: `Bearer ${user.token}` },
          params: { timeframe: filter } // Added filter as query parameter
        });
        
        // Make sure we're accessing the results array correctly
        setStats(res.data.results || []);
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.token) {
      fetchStats();
    }
  }, [user, filter]);

  // Calculate progress compared to previous test
  const getProgressIndicator = (current, previous) => {
    if (!previous) return null;
    
    const diff = current - previous;
    if (diff > 0) {
      return <span className="text-green-500 ml-1">↑ {diff.toFixed(1)}</span>;
    } else if (diff < 0) {
      return <span className="text-red-500 ml-1">↓ {Math.abs(diff).toFixed(1)}</span>;
    }
    return <span className="text-gray-500 ml-1">→</span>;
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Your Typing Stats</h2>
        <div className="flex space-x-2">
          <button 
            className={`px-3 py-1 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setFilter('all')}
          >
            All Time
          </button>
          <button 
            className={`px-3 py-1 rounded ${filter === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setFilter('month')}
          >
            This Month
          </button>
          <button 
            className={`px-3 py-1 rounded ${filter === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setFilter('week')}
          >
            This Week
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center">
          <p>Loading your stats...</p>
        </div>
      ) : stats.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 border-b">Date</th>
                <th className="py-3 px-4 border-b">WPM</th>
                <th className="py-3 px-4 border-b">Accuracy</th>
                <th className="py-3 px-4 border-b">Time</th>
                <th className="py-3 px-4 border-b">Text</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((stat, index) => {
                const prevStat = index < stats.length - 1 ? stats[index + 1] : null;
                return (
                  <tr key={stat._id || index} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b">
                      {new Date(stat.date || stat.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 border-b text-center font-medium">
                      {stat.wpm}
                      {getProgressIndicator(stat.wpm, prevStat?.wpm)}
                    </td>
                    <td className="py-3 px-4 border-b text-center">
                      {stat.accuracy}%
                      {getProgressIndicator(stat.accuracy, prevStat?.accuracy)}
                    </td>
                    <td className="py-3 px-4 border-b text-center">
                      {stat.timeTaken ? `${stat.timeTaken.toFixed(2)}s` : '-'}
                    </td>
                    <td className="py-3 px-4 border-b truncate max-w-xs">
                      {stat.text ? 
                        (stat.text.length > 30 ? `${stat.text.substring(0, 30)}...` : stat.text) 
                        : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">No stats available yet. Complete some typing tests to see your progress!</p>
          <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Start a Typing Test
          </button>
        </div>
      )}
    </div>
  );
};

export default Stats