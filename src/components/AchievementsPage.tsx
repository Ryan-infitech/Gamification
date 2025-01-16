import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Target, Award, Crown, BookOpen } from 'lucide-react';
import { QuizCategory } from '../data/questions';

interface QuizResult {
  categoryId: string;
  score: number;
  totalQuestions: number;
  timestamp: Date;
}

interface AchievementsProps {
  quizResults: QuizResult[];
  categories: QuizCategory[];
}

const calculateProgress = (results: QuizResult[]) => {
  const totalAttempts = results.length;
  const totalScore = results.reduce((acc, result) => acc + result.score, 0);
  const totalQuestions = results.reduce((acc, result) => acc + result.totalQuestions, 0);
  
  return {
    totalAttempts,
    averageScore: totalQuestions > 0 ? (totalScore / totalQuestions) * 100 : 0,
    completedCategories: new Set(results.map(r => r.categoryId)).size
  };
};

const getAchievementLevel = (score: number): { title: string; icon: React.ElementType } => {
  if (score >= 90) return { title: 'Master', icon: Crown };
  if (score >= 80) return { title: 'Expert', icon: Star };
  if (score >= 70) return { title: 'Advanced', icon: Target };
  if (score >= 60) return { title: 'Intermediate', icon: Award };
  return { title: 'Beginner', icon: BookOpen };
};

const AchievementsPage: React.FC<AchievementsProps> = ({ quizResults, categories }) => {
  const progress = calculateProgress(quizResults);

  // Helper function to get category title
  const getCategoryTitle = (categoryId: string): string => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.title : 'Unknown Category';
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
          Pencapaian Anda
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

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <Target className="w-12 h-12 text-green-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Rata-rata Skor
          </h3>
          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            {progress.averageScore.toFixed(1)}%
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <BookOpen className="w-12 h-12 text-blue-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Kategori Selesai
          </h3>
          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            {progress.completedCategories}/{categories.length}
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
            const categoryTitle = getCategoryTitle(result.categoryId);
            
            return (
              <motion.div
                key={index}
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
                        {categoryTitle}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {new Date(result.timestamp).toLocaleDateString()}
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
                    {categoryResults.length} Percobaan
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