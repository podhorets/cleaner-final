import * as SQLite from "expo-sqlite";

import { Migration } from "../types";

export const migration: Migration = {
  version: 1,
  name: "001_initial_schema",
  up: async (db: SQLite.SQLiteDatabase) => {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        lastChangeSecretFolder TEXT,
        lastClean TEXT,
        lastSpeedTest TEXT,
        cleanedInTotal INTEGER NOT NULL DEFAULT 0,
        password TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Insert default user if none exists
    const existingUsers = await db.getAllAsync("SELECT id FROM users LIMIT 1");
    if (existingUsers.length === 0) {
      await db.runAsync(
        `INSERT INTO users (cleanedInTotal) VALUES (0)`
      );
    }
  },
};

