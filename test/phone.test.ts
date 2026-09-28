/*
 * SmartREST - Hono Edition
 * Copyright (c) Alessio Saltarin, 2026
 * This software is licensed under ISC License
 * See LICENSE
 */

import { describe, it, expect, beforeEach } from 'bun:test'
import { Hono } from 'hono'
import { createDatabase, initTables } from '../src/dao/db'
import { PersonDao, PhoneDao } from '../src/dao'
import { PersonService, PhoneService } from '../src/service'
import { phoneController } from '../src/controller'

describe('Phone Controller and Service Tests', () => {
  let app: Hono
  let personService: PersonService
  let phoneService: PhoneService
  let person1Id: number
  let person2Id: number

  beforeEach(async () => {
    const { db, client } = createDatabase(':memory:')
    await initTables(client)
    const personDao = new PersonDao(db)
    const phoneDao = new PhoneDao(db)
    personService = new PersonService(personDao, phoneDao)
    phoneService = new PhoneService(phoneDao, personDao)

    app = new Hono()
    app.route('/api/phones', phoneController(phoneService))

    // Seed test persons
    const p1 = await personService.createPersonWithPhones({
      name: 'Leonardo',
      surname: 'Da Vinci',
      address: 'Via Vinci 1, Firenze',
      birthday: '1452-04-15',
      gender: 'M',
      phones: [
        { prefix: '+39', phoneNumber: '055-123456', description: 'Studio' },
      ],
    })
    person1Id = p1.id

    const p2 = await personService.createPersonWithPhones({
      name: 'Galileo',
      surname: 'Galilei',
      address: 'Piazza del Duomo, Pisa',
      birthday: '1564-02-15',
      gender: 'M',
      phones: [
        { prefix: '+39', phoneNumber: '050-987654', description: 'Osservatorio' },
        { prefix: '+39', phoneNumber: '333-555666', description: 'Mobile' },
      ],
    })
    person2Id = p2.id
  })

  it('GET /api/phones/search should find phone and return owner person', async () => {
    const res = await app.request('/api/phones/search?query=123456')
    expect(res.status).toBe(200)

    const json = (await res.json()) as Array<{
      phoneNumber: string
      person: { name: string; surname: string }
    }>
    expect(json.length).toBe(1)
    expect(json[0].phoneNumber).toBe('055-123456')
    expect(json[0].person.name).toBe('Leonardo')
    expect(json[0].person.surname).toBe('Da Vinci')
  })

  it('GET /api/phones/search should return 400 when query parameter is missing', async () => {
    const res = await app.request('/api/phones/search')
    expect(res.status).toBe(400)
  })

  it('GET /api/phones/lookup/:number should find phone by exact number with owner person', async () => {
    const res = await app.request('/api/phones/lookup/050-987654')
    expect(res.status).toBe(200)

    const json = (await res.json()) as {
      phoneNumber: string
      person: { name: string; surname: string }
    }
    expect(json.phoneNumber).toBe('050-987654')
    expect(json.person.name).toBe('Galileo')
    expect(json.person.surname).toBe('Galilei')
  })

  it('GET /api/phones/lookup/:number should return 404 if phone number is not found', async () => {
    const res = await app.request('/api/phones/lookup/999-000000')
    expect(res.status).toBe(404)
  })

  it('POST /api/phones should add a phone to a person with 1 phone', async () => {
    const res = await app.request('/api/phones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        personId: person1Id,
        prefix: '+39',
        phoneNumber: '333-1122334',
        description: 'Personal Mobile',
      }),
    })

    expect(res.status).toBe(201)
    const json = (await res.json()) as { id: number; phoneNumber: string; personId: number }
    expect(json.id).toBeDefined()
    expect(json.phoneNumber).toBe('333-1122334')
    expect(json.personId).toBe(person1Id)

    // Now person 1 has 2 phones
    const updatedPerson = await personService.getPersonById(person1Id)
    expect(updatedPerson?.phones.length).toBe(2)
  })

  it('POST /api/phones should reject adding a phone to a person who already has 2 phones', async () => {
    const res = await app.request('/api/phones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        personId: person2Id,
        prefix: '+39',
        phoneNumber: '050-000111',
        description: 'Extra Phone',
      }),
    })

    expect(res.status).toBe(400)
    const json = (await res.json()) as { error: string }
    expect(json.error).toContain('maximum of 2 phone numbers')
  })

  it('POST /api/phones should return 400 for non-existent person', async () => {
    const res = await app.request('/api/phones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        personId: 99999,
        prefix: '+39',
        phoneNumber: '000-000000',
        description: 'Ghost',
      }),
    })

    expect(res.status).toBe(400)
  })
})
