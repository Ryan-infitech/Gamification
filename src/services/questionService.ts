import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDb, QUESTIONS_TABLE } from '../data/aws-config';

class QuestionService {
  private docClient: DynamoDBDocumentClient;

  constructor() {
    this.docClient = DynamoDBDocumentClient.from(dynamoDb);
  }

  // Method untuk mengambil pertanyaan berdasarkan kategori
  async getQuestionsByCategory(category: string) {
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
  
    try {
      const command = new ScanCommand(params);
      const result = await this.docClient.send(command);
      
      // Tambah logging lebih detail
      console.log("Category requested:", category);
      console.log("Raw DynamoDB result:", result);
      console.log("Questions found:", result.Items?.length || 0);
      
      if (!result.Items?.length) {
        console.warn(`No questions found for category: ${category}`);
      }
      
      return result.Items || [];
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  }
}
// Buat instance dari QuestionService dan ekspor instance serta tipe kelasnya
const questionService = new QuestionService();

export { questionService, QuestionService };
