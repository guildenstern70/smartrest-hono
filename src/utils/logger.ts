/*
 * SmartREST - Hono Edition
 * Copyright (c) Alessio Saltarin, 2026
 * This software is licensed under ISC License
 * See LICENSE
 */

import pino from 'pino'
import packageJson from '../../package.json'

export interface AppInfo {
  name: string
  version: string
}

export const getAppInfo = (): AppInfo => ({
  name: packageJson.name || 'smartrest-hono',
  version: packageJson.version || '0.0.0',
})

const isProduction = process.env.NODE_ENV === 'production'

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: !isProduction
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      }
    : undefined,
})

export const logAppStartup = (): AppInfo => {
  const info = getAppInfo()
  logger.info({ app: info.name, version: info.version }, `🚀 Starting ${info.name} v${info.version}`)
  return info
}
