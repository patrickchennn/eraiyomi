import { GetObjectCommand } from "@aws-sdk/client-s3";
import { AWS_BUCKET_NAME, s3Client } from "../../index.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3Logger from "../loggers/s3Logger.js";


/**
 * Generates a pre-signed URL for accessing an S3 object.
 * @param {string} path - The S3 object key (file path).
 * @returns {Promise<SignedUrlResponse>} Response containing success/error message and the signed URL.
 * @see https://chatgpt.com/share/67a9bc0b-5f58-800a-be83-efc98c045394
 */
const getS3SignedUrl = async (path: string): Promise<{
  isError: boolean;
  message: string;
  url?: string;
}> => {
  if (!path) {
    const errorMsg = "Invalid file path provided.";
    s3Logger.error(errorMsg);
    return { isError: true, message: errorMsg };
  }

  try {
    const command = new GetObjectCommand({
      Bucket: AWS_BUCKET_NAME,
      Key: path,
    });

    // Generate signed URL
    // @ts-ignore
    const remoteUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    const msg = `Successfully generated signed URL for: ${path}`
    s3Logger.info(msg);

    return { isError: false, message: msg, url: remoteUrl };
  } catch (error: any) {
    const errorMsg = `Error generating signed URL: ${error.message}`;
    s3Logger.error(errorMsg);

    return { isError: true, message: errorMsg };
  }
};

export default getS3SignedUrl;