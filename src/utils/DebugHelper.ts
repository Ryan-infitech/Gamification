/**
 * Debug Helper Utility
 *
 * This utility helps troubleshoot issues with quiz scoring and data persistence
 */

export class DebugHelper {
  /**
   * Logs quiz data with both verbose and summarized information
   */
  static logQuizData(quizData: {
    username: string;
    category: string;
    score: number;
    correctAnswers: number;
    totalQuestions: number;
    answers: Array<{
      questionIndex: number;
      selectedAnswer: number;
      isCorrect: boolean;
    }>;
  }) {
    // Basic data logging
    console.log("🔍 Quiz Data Summary:", {
      username: quizData.username,
      category: quizData.category,
      score: `${quizData.score}%`,
      correctRatio: `${quizData.correctAnswers}/${quizData.totalQuestions}`,
      calculatedScore: `${Math.round(
        (quizData.correctAnswers / quizData.totalQuestions) * 100
      )}%`,
    });

    // Verify correctAnswers count against answers array
    const answersCorrectCount = quizData.answers.filter(
      (a) => a.isCorrect
    ).length;

    if (answersCorrectCount !== quizData.correctAnswers) {
      console.warn(
        "⚠️ SCORE MISMATCH: Provided correctAnswers doesn't match answers array",
        {
          providedCount: quizData.correctAnswers,
          countedFromAnswers: answersCorrectCount,
          difference: quizData.correctAnswers - answersCorrectCount,
        }
      );
    }

    // Display answers pattern for visual debugging
    if (quizData.answers.length > 0) {
      console.log(
        `📊 Answer Pattern: ${quizData.answers
          .map((a) => (a.isCorrect ? "✓" : "✗"))
          .join(" ")}`
      );
    }
  }

  /**
   * Validates quiz data and returns any issues found
   */
  static validateQuizData(quizData: {
    username: string;
    category: string;
    score: number;
    correctAnswers: number;
    totalQuestions: number;
    answers: Array<{
      questionIndex: number;
      selectedAnswer: number;
      isCorrect: boolean;
    }>;
  }): string[] {
    const issues: string[] = [];

    // Check for missing required fields
    if (!quizData.username) issues.push("Missing username");
    if (!quizData.category) issues.push("Missing category");

    // Check for invalid score values
    if (quizData.correctAnswers > quizData.totalQuestions) {
      issues.push(
        `Correct answers (${quizData.correctAnswers}) exceeds total questions (${quizData.totalQuestions})`
      );
    }

    // Verify score calculation
    const calculatedScore = Math.round(
      (quizData.correctAnswers / quizData.totalQuestions) * 100
    );
    if (Math.abs(calculatedScore - quizData.score) > 1) {
      issues.push(
        `Score (${quizData.score}%) doesn't match calculated score (${calculatedScore}%)`
      );
    }

    // Verify answer count
    const answersCorrectCount = quizData.answers.filter(
      (a) => a.isCorrect
    ).length;
    if (answersCorrectCount !== quizData.correctAnswers) {
      issues.push(
        `Correct answers count (${quizData.correctAnswers}) doesn't match answers array (${answersCorrectCount})`
      );
    }

    return issues;
  }
}
