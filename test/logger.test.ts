/*
 * SmartREST - Hono Edition
 * Copyright (c) Alessio Saltarin, 2026
 * This software is licensed under ISC License
 * See LICENSE
 */

import { describe, it, expect } from 'bun:test'
import { Hono } from 'hono'
import { getAppInfo, logAppStartup } from '../src/utils/logger'
import { httpLogger } from '../src/utils/http-logger.middleware'
import packageJson from '../package.json'

describe('Logger Tests', () => {
  it('should read name and version directly from package.json', () => {
    const info = getAppInfo()
    expect(info.name).toBe(packageJson.name)
    expect(info.version).toBe(packageJson.version)
  })

  it('should execute logAppStartup successfully', () => {
    const info = logAppStartup()
    expect(info.name).toBe('smartrest-hono')
    expect(info.version).toBe('1.0.0')
  })

  it('httpLogger middleware should log request payload and response result', async () => {
    const app = new Hono()
    app.use('*', httpLogger())

    app.post('/test', async (c) => {
      const body = await c.req.json()
      return c.json({ received: body, status: 'ok' }, 201)
    })

    app.get('/error', (c) => {
      return c.json({ error: 'Bad Request' }, 400)
    })

    // Test POST with payload and response
    const postRes = await app.request('/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ping: 'pong' }),
    })
    expect(postRes.status).toBe(201)
    const postJson = (await postRes.json()) as { status: string }
    expect(postJson.status).toBe('ok')

    // Test 400 Warning log path
    const errRes = await app.request('/error')
    expect(errRes.status).toBe(400)
  })
})
