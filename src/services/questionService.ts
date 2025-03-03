import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDb, QUESTIONS_TABLE } from '../data/aws-config';

// Define Question type explicitly
export interface Question {
  id: string;
  category: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

class QuestionService {
  private docClient: DynamoDBDocumentClient;

  constructor() {
    this.docClient = DynamoDBDocumentClient.from(dynamoDb);
  }

  // Method untuk mengambil pertanyaan berdasarkan kategori
  async getQuestionsByCategory(category: string): Promise<Question[]> {
    if (!category) {
      console.error('Category is undefined or empty');
      return [];
    }
  
    const params = {
      TableName: QUESTIONS_TABLE,
      FilterExpression: 'category = :category',
      ExpressionAttributeValues: {
        ':category': category
      }
    };
  
    console.log(`Fetching questions for category: ${category} from table: ${QUESTIONS_TABLE}`);
    
    try {
      const command = new ScanCommand(params);
      const result = await this.docClient.send(command);
      
      console.log(`Found ${result.Items?.length || 0} questions for category: ${category}`);
      
      // If no questions, return dummy data for testing in development
      if (!result.Items?.length) {
        console.warn(`No questions found for category: ${category}. Using sample data in development mode.`);
        if (import.meta.env.DEV) {
          return [
            {
              id: 'sample1',
              category: category,
              question: 'Sample Question 1?',
              options: ['Option A', 'Option B', 'Option C', 'Option D'],
              correctAnswer: 0
            },
            {
              id: 'sample2',
              category: category,
              question: 'Sample Question 2?',
              options: ['Option A', 'Option B', 'Option C', 'Option D'],
              correctAnswer: 1
            }
          ];
        }
      }
      
      return (result.Items || []) as Question[];
    } catch (error) {
      console.error('Error fetching questions:', error);
      if (import.meta.env.DEV) {
        // Return sample data in development environment to help debugging
        console.log('Using sample questions due to error');
        return [
          {
            id: 'sample1',
            category: category,
            question: 'Sample Question 1?',
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correctAnswer: 0
          }
        ];
      }
      return [];
    }
  }
}
// Buat instance dari QuestionService dan ekspor instance serta tipe kelasnya
const questionService = new QuestionService();

export { questionService, QuestionService };