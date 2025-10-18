import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { join } from "node:path";

async function seeDB() {
    const DB = await open({
        driver: sqlite3.Database,
        filename: join("database", "users", "users.db")
    });

    const data = await DB.all("SELECT * FROM users");
    await DB.close();
    console.log(data);
}

seeDB();