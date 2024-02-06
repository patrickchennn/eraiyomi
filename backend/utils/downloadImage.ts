import https from "https"
import fs from "fs"
import chalk from "chalk";

export async function downloadImage(url: string, imagePath: string):
Promise<{
  message: string;
  fileName: string;
}> {
  console.log(chalk.yellow("@downloadImage()"))
  return new Promise((resolve, reject) => {
      https.get(url, (httpRes) => {
        const contentType = httpRes.headers['content-type'];
        let extension;

        // determine the file extention
        if (contentType) {
            if (contentType.includes('image/jpeg')) {
                extension = '.jpg';
            } else if (contentType.includes('image/png')) {
                extension = '.png';
            } else {
                // You can add more conditions for other types or use a default
                extension = '.jpg'; // Default to .jpg if type is unknown
            }
        }

        let fileName = `downloaded_image${extension}`; // Default filename

        const contentDisp = httpRes.headers['content-disposition'];

        // Extract filename from Content-Disposition if available
        if (contentDisp && contentDisp.includes('filename=')) {
          fileName = contentDisp.split('filename=')[1].replace(/["']/g, "");
        }
        console.log("fileName=",fileName)

          const stream = fs.createWriteStream(`${imagePath}/${fileName}`);

          httpRes.on('data', (chunk) => {
              stream.write(chunk);
          });

          httpRes.on('end', () => {
              stream.end();
              resolve({
                message:`Image "${fileName}" downloaded successfully`,
                fileName
              });
          });

          httpRes.on('error', (e) => {
              reject(`Got error: ${e.message}`);
          });
      });
  });
}
