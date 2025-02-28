import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, useScroll, useInView } from "framer-motion";
import {
  Code2,
  Component,
  FileType,
  Brain,
  ArrowRight,
  BookOpen,
  Lightbulb,
} from "lucide-react";

// Types
type IconKey =
  | "Code2"
  | "Component"
  | "FileType"
  | "Brain"
  | "BookOpen"
  | "Lightbulb";

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
  type: "image" | "gif" | "icon";
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
  Lightbulb,
};

const learningPaths: MediaPath[] = [
  {
    type: "image",
    source:
      "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExdzB3NnBmYWxiMmYwdjZ4ODQ2NGlpNGw5amQzeDM5b25zc3h5eWE2eiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/jM4NGpvx6jZmW93hcZ/giphy.gif",
    title: "Dasar Pemrograman",
    description:
      "Pelajari konsep dasar pemrograman yang akan menjadi fondasi karir Anda sebagai developer.",
  },
  {
    type: "image",
    source:
      "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ21vcHU4aDJxaDk5aWE4ZzBva3Y0cHh5bmcwMGw4cW52emIwOWpiYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/73kKE9yqx9gSZDaB2e/giphy.gif",
    title: "Frontend Development",
    description:
      "Kuasai teknologi modern untuk membangun antarmuka web yang interaktif dan responsif.",
  },
  {
    type: "image",
    source:
      "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZHVtNWw2eHNtdGk2dXh5c29jOTA1ejF1bXE4N25hMGo0YnQ2bHJoayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/bi6RQ5x3tqoSI/giphy.gif",
    title: "Backend Development",
    description:
      "Pelajari cara membangun server, API, dan mengelola database untuk aplikasi yang scalable.",
  },
];

const funFacts = [
  {
    title: "Tahukah Kamu?",
    content:
      "JavaScript awalnya dibuat hanya dalam 10 hari oleh Brendan Eich pada tahun 1995!",
  },
  {
    title: "Fakta Menarik",
    content: "Ada lebih dari 700 bahasa pemrograman yang ada di dunia!",
  },
  {
    title: "Tips Developer",
    content:
      "90% waktu programmer dihabiskan untuk membaca kode, bukan menulis kode.",
  },
];

// Scroll Animation Hook with Reset Capability
const useScrollAnimation = (threshold = 0.2) => {
  const ref = useRef(null);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [shouldReset, setShouldReset] = useState(false);

  const inView = useInView(ref, {
    amount: threshold,
    once: false,
  });

  useEffect(() => {
    if (inView && !shouldReset) {
      setHasTriggered(true);
    } else if (!inView && shouldReset) {
      setHasTriggered(false);
      setShouldReset(false);
    }
  }, [inView, shouldReset]);

  const reset = useCallback(() => {
    setHasTriggered(false);
    setShouldReset(true);
  }, []);

  return [ref, inView || hasTriggered, reset] as const;
};

// Components
const MediaContainer: React.FC<{ path: MediaPath }> = ({ path }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  if (path.type === "icon") {
    const Icon = icons[path.source as IconKey];
    return (
      <div className="w-12 h-12 bg-indigo-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4">
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
          <span className="text-gray-500 dark:text-gray-400">
            Gagal memuat gambar
          </span>
        </div>
      ) : (
        <img
          src={path.source}
          alt={path.title}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoading ? "opacity-0" : "opacity-100"
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

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-indigo-600 dark:bg-indigo-500 z-50 origin-left"
      style={{ scaleX: scrollYProgress }}
    />
  );
};

const HeroSection: React.FC<{ addResetRef: (reset: () => void) => void }> = ({
  addResetRef,
}) => {
  const [ref, inView, reset] = useScrollAnimation(0.1);

  useEffect(() => {
    addResetRef(reset);
  }, [addResetRef, reset]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.7 }}
      className="text-center mb-16 min-h-[70vh] flex flex-col justify-center"
    >
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Selamat Datang di Developer Quiz
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
        Uji dan tingkatkan pengetahuan pemrograman Anda melalui quiz interaktif
        kami!
      </p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-8"
      >
        <motion.div
          className="mx-auto w-8 h-16 border-2 border-indigo-500 rounded-full flex items-start justify-center p-2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <div className="w-1 h-3 bg-indigo-500 rounded-full" />
        </motion.div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Scroll untuk menjelajahi
        </p>
      </motion.div>
    </motion.div>
  );
};

