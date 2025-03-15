import { ListObjectsV2Command, CopyObjectCommand } from "@aws-sdk/client-s3";
import { AWS_BUCKET_NAME, s3Client } from "../../index.js";
import omit1stStringAfterSlash from "./omit1stStringAfterSlash.js";
import httpLogger from "../loggers/afterResponseLogger.js";
import S3_deleteObject from "./S3_deleteObject.js";
import s3Logger from "../loggers/s3Logger.js";

/**
 * Renames a folder in S3 by copying all objects to a new location and deleting the old ones.
 * @param {string} src The source folder (current name).
 * @param {string} dst The destination folder (new name).
 * @see https://chatgpt.com/share/67a9bc0b-5f58-800a-be83-efc98c045394
 */
export default async function S3_renameFolder(src: string, dst: string): Promise<{
  isError: boolean;
  message: string;
}> {
  if (!src || !dst) {
    const errorMsg = "Invalid parameters: source and destination must be provided.";
    httpLogger.error(errorMsg);
    return { isError: true, message: errorMsg };
  }

  if (!AWS_BUCKET_NAME) {
    const errorMsg = "AWS_BUCKET_NAME is not defined.";
    httpLogger.error(errorMsg);
    return { isError: true, message: errorMsg };
  }

  try {
    // List all objects in the source folder
    const listCommand = new ListObjectsV2Command({
      Bucket: AWS_BUCKET_NAME,
      Prefix: src,
    });

    const list = await s3Client.send(listCommand);
    console.log("list=",list)

    if (!list.Contents || list.Contents.length === 0) {
      const errorMsg = `No objects found in source folder: ${src}`;
      s3Logger.warn(errorMsg);
      return { isError: true, message: errorMsg };
    }

    s3Logger.info(`Found ${list.Contents.length} objects in ${src}. Starting rename process.`);

    for (const objectContent of list.Contents) {
      if (!objectContent.Key) continue;

      const newPath = `${dst}/${omit1stStringAfterSlash(objectContent.Key)}`;

      // Copy object to the new destination
      const copyCommand = new CopyObjectCommand({
        Bucket: AWS_BUCKET_NAME,
        CopySource: encodeURI(`/${AWS_BUCKET_NAME}/${objectContent.Key}`),
        Key: newPath,
      });

      try {
        await s3Client.send(copyCommand);
        s3Logger.info(`Copied ${objectContent.Key} to ${newPath}`);
      } catch (copyError: any) {
        s3Logger.error(`Error copying ${objectContent.Key}: ${copyError.message}`);
        return { isError: true, message: `Failed to copy ${objectContent.Key}` };
      }

      // Delete original object after successful copy
      const deleteResponse = await S3_deleteObject(objectContent.Key);
      if (deleteResponse.isError) {
        s3Logger.error(`Failed to delete ${objectContent.Key}: ${deleteResponse.message}`);
        return { isError: true, message: `Failed to delete ${objectContent.Key}` };
      }
    }

    // s3Logger.info(`Successfully renamed folder: ${src} -> ${dst}`);
    return { isError: false, message: `Successfully renamed folder from '${src}' to '${dst}'.` };
  } catch (error: any) {
    const errorMsg = `Error renaming folder ${src}: ${error.message}`;
    s3Logger.error(errorMsg);
    return { isError: true, message: errorMsg };
  }
}
