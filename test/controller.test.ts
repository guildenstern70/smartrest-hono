/*
 * SmartREST - Hono Edition
 * Copyright (c) Alessio Saltarin, 2026
 * This software is licensed under ISC License
 * See LICENSE
 */

import { describe, it, expect } from 'bun:test'
import { Hono } from 'hono'
import { createDatabase, initTables } from '../src/dao/db'
import { PersonDao, PhoneDao } from '../src/dao'
import { PersonService, DatabaseService } from '../src/service'
import { personController } from '../src/controller'

describe('Person Controller HTTP Tests', () => {
  const { db, sqlite } = createDatabase(':memory:')
  initTables(sqlite)
  const personDao = new PersonDao(db)
  const phoneDao = new PhoneDao(db)
  const personService = new PersonService(personDao, phoneDao)
  const databaseService = new DatabaseService(sqlite, personDao, phoneDao, personService)

  const app = new Hono()
  app.route('/api/persons', personController(personService, databaseService))

  it('POST /api/persons/seed should seed 10 persons and 15 phones', async () => {
    const res = await app.request('/api/persons/seed', { method: 'POST' })
    expect(res.status).toBe(200)
    const json = (await res.json()) as { message: string; personsCreated: number; phonesCreated: number }
    expect(json.personsCreated).toBe(10)
    expect(json.phonesCreated).toBe(15)
  })

  it('GET /api/persons should return all 10 persons with phones', async () => {
    const res = await app.request('/api/persons')
    expect(res.status).toBe(200)
    const json = (await res.json()) as Array<{ name: string; phones: Array<unknown> }>
    expect(json.length).toBe(10)
    expect(json[0].phones.length).toBeGreaterThanOrEqual(1)
  })

  it('POST /api/persons should create a new person with validated phones', async () => {
    const res = await app.request('/api/persons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'New',
        surname: 'User',
        address: 'Test Street 10',
        birthday: '1999-01-01',
        gender: 'Other',
        phones: [
          { prefix: '+1', phoneNumber: '555-9988', description: 'Personal' },
        ],
      }),
    })
    expect(res.status).toBe(201)
    const json = (await res.json()) as { id: number; name: string }
    expect(json.id).toBeDefined()
    expect(json.name).toBe('New')
  })

  it('POST /api/persons should return 400 on validation failure', async () => {
    const res = await app.request('/api/persons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: '',
        surname: '',
      }),
    })
    expect(res.status).toBe(400)
  })

  it('PATCH /api/persons/:id should update person attributes', async () => {
    const res = await app.request('/api/persons/1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Alice Updated',
        address: '777 New Boulevard',
      }),
    })
    expect(res.status).toBe(200)
    const json = (await res.json()) as { name: string; address: string; surname: string }
    expect(json.name).toBe('Alice Updated')
    expect(json.address).toBe('777 New Boulevard')
    expect(json.surname).toBe('Smith')
  })

  it('PATCH /api/persons/:id should return 404 for non-existent person', async () => {
    const res = await app.request('/api/persons/9999', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Ghost' }),
    })
    expect(res.status).toBe(404)
  })

  it('DELETE /api/persons/:id should delete person and cascade delete phones', async () => {
    const res = await app.request('/api/persons/1', { method: 'DELETE' })
    expect(res.status).toBe(200)
    const json = (await res.json()) as { message: string }
    expect(json.message).toBe('Person deleted successfully')

    const getRes = await app.request('/api/persons/1')
    expect(getRes.status).toBe(404)
  })

  it('DELETE /api/persons/:id should return 404 for already deleted person', async () => {
    const res = await app.request('/api/persons/1', { method: 'DELETE' })
    expect(res.status).toBe(404)
  })
})
