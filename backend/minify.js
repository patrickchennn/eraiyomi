import { minify } from "terser";
import { readdirSync, statSync, writeFileSync, readFileSync } from "fs";
import { join, resolve } from "path";
function getAllFiles({ path, arrayOfFiles = [] }) {
  let files = readdirSync(path);

  files.forEach((file) => {
    if (statSync(`${path}/${file}`).isDirectory()) {
      arrayOfFiles = getAllFiles({ path: `${path}/${file}`, arrayOfFiles });
    } else {
      if (file.match(/\.js$/)) {
        arrayOfFiles.push(join(resolve(), `${path}/${file}`));
      }
    }
  });

  return arrayOfFiles; //.filter((path) => path.match(/\.js$/));
}

function minifyFiles(filePaths) {
  filePaths.forEach(async (filePath) => {
    let mini = await minify(readFileSync(filePath, "utf8"));
    let minicode = mini.code;
    writeFileSync(filePath, minicode);
  });
}

const files = getAllFiles({ path: "./dist" });
minifyFiles(files);

/**
 * https://github.com/terser/terser/issues/544
 */