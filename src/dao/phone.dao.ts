/*
 * SmartREST - Hono Edition
 * Copyright (c) Alessio Saltarin, 2026
 * This software is licensed under ISC License
 * See LICENSE
 */

import { eq, count as drizzleCount } from 'drizzle-orm'
import { phones, NewPhone, Phone } from '../model'
import { db as defaultDb, AppDatabase } from './db'

export class PhoneDao {
  constructor(private database: AppDatabase = defaultDb) {}

  async create(phoneData: NewPhone): Promise<Phone> {
    const inserted = await this.database.insert(phones).values(phoneData).returning()
    return inserted[0]
  }

  async createMany(phonesData: NewPhone[]): Promise<Phone[]> {
    if (phonesData.length === 0) return []
    return this.database.insert(phones).values(phonesData).returning()
  }

  async findById(id: number): Promise<Phone | null> {
    const result = await this.database.select().from(phones).where(eq(phones.id, id))
    return result[0] ?? null
  }

  async findByPersonId(personId: number): Promise<Phone[]> {
    return this.database.select().from(phones).where(eq(phones.personId, personId))
  }

  async findByNumberWithPerson(phoneNumber: string) {
    return this.database.query.phones.findMany({
      where: (phones, { eq, like, or }) =>
        or(eq(phones.phoneNumber, phoneNumber), like(phones.phoneNumber, `%${phoneNumber}%`)),
      with: {
        person: true,
      },
    })
  }

  async findExactWithPerson(phoneNumber: string, prefix?: string) {
    return this.database.query.phones.findFirst({
      where: (phones, { eq, and }) =>
        prefix
          ? and(eq(phones.phoneNumber, phoneNumber), eq(phones.prefix, prefix))
          : eq(phones.phoneNumber, phoneNumber),
      with: {
        person: true,
      },
    })
  }

  async findAll(): Promise<Phone[]> {
    return this.database.select().from(phones)
  }

  async count(): Promise<number> {
    const res = await this.database.select({ value: drizzleCount() }).from(phones)
    return res[0]?.value ?? 0
  }

  async countByPersonId(personId: number): Promise<number> {
    const res = await this.database
      .select({ value: drizzleCount() })
      .from(phones)
      .where(eq(phones.personId, personId))
    return res[0]?.value ?? 0
  }

  async deleteById(id: number): Promise<boolean> {
    const deleted = await this.database.delete(phones).where(eq(phones.id, id)).returning()
    return deleted.length > 0
  }

  async deleteAll(): Promise<void> {
    await this.database.delete(phones)
  }
}
