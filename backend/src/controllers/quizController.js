const supabase = require("../models/supabase");

// Get all quiz categories
exports.getAllCategories = async (req, res) => {
  try {
    const { data, error } = await supabase.from("quiz_categories").select("*");

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get a specific category with its questions
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    // Get the category
    const { data: category, error: categoryError } = await supabase
      .from("quiz_categories")
      .select("*")
      .eq("id", id)
      .single();

    if (categoryError) throw categoryError;
    if (!category) return res.status(404).json({ error: "Category not found" });

    // Get the questions for this category
    const { data: questions, error: questionsError } = await supabase
      .from("quiz_questions")
      .select("*")
      .eq("category_id", id);

    if (questionsError) throw questionsError;

    // Format the response to match the frontend structure
    const formattedQuestions = questions.map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options,
      correctAnswer: q.correct_answer,
    }));

    const result = {
      ...category,
      questions: formattedQuestions,
    };

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ error: error.message });
  }
};

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const { title, description, icon } = req.body;

    if (!title || !description || !icon) {
      return res
        .status(400)
        .json({ error: "Title, description and icon are required" });
    }

    const { data, error } = await supabase
      .from("quiz_categories")
      .insert([
        {
          id: title.toLowerCase().replace(/\s+/g, "-"),
          title,
          description,
          icon,
        },
      ])
      .select();

    if (error) throw error;

    res.status(201).json(data[0]);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update a category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, icon } = req.body;

    const { data, error } = await supabase
      .from("quiz_categories")
      .update({ title, description, icon })
      .eq("id", id)
      .select();

    if (error) throw error;
    if (data.length === 0)
      return res.status(404).json({ error: "Category not found" });

    res.status(200).json(data[0]);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // First delete all questions in the category
    await supabase.from("quiz_questions").delete().eq("category_id", id);

    // Then delete the category
    const { error, count } = await supabase
      .from("quiz_categories")
      .delete()
      .eq("id", id);

    if (error) throw error;
    if (count === 0)
      return res.status(404).json({ error: "Category not found" });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: error.message });
  }
};

// Add a question to a category
exports.addQuestion = async (req, res) => {
  try {
    const { id: categoryId } = req.params;
    const { question, options, correctAnswer } = req.body;

    if (!question || !options || correctAnswer === undefined) {
      return res.status(400).json({
        error: "Question, options and correctAnswer are required",
      });
    }

    const { data, error } = await supabase
      .from("quiz_questions")
      .insert([
        {
          category_id: categoryId,
          question,
          options,
          correct_answer: correctAnswer,
        },
      ])
      .select();

    if (error) throw error;

    res.status(201).json(data[0]);
  } catch (error) {
    console.error("Error adding question:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update a question
exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, options, correctAnswer } = req.body;

    const { data, error } = await supabase
      .from("quiz_questions")
      .update({
        question,
        options,
        correct_answer: correctAnswer,
      })
      .eq("id", id)
      .select();

    if (error) throw error;
    if (data.length === 0)
      return res.status(404).json({ error: "Question not found" });

    res.status(200).json(data[0]);
  } catch (error) {
    console.error("Error updating question:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete a question
exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const { error, count } = await supabase
      .from("quiz_questions")
      .delete()
      .eq("id", id);

    if (error) throw error;
    if (count === 0)
      return res.status(404).json({ error: "Question not found" });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting question:", error);
    res.status(500).json({ error: error.message });
  }
};

// Save quiz result
exports.saveResult = async (req, res) => {
  try {
    const { userId, categoryId, score, totalQuestions, answers } = req.body;

    if (!userId || !categoryId || score === undefined || !totalQuestions) {
      return res.status(400).json({
        error: "UserId, categoryId, score, and totalQuestions are required",
      });
    }

    const { data, error } = await supabase
      .from("quiz_results")
      .insert([
        {
          user_id: userId,
          category_id: categoryId,
          score,
          total_questions: totalQuestions,
          answers,
          created_at: new Date(),
        },
      ])
      .select();

    if (error) throw error;

    res.status(201).json(data[0]);
  } catch (error) {
    console.error("Error saving result:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get results for a specific user
exports.getUserResults = async (req, res) => {
  try {
    const { userId } = req.params;

    const { data, error } = await supabase
      .from("quiz_results")
      .select(
        `
        *,
        quiz_categories:category_id (title)
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching user results:", error);
    res.status(500).json({ error: error.message });
  }
};
