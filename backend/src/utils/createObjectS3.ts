import { PutObjectCommand } from "@aws-sdk/client-s3";
import { AWS_BUCKET_NAME, s3Client } from "../../index.js";
import chalk from "chalk";

/**
 * https://chatgpt.com/share/67a9bc0b-5f58-800a-be83-efc98c045394
 * Uploads an object to S3.
 * @param {string} key - The S3 object key (path).
 * @param {Buffer | string | Uint8Array} body - The data to store.
 * @param {string} mimetype - The MIME type of the file.
 * @returns {Promise<string | null>} The ETag of the uploaded object or null on failure.
 */
const createObjectS3 = async (key: string, body: Buffer | string | Uint8Array, mimetype: string): Promise<string | null> => {
  if (!key || !body || !mimetype) {
    console.error(chalk.red.bgBlack("[ERR] Invalid parameters: key, body, and mimetype are required."));
    return null;
  }

  if (!AWS_BUCKET_NAME) {
    console.error(chalk.red.bgBlack("[ERR] AWS_BUCKET_NAME is not defined."));
    return null;
  }

  try {
    const cmd = new PutObjectCommand({
      Bucket: AWS_BUCKET_NAME,
      Key: key,
      Body: body,
      ContentType: mimetype,
    });

    const response = await s3Client.send(cmd);

    if (response.$metadata?.httpStatusCode === 200) {
      console.log(chalk.green.bgBlack(`[OK] File uploaded successfully: ${key}`));
      return response.ETag || null;
    } else {
      console.error(chalk.red.bgBlack(`[ERR] Failed to upload file: ${key}`, response));
      return null;
    }
  } catch (error: any) {
    console.error(chalk.red.bgBlack(`[ERR] Error uploading file to S3: ${error.message}`));
    return null;
  }
};

export default createObjectS3;
