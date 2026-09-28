/*
 * SmartREST - Hono Edition
 * Copyright (c) Alessio Saltarin, 2026
 * This software is licensed under ISC License
 * See LICENSE
 */

import { describe, it, expect } from 'bun:test'
import { Hono } from 'hono'
import { homeController } from '../src/controller/home.controller'
import { swaggerController } from '../src/controller/swagger.controller'

describe('Home Page Controller Tests', () => {
  const app = new Hono()
  app.route('/', homeController())
  app.route('/', swaggerController())

  it('GET / should return professional HTML page with Hero section and buttons', async () => {
    const res = await app.request('/')
    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toContain('text/html')

    const html = await res.text()
    expect(html).toContain('SmartREST')
    expect(html).toContain('Hono Edition')
    expect(html).toContain('hero')
    expect(html).toContain('href="/swagger"')
    expect(html).toContain('href="/doc/download"')
    expect(html).toContain('Drizzle')
    expect(html).toContain('SQLite')
  })

  it('GET /doc/download should serve OpenAPI spec with attachment header', async () => {
    const res = await app.request('/doc/download')
    expect(res.status).toBe(200)
    expect(res.headers.get('content-disposition')).toBe('attachment; filename="openapi.json"')
    const doc = (await res.json()) as { openapi: string }
    expect(doc.openapi).toBe('3.0.3')
  })
})
