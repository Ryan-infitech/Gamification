import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, XCircle, CheckCircle, RefreshCw, ArrowLeft } from 'lucide-react';

// Types
interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizCategory {
  id: string;
  title: string;
  questions: Question[];
}

interface QuizProps {
  category: QuizCategory;
  onBack: () => void;
  isDarkMode: boolean;
  onComplete: (score: number) => void;
}

interface QuizResult {
  id: string;
  categoryId: string;
  categoryTitle: string;
  score: number;
  totalQuestions: number;
  timestamp: string;
  answers: {
    questionIndex: number;
    selectedAnswer: number;
    isCorrect: boolean;
  }[];
}

// Storage utilities
const saveQuizResult = (result: QuizResult) => {
  try {
    const existingResults = JSON.parse(localStorage.getItem('quizResults') || '[]');
    const newResults = [...existingResults, result];
    localStorage.setItem('quizResults', JSON.stringify(newResults));
    return true;
  } catch (error) {
    console.error('Error saving quiz result:', error);
    return false;
  }
};

const getQuizResults = (): QuizResult[] => {
  try {
    return JSON.parse(localStorage.getItem('quizResults') || '[]');
  } catch {
    return [];
  }
};

export default function Quiz({ category, onBack, isDarkMode, onComplete }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Array<{
    questionIndex: number;
    selectedAnswer: number;
    isCorrect: boolean;
  }>>([]);

  useEffect(() => {
    setShuffledQuestions([...category.questions].sort(() => Math.random() - 0.5));
  }, [category]);

  const handleAnswer = (optionIndex: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(optionIndex);
    const correct = optionIndex === shuffledQuestions[currentQuestionIndex].correctAnswer;
    setIsCorrect(correct);

    // Record the answer
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

  const handleQuizComplete = () => {
    const result: QuizResult = {
      id: crypto.randomUUID(),
      categoryId: category.id,
      categoryTitle: category.title,  // Added missing categoryTitle
      score,
      totalQuestions: shuffledQuestions.length,
      timestamp: new Date().toISOString(),
      answers
    };
    
    const saved = saveQuizResult(result);
    if (!saved) {
      console.error('Failed to save quiz results');
    }
    
    onComplete(score);  // Added missing onComplete call
    setShowResult(true);
  };

  const resetQuiz = () => {
    setShuffledQuestions([...category.questions].sort(() => Math.random() - 0.5));
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setAnswers([]);
  };

  if (!shuffledQuestions.length) return null;

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
        Kembali ke Kategori
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
              <h2 className={`text-2xl font-bold ${
                isDarkMode ? 'text-gray-100' : 'text-gray-800'
              }`}>
                {category.title} - Pertanyaan {currentQuestionIndex + 1}/{shuffledQuestions.length}
              </h2>
              <span className={`text-lg font-semibold ${
                isDarkMode ? 'text-blue-400' : 'text-indigo-600'
              }`}>
                Skor: {score}
              </span>
            </div>

            <div className="mb-8">
              <h3 className={`text-xl mb-6 ${
                isDarkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>{currentQuestion.question}</h3>
              <div className="space-y-4">
                {currentQuestion.options.map((option, index) => (
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
            }`}>Quiz Selesai!</h2>
            <p className={`text-xl mb-6 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Skor Anda: {score} dari {shuffledQuestions.length}
            </p>
            <div className={`text-lg mb-8 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Persentase: {((score / shuffledQuestions.length) * 100).toFixed(1)}%
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
                Coba Lagi
              </button>
              <button
                onClick={onBack}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Pilih Topik Lain
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}