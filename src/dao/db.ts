/*
 * SmartREST - Hono Edition
 * Copyright (c) Alessio Saltarin, 2026
 * This software is licensed under ISC License
 * See LICENSE
 */

import { createClient, Client } from '@libsql/client'
import { drizzle, LibSQLDatabase } from 'drizzle-orm/libsql'
import * as schema from '../model'

export type AppDatabase = LibSQLDatabase<typeof schema>

export const getDbUrl = (dbPath?: string): string => {
  if (dbPath) {
    return dbPath.startsWith('file:') || dbPath === ':memory:' ? dbPath : `file:${dbPath}`
  }
  if (process.env.DB_URL) {
    return process.env.DB_URL
  }
  const isServerless = Boolean(
    process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.LAMBDA_TASK_ROOT
  )
  const path = process.env.DB_PATH || (isServerless ? '/tmp/smartrest.db' : 'smartrest.db')
  return path.startsWith('file:') || path === ':memory:' ? path : `file:${path}`
}

export const createDatabase = (
  dbPath?: string
): { db: AppDatabase; client: Client } => {
  const url = getDbUrl(dbPath)
  const client = createClient({ url })
  const db = drizzle(client, { schema })
  return { db, client }
}

export const initTables = async (client: Client): Promise<void> => {
  await client.execute('PRAGMA foreign_keys = ON;')
  await client.execute(`
    CREATE TABLE IF NOT EXISTS persons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      surname TEXT NOT NULL,
      address TEXT NOT NULL,
      birthday TEXT NOT NULL,
      gender TEXT NOT NULL
    );
  `)

  await client.execute(`
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
const defaultDbSetup = createDatabase()
export const db = defaultDbSetup.db
export const client = defaultDbSetup.client
