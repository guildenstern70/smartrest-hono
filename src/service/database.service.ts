/*
 * SmartREST - Hono Edition
 * Copyright (c) Alessio Saltarin, 2026
 * This software is licensed under ISC License
 * See LICENSE
 */

import { Client } from '@libsql/client'
import { initTables, client as defaultClient } from '../dao/db'
import { PersonDao, PhoneDao } from '../dao'
import { PersonService } from './person.service'
import { CreatePersonWithPhonesDto } from '../dto'

export const SEED_PERSONS: CreatePersonWithPhonesDto[] = [
  {
    name: 'Alice',
    surname: 'Smith',
    address: '123 Maple Street, Springfield',
    birthday: '1985-04-12',
    gender: 'F',
    phones: [
      { prefix: '+1', phoneNumber: '555-0101', description: 'Personal Mobile' },
      { prefix: '+1', phoneNumber: '555-0102', description: 'Home' },
    ],
  },
  {
    name: 'Bob',
    surname: 'Jones',
    address: '456 Oak Avenue, Metropolis',
    birthday: '1990-08-23',
    gender: 'M',
    phones: [
      { prefix: '+1', phoneNumber: '555-0201', description: 'Work' },
      { prefix: '+1', phoneNumber: '555-0202', description: 'Mobile' },
    ],
  },
  {
    name: 'Charlie',
    surname: 'Brown',
    address: '789 Pine Road, Gotham',
    birthday: '1978-11-05',
    gender: 'M',
    phones: [
      { prefix: '+44', phoneNumber: '20-7946-0911', description: 'Office' },
      { prefix: '+44', phoneNumber: '7700-900822', description: 'Mobile' },
    ],
  },
  {
    name: 'Diana',
    surname: 'Prince',
    address: '101 Cedar Boulevard, Star City',
    birthday: '1988-03-22',
    gender: 'F',
    phones: [
      { prefix: '+33', phoneNumber: '1-4268-5501', description: 'Mobile' },
      { prefix: '+33', phoneNumber: '1-4268-5502', description: 'Direct Line' },
    ],
  },
  {
    name: 'Evan',
    surname: 'Wright',
    address: '202 Birch Lane, Central City',
    birthday: '1995-12-15',
    gender: 'M',
    phones: [
      { prefix: '+49', phoneNumber: '30-1234567', description: 'Mobile' },
      { prefix: '+49', phoneNumber: '30-7654321', description: 'Emergency' },
    ],
  },
  {
    name: 'Fiona',
    surname: 'Gallagher',
    address: '303 Elm Drive, Coast City',
    birthday: '1992-06-30',
    gender: 'F',
    phones: [{ prefix: '+1', phoneNumber: '555-0601', description: 'Personal Mobile' }],
  },
  {
    name: 'George',
    surname: 'Clark',
    address: '404 Walnut Court, Blüdhaven',
    birthday: '1982-01-18',
    gender: 'M',
    phones: [{ prefix: '+39', phoneNumber: '02-8940-1234', description: 'Work Desk' }],
  },
  {
    name: 'Hannah',
    surname: 'Abbott',
    address: '505 Willow Way, Keystone',
    birthday: '2000-09-09',
    gender: 'F',
    phones: [{ prefix: '+44', phoneNumber: '7700-900344', description: 'Mobile' }],
  },
  {
    name: 'Ian',
    surname: 'Malcolm',
    address: '606 Ash Place, National City',
    birthday: '1975-07-07',
    gender: 'M',
    phones: [{ prefix: '+1', phoneNumber: '555-0901', description: 'Laboratory Mobile' }],
  },
  {
    name: 'Julia',
    surname: 'Roberts',
    address: '707 Chestnut Street, Freeland',
    birthday: '1987-05-14',
    gender: 'F',
    phones: [{ prefix: '+1', phoneNumber: '555-1001', description: 'Main Phone' }],
  },
]

export class DatabaseService {
  constructor(
    private clientInstance: Client = defaultClient,
    private personDao: PersonDao = new PersonDao(),
    private phoneDao: PhoneDao = new PhoneDao(),
    private personService: PersonService = new PersonService(personDao, phoneDao)
  ) {}

  async initSchema(): Promise<void> {
    await initTables(this.clientInstance)
  }

  async seedDatabase(): Promise<{ personsCreated: number; phonesCreated: number }> {
    await this.initSchema()

    // Clear existing data before seeding
    await this.phoneDao.deleteAll()
    await this.personDao.deleteAll()

    for (const seed of SEED_PERSONS) {
      await this.personService.createPersonWithPhones(seed)
    }

    const personsCreated = await this.personDao.count()
    const phonesCreated = await this.phoneDao.count()

    return { personsCreated, phonesCreated }
  }

  async seedIfEmpty(): Promise<{ seeded: boolean; personsCreated: number; phonesCreated: number }> {
    await this.initSchema()
    const count = await this.personDao.count()
    if (count === 0) {
      const result = await this.seedDatabase()
      return { seeded: true, ...result }
    }
    return {
      seeded: false,
      personsCreated: count,
      phonesCreated: await this.phoneDao.count(),
    }
  }
}
