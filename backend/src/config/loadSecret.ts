import { readdirSync, readFileSync } from "fs";
import path from "path";
import indexLogger from "../loggers/indexLogger.js";

/**
 * Loads secrets from `/run/secrets/` in production or `.env` in development.
 * Automatically sets values in `process.env`.
 */
export default function loadSecret(secretPath="/run/secrets"){
  const files = readdirSync(secretPath);

  // const path = `/run/secrets/${name}`
  files.forEach((src: string) => {
    const fullPath = path.join(secretPath,src)
    try {
        const value = readFileSync(fullPath, 'utf8').trim();
        indexLogger.info(`[secret]: Load secret: ${src} from ${fullPath}`)
        
        process.env[src] = value; // Store in process.env
        return value;
      } catch (err) {
        indexLogger.warn(`[secret]: Secret ${src} not found in ${path}`);
        return process.env[src] = undefined;
      }
  });
};