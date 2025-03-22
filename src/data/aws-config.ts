// aws-config.ts

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

// Better environment variable handling with more explicit error messages
function getRequiredEnvVar(name: string, fallback?: string): string {
  const value = import.meta.env[name];
  if (!value && !fallback) {
    console.warn(`Required environment variable ${name} is missing`);
    return "";
  }
  return value || fallback || "";
}

// Initialize the DynamoDB client with better error handling
const region = getRequiredEnvVar("VITE_AWS_REGION", "ap-southeast-1");
const accessKeyId = getRequiredEnvVar("VITE_AWS_ACCESS_KEY_ID");
const secretAccessKey = getRequiredEnvVar("VITE_AWS_SECRET_ACCESS_KEY");

// Table names from environment variables with fallbacks
export const USERS_TABLE = getRequiredEnvVar("VITE_USERS_TABLE", "quiz_users");
export const SCORES_TABLE = getRequiredEnvVar(
  "VITE_SCORES_TABLE",
  "quiz_scores"
);
export const QUESTIONS_TABLE = getRequiredEnvVar(
  "VITE_QUESTIONS_TABLE",
  "quiz_questions"
);

// Log the actual values we're using (redacted for security)
console.log("AWS Configuration:", {
  region,
  accessKeyIdExists: !!accessKeyId,
  secretAccessKeyExists: !!secretAccessKey,
  usersTable: USERS_TABLE,
  scoresTable: SCORES_TABLE,
  questionsTable: QUESTIONS_TABLE,
});

// Create a placeholder client if credentials are missing, for development mode
let client: DynamoDBClient;
let clientInitialized = false;

try {
  // Validate credentials before creating client
  if (!accessKeyId || !secretAccessKey) {
    console.warn(
      "AWS credentials are missing. Using mock client for development."
    );

    // Create a mock client for development
    client = new DynamoDBClient({
      region,
      credentials: {
        accessKeyId: "mock-access-key",
        secretAccessKey: "mock-secret-key",
      },
      endpoint: "http://localhost:8000", // Use local DynamoDB if available
    });
  } else {
    // Create DynamoDB client with proper configuration
    client = new DynamoDBClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      // Uncomment this to resolve potential endpoint issues
      // endpoint: `https://dynamodb.${region}.amazonaws.com`,
    });

    console.log(`✅ DynamoDB client initialized with region: ${region}`);
  }
  clientInitialized = true;
} catch (error) {
  console.error("Failed to initialize DynamoDB client:", error);

  // Create a mock client as fallback
  client = new DynamoDBClient({
    region: "us-east-1",
    endpoint: "http://localhost:8000",
  });
}

// Create a document client for easier handling of JavaScript objects
export const dynamoDb = client;
export const docClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    // Convert empty strings, blobs, and sets to null
    convertEmptyValues: true,
    // Remove undefined values from objects
    removeUndefinedValues: true,
    // Convert typeof object to map attribute
    convertClassInstanceToMap: true,
  },
  unmarshallOptions: {
    // Return numbers as numbers, not strings
    wrapNumbers: false,
  },
});

// More helpful debugging information
console.log("DynamoDB Client Details:", {
  region: client.config.region,
  endpoint: client.config.endpoint?.toString() || "default AWS endpoint",
  defaultsMode: client.config.defaultsMode,
  usesLocalStorage: client.config.endpoint?.toString()?.includes("localhost"),
});

// Export a function to check if we're using mock/development setup
export const isUsingMockAWS = () => {
  return (
    !accessKeyId ||
    !secretAccessKey ||
    client.config.endpoint?.toString()?.includes("localhost")
  );
};
