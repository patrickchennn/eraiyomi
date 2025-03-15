import { ListObjectsV2Command, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { AWS_BUCKET_NAME, s3Client } from "../../index.js";
import s3Logger from "../loggers/s3Logger.js";


/**
 * Deletes all objects inside a folder in an S3 bucket.
 * @param {string} location The folder path in the S3 bucket.
 * @see 
 * https://chatgpt.com/share/67a9bc0b-5f58-800a-be83-efc98c045394
 * 
 * https://www.codemzy.com/blog/delete-s3-folder-nodejs
 * 
 */
export default async function deleteFolder(location: string): Promise<{
  isError: boolean;
  message: string;
}> {
  if (!location) {
    const errorMsg = "Invalid location provided.";
    s3Logger.error(errorMsg);
    return { isError: true, message: errorMsg };
  }

  try {
    // Get the list of files in the folder
    const listCommand = new ListObjectsV2Command({
      Bucket: AWS_BUCKET_NAME,
      Prefix: location,
    });

    const list = await s3Client.send(listCommand);

    if (!list.Contents || list.Contents.length === 0) {
      const noFilesMsg = "No files found to delete.";
      s3Logger.info(noFilesMsg);
      return { isError: false, message: noFilesMsg };
    }

    s3Logger.info(`Found ${list.Contents.length} files to delete.`);

    // Prepare delete request
    const deleteCommand = new DeleteObjectsCommand({
      Bucket: AWS_BUCKET_NAME,
      Delete: {
        Objects: list.Contents.map((item) => ({ Key: item.Key })),
        Quiet: false, 
      },
    });

    // Execute delete request
    const deleted = await s3Client.send(deleteCommand);

    if (deleted.Errors && deleted.Errors.length > 0) {
      deleted.Errors.forEach((error) =>
        s3Logger.error(`Error deleting ${error.Key}: ${error.Code}`)
      );
      return {
        isError: true,
        message: "Some files could not be deleted. Check logs for details.",
      };
    }

    const successMsg = `${deleted.Deleted?.length || 0} files deleted successfully.`;
    s3Logger.info(successMsg);

    return { isError: false, message: successMsg };
  } catch (error: any) {

    const errorMsg = `Error deleting folder: ${error.message}`;
    s3Logger.error(errorMsg);

    return { isError: true, message: errorMsg };
  }
}