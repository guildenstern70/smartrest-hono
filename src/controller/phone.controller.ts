/*
 * SmartREST - Hono Edition
 * Copyright (c) Alessio Saltarin, 2026
 * This software is licensed under ISC License
 * See LICENSE
 */

import { Hono } from 'hono'
import { PhoneService } from '../service/phone.service'
import { addPhoneSchema } from '../dto'

export const phoneController = (phoneService: PhoneService = new PhoneService()) => {
  const app = new Hono()

  app.get('/', async (c) => {
    const phones = await phoneService.getAllPhones()
    return c.json(phones)
  })

  // Search/lookup phone number to retrieve the owner person
  app.get('/search', async (c) => {
    const query = c.req.query('query') || c.req.query('number')
    if (!query) {
      return c.json({ error: 'Query parameter "query" or "number" is required' }, 400)
    }
    const results = await phoneService.searchPhonesWithPerson(query)
    return c.json(results)
  })

  app.get('/lookup/:number', async (c) => {
    const number = c.req.param('number')
    const prefix = c.req.query('prefix')
    const result = await phoneService.findExactPhoneWithPerson(number, prefix)
    if (!result) {
      return c.json({ error: 'Phone number not found' }, 404)
    }
    return c.json(result)
  })

  // Add a phone to an existing person
  app.post('/', async (c) => {
    try {
      const body = await c.req.json()
      const validated = addPhoneSchema.parse(body)
      const created = await phoneService.addPhoneToPerson(validated)
      return c.json(created, 201)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid request payload'
      return c.json({ error: message }, 400)
    }
  })

  return app
}
