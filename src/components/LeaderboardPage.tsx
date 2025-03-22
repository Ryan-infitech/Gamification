import React, { useEffect, useState } from "react";
import { userService } from "../services/userService";

interface LeaderboardEntry {
  username: string;
  score: number;
  timeSpent: number;
  completedAt: string;
}

interface LeaderboardPageProps {
  isDarkMode?: boolean;
  categories?: Array<{ id: string; title: string; description?: string }>;
}

export const LeaderboardPage: React.FC<LeaderboardPageProps> = ({
  isDarkMode,
  categories = [],
}) => {
  const [category, setCategory] = useState(categories[0]?.id || "javascript");
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (category) {
      loadLeaderboard();
    }
  }, [category]);

  const loadLeaderboard = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("Loading leaderboard for category:", category);

      const data = await userService.getLeaderboard(category);
      console.log("Leaderboard data received:", data);
      setLeaderboard(data);
    } catch (error) {
      console.error("Error loading leaderboard:", error);
      setError("Failed to load leaderboard. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // If no categories provided, use a default
  if (categories.length === 0 && category === "") {
    setCategory("javascript");
  }

  return (
    <div className="container mx-auto p-4">
      <h1
        className={`text-2xl font-bold mb-4 ${
          isDarkMode ? "text-white" : "text-gray-800"
        }`}
      >
        Leaderboard
      </h1>

      <div className="mb-4">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={`p-2 border rounded ${
            isDarkMode
              ? "bg-gray-700 text-white border-gray-600"
              : "bg-white text-gray-800 border-gray-300"
          }`}
        >
          {categories.length > 0 ? (
            categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.title || cat.id}
              </option>
            ))
          ) : (
            <option value="javascript">JavaScript</option>
          )}
        </select>
        <button
          onClick={loadLeaderboard}
          className={`ml-2 px-4 py-2 rounded ${
            isDarkMode
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
        >
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
        </div>
      ) : error ? (
        <div
          className={`p-4 rounded-lg ${
            isDarkMode ? "bg-red-900 text-white" : "bg-red-100 text-red-700"
          }`}
        >
          {error}
        </div>
      ) : leaderboard.length === 0 ? (
        <div
          className={`p-4 rounded-lg ${
            isDarkMode
              ? "bg-gray-800 text-gray-300"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          No leaderboard data available for this category yet.
        </div>
      ) : (
        <div
          className={`${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } shadow-md rounded-lg`}
        >
          <table className="min-w-full">
            <thead>
              <tr className={isDarkMode ? "bg-gray-700" : "bg-gray-100"}>
                <th className="px-4 py-2">Rank</th>
                <th className="px-4 py-2">Username</th>
                <th className="px-4 py-2">Score</th>
                <th className="px-4 py-2">Time</th>
                <th className="px-4 py-2">Completed</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, index) => (
                <tr
                  key={index}
                  className={`border-t ${
                    isDarkMode ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <td className="px-4 py-2 text-center">{index + 1}</td>
                  <td className="px-4 py-2">{entry.username}</td>
                  <td className="px-4 py-2 text-center">{entry.score}%</td>
                  <td className="px-4 py-2 text-center">
                    {Math.floor(entry.timeSpent / 60)}:
                    {(entry.timeSpent % 60).toString().padStart(2, "0")}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(entry.completedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 text-center">
        <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
          Complete quizzes to appear on the leaderboard!
        </p>
      </div>
    </div>
  );
};

export default LeaderboardPage;
