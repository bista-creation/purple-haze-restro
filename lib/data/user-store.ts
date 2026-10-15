import bcrypt from 'bcryptjs'
import fs from 'fs'
import path from 'path'
import { prisma } from '@/lib/prisma'
import type { Role } from '@prisma/client'

export interface AppUser {
  id: string
  name: string
  email: string
  passwordHash?: string
  phone?: string
  role: Role
  image?: string
  isBlocked?: boolean
  emailVerified?: Date | null
  createdAt?: Date
  addresses?: {
    id: string
    label: string
    street: string
    area: string
    city: string
    isDefault: boolean
  }[]
}

// Initial pre-seeded accounts
const SEED_USERS: AppUser[] = [
  {
    id: 'usr-admin-1',
    name: 'Purple Haze Admin',
    email: 'admin@purplehaze.com',
    passwordHash: bcrypt.hashSync('Admin@123456', 10),
    phone: '+977 9852022202',
    role: 'ADMIN' as Role,
    isBlocked: false,
    emailVerified: new Date(),
    createdAt: new Date(),
  },
  {
    id: 'usr-staff-1',
    name: 'Kitchen Staff',
    email: 'staff@purplehaze.com',
    passwordHash: bcrypt.hashSync('Staff@123456', 10),
    phone: '+977 9841537347',
    role: 'STAFF' as Role,
    isBlocked: false,
    emailVerified: new Date(),
    createdAt: new Date(),
  },
  {
    id: 'usr-cust-1',
    name: 'Ramesh Shrestha',
    email: 'customer@purplehaze.com',
    passwordHash: bcrypt.hashSync('Customer@123456', 10),
    phone: '+977 9812345678',
    role: 'CUSTOMER' as Role,
    isBlocked: false,
    emailVerified: new Date(),
    createdAt: new Date(),
  },
]

// In-memory + file-backed user registry for zero-configuration resilience
const storeFilePath = path.join(process.cwd(), '.data', 'users.json')

function loadStoredUsers(): Map<string, AppUser> {
  const map = new Map<string, AppUser>()
  for (const u of SEED_USERS) {
    map.set(u.email.toLowerCase(), u)
  }

  try {
    if (fs.existsSync(storeFilePath)) {
      const data = fs.readFileSync(storeFilePath, 'utf-8')
      const parsed: AppUser[] = JSON.parse(data)
      for (const u of parsed) {
        map.set(u.email.toLowerCase(), u)
      }
    }
  } catch (err) {
    // Ignore file load issues
  }

  return map
}

function persistStoredUsers(usersMap: Map<string, AppUser>) {
  try {
    const dir = path.dirname(storeFilePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    const arr = Array.from(usersMap.values())
    fs.writeFileSync(storeFilePath, JSON.stringify(arr, null, 2), 'utf-8')
  } catch (err) {
    // Ignore file write issues
  }
}

// Global cache
const memoryUsers = loadStoredUsers()

/**
 * Finds user by email from Prisma DB with fallback to persistent store.
 */
export async function findUserByEmail(email: string): Promise<AppUser | null> {
  const cleanEmail = email.trim().toLowerCase()

  // 1. Try Prisma first if DB is accessible
  try {
    const dbUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    })
    if (dbUser) {
      return {
        id: dbUser.id,
        name: dbUser.name || 'Valued Guest',
        email: dbUser.email,
        passwordHash: dbUser.passwordHash || undefined,
        phone: dbUser.phone || undefined,
        role: dbUser.role as Role,
        image: dbUser.image || undefined,
        isBlocked: dbUser.isBlocked,
        emailVerified: dbUser.emailVerified,
        createdAt: dbUser.createdAt,
      }
    }
  } catch (dbErr) {
    // DB offline/unreachable in local dev, fallback gracefully to store
  }

  // 2. Fallback to resilient store
  return memoryUsers.get(cleanEmail) || null
}

