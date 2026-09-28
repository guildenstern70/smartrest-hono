/*
 * SmartREST - Hono Edition
 * Copyright (c) Alessio Saltarin, 2026
 * This software is licensed under ISC License
 * See LICENSE
 */

import { eq, count as drizzleCount } from 'drizzle-orm'
import { persons, NewPerson, Person } from '../model'
import { db as defaultDb, AppDatabase } from './db'

export class PersonDao {
  constructor(private database: AppDatabase = defaultDb) {}

  async create(personData: NewPerson): Promise<Person> {
    const inserted = await this.database.insert(persons).values(personData).returning()
    return inserted[0]
  }

  async findById(id: number): Promise<Person | null> {
    const result = await this.database.select().from(persons).where(eq(persons.id, id))
    return result[0] ?? null
  }

  async findByIdWithPhones(id: number) {
    return this.database.query.persons.findFirst({
      where: eq(persons.id, id),
      with: {
        phones: true,
      },
    })
  }

  async findAll(): Promise<Person[]> {
    return this.database.select().from(persons)
  }

  async findAllWithPhones() {
    return this.database.query.persons.findMany({
      with: {
        phones: true,
      },
    })
  }

  async count(): Promise<number> {
    const res = await this.database.select({ value: drizzleCount() }).from(persons)
    return res[0]?.value ?? 0
  }

  async update(id: number, personData: Partial<NewPerson>): Promise<Person | null> {
    const updated = await this.database
      .update(persons)
      .set(personData)
      .where(eq(persons.id, id))
      .returning()
    return updated[0] ?? null
  }

  async deleteById(id: number): Promise<boolean> {
    const deleted = await this.database.delete(persons).where(eq(persons.id, id)).returning()
    return deleted.length > 0
  }

  async deleteAll(): Promise<void> {
    await this.database.delete(persons)
  }
}
