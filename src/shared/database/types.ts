import * as SQLite from "expo-sqlite";

export interface User {
  id: number;
  lastChangeSecretFolder: string | null;
  lastClean: string | null;
  lastSpeedTest: string | null;
  cleanedInTotal: number;
  password: string | null;
}

export interface Database {
  db: SQLite.SQLiteDatabase;
}

export type Migration = {
  version: number;
  name: string;
  up: (db: SQLite.SQLiteDatabase) => Promise<void>;
};

