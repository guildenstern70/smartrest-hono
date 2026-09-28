/*
 * SmartREST - Hono Edition
 * Copyright (c) Alessio Saltarin, 2026
 * This software is licensed under ISC License
 * See LICENSE
 */

import { MiddlewareHandler } from 'hono'
import { logger } from './logger'

export const httpLogger = (): MiddlewareHandler => {
  return async (c, next) => {
    const start = performance.now()
    const method = c.req.method
    const path = c.req.path

    let payload: unknown = undefined
    if (method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS') {
      try {
        const clonedReq = c.req.raw.clone()
        const contentType = clonedReq.headers.get('content-type') || ''
        if (contentType.includes('application/json')) {
          payload = await clonedReq.json()
        } else {
          const text = await clonedReq.text()
          payload = text ? text : undefined
        }
      } catch {
        payload = undefined
      }
    } else {
      const query = c.req.query()
      if (Object.keys(query).length > 0) {
        payload = query
      }
    }

    try {
      await next()
    } catch (err: unknown) {
      const durationMs = Number((performance.now() - start).toFixed(2))
      const errorMessage = err instanceof Error ? err.message : String(err)
      logger.error(
        {
          method,
          path,
          payload,
          durationMs,
          error: errorMessage,
        },
        `❌ [${method}] ${path} - Exception: ${errorMessage} (${durationMs}ms)`
      )
      throw err
    }

    const durationMs = Number((performance.now() - start).toFixed(2))
    const status = c.res.status

    let result: unknown = undefined
    const resContentType = c.res.headers.get('content-type') || ''
    if (resContentType.includes('application/json')) {
      try {
        const clonedRes = c.res.clone()
        result = await clonedRes.json()
      } catch {
        result = undefined
      }
    }

    const logData = {
      method,
      path,
      status,
      durationMs,
      payload,
      result,
    }

    const logMessage = `[${method}] ${path} -> ${status} (${durationMs}ms)`

    if (status >= 500) {
      logger.error(logData, `❌ ${logMessage}`)
    } else if (status >= 400) {
      logger.warn(logData, `⚠️ ${logMessage}`)
    } else {
      logger.info(logData, `✅ ${logMessage}`)
    }
  }
}
