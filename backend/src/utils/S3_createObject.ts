import { PutObjectCommand } from "@aws-sdk/client-s3";
import { AWS_BUCKET_NAME, s3Client } from "../../index.js";
import s3Logger from "../loggers/s3Logger.js";

/**
 * Uploads an object to S3.
 * @param {string} key The S3 object key (path).
 * @param {Buffer | string | Uint8Array} body The data to store.
 * @param {string} mimetype The MIME type of the file.
 * @see https://chatgpt.com/share/67a9bc0b-5f58-800a-be83-efc98c045394
 */
const createObjectS3 = async (
  key: string,
  body: Buffer | string | Uint8Array,
  mimetype: string
): Promise<{
  isError: boolean;
  message: string;
  etag?: string | null;
}> => {
  if (!key || !body || !mimetype) {
    const errorMsg = "Invalid parameters: key, body, and mimetype are required.";
    s3Logger.error(errorMsg);
    return { isError: true, message: errorMsg };
  }

  if (!AWS_BUCKET_NAME) {
    const errorMsg = "AWS_BUCKET_NAME is not defined.";
    s3Logger.error(errorMsg);
    return { isError: true, message: errorMsg };
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
      const successMsg = `File uploaded successfully: ${key}`;
      s3Logger.info(successMsg);

      return { isError: false, message: successMsg, etag: response.ETag || null };
    } else {
      const errorMsg = `Failed to upload file: ${key}`;
      s3Logger.error(errorMsg);


      return { isError: true, message: errorMsg };
    }
  } catch (error: any) {
    const errorMsg = `Error uploading file to S3: ${error.message}`;
    s3Logger.error(errorMsg);
    return { isError: true, message: errorMsg };
  }
};

export default createObjectS3;