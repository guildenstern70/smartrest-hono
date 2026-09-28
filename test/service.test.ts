/*
 * SmartREST - Hono Edition
 * Copyright (c) Alessio Saltarin, 2026
 * This software is licensed under ISC License
 * See LICENSE
 */

import { describe, it, expect, beforeEach } from 'bun:test'
import { createDatabase, initTables } from '../src/dao/db'
import { PersonDao } from '../src/dao/person.dao'
import { PhoneDao } from '../src/dao/phone.dao'
import { PersonService } from '../src/service/person.service'

describe('PersonService Tests', () => {
  let personService: PersonService

  beforeEach(async () => {
    const { db, client } = createDatabase(':memory:')
    await initTables(client)
    const personDao = new PersonDao(db)
    const phoneDao = new PhoneDao(db)
    personService = new PersonService(personDao, phoneDao)
  })

  it('should create person with 1 phone number', async () => {
    const person = await personService.createPersonWithPhones({
      name: 'Mario',
      surname: 'Rossi',
      address: 'Via Roma 1, Milano',
      birthday: '1980-05-20',
      gender: 'M',
      phones: [
        { prefix: '+39', phoneNumber: '333-1234567', description: 'Cellulare' },
      ],
    })

    expect(person.id).toBeDefined()
    expect(person.name).toBe('Mario')
    expect(person.phones.length).toBe(1)
  })

  it('should create person with 2 phone numbers', async () => {
    const person = await personService.createPersonWithPhones({
      name: 'Luigi',
      surname: 'Verdi',
      address: 'Corso Italia 10, Torino',
      birthday: '1985-10-12',
      gender: 'M',
      phones: [
        { prefix: '+39', phoneNumber: '333-7654321', description: 'Cellulare' },
        { prefix: '+39', phoneNumber: '011-123456', description: 'Ufficio' },
      ],
    })

    expect(person.id).toBeDefined()
    expect(person.phones.length).toBe(2)
  })

  it('should reject person creation with 0 phone numbers', async () => {
    expect(
      personService.createPersonWithPhones({
        name: 'Anna',
        surname: 'Bianchi',
        address: 'Via Dante 5, Firenze',
        birthday: '1995-02-14',
        gender: 'F',
        phones: [],
      })
    ).rejects.toThrow()
  })

  it('should reject person creation with more than 2 phone numbers', async () => {
    expect(
      personService.createPersonWithPhones({
        name: 'Anna',
        surname: 'Bianchi',
        address: 'Via Dante 5, Firenze',
        birthday: '1995-02-14',
        gender: 'F',
        phones: [
          { prefix: '+39', phoneNumber: '111', description: 'p1' },
          { prefix: '+39', phoneNumber: '222', description: 'p2' },
          { prefix: '+39', phoneNumber: '333', description: 'p3' },
        ],
      })
    ).rejects.toThrow()
  })

  it('should allow adding a 2nd phone number to person with 1 phone', async () => {
    const person = await personService.createPersonWithPhones({
      name: 'Sara',
      surname: 'Neri',
      address: 'Piazza Garibaldi 3, Napoli',
      birthday: '1991-07-07',
      gender: 'F',
      phones: [
        { prefix: '+39', phoneNumber: '333-9999999', description: 'Mobile' },
      ],
    })

    const phone = await personService.addPhoneToPerson(person.id, {
      prefix: '+39',
      phoneNumber: '081-111222',
      description: 'Home',
    })

    expect(phone.id).toBeDefined()

    const updatedPerson = await personService.getPersonById(person.id)
    expect(updatedPerson?.phones.length).toBe(2)
  })

  it('should reject adding a 3rd phone number to person who already has 2', async () => {
    const person = await personService.createPersonWithPhones({
      name: 'Sara',
      surname: 'Neri',
      address: 'Piazza Garibaldi 3, Napoli',
      birthday: '1991-07-07',
      gender: 'F',
      phones: [
        { prefix: '+39', phoneNumber: '333-1111111', description: 'Mobile' },
        { prefix: '+39', phoneNumber: '081-2222222', description: 'Home' },
      ],
    })

    expect(
      personService.addPhoneToPerson(person.id, {
        prefix: '+39',
        phoneNumber: '081-3333333',
        description: 'Office',
      })
    ).rejects.toThrow('already has the maximum of 2 phone numbers')
  })
})
