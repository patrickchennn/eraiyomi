import { HeadObjectCommand, HeadObjectCommandInput, HeadObjectCommandOutput } from "@aws-sdk/client-s3";
import { AWS_BUCKET_NAME, s3Client } from "../../index.js";

/**
 * https://stackoverflow.com/questions/26726862/how-to-determine-if-object-exists-aws-s3-node-js-sdk
 * https://nesin.io/blog/check-if-file-exists-aws-s3
 * @param filePath The file full path to be checked
 */
const S3_isObjectExist = async (filePath: string) => {
  try {
    const bucketParams: HeadObjectCommandInput = {
      Bucket: AWS_BUCKET_NAME,
      Key: filePath,
    };
    const cmd = new HeadObjectCommand(bucketParams);
    const data: HeadObjectCommandOutput = await s3Client.send(cmd);

    // I always get 200 for my testing if the object exists
    const exists = data.$metadata.httpStatusCode === 200;
    return { exists, error: null };
  } catch (error: any) {
    if (error.$metadata?.httpStatusCode === 404) {
      // doesn't exist and permission policy includes s3:ListBucket
      // console.error(error)
      return { exists: false, error };
    } else if (error.$metadata?.httpStatusCode === 403) {
      // console.error(error)
      // doesn't exist, permission policy WITHOUT s3:ListBucket
      return { exists: false, error };
    } else {
      // some other error
      // console.error("Other error:",error)
      return { exists: false, error };
    }
  }
}

export default S3_isObjectExist