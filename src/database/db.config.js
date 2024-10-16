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

  await db.exec(`
    CREATE TABLE IF NOT EXISTS tb_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );`);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS tb_tasks (
      id TEXT NOT NULL PRIMARY KEY,
      is_done BOOLEAN NOT NULL,
      description TEXT NOT NULL,
      user_id INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES tb_users (id)
    );`);

  return db;
}
