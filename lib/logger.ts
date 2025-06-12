import { Prisma } from '@prisma/client'
import { prisma } from './prisma'

type LogData = {
  level: 'info' | 'warn' | 'error'
  message: string
  userId: string
  action: string
  entityType: string
  entityId: string
  details?: string
  ipAddress?: string
  userAgent?: string
}

const logger = {
  async log(data: LogData) {
    try {
      // Create a log entry in the database
      await prisma.auditLog.create({
        data: {
          action: data.action,
          entityType: data.entityType,
          entityId: data.entityId,
          details: data.details || data.message,
          performedBy: { connect: { id: data.userId } },
          ipAddress: data.ipAddress || '',
          userAgent: data.userAgent || ''
        },
      })
      
      // Also log to console in development
      if (process.env.NODE_ENV === 'development') {
        const logMethod = console[data.level] || console.log
        logMethod(`[${data.level.toUpperCase()}] ${data.action}: ${data.message}`)
      }
    } catch (error) {
      console.error('Failed to write log:', error)
    }
  },

  async info(message: string, options: Omit<LogData, 'level' | 'message'>) {
    await this.log({
      level: 'info',
      message,
      ...options,
    })
  },

  async error(message: string, options: Omit<LogData, 'level' | 'message'>) {
    await this.log({
      level: 'error',
      message,
      ...options,
    })
  },

  async warn(message: string, options: Omit<LogData, 'level' | 'message'>) {
    await this.log({
      level: 'warn',
      message,
      ...options,
    })
  },
}

// Export the logger instance
export default logger

// Also export individual log levels for convenience
export { logger }