/**
 * Retrieves all registered users and staff (excluding sensitive password hashes).
 */
export async function getAllUsers(): Promise<Omit<AppUser, 'passwordHash'>[]> {
  try {
    const dbUsers = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        image: true,
        isBlocked: true,
        createdAt: true,
      },
    })
    if (dbUsers && dbUsers.length > 0) {
      return dbUsers.map((u) => ({
        id: u.id,
        name: u.name || 'Valued Guest',
        email: u.email,
        phone: u.phone || undefined,
        role: u.role as Role,
        image: u.image || undefined,
        isBlocked: u.isBlocked,
        createdAt: u.createdAt,
      }))
    }
  } catch (err) {
    // Database offline; proceed with file store
  }

  const all = Array.from(memoryUsers.values())
  return all.map(({ passwordHash, ...safe }) => safe)
}

/**
 * Registers a new user with standard CUSTOMER role.
 */
export async function registerNewUser(data: {
  name: string
  email: string
  password?: string
  phone?: string
  image?: string
}): Promise<AppUser> {
  const cleanEmail = data.email.trim().toLowerCase()
  const role: Role = cleanEmail === 'admin@purplehaze.com' ? 'ADMIN' : 'CUSTOMER'
  return createUserWithRole({ ...data, role })
}

/**
 * Creates a user with a specific role (ADMIN, STAFF, or CUSTOMER).
 */
