import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Star,
  Target,
  Award,
  Crown,
  BookOpen,
  XCircle,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { userService } from "../services/userService";

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
  correctAnswers: number; // CRITICAL: Explicitly include correctAnswers
  totalQuestions: number;
  completionTime: number;
  timestamp: Date;
  answers?: {
    questionIndex: number;
    selectedAnswer: number;
    isCorrect: boolean;
  }[];
}

// Helper functions
const calculateProgress = (results: QuizResult[]) => {
  const totalAttempts = results.length;

  // Calculate total scores using correctAnswers
  const totalCorrectAnswers = results.reduce(
    (acc, result) => acc + (result.correctAnswers || 0),
    0
  );
  const totalQuestions = results.reduce(
    (acc, result) => acc + (result.totalQuestions || 0),
    0
  );

  console.log("Progress calculation:", {
    totalAttempts,
    totalCorrectAnswers,
    totalQuestions,
  });

  // Debug the results to see if correctAnswers is present
  console.log(
    "Calculating progress from results:",
    results.map((r) => ({
      id: r.id,
      correctAnswers: r.correctAnswers,
      totalQuestions: r.totalQuestions,
      score: r.score,
    }))
  );

  // Ensure we don't divide by zero
  const averageScore =
    totalQuestions > 0 ? (totalCorrectAnswers / totalQuestions) * 100 : 0;

  return {
    totalAttempts,
    averageScore,
    completedCategories: new Set(results.map((r) => r.categoryId)).size,
    totalTime: results.reduce((acc, result) => acc + result.completionTime, 0),
  };
};

