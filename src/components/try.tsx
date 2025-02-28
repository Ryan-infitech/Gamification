import React, { useState, useEffect } from 'react';
import { QuestionService } from '../services/questionService';
import { motion } from 'framer-motion';

// Types
interface Question {
  id: string;
  category: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface Category {
  id: string;
  title: string;
}

const QuizPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([
    { id: 'javascript', title: 'JavaScript' },
    { id: 'html', title: 'HTML' },
    { id: 'css', title: 'CSS' },
  ]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isQuizFinished, setIsQuizFinished] = useState<boolean>(false);

  const questionService = new QuestionService();

  // Load questions for the selected category
  const loadQuestions = async (categoryId: string) => {
    try {
      const fetchedQuestions = await questionService.getQuestionsByCategory(categoryId);
      setQuestions(fetchedQuestions);
      setCurrentQuestionIndex(0);
      setScore(0);
      setIsQuizFinished(false);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  // Handle category selection
  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    loadQuestions(category.id);
  };

  // Handle answer selection
  const handleAnswerSelect = (index: number) => {
    if (selectedAnswer !== null) return; // Prevent multiple answers

    setSelectedAnswer(index);
    if (index === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }

    // Wait before moving to the next question
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
      } else {
        setIsQuizFinished(true);
      }
    }, 1000);
  };

  // Render the result
  const renderResult = () => {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center p-8"
      >
        <h2 className="text-3xl font-bold mb-4">Quiz Completed!</h2>
        <p className="text-xl">Your score: {score} / {questions.length}</p>
        <p className="text-lg">
          Percentage: {((score / questions.length) * 100).toFixed(2)}%
        </p>
      </motion.div>
    );
  };

  // Render quiz question
  const renderQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 bg-white rounded-xl shadow-lg"
      >
        <h3 className="text-xl mb-4">{currentQuestion.question}</h3>
        <div>
          {currentQuestion.options.map((option, index) => (
            <motion.button
              key={index}
              className={`w-full p-4 mb-2 rounded-lg text-left ${selectedAnswer === index ? (index === currentQuestion.correctAnswer ? 'bg-green-400' : 'bg-red-400') : 'bg-gray-100'}`}
              onClick={() => handleAnswerSelect(index)}
            >
              {option}
            </motion.button>
          ))}
        </div>
      </motion.div>
    );
  };

  // Render category selection
  const renderCategorySelection = () => (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-6">Select a Category</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategorySelect(category)}
            className="p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-400"
          >
            {category.title}
          </button>
        ))}
      </div>
    </div>
  );

  // If the quiz is finished, show the result
  if (isQuizFinished) {
    return renderResult();
  }

  // If a category is selected, start showing the quiz
  if (selectedCategory) {
    return (
      <div className="max-w-xl mx-auto mt-8">
        <button
          onClick={() => setSelectedCategory(null)}
          className="mb-6 text-blue-500 hover:text-blue-400"
        >
          Back to Categories
        </button>
        {questions.length > 0 ? renderQuestion() : <p>Loading questions...</p>}
      </div>
    );
  }

  // Show category selection if no category is selected
  return renderCategorySelection();
};

export default QuizPage;
