import * as SQLite from "expo-sqlite";


let dbInstance: SQLite.SQLiteDatabase | null = null;

export async function initializeDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (dbInstance) {
    return dbInstance;
  }

  const db = await SQLite.openDatabaseAsync("cleaner.db");
  dbInstance = db;
  console.log("[Database] Initialized database instance");

  // Run migrations
  await runMigrations(db);

  return db;
}

export function getDatabase(): SQLite.SQLiteDatabase {
  if (!dbInstance) {
    throw new Error(
      "Database not initialized. Call initializeDatabase() first."
    );
  }
  return dbInstance;
}

async function runMigrations(db: SQLite.SQLiteDatabase): Promise<void> {
  console.log("[Database] Starting migrations check...");
  // Create migrations table if it doesn't exist
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Get applied migrations
  const result = await db.getAllAsync<{ version: number }>(
    "SELECT version FROM schema_migrations ORDER BY version"
  );
  const appliedVersions = new Set(result.map((r) => r.version));
  console.log(
    `[Database] Found ${appliedVersions.size} applied migrations:`,
    Array.from(appliedVersions)
  );

  // Import and run pending migrations
  const { migrations } = await import("./migrations");

  for (const migration of migrations) {
    if (!appliedVersions.has(migration.version)) {
      console.log(`[Database] Running migration: ${migration.name} (${migration.version})`);
      await migration.up(db);
      await db.runAsync(
        "INSERT INTO schema_migrations (version, name) VALUES (?, ?)",
        [migration.version, migration.name]
      );
    }
  }
}

