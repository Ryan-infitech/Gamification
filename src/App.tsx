import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";
import Quiz from "./components/Quiz";
import Landing from "./components/Landing";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import LeaderboardPage from "./components/LeaderboardPage";
import { questionService } from "./services/questionService";
import { Sun, Moon } from "lucide-react";

// Interface for quiz category
interface QuizCategory {
  id: string;
  title: string;  // ubah dari 'name' ke 'title'
  description: string;
  icon: IconKey;  // tambahkan icon sesuai Landing.tsx
}

// Interface for quiz results
interface QuizResult {
  userId: string;
  username: string;
  categoryId: string;
  score: number;
  totalQuestions: number;
  completionTime: number;
  timestamp: Date;
}

// Interface for quiz category with questions
interface QuizCategoryWithQuestions extends QuizCategory {
  questions: Array<{
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation?: string;
  }>;
}

// AppContent component to handle router-dependent logic
function AppContent() {
  const [selectedCategory, setSelectedCategory] = 
    useState<QuizCategoryWithQuestions | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [categories, setCategories] = useState<QuizCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  // Load categories and their questions
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData: QuizCategory[] = [
          { 
            id: 'javascript', 
            title: 'JavaScript Dasar',
            description: 'Uji pengetahuan Anda tentang JavaScript dasar, fitur ES6, dan pola umum',
            icon: 'Code2'  // sesuaikan dengan icon yang diinginkan
          }
        ];
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error loading categories:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadCategories();
  }, []);
  

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleSelectCategory = async (category: QuizCategory) => {
    try {
      setIsLoading(true);
      const questions = await questionService.getQuestionsByCategory(category.id);
      setSelectedCategory({ ...category, questions });
      navigate("/quiz");
    } catch (error) {
      console.error("Error loading questions:", error);
    } finally {
      setIsLoading(false);
    }
  };  

  const handleQuizBack = () => {
    setSelectedCategory(null);
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }
  
  if (!categories.length) {
    return (
      <div className="text-center">
        <p>No categories found. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <div className="flex">
        <Sidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          currentPath={location.pathname}
        />

        <div className="flex-1 transition-all duration-300">
          {/* Navbar */}
          <nav className="bg-white dark:bg-slate-900 shadow-md px-4 py-3 flex justify-between items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg text-gray-700 dark:text-gray-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <button
              onClick={toggleDarkMode}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg text-gray-700 dark:text-gray-200"
            >
              {isDarkMode ? (
                <Sun className="w-6 h-6" />
              ) : (
                <Moon className="w-6 h-6" />
              )}
            </button>
          </nav>

          {/* Main content */}
          <main
            className={`min-h-screen bg-gradient-to-br ${
              isDarkMode
                ? "from-slate-950 via-slate-900 to-slate-800 text-gray-100"
                : "from-blue-50 via-indigo-50 to-indigo-100 text-gray-800"
            } py-12 px-4 transition-colors duration-300`}
          >
            <Routes>
              <Route
                path="/"
                element={
                  <Landing
                    categories={categories}
                    onSelectCategory={handleSelectCategory}
                    isDarkMode={isDarkMode}
                  />
                }
              />
              <Route
                path="/quiz"
                element={
                  selectedCategory ? (
                    <Quiz
                      category={selectedCategory}
                      onBack={handleQuizBack}
                      isDarkMode={isDarkMode}
                    />
                  ) : (
                    <Navigate to="/" replace />
                  )
                }
              />
              <Route
                path="/leaderboard"
                element={
                  <LeaderboardPage
                    categories={categories}
                    isDarkMode={isDarkMode}
                  />
                }
              />
              <Route
                path="/materi"
                element={
                  <div className="text-center p-8">
                    <h1 className="text-2xl font-bold mb-4">Materi Belajar</h1>
                    <p>Halaman ini sedang dalam pengembangan</p>
                  </div>
                }
              />
              <Route
                path="/latihan"
                element={
                  <div className="text-center p-8">
                    <h1 className="text-2xl font-bold mb-4">Latihan Koding</h1>
                    <p>Halaman ini sedang dalam pengembangan</p>
                  </div>
                }
              />
              <Route
                path="/komunitas"
                element={
                  <div className="text-center p-8">
                    <h1 className="text-2xl font-bold mb-4">Komunitas</h1>
                    <p>Halaman ini sedang dalam pengembangan</p>
                  </div>
                }
              />
              <Route
                path="/contact"
                element={
                  <div className="text-center p-8">
                    <h1 className="text-2xl font-bold mb-4">Hubungi Kami</h1>
                    <p>Halaman ini sedang dalam pengembangan</p>
                  </div>
                }
              />
            </Routes>
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
}

// Main App component wrapping Router
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;