/*
 * SmartREST - Hono Edition
 * Copyright (c) Alessio Saltarin, 2026
 * This software is licensed under ISC License
 * See LICENSE
 */

import { Database } from 'bun:sqlite'
import { drizzle, BunSQLiteDatabase } from 'drizzle-orm/bun-sqlite'
import * as schema from '../model'

export type AppDatabase = BunSQLiteDatabase<typeof schema>

export const createDatabase = (dbPath: string = 'smartrest.db'): { db: AppDatabase; sqlite: Database } => {
  const sqlite = new Database(dbPath)
  sqlite.run('PRAGMA foreign_keys = ON;')
  const db = drizzle(sqlite, { schema })
  return { db, sqlite }
}

export const initTables = (sqlite: Database): void => {
  sqlite.run(`
    CREATE TABLE IF NOT EXISTS persons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      surname TEXT NOT NULL,
      address TEXT NOT NULL,
      birthday TEXT NOT NULL,
      gender TEXT NOT NULL
    );
  `)

  sqlite.run(`
    CREATE TABLE IF NOT EXISTS phones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      person_id INTEGER NOT NULL,
      prefix TEXT NOT NULL,
      phone_number TEXT NOT NULL,
      description TEXT NOT NULL,
      FOREIGN KEY (person_id) REFERENCES persons(id) ON DELETE CASCADE
    );
  `)
}

// Default singleton database instance
const defaultDbSetup = createDatabase(process.env.DB_PATH || 'smartrest.db')
export const db = defaultDbSetup.db
export const sqlite = defaultDbSetup.sqlite
