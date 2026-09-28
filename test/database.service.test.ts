/*
 * SmartREST - Hono Edition
 * Copyright (c) Alessio Saltarin, 2026
 * This software is licensed under ISC License
 * See LICENSE
 */

import { describe, it, expect } from 'bun:test'
import { createDatabase } from '../src/dao/db'
import { PersonDao } from '../src/dao/person.dao'
import { PhoneDao } from '../src/dao/phone.dao'
import { DatabaseService } from '../src/service/database.service'
import { PersonService } from '../src/service/person.service'

describe('DatabaseService Seeder Tests', () => {
  it('should initialize and seed exactly 10 persons and 15 phone numbers', async () => {
    const { db, client } = createDatabase(':memory:')
    const personDao = new PersonDao(db)
    const phoneDao = new PhoneDao(db)
    const personService = new PersonService(personDao, phoneDao)
    const dbService = new DatabaseService(client, personDao, phoneDao, personService)

    const result = await dbService.seedDatabase()

    expect(result.personsCreated).toBe(10)
    expect(result.phonesCreated).toBe(15)

    const persons = await personService.getAllPersons()
    expect(persons.length).toBe(10)

    let totalPhones = 0
    for (const p of persons) {
      expect(p.phones.length).toBeGreaterThanOrEqual(1)
      expect(p.phones.length).toBeLessThanOrEqual(2)
      totalPhones += p.phones.length
    }

    expect(totalPhones).toBe(15)
  })

  it('should only seed if the database is empty', async () => {
    const { db, client } = createDatabase(':memory:')
    const personDao = new PersonDao(db)
    const phoneDao = new PhoneDao(db)
    const personService = new PersonService(personDao, phoneDao)
    const dbService = new DatabaseService(client, personDao, phoneDao, personService)

    const firstRun = await dbService.seedIfEmpty()
    expect(firstRun.seeded).toBe(true)
    expect(firstRun.personsCreated).toBe(10)

    const secondRun = await dbService.seedIfEmpty()
    expect(secondRun.seeded).toBe(false)
    expect(secondRun.personsCreated).toBe(10)
  })
})
