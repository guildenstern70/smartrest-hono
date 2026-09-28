/*
 * SmartREST - Hono Edition
 * Copyright (c) Alessio Saltarin, 2026
 * This software is licensed under ISC License
 * See LICENSE
 */

import { handle as handleAws } from 'hono/aws-lambda'
import app from '../../src/index'

const awsHandler = handleAws(app)

export const handler = async (reqOrEvent: any, context: any) => {
  // If invoked with a standard Web Request (Netlify Functions v2)
  if (reqOrEvent && typeof reqOrEvent.url === 'string') {
    return app.fetch(reqOrEvent, context)
  }
  // If invoked with an AWS Lambda event (Netlify Functions v1)
  return awsHandler(reqOrEvent, context)
}

export default handler
