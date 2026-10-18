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

  // Strip channel_binding (unsupported in Prisma) and normalize pooler to direct connection if needed
  url = url
    .replace('-pooler.', '.')
    .replace(/([?&])channel_binding=[^&]*(&|$)/, '$1')
    .replace(/[?&]$/, '')

  return url
}

const dbUrl = getDatabaseUrl()

if (dbUrl && !process.env.DATABASE_URL) {
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
