import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

// Initialize the DynamoDB client
const client = new DynamoDBClient({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY
  }
});

// Create a document client for easier handling of JavaScript objects
export const dynamoDb = DynamoDBDocumentClient.from(client);

// Table names
export const USERS_TABLE = 'quiz_users';
export const SCORES_TABLE = 'quiz_scores';
export const QUESTIONS_TABLE = 'quiz_questions';