export async function createUserWithRole(data: {
  name: string
  email: string
  password?: string
  phone?: string
  role: Role
  image?: string
}): Promise<AppUser> {
  const cleanEmail = data.email.trim().toLowerCase()
  const passwordHash = data.password ? bcrypt.hashSync(data.password, 10) : undefined

  const newUser: AppUser = {
    id: `usr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: data.name.trim(),
    email: cleanEmail,
    passwordHash,
    phone: data.phone?.trim() || '',
    role: data.role,
    image: data.image?.trim() || undefined,
    isBlocked: false,
    emailVerified: new Date(),
    createdAt: new Date(),
  }

  // 1. Try Prisma
  try {
    const created = await prisma.user.create({
      data: {
        name: newUser.name,
        email: newUser.email,
        passwordHash: newUser.passwordHash,
        phone: newUser.phone,
        role: newUser.role,
        image: newUser.image,
        emailVerified: newUser.emailVerified,
      },
    })
    newUser.id = created.id
  } catch (dbErr) {
    console.warn('Prisma DB write bypassed (local store active):', (dbErr as Error).message)
  }

  // 2. Persist in memory & file
  memoryUsers.set(cleanEmail, newUser)
  persistStoredUsers(memoryUsers)

  return newUser
}

/**
 * Updates a user's role (promote/demote between ADMIN, STAFF, and CUSTOMER).
 */
export async function updateUserRole(userId: string, newRole: Role): Promise<AppUser | null> {
  // 1. Try Prisma
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    })
  } catch {
    // Ignore DB offline
  }

  // 2. Update memory & file store
  for (const user of Array.from(memoryUsers.values())) {
    if (user.id === userId || user.email.toLowerCase() === userId.toLowerCase()) {
      user.role = newRole
      memoryUsers.set(user.email.toLowerCase(), user)
      persistStoredUsers(memoryUsers)
      return user
    }
  }

  return null
}

/**
 * Toggles a user's blocked status.
 */
export async function toggleUserBlock(userId: string): Promise<AppUser | null> {
  let targetUser: AppUser | null = null

  // 1. Update in local store
  for (const user of Array.from(memoryUsers.values())) {
    if (user.id === userId || user.email.toLowerCase() === userId.toLowerCase()) {
      user.isBlocked = !user.isBlocked
      targetUser = user
      memoryUsers.set(user.email.toLowerCase(), user)
      persistStoredUsers(memoryUsers)
      break
    }
  }

  // 2. Try Prisma
  if (targetUser) {
    try {
      await prisma.user.update({
        where: { id: targetUser.id },
        data: { isBlocked: targetUser.isBlocked },
      })
    } catch {
      // Ignore
    }
  }

  return targetUser
}

/**
 * Deletes a user (protected: cannot delete primary admin).
 */
export async function deleteUser(userId: string): Promise<boolean> {
  let userToDelete: AppUser | null = null

  for (const user of Array.from(memoryUsers.values())) {
    if (user.id === userId || user.email.toLowerCase() === userId.toLowerCase()) {
      if (user.email === 'admin@purplehaze.com') {
        throw new Error('Primary administrator account cannot be deleted.')
      }
      userToDelete = user
      break
    }
  }

  if (!userToDelete) return false

  // 1. Delete from Prisma
  try {
    await prisma.user.delete({
      where: { id: userToDelete.id },
    })
  } catch {
    // Ignore
  }

  // 2. Delete from memory & file
  memoryUsers.delete(userToDelete.email.toLowerCase())
  persistStoredUsers(memoryUsers)
  return true
}

/**
 * Validates a user's password.
 */
export async function verifyUserPassword(
  providedPassword: string,
  storedHash?: string
): Promise<boolean> {
  if (!storedHash) return false
  return bcrypt.compare(providedPassword, storedHash)
}

/**
 * Updates a user's profile information (name, phone, addresses).
 */
export async function updateUserProfile(
  emailOrId: string,
  updates: { name?: string; phone?: string; addresses?: any[]; image?: string }
): Promise<AppUser | null> {
  const clean = emailOrId.trim().toLowerCase()

  let targetUser: AppUser | null = null
  for (const user of Array.from(memoryUsers.values())) {
    if (user.id === emailOrId || user.email.toLowerCase() === clean) {
      if (updates.name !== undefined) user.name = updates.name.trim()
      if (updates.phone !== undefined) user.phone = updates.phone.trim()
      if (updates.image !== undefined) user.image = updates.image.trim()
      if (updates.addresses !== undefined) user.addresses = updates.addresses
      targetUser = user
      memoryUsers.set(user.email.toLowerCase(), user)
      persistStoredUsers(memoryUsers)
      break
    }
  }

  // Also try Prisma if accessible
  if (targetUser) {
    try {
      await prisma.user.update({
        where: { id: targetUser.id },
        data: {
          name: targetUser.name,
          phone: targetUser.phone,
          image: targetUser.image,
        },
      })
    } catch {
      // Local store has persisted
    }
  }

  return targetUser
}

/**
 * Changes a user's password securely with current password validation.
 */
export async function changeUserPassword(
  emailOrId: string,
  currentPass: string,
  newPass: string
): Promise<{ success: boolean; error?: string }> {
  const clean = emailOrId.trim().toLowerCase()

  let targetUser: AppUser | null = null
  for (const user of Array.from(memoryUsers.values())) {
    if (user.id === emailOrId || user.email.toLowerCase() === clean) {
      targetUser = user
      break
    }
  }

  if (!targetUser) {
    return { success: false, error: 'User account not found.' }
  }

  if (targetUser.passwordHash) {
    const isValid = await verifyUserPassword(currentPass, targetUser.passwordHash)
    if (!isValid) {
      return { success: false, error: 'Current password does not match.' }
    }
  }

  if (!newPass || newPass.length < 6) {
    return { success: false, error: 'New password must be at least 6 characters.' }
  }

  const newHash = bcrypt.hashSync(newPass, 10)
  targetUser.passwordHash = newHash
  memoryUsers.set(targetUser.email.toLowerCase(), targetUser)
  persistStoredUsers(memoryUsers)

  // Try Prisma
  try {
    await prisma.user.update({
      where: { id: targetUser.id },
      data: { passwordHash: newHash },
    })
  } catch {
    // Local store active
  }

  return { success: true }
}

