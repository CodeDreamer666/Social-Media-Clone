import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { join } from "node:path";

export default async function getLikesDB() {
    return open({
        driver: sqlite3.Database,
        filename: join("database", "likes", "likes.db")
    });
}

getLikesDB();