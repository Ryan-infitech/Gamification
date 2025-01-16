import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import Quiz from './components/Quiz';
import Landing from './components/Landing';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import AchievementsPage from './components/AchievementsPage';
import { quizCategories, QuizCategory } from './data/questions';
import { Sun, Moon } from 'lucide-react';

// Interface for quiz results
interface QuizResult {
  categoryId: string;
  score: number;
  totalQuestions: number;
  timestamp: Date;
}

// AppContent component to handle router-dependent logic
function AppContent() {
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  
  const location = useLocation();
  const navigate = useNavigate();

  // Load quiz results from localStorage on mount
  useEffect(() => {
    const savedResults = localStorage.getItem('quizResults');
    if (savedResults) {
      setQuizResults(JSON.parse(savedResults));
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const saveQuizResult = (result: QuizResult) => {
    const newResults = [...quizResults, result];
    setQuizResults(newResults);
    localStorage.setItem('quizResults', JSON.stringify(newResults));
  };

  const handleSelectCategory = (category: QuizCategory) => {
    setSelectedCategory(category);
    navigate('/quiz');
  };

  const handleQuizBack = () => {
    setSelectedCategory(null);
    navigate('/');
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
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
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button
              onClick={toggleDarkMode}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg text-gray-700 dark:text-gray-200"
            >
              {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>
          </nav>

          {/* Main content */}
          <main className={`min-h-screen bg-gradient-to-br ${
            isDarkMode 
              ? 'from-slate-950 via-slate-900 to-slate-800 text-gray-100' 
              : 'from-blue-50 via-indigo-50 to-indigo-100 text-gray-800'
          } py-12 px-4 transition-colors duration-300`}>
            <Routes>
              <Route 
                path="/" 
                element={
                  <Landing 
                    categories={quizCategories} 
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
                      onComplete={(score) => {
                        saveQuizResult({
                          categoryId: selectedCategory.id,
                          score,
                          totalQuestions: selectedCategory.questions.length,
                          timestamp: new Date()
                        });
                      }}
                    />
                  ) : (
                    <Navigate to="/" replace />
                  )
                } 
              />
              <Route 
                path="/achievements" 
                element={
                  <AchievementsPage 
                    quizResults={quizResults}
                    categories={quizCategories}
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