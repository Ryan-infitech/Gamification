import React from "react";
import {
  Github,
  Linkedin,
  Mail,
  Globe,
  Instagram,
  PhoneCallIcon,
  PhoneIcon,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Programing Learning
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Platform pembelajaran interaktif untuk mengembangkan kemampuan
              programming Anda melalui quiz dan latihan.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Kontak
            </h3>
            <div className="space-y-2">
              <a
                href="mailto:rianseptiawan@infitech.or.id"
                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                <Mail className="w-5 h-5 mr-2" />
                rianseptiawan@infitech.or.id
              </a>
              <a
                href="https://riyanseptiawan.github.io/"
                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                <Globe className="w-5 h-5 mr-2" />
                https://riyanseptiawan.github.io/
              </a>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Sosial Media
            </h3>
            <div className="flex space-x-4 justify-center">
              <a
                href="https://github.com/Ryan-infitech"
                className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                <Github className="w-6 h-6" />
              </a>
              <a
                href="https://www.instagram.com/ryan.septiawan__/"
                className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="https://api.whatsapp.com/send?phone=6285157517798"
                className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                <PhoneIcon className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-gray-600 dark:text-gray-300">
            © 2025 Directed by{" "}
            <a
              href="https://github.com/Ryan-infitech"
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Rian Septiawan
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
