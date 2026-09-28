/*
 * SmartREST - Hono Edition
 * Copyright (c) Alessio Saltarin, 2026
 * This software is licensed under ISC License
 * See LICENSE
 */

import { Hono } from 'hono'
import { PersonService } from '../service/person.service'
import { DatabaseService } from '../service/database.service'
import { createPersonWithPhonesSchema, updatePersonSchema } from '../dto'

export const personController = (
  personService: PersonService = new PersonService(),
  databaseService: DatabaseService = new DatabaseService()
) => {
  const app = new Hono()

  app.get('/', async (c) => {
    const persons = await personService.getAllPersons()
    return c.json(persons)
  })

  app.get('/:id', async (c) => {
    const id = Number(c.req.param('id'))
    if (isNaN(id)) {
      return c.json({ error: 'Invalid person id' }, 400)
    }
    const person = await personService.getPersonById(id)
    if (!person) {
      return c.json({ error: 'Person not found' }, 404)
    }
    return c.json(person)
  })

  app.post('/', async (c) => {
    try {
      const body = await c.req.json()
      const validated = createPersonWithPhonesSchema.parse(body)
      const created = await personService.createPersonWithPhones(validated)
      return c.json(created, 201)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid request payload'
      return c.json({ error: message }, 400)
    }
  })

  app.patch('/:id', async (c) => {
    const id = Number(c.req.param('id'))
    if (isNaN(id)) {
      return c.json({ error: 'Invalid person id' }, 400)
    }
    try {
      const body = await c.req.json()
      const validated = updatePersonSchema.parse(body)
      const updated = await personService.updatePerson(id, validated)
      if (!updated) {
        return c.json({ error: 'Person not found' }, 404)
      }
      return c.json(updated)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid update payload'
      return c.json({ error: message }, 400)
    }
  })

  app.delete('/:id', async (c) => {
    const id = Number(c.req.param('id'))
    if (isNaN(id)) {
      return c.json({ error: 'Invalid person id' }, 400)
    }
    const deleted = await personService.deletePerson(id)
    if (!deleted) {
      return c.json({ error: 'Person not found' }, 404)
    }
    return c.json({ message: 'Person deleted successfully' })
  })

  app.post('/seed', async (c) => {
    try {
      const result = await databaseService.seedDatabase()
      return c.json({ message: 'Database seeded successfully', ...result })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to seed database'
      return c.json({ error: message }, 500)
    }
  })

  return app
}
