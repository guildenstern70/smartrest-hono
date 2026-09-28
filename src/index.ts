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
await databaseService.seedIfEmpty()

const app = new Hono()

app.use('*', httpLogger())

app.route('/', homeController())
app.route('/api/persons', personController(undefined, databaseService))
app.route('/api/phones', phoneController())
app.route('/', swaggerController())

export default app
