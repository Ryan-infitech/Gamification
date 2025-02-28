import React from "react";
import { Github, Linkedin, Instagram, Mail, Globe, Code } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900">
      {/* Accent Bar */}
      <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500"></div>
      
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="flex items-center mb-4">
              <div className="bg-indigo-600 h-8 w-8 rounded-md flex items-center justify-center mr-3">
                <Code className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Programing Learning</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Platform pembelajaran interaktif untuk mengembangkan kemampuan programming Anda melalui quiz dan latihan.
            </p>
            <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                © 2025 Directed by{" "}
                <a
                  href="https://github.com/Ryan-infitech"
                  className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Rian Septiawan
                </a>
              </p>
            </div>
          </div>
          
          {/* Navigation Columns */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Links Column */}
              <div>
                <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">
                  Platform
                </h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                      Home
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                      Quiz
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                      Materi
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                      Forum
                    </a>
                  </li>
                </ul>
              </div>
              
              {/* Contact Column */}
              <div>
                <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">
                  Kontak
                </h3>
                <ul className="space-y-3">
                  <li>
                    <a 
                      href="mailto:rianseptiawan@infitech.or.id" 
                      className="flex items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      <span>rianseptiawan@infitech.or.id</span>
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://riyanseptiawan.github.io/" 
                      className="flex items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      <span>riyanseptiawan.github.io</span>
                    </a>
                  </li>
                </ul>
              </div>
              
              {/* Social Media Column */}
              <div>
                <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">
                  Sosial Media
                </h3>
                <div className="flex space-x-3">
                  <a 
                    href="https://github.com/Ryan-infitech" 
                    className="h-8 w-8 rounded-full bg-white dark:bg-gray-800 shadow-sm hover:shadow flex items-center justify-center hover:bg-indigo-50 dark:hover:bg-gray-700 transition-all duration-200"
                    aria-label="GitHub"
                  >
                    <Github className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                  </a>
                  <a 
                    href="https://www.linkedin.com/in/rian-septiawan-23b0a5351/" 
                    className="h-8 w-8 rounded-full bg-white dark:bg-gray-800 shadow-sm hover:shadow flex items-center justify-center hover:bg-indigo-50 dark:hover:bg-gray-700 transition-all duration-200"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                  </a>
                  <a 
                    href="https://www.instagram.com/ryan.septiawan__/" 
                    className="h-8 w-8 rounded-full bg-white dark:bg-gray-800 shadow-sm hover:shadow flex items-center justify-center hover:bg-indigo-50 dark:hover:bg-gray-700 transition-all duration-200"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                  </a>
                </div>
                
                <div className="mt-6">
                  <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>
                    Aktif
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}