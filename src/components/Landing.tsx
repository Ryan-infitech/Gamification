import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Code2, 
  Component, 
  FileType, 
  Brain, 
  ArrowRight, 
  BookOpen, 
  Lightbulb 
} from 'lucide-react';

// Types
type IconKey = 'Code2' | 'Component' | 'FileType' | 'Brain' | 'BookOpen' | 'Lightbulb';

interface QuizCategory {
  id: string;
  title: string;
  description: string;
  icon: IconKey;
}

interface LandingProps {
  categories: QuizCategory[];
  onSelectCategory: (category: QuizCategory) => void;
  isDarkMode?: boolean;
}

interface MediaPath {
  type: 'image' | 'gif' | 'icon';
  source: string;
  title: string;
  description: string;
}

// Constants
const icons: Record<IconKey, React.ElementType> = {
  Code2,
  Component,
  FileType,
  Brain,
  BookOpen,
  Lightbulb
};

const learningPaths: MediaPath[] = [
  {
    type: 'image',
    source: 'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExdzB3NnBmYWxiMmYwdjZ4ODQ2NGlpNGw5amQzeDM5b25zc3h5eWE2eiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/jM4NGpvx6jZmW93hcZ/giphy.gif',
    title: "Dasar Pemrograman",
    description: "Pelajari konsep dasar pemrograman yang akan menjadi fondasi karir Anda sebagai developer."
  },
  {
    type: 'image',
    source: 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ21vcHU4aDJxaDk5aWE4ZzBva3Y0cHh5bmcwMGw4cW52emIwOWpiYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/73kKE9yqx9gSZDaB2e/giphy.gif',
    title: "Frontend Development",
    description: "Kuasai teknologi modern untuk membangun antarmuka web yang interaktif dan responsif."
  },
  {
    type: 'image',
    source: 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZHVtNWw2eHNtdGk2dXh5c29jOTA1ejF1bXE4N25hMGo0YnQ2bHJoayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/bi6RQ5x3tqoSI/giphy.gif',
    title: "Backend Development",
    description: "Pelajari cara membangun server, API, dan mengelola database untuk aplikasi yang scalable."
  }
];

const funFacts = [
  {
    title: "Tahukah Kamu?",
    content: "JavaScript awalnya dibuat hanya dalam 10 hari oleh Brendan Eich pada tahun 1995!"
  },
  {
    title: "Fakta Menarik",
    content: "Ada lebih dari 700 bahasa pemrograman yang ada di dunia!"
  },
  {
    title: "Tips Developer",
    content: "90% waktu programmer dihabiskan untuk membaca kode, bukan menulis kode."
  }
];

// Components
const MediaContainer: React.FC<{ path: MediaPath }> = ({ path }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  if (path.type === 'icon') {
    const Icon = icons[path.source as IconKey];
    return (
      <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden mb-4">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400" />
        </div>
      )}
      
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <span className="text-gray-500 dark:text-gray-400">Gagal memuat gambar</span>
        </div>
      ) : (
        <img 
          src={path.source}
          alt={path.title}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setError(true);
            setIsLoading(false);
          }}
        />
      )}
    </div>
  );
};

const HeroSection: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center mb-16"
  >
    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
      Selamat Datang di Developer Quiz
    </h1>
    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
      Uji dan tingkatkan pengetahuan pemrograman Anda melalui quiz interaktif kami!
    </p>
  </motion.div>
);

const LearningPathsSection: React.FC = () => (
  <motion.section className="mb-16">
    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8 text-center">
      Jalur Pembelajaran
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {learningPaths.map((path, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
        >
          <MediaContainer path={path} />
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {path.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">{path.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.section>
);

const FunFactsSection: React.FC = () => (
  <motion.section
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.4 }}
    className="mb-16"
  >
    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8 text-center">
      Fakta Menarik
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {funFacts.map((fact, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 p-6 rounded-xl shadow-md"
        >
          <Lightbulb className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {fact.title}
          </h3>
          <p className="text-gray-700 dark:text-gray-300">{fact.content}</p>
        </motion.div>
      ))}
    </div>
  </motion.section>
);

const QuizCategoriesSection: React.FC<{
  categories: QuizCategory[];
  onSelectCategory: (category: QuizCategory) => void;
}> = ({ categories, onSelectCategory }) => (
  <motion.section
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.6 }}
    className="mb-16"
  >
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        Pilih Quiz Anda
      </h2>
      <p className="text-gray-600 dark:text-gray-300">
        Tantang diri Anda dengan berbagai topik pemrograman yang tersedia
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category, index) => {
        const Icon = icons[category.icon];
        return (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <button
              onClick={() => onSelectCategory(category)}
              className="w-full h-full bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 text-left hover:shadow-xl transition-all hover:-translate-y-1 group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  {Icon && <Icon className="w-6 h-6" />}
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {category.title}
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{category.description}</p>
              <div className="flex items-center text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300">
                Mulai Quiz <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </button>
          </motion.div>
        );
      })}
    </div>
  </motion.section>
);

// Main Component
const Landing: React.FC<LandingProps> = ({ categories, onSelectCategory }) => {
  return (
    <div className="max-w-6xl mx-auto px-4">
      <HeroSection />
      <LearningPathsSection />
      <FunFactsSection />
      <QuizCategoriesSection 
        categories={categories} 
        onSelectCategory={onSelectCategory} 
      />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center"
      >
        <p className="text-gray-600 dark:text-gray-300">
          Quiz baru ditambahkan secara berkala. Pantau terus untuk tantangan baru!
        </p>
      </motion.div>
    </div>
  );
};

export default Landing;