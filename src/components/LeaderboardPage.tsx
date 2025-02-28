import React, { useEffect, useState } from 'react';
import { userService } from '../services/userService';

interface LeaderboardEntry {
  username: string;
  score: number;
  timeSpent: number;
  completedAt: string;
}

interface LeaderboardPageProps {
  isDarkMode?: boolean;
  categories?: Array<{ id: string; name: string }>;
}

export const LeaderboardPage: React.FC<LeaderboardPageProps> = ({ isDarkMode, categories = [] }) => {
  const [category, setCategory] = useState(categories[0]?.id || '');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    if (category) {
      loadLeaderboard();
    }
  }, [category]);

  const loadLeaderboard = async () => {
    try {
      const data = await userService.getLeaderboard(category);
      setLeaderboard(data);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        Leaderboard
      </h1>
      
      <div className="mb-4">
        <select 
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={`p-2 border rounded ${
            isDarkMode 
              ? 'bg-gray-700 text-white border-gray-600' 
              : 'bg-white text-gray-800 border-gray-300'
          }`}
        >
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md rounded-lg`}>
        <table className="min-w-full">
          <thead>
            <tr className={isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}>
              <th className="px-4 py-2">Rank</th>
              <th className="px-4 py-2">Username</th>
              <th className="px-4 py-2">Score</th>
              <th className="px-4 py-2">Time</th>
              <th className="px-4 py-2">Completed</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, index) => (
              <tr key={index} className={`border-t ${
                isDarkMode ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <td className="px-4 py-2 text-center">{index + 1}</td>
                <td className="px-4 py-2">{entry.username}</td>
                <td className="px-4 py-2 text-center">{entry.score}%</td>
                <td className="px-4 py-2 text-center">
                  {Math.floor(entry.timeSpent / 60)}:{(entry.timeSpent % 60).toString().padStart(2, '0')}
                </td>
                <td className="px-4 py-2">
                  {new Date(entry.completedAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardPage;