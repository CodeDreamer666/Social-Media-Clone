import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { join } from "node:path";

async function createDB() {
    const DB = await open({
        driver: sqlite3.Database,
        filename: join("database", "users", "users.db")
    });

    await DB.exec(`
        CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        bio TEXT)`);

    await DB.close();
    console.log("DB created");
}

createDB();