import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import type { Role } from '@prisma/client'

import {
  findUserByEmail,
  verifyUserPassword,
  registerNewUser,
  createUserWithRole,
  updateUserProfile,
} from '@/lib/data/user-store'

const googleClientId =
  process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID
const googleClientSecret =
  process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET

function getResilientAdapter() {
  const baseAdapter = PrismaAdapter(prisma) as any

  return {
    ...baseAdapter,
    async createUser(user: any) {
      try {
        return await baseAdapter.createUser(user)
      } catch (e) {
        const registered = await registerNewUser({
          name: user.name || 'Google Guest',
          email: user.email,
          password: 'OAuth_Secure_Account_' + Math.random().toString(36),
          image: user.image,
        })
        return {
          id: registered.id,
          name: registered.name,
          email: registered.email,
          emailVerified: registered.emailVerified || new Date(),
          image: user.image || registered.image,
          role: registered.role,
        }
      }
    },
    async getUserByEmail(email: string) {
      try {
        return await baseAdapter.getUserByEmail(email)
      } catch (e) {
        const found = await findUserByEmail(email)
        if (!found) return null
        return {
          id: found.id,
          name: found.name,
          email: found.email,
          emailVerified: found.emailVerified || new Date(),
          image: found.image,
          role: found.role,
        }
      }
    },
    async getUserByAccount(account: any) {
      try {
        return await baseAdapter.getUserByAccount(account)
      } catch (e) {
        return null
      }
    },
    async linkAccount(account: any) {
      try {
        return await baseAdapter.linkAccount(account)
      } catch (e) {
        return account
      }
    },
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: getResilientAdapter() as any,
  session: { strategy: 'jwt' },
  trustHost: true,
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    ...(googleClientId && googleClientSecret
      ? [
          GoogleProvider({
            clientId: googleClientId,
            clientSecret: googleClientSecret,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required.')
        }

        const email = (credentials.email as string).trim().toLowerCase()
        const user = await findUserByEmail(email)

        if (!user) {
          throw new Error('No account found with this email. Please register first.')
        }

        if (user.isBlocked) {
          throw new Error('Your account has been blocked. Please contact support.')
        }

        const isValidPassword = await verifyUserPassword(
          credentials.password as string,
          user.passwordHash
        )

        if (!isValidPassword) {
          throw new Error('Incorrect password. Please try again.')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role: Role }).role
        token.name = user.name
        token.email = user.email
        token.image = user.image || (user as any).picture

        // If user exists in database / store, load their specific stored image & role
        if (user.email) {
          try {
            const dbUser = await findUserByEmail(user.email)
            if (dbUser) {
              token.id = dbUser.id
              token.role = dbUser.role
              if (dbUser.image) {
                token.image = dbUser.image
              }
            } else {
              token.role = token.role || ('CUSTOMER' as Role)
            }
          } catch {
            token.role = token.role || ('CUSTOMER' as Role)
          }
        }
      }

      // Handle session updates
      if (trigger === 'update' && session) {
        if (session.name) token.name = session.name
        if (session.email) token.email = session.email
        if (session.image !== undefined) token.image = session.image
      }

      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = (token.role as Role) || 'CUSTOMER'
        if (token.image) {
          session.user.image = token.image as string
        }
        if (token.name) {
          session.user.name = token.name as string
        }
        if (token.email) {
          session.user.email = token.email as string
        }
      }
      return session
    },
    async signIn({ user, account }) {
      if (user.email) {
        // Automatically sync Google account and its profile picture to local database/store
        if (account?.provider === 'google') {
          try {
            const existing = await findUserByEmail(user.email)
            if (!existing) {
              await createUserWithRole({
                name: user.name || 'Google User',
                email: user.email,
                role: user.email.toLowerCase() === 'admin@purplehaze.com' ? 'ADMIN' : 'CUSTOMER',
                image: user.image || undefined,
              })
            } else if (!existing.image && user.image) {
              await updateUserProfile(user.email, { image: user.image })
            }
          } catch (syncErr) {
            console.error('Google user sync notice:', syncErr)
          }
        }

        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email },
            select: { isBlocked: true },
          })
          if (dbUser?.isBlocked) return false
        } catch {
          // Ignore
        }
      }

      // Allow OAuth
      if (account?.provider !== 'credentials') return true

      // For credentials, verify email and check block status
      try {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
          select: { emailVerified: true, isBlocked: true },
        })

        if (dbUser?.isBlocked) return false
      } catch {
        // Ignore
      }

      return true
    },
  },
  events: {
    async createUser({ user }) {
      // Set default role on first Google sign-in — ignore if DB is offline
      if (user.email) {
        try {
          await prisma.user.update({
            where: { email: user.email },
            data: { role: 'CUSTOMER', emailVerified: new Date() },
          })
        } catch {
          // DB offline or user already set — safe to ignore
        }
      }
    },
  },
  secret: process.env.AUTH_SECRET,
})
