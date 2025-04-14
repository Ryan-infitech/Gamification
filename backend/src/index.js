require('dotenv').config();
const express = require('express');
const cors = require('cors');
const quizRoutes = require('./routes/quiz');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/quiz', quizRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Quiz API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
