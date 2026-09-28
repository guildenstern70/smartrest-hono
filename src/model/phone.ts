/*
 * SmartREST - Hono Edition
 * Copyright (c) Alessio Saltarin, 2026
 * This software is licensed under ISC License
 * See LICENSE
 */

import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { persons } from './person'

export const phones = sqliteTable('phones', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  personId: integer('person_id')
    .notNull()
    .references(() => persons.id, { onDelete: 'cascade' }),
  prefix: text('prefix').notNull(),
  phoneNumber: text('phone_number').notNull(),
  description: text('description').notNull(),
})

export type Phone = typeof phones.$inferSelect
export type NewPhone = typeof phones.$inferInsert
