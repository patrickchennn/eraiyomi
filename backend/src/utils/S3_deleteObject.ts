import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { AWS_BUCKET_NAME, s3Client } from "../../index.js";
import s3Logger from "../loggers/s3Logger.js";

/**
 * Deletes an object from an S3 bucket.
 * @param {string} key The key (path) of the object to delete.
 * @see https://chatgpt.com/c/67a9ba58-a1e8-800a-ae43-e9c362982bde
 */
const S3_deleteObject = async (key: string): Promise<{
  isError: boolean;
  message: string;
}> => {
  if (!key) {
    const msg = "Invalid key: A valid S3 object key is required."

    s3Logger.error(msg);
    return { isError: true, message: msg };
  }

  if (!AWS_BUCKET_NAME) {
    const msg = "AWS_BUCKET_NAME is not defined."

    s3Logger.error(msg);
    return { isError: true, message: msg };
  }

  try {
    const command = new DeleteObjectCommand({
      Bucket: AWS_BUCKET_NAME,
      Key: key,
    });

    const response = await s3Client.send(command);
    if (response.$metadata?.httpStatusCode === 204) {
      const msg = `Object '${key}' deleted successfully.`
      s3Logger.info(msg);
      return { isError: false, message: msg};
    } else {
      s3Logger.error(`Failed to delete object: ${key}`, response);
      return { isError: true, message: `Failed to delete object: ${key}.` };
    }
  } catch (error: any) {
    const msg = `Error deleting object from S3: ${error.message}`

    s3Logger.error(msg);
    return { isError: true, message: msg};
  }
};

export default S3_deleteObject;