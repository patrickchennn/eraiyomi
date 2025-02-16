import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { AWS_BUCKET_NAME, s3Client } from "../../index.js";
import chalk from "chalk";

/**
 * https://chatgpt.com/share/67a9bc0b-5f58-800a-be83-efc98c045394
 * 
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/s3/command/DeleteObjectCommand/
 */
const S3_deleteObject = async (key: string): Promise<string | null> => {
  if (!key) {
    console.error(chalk.red.bgBlack("[ERR] Invalid key: A valid S3 object key is required."));
    return null;
  }

  if (!AWS_BUCKET_NAME) {
    console.error(chalk.red.bgBlack("[ERR] AWS_BUCKET_NAME is not defined."));
    return null;
  }

  try {
    const command = new DeleteObjectCommand({
      Bucket: AWS_BUCKET_NAME,
      Key: key,
    });

    const response = await s3Client.send(command);

    if (response.$metadata?.httpStatusCode === 204) {
      console.log(chalk.green.bgBlack(`[OK] Successfully deleted object: ${key}`));
      return `Object '${key}' deleted successfully.`;
    } else {
      console.error(chalk.red.bgBlack(`[ERR] Failed to delete object: ${key}`, response));
      return null;
    }
  } catch (error: any) {
    console.error(chalk.red.bgBlack(`[ERR] Error deleting object from S3: ${error.message}`));
    return null;
  }
};

export default S3_deleteObject;