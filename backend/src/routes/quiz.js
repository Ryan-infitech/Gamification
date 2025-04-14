const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");

// Get all quiz categories
router.get("/categories", quizController.getAllCategories);

// Get a specific quiz category with questions
router.get("/categories/:id", quizController.getCategoryById);

// Add a new quiz category
router.post("/categories", quizController.createCategory);

// Update a quiz category
router.put("/categories/:id", quizController.updateCategory);

// Delete a quiz category
router.delete("/categories/:id", quizController.deleteCategory);

// Add a question to a category
router.post("/categories/:id/questions", quizController.addQuestion);

// Update a question
router.put("/questions/:id", quizController.updateQuestion);

// Delete a question
router.delete("/questions/:id", quizController.deleteQuestion);

// Save a quiz result
router.post("/results", quizController.saveResult);

// Get quiz results for a user
router.get("/results/user/:userId", quizController.getUserResults);

module.exports = router;
