import { GetCommand, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { dynamoDb, USERS_TABLE, SCORES_TABLE } from '../data/aws-config';

// Interfaces
interface UserData {
  username: string;
  createdAt: string;
}

interface QuizScore {
  username: string;
  category: string;
  score: number;
  timeSpent: number;
  completedAt: string;
}

interface LeaderboardEntry extends QuizScore {
  rank?: number;
}

// Custom error classes
class UserServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserServiceError';
  }
}

class UserExistsError extends UserServiceError {
  constructor(username: string) {
    super(`Username ${username} already exists`);
    this.name = 'UserExistsError';
  }
}

class UserService {
  private docClient: DynamoDBDocumentClient;

  constructor() {
    this.docClient = DynamoDBDocumentClient.from(dynamoDb);
  }

  /**
   * Check if a username is available
   * @param username - The username to check
   * @returns Promise<boolean> - True if username is available
   * @throws UserServiceError if there's an error checking the username
   */
  async checkUsername(username: string): Promise<boolean> {
    if (!username || username.trim().length === 0) {
      throw new UserServiceError('Username cannot be empty');
    }

    const params = {
      TableName: USERS_TABLE,
      Key: {
        username: username.trim().toLowerCase()
      }
    };

    try {
      const command = new GetCommand(params);
      const result = await this.docClient.send(command);
      return !result.Item;
    } catch (error) {
      console.error('Error checking username:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      throw new UserServiceError('Failed to check username availability');
    }
  }

  /**
   * Create a new user
   * @param username - The username to create
   * @throws UserExistsError if username already exists
   * @throws UserServiceError if there's an error creating the user
   */
  async createUser(username: string): Promise<void> {
    const isAvailable = await this.checkUsername(username);
    if (!isAvailable) {
      throw new UserExistsError(username);
    }

    const userData: UserData = {
      username: username.trim().toLowerCase(),
      createdAt: new Date().toISOString()
    };

    const params = {
      TableName: USERS_TABLE,
      Item: userData,
      ConditionExpression: 'attribute_not_exists(username)'
    };

    try {
      const command = new PutCommand(params);
      await this.docClient.send(command);
    } catch (error) {
      console.error('Error creating user:', error);
      throw new UserServiceError('Failed to create user');
    }
  }

  /**
   * Save a quiz result
   * @param username - The username of the quiz taker
   * @param category - The quiz category
   * @param score - The score achieved (0-100)
   * @param timeSpent - Time spent in seconds
   * @throws UserServiceError if there's an error saving the result
   */
  async saveQuizResult(
    username: string,
    category: string,
    score: number,
    timeSpent: number
  ): Promise<void> {
    if (score < 0 || score > 100) {
      throw new UserServiceError('Score must be between 0 and 100');
    }

    const quizScore: QuizScore = {
      username: username.trim().toLowerCase(),
      category,
      score,
      timeSpent,
      completedAt: new Date().toISOString()
    };

    const params = {
      TableName: SCORES_TABLE,
      Item: quizScore
    };

    try {
      const command = new PutCommand(params);
      await this.docClient.send(command);
    } catch (error) {
      console.error('Error saving quiz result:', error);
      throw new UserServiceError('Failed to save quiz result');
    }
  }

  /**
   * Get leaderboard for a specific category
   * @param category - The quiz category
   * @returns Promise<LeaderboardEntry[]> - Sorted leaderboard entries
   * @throws UserServiceError if there's an error fetching the leaderboard
   */
  async getLeaderboard(category: string): Promise<LeaderboardEntry[]> {
    const params = {
      TableName: SCORES_TABLE,
      FilterExpression: 'category = :category',
      ExpressionAttributeValues: {
        ':category': category
      }
    };

    try {
      const command = new ScanCommand(params);
      const result = await this.docClient.send(command);
      const scores = (result.Items || []) as QuizScore[];
      
      return scores
        .sort((a, b) => {
          // Sort by score first (descending)
          if (b.score !== a.score) {
            return b.score - a.score;
          }
          // Then by time spent (ascending)
          return a.timeSpent - b.timeSpent;
        })
        .map((score, index) => ({
          ...score,
          rank: index + 1
        }))
        .slice(0, 100); // Limit to top 100
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      throw new UserServiceError('Failed to fetch leaderboard');
    }
  }

  /**
   * Get user's quiz history
   * @param username - The username to get history for
   * @returns Promise<QuizScore[]> - User's quiz scores
   * @throws UserServiceError if there's an error fetching the history
   */
  async getUserHistory(username: string): Promise<QuizScore[]> {
    const params = {
      TableName: SCORES_TABLE,
      FilterExpression: 'username = :username',
      ExpressionAttributeValues: {
        ':username': username.trim().toLowerCase()
      }
    };

    try {
      const command = new ScanCommand(params);
      const result = await this.docClient.send(command);
      return (result.Items || []) as QuizScore[];
    } catch (error) {
      console.error('Error fetching user history:', error);
      throw new UserServiceError('Failed to fetch user history');
    }
  }
}

// Create singleton instance
const userService = new UserService();

// Export instance, interfaces, and error classes
export {
  userService,
  UserService,
  UserServiceError,
  UserExistsError,
  type UserData,
  type QuizScore,
  type LeaderboardEntry
};