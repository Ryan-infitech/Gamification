require("dotenv").config();
const fs = require("fs");
const path = require("path");
const supabase = require("../models/supabase");

async function runMigrations() {
  try {
    console.log("Running migrations...");

    // Read the SQL file
    const sqlPath = path.join(__dirname, "001_create_quiz_tables.sql");
    const sqlContent = fs.readFileSync(sqlPath, "utf8");

    // Execute SQL queries
    const { error } = await supabase.rpc("run_sql_migration", {
      sql: sqlContent,
    });

    if (error) {
      console.error("Migration failed:", error);
      return;
    }

    console.log("Tables created successfully!");

    // Run data seeding
    await seedDatabase();

    console.log("All migrations completed successfully!");
  } catch (error) {
    console.error("Migration error:", error);
  }
}

async function seedDatabase() {
  try {
    console.log("Seeding database with initial quiz data...");

    // Import the existing quiz data
    const { quizCategories } = require("../../../data/questions");

    // Insert each category
    for (const category of quizCategories) {
      const { data: categoryData, error: categoryError } = await supabase
        .from("quiz_categories")
        .insert({
          id: category.id,
          title: category.title,
          description: category.description,
          icon: category.icon,
        })
        .select();

      if (categoryError) {
        console.error(
          `Error inserting category ${category.id}:`,
          categoryError
        );
        continue;
      }

      console.log(`Added category: ${category.title}`);

      // Insert each question for this category
      for (const question of category.questions) {
        const { error: questionError } = await supabase
          .from("quiz_questions")
          .insert({
            category_id: category.id,
            question: question.question,
            options: question.options,
            correct_answer: question.correctAnswer,
          });

        if (questionError) {
          console.error(`Error inserting question:`, questionError);
        }
      }

      console.log(
        `Added ${category.questions.length} questions for category: ${category.title}`
      );
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Seeding failed:", error);
  }
}

// Execute the migrations
runMigrations();
