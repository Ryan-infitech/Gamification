import { AppWindow } from 'lucide-react';

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface QuizCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  questions: Question[];
}

export const quizCategories: QuizCategory[] = [
  {
    id: "javascript",
    title: "JavaScript Dasar",
    description:
      "Uji pengetahuan Anda tentang JavaScript dasar, fitur ES6, dan pola umum",
    icon: "Code2",
    questions: [
      {
        id: 1,
        question: "Apa output dari: console.log(typeof [])?",
        options: ["'array'", "'object'", "'undefined'", "'null'"],
        correctAnswer: 1,
      },
      {
        id: 2,
        question:
          "Method apa yang digunakan untuk menambahkan elemen di akhir array?",
        options: ["push()", "unshift()", "append()", "add()"],
        correctAnswer: 0,
      },
      {
        id: 3,
        question: "Apa itu closure dalam JavaScript?",
        options: [
          "Fungsi yang memiliki akses ke variabel di scope luarnya",
          "Cara untuk menutup jendela browser",
          "Method untuk mengakhiri loop",
          "Tipe penanganan error",
        ],
        correctAnswer: 0,
      },
      {
        id: 4,
        question: "Apa yang dilakukan 'use strict'?",
        options: [
          "Mengaktifkan mode strict untuk penanganan error yang lebih baik",
          "Membuat kode berjalan lebih cepat",
          "Mengimpor semua modul secara otomatis",
          "Menonaktifkan semua console log",
        ],
        correctAnswer: 0,
      },
      {
        id: 5,
        question:
          "Cara yang benar untuk mengecek apakah variabel adalah array?",
        options: [
          "typeof variable === 'array'",
          "variable instanceof Array",
          "Array.isArray(variable)",
          "variable.isArray()",
        ],
        correctAnswer: 2,
      },
    ],
  },
  {
    id: "react",
    title: "React Fundamental",
    description:
      "Tantang diri Anda dengan konsep React, hooks, dan praktik terbaik",
    icon: "Component",
    questions: [
      {
        id: 1,
        question: "Hook apa yang harus digunakan untuk side effects di React?",
        options: ["useEffect", "useState", "useContext", "useReducer"],
        correctAnswer: 0,
      },
      {
        id: 2,
        question: "Apa tujuan dari prop key dalam daftar React?",
        options: [
          "Untuk mengidentifikasi elemen dalam list secara unik",
          "Untuk styling item list",
          "Untuk menghitung item list",
          "Untuk mengurutkan item list",
        ],
        correctAnswer: 0,
      },
      {
        id: 3,
        question:
          "Hook apa yang digunakan untuk mengelola state lokal di React?",
        options: ["useEffect", "useState", "useContext", "useRef"],
        correctAnswer: 1,
      },
      {
        id: 4,
        question: "Apa itu Virtual DOM di React?",
        options: [
          "Salinan virtual dari DOM asli untuk optimasi performa",
          "Ekstensi browser",
          "Framework testing",
          "Solusi routing",
        ],
        correctAnswer: 0,
      },
      {
        id: 5,
        question: "Cara yang benar untuk meneruskan props ke komponen?",
        options: [
          "<Component props={props}>",
          "<Component {props}>",
          "<Component ...props>",
          "<Component {...props}>",
        ],
        correctAnswer: 3,
      },
    ],
  },
  {
    id: "typescript",
    title: "TypeScript Dasar",
    description: "Kuasai tipe, interface, dan fitur lanjutan TypeScript",
    icon: "FileType",
    questions: [
      {
        id: 1,
        question: "Apa tujuan dari keyword 'interface' di TypeScript?",
        options: [
          "Untuk mendefinisikan kontrak struktur objek",
          "Untuk membuat class baru",
          "Untuk mengimpor modul",
          "Untuk mendefinisikan fungsi",
        ],
        correctAnswer: 0,
      },
      {
        id: 2,
        question: "Apa arti tipe 'any' di TypeScript?",
        options: [
          "Menonaktifkan pengecekan tipe untuk variabel",
          "Hanya mengizinkan angka",
          "Hanya mengizinkan string",
          "Membuat variabel menjadi private",
        ],
        correctAnswer: 0,
      },
      {
        id: 3,
        question: "Apa itu Union Type di TypeScript?",
        options: [
          "Tipe yang bisa menjadi salah satu dari beberapa tipe",
          "Tipe khusus untuk union",
          "Tipe untuk menggabungkan class",
          "Tipe khusus untuk array",
        ],
        correctAnswer: 0,
      },
      {
        id: 4,
        question: "Cara yang benar untuk mendefinisikan properti opsional?",
        options: [
          "property?: type",
          "property!: type",
          "property?: optional",
          "optional property: type",
        ],
        correctAnswer: 0,
      },
      {
        id: 5,
        question: "Untuk apa keyword 'as' digunakan di TypeScript?",
        options: [
          "Type assertion",
          "Mengimpor modul",
          "Membuat loop",
          "Deklarasi fungsi",
        ],
        correctAnswer: 0,
      },
    ],
  },
  {
    id: "html-css",
    title: "HTML & CSS",
    description:
      "Pelajari dasar-dasar HTML5 dan CSS3 untuk pengembangan web modern",
    icon: "AppWindow",
    questions: [
      {
        id: 1,
        question: "Apa fungsi utama dari tag <meta viewport>?",
        options: [
          "Mengatur tampilan responsif untuk perangkat mobile",
          "Menambahkan metadata SEO",
          "Mengatur warna tema browser",
          "Mengimpor font eksternal",
        ],
        correctAnswer: 0,
      },
      {
        id: 2,
        question:
          "Property CSS mana yang digunakan untuk membuat layout flexbox?",
        options: [
          "display: flex",
          "position: flex",
          "flex: true",
          "layout: flex",
        ],
        correctAnswer: 0,
      },
      {
        id: 3,
        question: "Apa perbedaan antara margin dan padding?",
        options: [
          "Margin adalah jarak luar elemen, padding adalah jarak dalam elemen",
          "Margin untuk warna, padding untuk ukuran",
          "Margin hanya horizontal, padding hanya vertical",
          "Tidak ada perbedaan",
        ],
        correctAnswer: 0,
      },
      {
        id: 4,
        question:
          "Selector CSS mana yang memilih semua elemen <p> dalam <div>?",
        options: ["div p", "div > p", "div + p", "div.p"],
        correctAnswer: 0,
      },
      {
        id: 5,
        question: "Unit CSS mana yang relatif terhadap ukuran viewport?",
        options: ["vh dan vw", "px dan em", "% dan pt", "cm dan mm"],
        correctAnswer: 0,
      },
    ],
  },
  {
    id: "node-js",
    title: "Node.js",
    description:
      "Pelajari pengembangan backend dengan Node.js dan ekosistemnya",
    icon: "Server",
    questions: [
      {
        id: 1,
        question: "Apa itu Node.js?",
        options: [
          "Runtime JavaScript yang berjalan di server",
          "Framework frontend",
          "Database NoSQL",
          "Sistem operasi",
        ],
        correctAnswer: 0,
      },
      {
        id: 2,
        question: "Package manager default untuk Node.js adalah?",
        options: ["npm", "yarn", "pnpm", "bower"],
        correctAnswer: 0,
      },
      {
        id: 3,
        question: "Fungsi require() di Node.js digunakan untuk?",
        options: [
          "Mengimpor modul",
          "Membuat variabel",
          "Menjalankan fungsi",
          "Membuat route",
        ],
        correctAnswer: 0,
      },
      {
        id: 4,
        question: "Event loop di Node.js adalah?",
        options: [
          "Mekanisme untuk menangani operasi asynchronous",
          "Library untuk membuat loop",
          "Framework testing",
          "Package manager",
        ],
        correctAnswer: 0,
      },
      {
        id: 5,
        question: "Express.js adalah?",
        options: [
          "Framework web untuk Node.js",
          "Database",
          "Browser",
          "Operating system",
        ],
        correctAnswer: 0,
      },
    ],
  },
  {
    id: "git",
    title: "Git & Version Control",
    description: "Kuasai dasar-dasar Git dan manajemen versi kode",
    icon: "Git",
    questions: [
      {
        id: 1,
        question: "Perintah Git untuk membuat branch baru adalah?",
        options: [
          "git branch <nama-branch>",
          "git new branch",
          "git create branch",
          "git -b branch",
        ],
        correctAnswer: 0,
      },
      {
        id: 2,
        question: "Apa fungsi git pull?",
        options: [
          "Mengambil dan menggabungkan perubahan dari remote repository",
          "Mengunggah perubahan ke remote repository",
          "Membuat branch baru",
          "Menghapus branch",
        ],
        correctAnswer: 0,
      },
      {
        id: 3,
        question: "Apa itu merge conflict?",
        options: [
          "Konflik saat menggabungkan dua branch dengan perubahan yang bertentangan",
          "Error saat instalasi Git",
          "Masalah koneksi ke remote repository",
          "Bug dalam kode",
        ],
        correctAnswer: 0,
      },
      {
        id: 4,
        question: "Perintah untuk melihat riwayat commit adalah?",
        options: ["git log", "git history", "git show", "git commit -h"],
        correctAnswer: 0,
      },
      {
        id: 5,
        question: "Apa fungsi .gitignore?",
        options: [
          "Menentukan file yang tidak perlu ditrack Git",
          "Menyimpan kredensial Git",
          "Konfigurasi Git",
          "Menyimpan branch information",
        ],
        correctAnswer: 0,
      },
    ],
  },
];
