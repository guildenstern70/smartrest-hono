/*
 * SmartREST - Hono Edition
 * Copyright (c) Alessio Saltarin, 2026
 * This software is licensed under ISC License
 * See LICENSE
 */

import pino, { Logger } from 'pino'
import packageJson from '../../package.json'

export interface AppInfo {
  name: string
  version: string
}

export const getAppInfo = (): AppInfo => ({
  name: packageJson.name || 'smartrest-hono',
  version: packageJson.version || '0.0.0',
})

const createLogger = (): Logger => {
  const isServerless = Boolean(
    process.env.NETLIFY ||
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.LAMBDA_TASK_ROOT ||
      process.env.NODE_ENV === 'production'
  )

  // In Netlify / serverless / production environments, avoid thread-spawned transports like pino-pretty
  if (isServerless) {
    return pino({ level: process.env.LOG_LEVEL || 'info' })
  }

  try {
    return pino({
      level: process.env.LOG_LEVEL || 'info',
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      },
    })
  } catch {
    return pino({ level: process.env.LOG_LEVEL || 'info' })
  }
}

export const logger = createLogger()

export const logAppStartup = (): AppInfo => {
  const info = getAppInfo()
  logger.info({ app: info.name, version: info.version }, `🚀 Starting ${info.name} v${info.version}`)
  return info
}
