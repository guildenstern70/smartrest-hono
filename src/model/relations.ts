/*
 * SmartREST - Hono Edition
 * Copyright (c) Alessio Saltarin, 2026
 * This software is licensed under ISC License
 * See LICENSE
 */

import { relations } from 'drizzle-orm'
import { persons } from './person'
import { phones } from './phone'

export const personsRelations = relations(persons, ({ many }) => ({
  phones: many(phones),
}))

export const phonesRelations = relations(phones, ({ one }) => ({
  person: one(persons, {
    fields: [phones.personId],
    references: [persons.id],
  }),
}))
