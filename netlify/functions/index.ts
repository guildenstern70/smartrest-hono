/*
 * SmartREST - Hono Edition
 * Copyright (c) Alessio Saltarin, 2026
 * This software is licensed under ISC License
 * See LICENSE
 */

import { handle } from 'hono/netlify'
import app from '../../src/index'

export const handler = handle(app)
