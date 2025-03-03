// aws-config.ts

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

// Better environment variable handling with more explicit error messages
function getRequiredEnvVar(name: string, fallback?: string): string {
  const value = import.meta.env[name];
  if (!value && !fallback) {
    console.error(`Required environment variable ${name} is missing`);
    return '';
  }
  return value || fallback || '';
}

// Initialize the DynamoDB client with better error handling
const region = getRequiredEnvVar('VITE_AWS_REGION', 'ap-southeast-1');
const accessKeyId = getRequiredEnvVar('VITE_AWS_ACCESS_KEY_ID');
const secretAccessKey = getRequiredEnvVar('VITE_AWS_SECRET_ACCESS_KEY');

// Validate credentials before creating client
if (!accessKeyId || !secretAccessKey) {
  console.error('AWS credentials are missing. Check your .env file');
}

// Create DynamoDB client with proper configuration
const client = new DynamoDBClient({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey
  }
});

// Create a document client for easier handling of JavaScript objects
export const dynamoDb = client;
export const docClient = DynamoDBDocumentClient.from(client);

// Table names from environment variables with fallbacks
export const USERS_TABLE = getRequiredEnvVar('VITE_USERS_TABLE', 'quiz_users');
export const SCORES_TABLE = getRequiredEnvVar('VITE_SCORES_TABLE', 'quiz_scores');
export const QUESTIONS_TABLE = getRequiredEnvVar('VITE_QUESTIONS_TABLE', 'quiz_questions');

// More helpful debugging information
console.log('AWS Config Loaded:', {
  region,
  usersTable: USERS_TABLE,
  scoresTable: SCORES_TABLE,
  questionsTable: QUESTIONS_TABLE,
  hasAccessKey: !!accessKeyId,
  hasSecretKey: !!secretAccessKey
});