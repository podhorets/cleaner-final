import * as SQLite from "expo-sqlite";

import { Migration } from "../types";

export const migration: Migration = {
  version: 2,
  name: "002_add_speed_fields",
  up: async (db: SQLite.SQLiteDatabase) => {
    await db.execAsync(`
      ALTER TABLE users ADD COLUMN downloadSpeed REAL DEFAULT NULL;
    `);
    
    await db.execAsync(`
      ALTER TABLE users ADD COLUMN uploadSpeed REAL DEFAULT NULL;
    `);
  },
};