const getAchievementLevel = (
  score: number
): { title: string; icon: React.ElementType } => {
  if (score >= 90) return { title: "Master", icon: Crown };
  if (score >= 80) return { title: "Expert", icon: Star };
  if (score >= 70) return { title: "Advanced", icon: Target };
  if (score >= 60) return { title: "Intermediate", icon: Award };
  return { title: "Beginner", icon: BookOpen };
};

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const AchievementsPage: React.FC<AchievementsProps> = ({
  username,
  categories,
}) => {
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actualUsername, setActualUsername] = useState(username);
  const [selectedResult, setSelectedResult] = useState<QuizResult | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have a username
    const loadUserResults = async () => {
      try {
        setIsLoading(true);
        const userToLoad = actualUsername || "guest";
        console.log("Loading results for user:", userToLoad);
        const results = await userService.getUserResults(userToLoad);
        console.log("User results loaded:", results.length);
        setQuizResults(results);
      } catch (error) {
        console.error("Error loading user results:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserResults();
  }, [username, actualUsername]);

  // Add this debugging function
  useEffect(() => {
    if (quizResults.length > 0) {
      console.log("Quiz results loaded:", quizResults.length);
      quizResults.forEach((result, index) => {
        console.log(`Result #${index + 1}:`, {
          id: result.id,
          score: result.score,
          correctAnswers: result.correctAnswers,
          totalQuestions: result.totalQuestions,
          percentage:
            result.totalQuestions > 0
              ? ((result.correctAnswers / result.totalQuestions) * 100).toFixed(
                  1
                ) + "%"
              : "N/A",
        });
      });
    }
  }, [quizResults]);

  // Add this function to run immediately when quiz results are loaded
  useEffect(() => {
    if (quizResults.length > 0) {
      // Check if correctAnswers is actually present in the results
      const hasMissingCorrectAnswers = quizResults.some(
        (result) =>
          result.correctAnswers === undefined || result.correctAnswers === null
      );

      if (hasMissingCorrectAnswers) {
        console.warn("Some quiz results are missing correctAnswers field!");
      }

      // Debug log showing all results
      console.log(
        "Quiz results summary:",
        quizResults.map((result) => ({
          id: result.id,
          score: result.score,
          correctAnswers: result.correctAnswers,
          totalQuestions: result.totalQuestions,
          percentage:
            result.totalQuestions > 0
              ? ((result.correctAnswers / result.totalQuestions) * 100).toFixed(
                  1
                ) + "%"
              : "N/A",
        }))
      );
    }
  }, [quizResults]);

  const progress = calculateProgress(quizResults);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  const navigateToLeaderboard = () => {
    navigate("/leaderboardPage");
  };

  const openResultDetails = (result: QuizResult) => {
    console.log("Opening result details:", {
      id: result.id,
      hasAnswers: Boolean(result.answers),
      answersCount: result.answers?.length || 0,
      answers: result.answers,
    });
    setSelectedResult(result);
    setShowDetails(true);
  };

  const closeResultDetails = () => {
    setShowDetails(false);
    setSelectedResult(null);
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
          {quizResults
            .slice(-5)
            .reverse()
            .map((result, index) => {
              // Calculate achievement level based on correctAnswers/totalQuestions
              const achievementScore =
                result.totalQuestions > 0
                  ? (result.correctAnswers / result.totalQuestions) * 100
                  : 0;

              const achievement = getAchievementLevel(achievementScore);
              const AchievementIcon = achievement.icon;
              const category = categories.find(
                (c) => c.id === result.categoryId
              );

              // Double-check we have correctAnswers
              const displayCorrectAnswers =
                result.correctAnswers !== undefined ? result.correctAnswers : 0;

              return (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => openResultDetails(result)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <AchievementIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {category?.title || "Unknown Category"}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {new Date(result.timestamp).toLocaleDateString()} -{" "}
                          {formatTime(result.completionTime)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                        {displayCorrectAnswers}/{result.totalQuestions} (
                        {achievementScore.toFixed(1)}%)
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {
                          getAchievementLevel(
                            result.totalQuestions > 0
                              ? (result.correctAnswers /
                                  result.totalQuestions) *
                                  100
                              : 0
                          ).title
                        }
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
            const categoryResults = quizResults.filter(
              (r) => r.categoryId === category.id
            );
            const bestScore =
              categoryResults.length > 0
                ? Math.max(
                    ...categoryResults.map(
                      (r) => (r.score / r.totalQuestions) * 100
                    )
                  )
                : 0;
            const totalTime = categoryResults.reduce(
              (acc, r) => acc + r.completionTime,
              0
            );

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

      {/* Quiz Result Details Modal */}
      {showDetails && selectedResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Quiz Detail
              </h3>
              <button
                onClick={closeResultDetails}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-300 mb-1">
                <span className="font-semibold">Category:</span>{" "}
                {categories.find((c) => c.id === selectedResult.categoryId)
                  ?.title || selectedResult.categoryId}
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-1">
                <span className="font-semibold">Date:</span>{" "}
                {new Date(selectedResult.timestamp).toLocaleString()}
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-1">
                <span className="font-semibold">Score:</span>{" "}
                {selectedResult.correctAnswers}/{selectedResult.totalQuestions}{" "}
                (
                {selectedResult.totalQuestions > 0
                  ? (
                      (selectedResult.correctAnswers /
                        selectedResult.totalQuestions) *
                      100
                    ).toFixed(1)
                  : 0}
                %)
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-semibold">Time:</span>{" "}
                {formatTime(selectedResult.completionTime)}
              </p>
            </div>

            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Answer Summary{" "}
              {selectedResult.answers
                ? `(${selectedResult.answers.length})`
                : ""}
            </h4>

            {selectedResult.answers && selectedResult.answers.length > 0 ? (
              <div className="space-y-3">
                {selectedResult.answers.map((answer, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${
                      answer.isCorrect
                        ? "bg-green-100 dark:bg-green-900/30"
                        : "bg-red-100 dark:bg-red-900/30"
                    }`}
                  >
                    <div className="flex items-start">
                      <div
                        className={`mt-1 mr-2 ${
                          answer.isCorrect
                            ? "text-green-500 dark:text-green-400"
                            : "text-red-500 dark:text-red-400"
                        }`}
                      >
                        {answer.isCorrect ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <XCircle className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          Question {index + 1}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Answer {answer.selectedAnswer + 1}{" "}
                          {answer.isCorrect ? "(Correct)" : "(Incorrect)"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic">
                No answer details available.{" "}
                {JSON.stringify(selectedResult.answers)}
              </p>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={closeResultDetails}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AchievementsPage;
