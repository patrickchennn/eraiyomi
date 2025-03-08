import { defineConfig } from 'cypress';
import fs from 'fs';
import path from 'path';

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles); // Recursively read subdirectories
    } else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        readdirRecursive(folderPath) {
          return getAllFiles(folderPath);
        },
      });
    },
  },
});
