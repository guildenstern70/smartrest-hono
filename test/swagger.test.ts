/*
 * SmartREST - Hono Edition
 * Copyright (c) Alessio Saltarin, 2026
 * This software is licensed under ISC License
 * See LICENSE
 */

import { describe, it, expect } from 'bun:test'
import { Hono } from 'hono'
import { swaggerController } from '../src/controller/swagger.controller'

describe('Swagger Documentation Tests', () => {
  const app = new Hono()
  app.route('/', swaggerController())

  it('GET /doc should return valid OpenAPI 3.0 JSON specification', async () => {
    const res = await app.request('/doc')
    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toContain('application/json')

    const doc = (await res.json()) as { openapi: string; paths: Record<string, unknown>; info: { title: string } }
    expect(doc.openapi).toBe('3.0.3')
    expect(doc.info.title).toContain('SmartREST')
    expect(doc.paths['/api/persons']).toBeDefined()
    expect(doc.paths['/api/persons/{id}']).toBeDefined()
    expect(doc.paths['/api/persons/seed']).toBeDefined()
  })

  it('GET /swagger should serve Swagger UI HTML page', async () => {
    const res = await app.request('/swagger')
    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toContain('text/html')
    const html = await res.text()
    expect(html).toContain('swagger-ui')
  })

  it('GET /docs should also serve Swagger UI HTML page', async () => {
    const res = await app.request('/docs')
    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toContain('text/html')
  })
})