const LearningPathsSection: React.FC<{
  addResetRef: (reset: () => void) => void;
}> = ({ addResetRef }) => {
  const [sectionRef, sectionInView, resetSection] = useScrollAnimation(0.1);

  useEffect(() => {
    addResetRef(resetSection);
  }, [addResetRef, resetSection]);

  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0 }}
      animate={sectionInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.7 }}
      className="mb-16 py-16 mt-32" // Added margin top to push content down
    >
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8 text-center">
        Jalur Pembelajaran
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {learningPaths.map((path, index) => {
          const [pathRef, pathInView, resetPath] = useScrollAnimation(0.2);

          useEffect(() => {
            addResetRef(resetPath);
          }, [addResetRef, resetPath]);

          return (
            <motion.div
              key={index}
              ref={pathRef}
              initial={{ opacity: 0, y: 50 }}
              animate={
                pathInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
              }
              transition={{ delay: index * 0.2, duration: 0.5 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <MediaContainer path={path} />
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {path.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {path.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
};

const FunFactsSection: React.FC<{
  addResetRef: (reset: () => void) => void;
}> = ({ addResetRef }) => {
  const [sectionRef, sectionInView, resetSection] = useScrollAnimation(0.2);

  useEffect(() => {
    addResetRef(resetSection);
  }, [addResetRef, resetSection]);

  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0 }}
      animate={sectionInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.7 }}
      className="mb-16 py-16"
    >
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8 text-center">
        Fakta Menarik
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {funFacts.map((fact, index) => {
          const [factRef, factInView, resetFact] = useScrollAnimation(0.2);

          useEffect(() => {
            addResetRef(resetFact);
          }, [addResetRef, resetFact]);

          return (
            <motion.div
              key={index}
              ref={factRef}
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={
                factInView
                  ? { opacity: 1, scale: 1, y: 0 }
                  : { opacity: 0, scale: 0.9, y: 30 }
              }
              transition={{ delay: index * 0.2, duration: 0.5 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
            >
              <Lightbulb className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {fact.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300">{fact.content}</p>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
};

const QuizCategoriesSection: React.FC<{
  categories: QuizCategory[];
  onSelectCategory: (category: QuizCategory) => void;
  addResetRef: (reset: () => void) => void;
}> = ({ categories, onSelectCategory, addResetRef }) => {
  const [sectionRef, sectionInView, resetSection] = useScrollAnimation(0.1);

  useEffect(() => {
    addResetRef(resetSection);
  }, [addResetRef, resetSection]);

  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0 }}
      animate={sectionInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.7 }}
      className="mb-16 py-16"
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
          const [categoryRef, categoryInView, resetCategory] =
            useScrollAnimation(0.1);
          const Icon = icons[category.icon];

          useEffect(() => {
            addResetRef(resetCategory);
          }, [addResetRef, resetCategory]);

          return (
            <motion.div
              key={category.id}
              ref={categoryRef}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30, y: 20 }}
              animate={
                categoryInView
                  ? { opacity: 1, x: 0, y: 0 }
                  : { opacity: 0, x: index % 2 === 0 ? -30 : 30, y: 20 }
              }
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <button
                onClick={() => onSelectCategory(category)}
                className="w-full h-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-left hover:shadow-xl transition-all hover:-translate-y-1 group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-indigo-100 dark:bg-gray-800 rounded-lg text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    {Icon && <Icon className="w-6 h-6" />}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {category.title}
                  </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {category.description}
                </p>
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
};

// Main Component
const Landing: React.FC<LandingProps> = ({ categories, onSelectCategory }) => {
  const [scrolled, setScrolled] = useState(false);
  const resetRefs = useRef<(() => void)[]>([]);

  // Function untuk menambahkan reset function
  const addResetRef = (reset: () => void) => {
    resetRefs.current.push(reset);
  };

  // Function untuk reset semua animasi
  const resetAllAnimations = () => {
    resetRefs.current.forEach((reset) => reset());
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Reset animations ketika user scroll ke atas
      if (window.scrollY === 0) {
        resetAllAnimations();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(resetAllAnimations, 500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      <ScrollProgress />

      <HeroSection addResetRef={addResetRef} />
      <LearningPathsSection addResetRef={addResetRef} />
      <FunFactsSection addResetRef={addResetRef} />
      <QuizCategoriesSection
        categories={categories}
        onSelectCategory={onSelectCategory}
        addResetRef={addResetRef}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center pb-16"
      >
        <p className="text-gray-600 dark:text-gray-300">
          Quiz baru ditambahkan secara berkala. Pantau terus untuk tantangan
          baru!
        </p>
      </motion.div>

      {scrolled && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed bottom-8 right-8 p-3 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 focus:outline-none z-50"
          onClick={scrollToTop}
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <line x1="12" y1="19" x2="12" y2="5"></line>
            <polyline points="5 12 12 5 19 12"></polyline>
          </motion.svg>
        </motion.button>
      )}
    </div>
  );
};

export default Landing;
