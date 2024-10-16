import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function connectToDatabase() {
  const db = await open({
    filename: __dirname + "/app.db",
    driver: sqlite3.Database,
  });

  return db;
}
