/*
 * SmartREST - Hono Edition
 * Copyright (c) Alessio Saltarin, 2026
 * This software is licensed under ISC License
 * See LICENSE
 */

import { Hono } from 'hono'
import {
  homeController,
  personController,
  phoneController,
  swaggerController,
} from './controller'
import { DatabaseService } from './service'
import { logAppStartup, httpLogger } from './utils'

logAppStartup()

const databaseService = new DatabaseService()
let initPromise: Promise<unknown> | null = null

export const ensureDbInitialized = async () => {
  if (!initPromise) {
    initPromise = databaseService.seedIfEmpty()
  }
  return initPromise
}

// Start async initialization in background
ensureDbInitialized()

const app = new Hono()

// Middleware to ensure DB schema and initial seed are ready
app.use('*', async (_c, next) => {
  await ensureDbInitialized()
  await next()
})

app.use('*', httpLogger())

app.route('/', homeController())
app.route('/api/persons', personController(undefined, databaseService))
app.route('/api/phones', phoneController())
app.route('/', swaggerController())

export default app
