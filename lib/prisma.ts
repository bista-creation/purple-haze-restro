import { PrismaClient } from '@prisma/client'

function getDatabaseUrl(): string | undefined {
  // 1. Prefer unpooled direct connection (most reliable with Prisma)
  let url =
    process.env.DATABASE_URL_UNPOOLED ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL

  if (!url) return undefined

  // Strip channel_binding (unsupported in Prisma)
  url = url
    .replace(/([?&])channel_binding=[^&]*(&|$)/, '$1')
    .replace(/[?&]$/, '')

  // Ensure connection timeout allows Neon serverless compute to wake from sleep
  if (!url.includes('connect_timeout')) {
    url += (url.includes('?') ? '&' : '?') + 'connect_timeout=30'
  }

  return url
}

const dbUrl = getDatabaseUrl()

if (dbUrl) {
  process.env.DATABASE_URL = dbUrl
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: dbUrl,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma
