import { DynamoDBClient, ListTablesCommand } from "@aws-sdk/client-dynamodb";
import {
  dynamoDb,
  USERS_TABLE,
  SCORES_TABLE,
  QUESTIONS_TABLE,
} from "../data/aws-config";

/**
 * Utility to test AWS DynamoDB connection and report status
 */
export class AwsConnectionTester {
  /**
   * Test AWS connection by attempting simple operations
   */
  static async testConnection(): Promise<{
    success: boolean;
    message: string;
    details?: any;
  }> {
    console.log("Testing AWS DynamoDB connection...");

    try {
      // Check if credentials exist
      const accessKeyId = import.meta.env.VITE_AWS_ACCESS_KEY_ID;
      const secretAccessKey = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY;

      if (!accessKeyId || !secretAccessKey) {
        return {
          success: false,
          message: "AWS credentials are missing",
        };
      }

      // Check tables
      const tablesExist = {
        usersTable: !!import.meta.env.VITE_USERS_TABLE,
        scoresTable: !!import.meta.env.VITE_SCORES_TABLE,
        questionsTable: !!import.meta.env.VITE_QUESTIONS_TABLE,
      };

      // Further checks could be added here to actually test AWS connectivity

      try {
        console.log("Testing AWS DynamoDB connection...");
        const client = dynamoDb as DynamoDBClient;

        // Simple test to list tables
        const command = new ListTablesCommand({
          Limit: 10,
        });

        const response = await client.send(command);

        // Check if our tables are in the list
        const tables = response.TableNames || [];
        const foundTables = {
          usersTable: tables.includes(USERS_TABLE),
          scoresTable: tables.includes(SCORES_TABLE),
          questionsTable: tables.includes(QUESTIONS_TABLE),
        };

        console.log("AWS Connection Test Results:", {
          success: true,
          tables: tables,
          foundTables,
        });

        // Add information about the required tables if they're missing
        let message = `Connection successful! Found ${tables.length} tables.`;
        if (!foundTables.usersTable) {
          message += ` Warning: '${USERS_TABLE}' table not found. Create a table with 'UserID' (String) as Partition key.`;
        }
        if (!foundTables.scoresTable) {
          message += ` Warning: '${SCORES_TABLE}' table not found. Create a table with 'UserID' (String) as Partition key and 'timestamp' (Number) as Sort key.`;
        }

        return {
          success: true,
          message,
          details: {
            tables,
            foundTables,
            region: client.config.region,
          },
        };
      } catch (error) {
        console.error("AWS Connection Test Failed:", error);

        return {
          success: false,
          message: `Connection failed: ${
            error instanceof Error ? error.message : String(error)
          }`,
          details: {
            errorName: error instanceof Error ? error.name : "Unknown",
            errorStack: error instanceof Error ? error.stack : undefined,
          },
        };
      }

      return {
        success: true,
        message: "AWS configuration looks good",
        details: {
          credentialsExist: true,
          tablesExist,
        },
      };
    } catch (error) {
      console.error("Error testing AWS connection:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
        error,
      };
    }
  }
}

// Auto-run test on module load in development
if (import.meta.env.DEV) {
  console.log("Running automatic AWS connection test in development...");
  AwsConnectionTester.testConnection()
    .then((result) => {
      console.log("AWS Connection Test complete:", result);
    })
    .catch((err) => {
      console.error("Error during AWS connection test:", err);
    });
}
