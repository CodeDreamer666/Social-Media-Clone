import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { join } from "node:path";

async function createDB() {
    const DB = await open({
        driver: sqlite3.Database,
        filename: join("database", "comments", "comments.db")
    });

    await DB.exec(`
            CREATE TABLE IF NOT EXISTS comments(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            user_id INTEGER NOT NULL,
            post_id INTEGER NOT NULL,
            comment TEXT NOT NULL,
            likes INTEGER NOT NULL DEFAULT 0,
            FOREIGN KEY (username) REFERENCES users(username),
            FOREIGN KEY (post_id) REFERENCES posts(id),
            FOREIGN KEY (user_id) REFERENCES users(id)
             )`);

    await DB.close();
    console.log("DB created");
}

createDB()