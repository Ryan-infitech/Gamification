import { PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { docClient, USERS_TABLE, SCORES_TABLE } from '../data/aws-config';

// Types
interface User {
  username: string;
  createdAt: number;
}

interface QuizResult {
  username: string;
  category: string;
  score: number;
  timeSpent: number;
  answers: Array<{
    questionIndex: number;
    selectedAnswer: number;
    isCorrect: boolean;
  }>;
  completedAt: number;
}

class UserService {
  /**
   * Check if username is available
   * @param username - Username to check
   * @returns Promise<boolean> - True if username is available
   */
  async checkUsername(username: string): Promise<boolean> {
    if (!username) {
      console.error('Username is empty');
      return false;
    }
    
    const params = {
      TableName: USERS_TABLE,
      Key: {
        username: username
      }
    };
    
    try {
      // Verify table exists
      if (!USERS_TABLE) {
        console.error('USERS_TABLE environment variable is not set');
        return true; // Allow during development if table doesn't exist
      }
      
      console.log(`Checking username ${username} in table ${USERS_TABLE}`);
      const command = new GetCommand(params);
      const result = await docClient.send(command);
      
      // If user doesn't exist, username is available
      return !result.Item;
    } catch (error) {
      console.error('Error checking username:', error);
      // In development mode, allow creation even on error
      if (import.meta.env.DEV) {
        console.warn('Development mode: allowing username despite error');
        return true;
      }
      throw error;
    }
  }
  
  /**
   * Create new user
   * @param username - Username for new user
   * @returns Promise<User> - Created user object
   */
  async createUser(username: string): Promise<User> {
    if (!username) throw new Error('Username is required');
    
    const newUser: User = {
      username,
      createdAt: Date.now()
    };
    
    const params = {
      TableName: USERS_TABLE,
      Item: newUser
    };
    
    try {
      // In development mode, just return the user if table doesn't exist
      if (!USERS_TABLE && import.meta.env.DEV) {
        console.warn('Development mode: skipping DB write for user creation');
        return newUser;
      }
      
      console.log(`Creating user ${username} in table ${USERS_TABLE}`);
      const command = new PutCommand(params);
      await docClient.send(command);
      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      // In development mode, return the user even if saving fails
      if (import.meta.env.DEV) {
        console.warn('Development mode: returning user despite error');
        return newUser;
      }
      throw error;
    }
  }
  
  /**
   * Save quiz result for a user
   * @param username - Username
   * @param category - Quiz category ID
   * @param score - Score percentage
   * @param timeSpent - Time spent in seconds
   * @param answers - Array of user answers with correctness
   * @returns Promise<QuizResult> - Saved quiz result
   */
  async saveQuizResult(
    username: string,
    category: string,
    score: number,
    timeSpent: number,
    answers: Array<{
      questionIndex: number;
      selectedAnswer: number;
      isCorrect: boolean;
    }>
  ): Promise<QuizResult> {
    if (!username || !category) throw new Error('Username and category are required');
    
    const quizResult: QuizResult = {
      username,
      category,
      score,
      timeSpent,
      answers,
      completedAt: Date.now()
    };
    
    const params = {
      TableName: SCORES_TABLE, // Changed to SCORES_TABLE instead of USERS_TABLE
      Item: quizResult
    };
    
    try {
      // In development mode, just return the result if table doesn't exist
      if (!SCORES_TABLE && import.meta.env.DEV) {
        console.warn('Development mode: skipping DB write for quiz result');
        return quizResult;
      }
      
      console.log(`Saving quiz result for ${username} in table ${SCORES_TABLE}`);
      const command = new PutCommand(params);
      await docClient.send(command);
      return quizResult;
    } catch (error) {
      console.error('Error saving quiz result:', error);
      // In development mode, return the result even if saving fails
      if (import.meta.env.DEV) {
        console.warn('Development mode: returning quiz result despite error');
        return quizResult;
      }
      throw error;
    }
  }
}

// Create and export singleton instance
const userService = new UserService();

export { userService, UserService, type User, type QuizResult };