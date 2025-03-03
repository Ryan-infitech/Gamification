// Quiz.tsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, XCircle, CheckCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { questionService, type Question } from '../services/questionService';
import { userService } from '../services/userService';

// Types
interface QuizCategory {
  id: string;
  title: string;
}

interface QuizProps {
  category: QuizCategory;
  onBack: () => void;
  isDarkMode: boolean;
  onComplete: (score: number) => void;
}

interface Answer {
  questionIndex: number;
  selectedAnswer: number;
  isCorrect: boolean;
}

export default function Quiz({ category, onBack, isDarkMode, onComplete }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [showLogin, setShowLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!category?.id) {
      console.error('Invalid category data:', category);
      setError('Invalid category data');
      onBack(); // Return to previous page if category is invalid
      return;
    }
    loadQuestions();
  }, [category]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      console.log('Loading questions for category:', category);
      const questions = await questionService.getQuestionsByCategory(category.id);
      console.log('Questions loaded:', questions?.length || 0);
      
      if (!questions?.length) {
        console.warn('No questions returned for category:', category);
        setError('No questions available for this category');
        setLoading(false);
        return;
      }
      
      // Fix: Ensure questions are properly typed
      const typedQuestions: Question[] = questions.map(q => ({
        id: q.id,
        category: q.category,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer
      }));
      
      setShuffledQuestions([...typedQuestions].sort(() => Math.random() - 0.5));
      setLoading(false);
      setError(null);
    } catch (error) {
      console.error('Error loading questions:', error);
      setError('Failed to load questions. Please try again.');
      setLoading(false);
    }
  };

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      alert('Please enter a valid username');
      return;
    }
    
    try {
      setLoading(true);
      const isAvailable = await userService.checkUsername(username);
      if (!isAvailable) {
        alert('Username already in use. Please choose another username.');
        setLoading(false);
        return;
      }
      await userService.createUser(username);
      setShowLogin(false);
      setStartTime(Date.now());
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      alert('Error checking username. Please try again.');
      setLoading(false);
    }
  };

  const handleAnswer = (optionIndex: number) => {
    if (selectedAnswer !== null || loading) return;

    setSelectedAnswer(optionIndex);
    const correct = optionIndex === shuffledQuestions[currentQuestionIndex].correctAnswer;
    setIsCorrect(correct);

    setAnswers(prev => [...prev, {
      questionIndex: currentQuestionIndex,
      selectedAnswer: optionIndex,
      isCorrect: correct
    }]);

    if (correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestionIndex < shuffledQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        handleQuizComplete();
      }
    }, 1000);
  };

  const handleQuizComplete = async () => {
    try {
      setLoading(true);
      const endTime = Date.now();
      const timeSpent = Math.floor((endTime - (startTime || 0)) / 1000);
      const finalScore = Math.round((score / shuffledQuestions.length) * 100);

      await userService.saveQuizResult(
        username,
        category.id,
        finalScore,
        timeSpent,
        answers
      );
      
      onComplete(score);
      setShowResult(true);
      setLoading(false);
    } catch (error) {
      console.error('Error saving results:', error);
      alert('Error saving quiz results. Please try again.');
      setLoading(false);
    }
  };

  const resetQuiz = async () => {
    try {
      setLoading(true);
      const questions = await questionService.getQuestionsByCategory(category.id);
      
      // Fix: Ensure questions are properly typed
      const typedQuestions: Question[] = questions.map(q => ({
        id: q.id,
        category: q.category,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer
      }));
      
      setShuffledQuestions([...typedQuestions].sort(() => Math.random() - 0.5));
      setCurrentQuestionIndex(0);
      setScore(0);
      setShowResult(false);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setAnswers([]);
      setStartTime(Date.now());
      setLoading(false);
    } catch (error) {
      console.error('Error resetting quiz:', error);
      setError('Failed to reset quiz. Please try again.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto text-center">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`p-8 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'}`}
        >
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
            <p>Loading...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <button
          onClick={onBack}
          className={`mb-4 flex items-center gap-2 ${
            isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-indigo-600 hover:text-indigo-700'
          } transition-colors`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Categories
        </button>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`p-8 rounded-xl shadow-lg text-center ${
            isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'
          }`}
        >
          <XCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-bold mb-4">Error</h2>
          <p className="mb-6">{error}</p>
          <button
            onClick={onBack}
            className={`px-6 py-3 rounded-lg ${
              isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-indigo-600 hover:bg-indigo-700'
            } text-white transition-colors`}
          >
            Return to Categories
          </button>
        </motion.div>
      </div>
    );
  }

  if (!shuffledQuestions.length) {
    return (
      <div className="w-full max-w-2xl mx-auto text-center">
        <button
          onClick={onBack}
          className={`mb-4 flex items-center gap-2 ${
            isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-indigo-600 hover:text-indigo-700'
          } transition-colors`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Categories
        </button>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`p-8 rounded-xl shadow-lg ${
            isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'
          }`}
        >
          <p>No questions available for this category. Please try again later.</p>
          <button
            onClick={onBack}
            className={`mt-4 px-6 py-2 rounded-lg ${
              isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-indigo-600 hover:bg-indigo-700'
            } text-white transition-colors`}
          >
            Choose Another Category
          </button>
        </motion.div>
      </div>
    );
  }

  if (showLogin) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <button
          onClick={onBack}
          className={`mb-4 flex items-center gap-2 ${
            isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-indigo-600 hover:text-indigo-700'
          } transition-colors`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Categories
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl shadow-lg p-8 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <h2 className={`text-2xl font-bold mb-6 ${
            isDarkMode ? 'text-gray-100' : 'text-gray-800'
          }`}>
            Enter Username
          </h2>
          <form onSubmit={handleUsernameSubmit}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full p-4 rounded-lg mb-4 ${
                isDarkMode 
                  ? 'bg-gray-700 text-gray-100 border-gray-600' 
                  : 'bg-gray-50 text-gray-800 border-gray-200'
              } border-2`}
              placeholder="Enter username"
              required
            />
            <button
              type="submit"
              className={`w-full py-4 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Start Quiz'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }
  
  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <button
        onClick={onBack}
        className={`mb-4 flex items-center gap-2 ${
          isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-indigo-600 hover:text-indigo-700'
        } transition-colors`}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Categories
      </button>
      
      <AnimatePresence mode="wait">
        {!showResult ? (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`rounded-xl shadow-lg p-8 ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className={`text-2xl font-bold ${
                  isDarkMode ? 'text-gray-100' : 'text-gray-800'
                }`}>
                  {category?.title || 'Quiz'} - Question {currentQuestionIndex + 1}/{shuffledQuestions.length}
                </h2>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Username: {username}
                </p>
              </div>
              <span className={`text-lg font-semibold ${
                isDarkMode ? 'text-blue-400' : 'text-indigo-600'
              }`}>
                Score: {score}
              </span>
            </div>

            <div className="mb-8">
              <h3 className={`text-xl mb-6 ${
                isDarkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>{currentQuestion.question}</h3>
              <div className="space-y-4">
              {currentQuestion.options.map((option: string, index: number) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(index)}
                  disabled={selectedAnswer !== null}
                  className={`w-full p-4 text-left rounded-lg transition-colors border-2 ${
                    selectedAnswer === index
                      ? isCorrect
                        ? 'bg-green-100 border-green-500 dark:bg-green-900 dark:border-green-400'
                        : 'bg-red-100 border-red-500 dark:bg-red-900 dark:border-red-400'
                      : isDarkMode
                      ? 'bg-gray-700 hover:bg-gray-600 border-gray-600'
                      : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                  } ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}
                >
                  {option}
                  {selectedAnswer === index && (
                    <span className="float-right">
                      {isCorrect ? (
                        <CheckCircle className="text-green-500 dark:text-green-400" />
                      ) : (
                        <XCircle className="text-red-500 dark:text-red-400" />
                      )}
                    </span>
                  )}
                </motion.button>
              ))}
              </div>
            </div>

            <div className={`h-2 rounded-full ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
            }`}>
              <motion.div
                className={`h-full rounded-full ${
                  isDarkMode ? 'bg-blue-500' : 'bg-indigo-600'
                }`}
                initial={{ width: '0%' }}
                animate={{
                  width: `${((currentQuestionIndex + 1) / shuffledQuestions.length) * 100}%`,
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className={`rounded-xl shadow-lg p-8 text-center ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-6" />
            <h2 className={`text-3xl font-bold mb-4 ${
              isDarkMode ? 'text-gray-100' : 'text-gray-800'
            }`}>Quiz Complete!</h2>
            <p className={`text-xl mb-6 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Your Score: {score} of {shuffledQuestions.length}
            </p>
            <div className={`text-lg mb-8 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Percentage: {((score / shuffledQuestions.length) * 100).toFixed(1)}%
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={resetQuiz}
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                  isDarkMode 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </button>
              <button
                onClick={onBack}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Choose Another Topic
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}