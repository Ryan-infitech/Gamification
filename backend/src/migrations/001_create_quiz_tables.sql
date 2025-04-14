-- Create quiz_categories table
CREATE TABLE IF NOT EXISTS quiz_categories (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quiz_questions table
CREATE TABLE IF NOT EXISTS quiz_questions (
  id SERIAL PRIMARY KEY,
  category_id TEXT REFERENCES quiz_categories(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options TEXT[] NOT NULL,
  correct_answer INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quiz_results table
CREATE TABLE IF NOT EXISTS quiz_results (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  category_id TEXT REFERENCES quiz_categories(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  answers JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_questions_category_id ON quiz_questions(category_id);
CREATE INDEX IF NOT EXISTS idx_results_user_id ON quiz_results(user_id);
CREATE INDEX IF NOT EXISTS idx_results_category_id ON quiz_results(category_id);
