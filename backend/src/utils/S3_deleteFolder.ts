import { ListObjectsV2Command, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../../index.js";

const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME; // Ensure environment variable is set

/**
 * @param location 
 * 
 * https://chatgpt.com/share/67a9bc0b-5f58-800a-be83-efc98c045394
 * 
 * https://www.codemzy.com/blog/delete-s3-folder-nodejs
 */
export default async function deleteFolder(location: string): Promise<string | null> {
  if (!location) {
    console.error("Invalid location provided.");
    return null;
  }

  try {
    // Get the list of files in the folder
    const listCommand = new ListObjectsV2Command({
      Bucket: AWS_BUCKET_NAME,
      Prefix: location,
    });

    const list = await s3Client.send(listCommand);

    if (!list.Contents || list.Contents.length === 0) {
      console.log("No files found to delete.");
      return "No files to delete.";
    }

    console.log(`Found ${list.Contents.length} files to delete.`);

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
        console.error(`Error deleting ${error.Key}: ${error.Code}`)
      );
      return "Some files could not be deleted. Check logs for details.";
    }

    return `${deleted.Deleted?.length || 0} files deleted successfully.`;
  } catch (error) {
    console.error("Error deleting folder:", error);
    return "Failed to delete folder due to an error.";
  }
}
