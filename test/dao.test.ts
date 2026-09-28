/*
 * SmartREST - Hono Edition
 * Copyright (c) Alessio Saltarin, 2026
 * This software is licensed under ISC License
 * See LICENSE
 */

import { describe, it, expect, beforeEach } from 'bun:test'
import { createDatabase, initTables, AppDatabase } from '../src/dao/db'
import { PersonDao } from '../src/dao/person.dao'
import { PhoneDao } from '../src/dao/phone.dao'

describe('DAO Tests', () => {
  let testDb: AppDatabase
  let personDao: PersonDao
  let phoneDao: PhoneDao

  beforeEach(() => {
    const { db, sqlite } = createDatabase(':memory:')
    initTables(sqlite)
    testDb = db
    personDao = new PersonDao(testDb)
    phoneDao = new PhoneDao(testDb)
  })

  it('should insert and retrieve a person', async () => {
    const person = await personDao.create({
      name: 'John',
      surname: 'Doe',
      address: '123 Main St',
      birthday: '1990-01-01',
      gender: 'M',
    })

    expect(person.id).toBeDefined()
    expect(person.name).toBe('John')
    expect(person.surname).toBe('Doe')

    const found = await personDao.findById(person.id)
    expect(found).not.toBeNull()
    expect(found?.name).toBe('John')
  })

  it('should insert phones for a person and find with relations', async () => {
    const person = await personDao.create({
      name: 'Jane',
      surname: 'Doe',
      address: '456 Oak Ave',
      birthday: '1992-05-15',
      gender: 'F',
    })

    const phone1 = await phoneDao.create({
      personId: person.id,
      prefix: '+1',
      phoneNumber: '555-1234',
      description: 'Mobile',
    })

    const phone2 = await phoneDao.create({
      personId: person.id,
      prefix: '+1',
      phoneNumber: '555-5678',
      description: 'Work',
    })

    expect(phone1.id).toBeDefined()
    expect(phone2.id).toBeDefined()

    const personPhones = await phoneDao.findByPersonId(person.id)
    expect(personPhones.length).toBe(2)

    const personWithPhones = await personDao.findByIdWithPhones(person.id)
    expect(personWithPhones).toBeDefined()
    expect(personWithPhones?.phones.length).toBe(2)
    expect(personWithPhones?.phones[0].phoneNumber).toBe('555-1234')
  })

  it('should count persons and phones correctly', async () => {
    expect(await personDao.count()).toBe(0)
    expect(await phoneDao.count()).toBe(0)

    const person = await personDao.create({
      name: 'Alice',
      surname: 'Smith',
      address: '789 Pine Rd',
      birthday: '1985-04-12',
      gender: 'F',
    })

    await phoneDao.create({
      personId: person.id,
      prefix: '+1',
      phoneNumber: '555-9999',
      description: 'Personal',
    })

    expect(await personDao.count()).toBe(1)
    expect(await phoneDao.count()).toBe(1)
    expect(await phoneDao.countByPersonId(person.id)).toBe(1)
  })

  it('should cascade delete phones when person is deleted', async () => {
    const person = await personDao.create({
      name: 'Mark',
      surname: 'Twain',
      address: 'River Road',
      birthday: '1835-11-30',
      gender: 'M',
    })

    await phoneDao.create({
      personId: person.id,
      prefix: '+1',
      phoneNumber: '555-0000',
      description: 'Desk',
    })

    expect(await phoneDao.count()).toBe(1)
    await personDao.deleteById(person.id)
    expect(await personDao.count()).toBe(0)
    expect(await phoneDao.count()).toBe(0)
  })
})
