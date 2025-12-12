import * as SQLite from "expo-sqlite";

import { getDatabase } from "../database";
import { User } from "../types";

export class UserRepository {
  private getDb(): SQLite.SQLiteDatabase {
    return getDatabase();
  }

  async getUser(): Promise<User | null> {
    console.log("[UserRepository] getUser called");
    const db = this.getDb();
    const result = await db.getFirstAsync<User>("SELECT * FROM users LIMIT 1");
    console.log("[UserRepository] getUser result:", result);
    return result || null;
  }

  async createUser(user: Partial<User>): Promise<User> {
    console.log("[UserRepository] createUser called with:", user);
    const db = this.getDb();
    const now = new Date().toISOString();

    const result = await db.runAsync(
      `INSERT INTO users (
        lastChangeSecretFolder,
        lastClean,
        lastSpeedTest,
        cleanedInTotal,
        password,
        downloadSpeed,
        uploadSpeed,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user.lastChangeSecretFolder || null,
        user.lastClean || null,
        user.lastSpeedTest || null,
        user.cleanedInTotal ?? 0,
        user.password || null,
        user.downloadSpeed ?? null,
        user.uploadSpeed ?? null,
        now,
        now,
      ]
    );

    const createdUser = await db.getFirstAsync<User>(
      "SELECT * FROM users WHERE id = ?",
      [result.lastInsertRowId]
    );

    if (!createdUser) {
      throw new Error("Failed to create user");
    }

    return createdUser;
  }

  async updateUser(updates: Partial<User>): Promise<User> {
    console.log("[UserRepository] updateUser called with:", updates);
    const db = this.getDb();
    const now = new Date().toISOString();

    const fields: string[] = [];
    const values: SQLite.SQLiteBindValue[] = [];

    if (updates.lastChangeSecretFolder !== undefined) {
      fields.push("lastChangeSecretFolder = ?");
      values.push(updates.lastChangeSecretFolder);
    }
    if (updates.lastClean !== undefined) {
      fields.push("lastClean = ?");
      values.push(updates.lastClean);
    }
    if (updates.lastSpeedTest !== undefined) {
      fields.push("lastSpeedTest = ?");
      values.push(updates.lastSpeedTest);
    }
    if (updates.cleanedInTotal !== undefined) {
      fields.push("cleanedInTotal = ?");
      values.push(updates.cleanedInTotal);
    }
    if (updates.password !== undefined) {
      fields.push("password = ?");
      values.push(updates.password);
    }
    if (updates.downloadSpeed !== undefined) {
      fields.push("downloadSpeed = ?");
      values.push(updates.downloadSpeed);
    }
    if (updates.uploadSpeed !== undefined) {
      fields.push("uploadSpeed = ?");
      values.push(updates.uploadSpeed);
    }

    if (fields.length === 0) {
      const user = await this.getUser();
      if (!user) {
        throw new Error("No user found to update");
      }
      return user;
    }

    fields.push("updated_at = ?");
    values.push(now);

    await db.runAsync(
      `UPDATE users SET ${fields.join(
        ", "
      )} WHERE id = (SELECT id FROM users LIMIT 1)`,
      values
    );

    const updatedUser = await this.getUser();
    if (!updatedUser) {
      throw new Error("Failed to update user");
    }

    console.log("[UserRepository] updateUser result:", updatedUser);

    return updatedUser;
  }

  async updateField<K extends keyof User>(
    field: K,
    value: User[K]
  ): Promise<User> {
    return this.updateUser({ [field]: value } as Partial<User>);
  }
}

export const userRepository = new UserRepository();
