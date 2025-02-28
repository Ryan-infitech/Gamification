import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, BookOpen, Trophy, Users, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  currentPath: string;
}

const menuItems = [
  { icon: BookOpen, text: "Home", path: "/" },
  { icon: Trophy, text: "Pencapaian", path: "/AchievementsPage" },
  { icon: Code2, text: "Latihan Koding", path: "/latihan" },
  { icon: Users, text: "Komunitas", path: "/komunitas" },
  { icon: Mail, text: "Hubungi Kami", path: "/contact" },
  { icon: Mail, text: "try", path: "/try" },
];

export default function Sidebar({
  isOpen,
  setIsOpen,
  currentPath,
}: SidebarProps) {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg z-50"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                  Hello World
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {menuItems.map((item, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ x: 5 }}
                    onClick={() => handleNavigation(item.path)}
                    className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors ${
                      currentPath === item.path
                        ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <item.icon
                      className={`w-5 h-5 ${
                        currentPath === item.path
                          ? "text-indigo-600 dark:text-indigo-400"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    />
                    <span
                      className={`${
                        currentPath === item.path
                          ? "text-indigo-600 dark:text-indigo-400"
                          : "text-gray-800 dark:text-gray-200"
                      }`}
                    >
                      {item.text}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black z-40"
          />
        </>
      )}
    </AnimatePresence>
  );
}
