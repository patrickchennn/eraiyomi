import { GetObjectCommand } from "@aws-sdk/client-s3";
import { AWS_BUCKET_NAME, s3Client } from "../../index.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const getS3SignedUrl = async (path: string) => {
  try {
    const getObjectParams = {
      Bucket: AWS_BUCKET_NAME,
      Key: path
    }
    const command = new GetObjectCommand(getObjectParams);

    // @ts-ignore
    const remoteUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    return remoteUrl

  } catch (error) {
    console.error(error)
    return null
  }
}

export default getS3SignedUrl