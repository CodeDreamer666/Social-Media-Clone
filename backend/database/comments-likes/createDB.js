import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { join } from "node:path";

async function createDB() {
    const DB = await open({
        driver: sqlite3.Database,
        filename: join("database", "comments-likes", "comments-likes.db")
    });

    await DB.exec(`
        CREATE TABLE IF NOT EXISTS comments_likes(
        comment_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        FOREIGN KEY (comment_id) REFERENCES comments(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
         )`);

    await DB.close();
    console.log("DB created");
}

createDB();