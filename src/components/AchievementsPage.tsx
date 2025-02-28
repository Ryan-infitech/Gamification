import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Target, Award, Crown, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';

// Interfaces
interface QuizCategory {
  id: string;
  title: string;
  description: string;
}

interface QuizResult {
  id: string;
  userId: string;
  username: string;
  categoryId: string;
  score: number;
  totalQuestions: number;
  completionTime: number;
  timestamp: Date;
}

interface AchievementsProps {
  username: string;
  categories: QuizCategory[];
}

// Helper functions
const calculateProgress = (results: QuizResult[]) => {
  const totalAttempts = results.length;
  const totalScore = results.reduce((acc, result) => acc + result.score, 0);
  const totalQuestions = results.reduce((acc, result) => acc + result.totalQuestions, 0);
  
  return {
    totalAttempts,
    averageScore: totalQuestions > 0 ? (totalScore / totalQuestions) * 100 : 0,
    completedCategories: new Set(results.map(r => r.categoryId)).size,
    totalTime: results.reduce((acc, result) => acc + result.completionTime, 0)
  };
};

const getAchievementLevel = (score: number): { title: string; icon: React.ElementType } => {
  if (score >= 90) return { title: 'Master', icon: Crown };
  if (score >= 80) return { title: 'Expert', icon: Star };
  if (score >= 70) return { title: 'Advanced', icon: Target };
  if (score >= 60) return { title: 'Intermediate', icon: Award };
  return { title: 'Beginner', icon: BookOpen };
};

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const AchievementsPage: React.FC<AchievementsProps> = ({ username, categories }) => {
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserResults = async () => {
      try {
        const results = await userService.getUserResults(username);
        setQuizResults(results);
      } catch (error) {
        console.error('Error loading user results:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserResults();
  }, [username]);

  const progress = calculateProgress(quizResults);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  const navigateToLeaderboard = () => {
    navigate('/leaderboard');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Pencapaian {username}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Terus tingkatkan pengetahuan dan kemampuan Anda!
        </p>
      </motion.div>

      {/* Overall Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <Trophy className="w-12 h-12 text-yellow-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Total Quiz
          </h3>
          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            {progress.totalAttempts}
          </p>
        </div>

        <div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          onClick={navigateToLeaderboard}
        >
          <Target className="w-12 h-12 text-green-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Leaderboard
          </h3>
          <p className="text-base text-gray-600 dark:text-gray-300">
            Lihat peringkat semua pemain
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <BookOpen className="w-12 h-12 text-blue-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Total Waktu
          </h3>
          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            {formatTime(progress.totalTime)}
          </p>
        </div>
      </motion.div>

      {/* Recent Results */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Hasil Quiz Terakhir
        </h2>
        <div className="space-y-4">
          {quizResults.slice(-5).reverse().map((result, index) => {
            const achievement = getAchievementLevel((result.score / result.totalQuestions) * 100);
            const AchievementIcon = achievement.icon;
            const category = categories.find(c => c.id === result.categoryId);
            
            return (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <AchievementIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {category?.title || 'Unknown Category'}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {new Date(result.timestamp).toLocaleDateString()} - {formatTime(result.completionTime)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                      {((result.score / result.totalQuestions) * 100).toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {achievement.title}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Category Progress */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Progress per Kategori
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category, index) => {
            const categoryResults = quizResults.filter(r => r.categoryId === category.id);
            const bestScore = categoryResults.length > 0
              ? Math.max(...categoryResults.map(r => (r.score / r.totalQuestions) * 100))
              : 0;
            const totalTime = categoryResults.reduce((acc, r) => acc + r.completionTime, 0);
            
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  {category.title}
                </h3>
                <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full mb-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${bestScore}%` }}
                    className="absolute h-full bg-indigo-600 rounded-full"
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">
                    {categoryResults.length} Percobaan - {formatTime(totalTime)}
                  </span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                    {bestScore.toFixed(1)}%
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>
    </div>
  );
};

export default AchievementsPage;