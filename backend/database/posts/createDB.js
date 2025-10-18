import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { join } from "node:path";

async function createDB() {
    const DB = await open({
        driver: sqlite3.Database,
        filename: join("database", "posts", "posts.db")
    });

    await DB.exec(`
        CREATE TABLE IF NOT EXISTS posts(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        username TEXT NOT NULL,
        title TEXT NOT NULL,
        details TEXT NOT NULL,
        likes INTEGER NOT NULL DEFAULT 0,
        comments INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users(id)
         )`);

    await DB.close();
    console.log("DB created");
}

createDB();