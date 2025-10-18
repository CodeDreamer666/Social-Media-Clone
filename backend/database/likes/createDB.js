import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { join } from "node:path";

async function createDB() {
    const DB = await open({
        driver: sqlite3.Database,
        filename: join("database", "likes", "likes.db")
    });

    await DB.exec(`
        CREATE TABLE IF NOT EXISTS likes(
        post_id  INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        FOREIGN KEY (post_id) REFERENCES posts(id),
        FOREIGN KEY (user_id) REFERENCES users(id),
        UNIQUE (post_id, user_id)
         )`);

    await DB.close();
    console.log("DB created");
}

createDB();