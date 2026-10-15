import fs from 'fs'
import path from 'path'
import { RESTAURANT_INFO } from '@/lib/data/restaurant-data'
import { prisma } from '@/lib/prisma'

export interface RestaurantSettings {
  name: string
  tagline: string
  phone: string
  address: string
  email: string
  taxRate: number
  minOrderDelivery: number
  codEnabled: boolean
  esewaEnabled: boolean
  khaltiEnabled: boolean
  zones: {
    name: string
    fee: number
    estTime: string
  }[]
  openingHours?: {
    days: string
    hours: string
  }[]
  updatedAt?: string
}

const DATA_DIR = path.join(process.cwd(), '.data')
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json')

const DEFAULT_SETTINGS: RestaurantSettings = {
  name: RESTAURANT_INFO.name,
  tagline: RESTAURANT_INFO.tagline,
  phone: RESTAURANT_INFO.primaryPhone,
  address: RESTAURANT_INFO.address,
  email: RESTAURANT_INFO.email,
  taxRate: 0,
  minOrderDelivery: 300,
  codEnabled: true,
  esewaEnabled: true,
  khaltiEnabled: true,
  zones: [...RESTAURANT_INFO.deliveryZones],
  openingHours: [...RESTAURANT_INFO.openingHours],
  updatedAt: new Date().toISOString(),
}

let settingsCache: RestaurantSettings | null = null

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    } catch {
      // Ignore
    }
  }
}

export async function getRestaurantSettings(): Promise<RestaurantSettings> {
  if (settingsCache) return settingsCache

  // 1. Try reading from Prisma DB
  try {
    const dbRecord = await prisma.setting.findUnique({
      where: { key: 'restaurant_config' },
    })
    if (dbRecord && dbRecord.value) {
      settingsCache = JSON.parse(dbRecord.value)
      return settingsCache!
    }
  } catch (err) {
    // Database unreachable/offline in local dev, proceed to file store
  }

  // 2. Read from local file
  ensureDataDir()
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const content = fs.readFileSync(SETTINGS_FILE, 'utf-8')
      const parsed = JSON.parse(content)
      if (parsed && typeof parsed === 'object') {
        settingsCache = { ...DEFAULT_SETTINGS, ...parsed }
        return settingsCache!
      }
    }
  } catch (err) {
    console.error('Error reading settings.json:', err)
  }

  // 3. Fallback to default
  settingsCache = { ...DEFAULT_SETTINGS }
  saveSettingsToFile(settingsCache)
  return settingsCache
}

function saveSettingsToFile(settings: RestaurantSettings) {
  ensureDataDir()
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf-8')
    settingsCache = settings
  } catch (err) {
    console.error('Error writing settings.json:', err)
  }
}

export async function updateRestaurantSettings(
  newSettings: Partial<RestaurantSettings>
): Promise<RestaurantSettings> {
  const current = await getRestaurantSettings()
  const updated: RestaurantSettings = {
    ...current,
    ...newSettings,
    updatedAt: new Date().toISOString(),
  }

  // 1. Try saving to Prisma DB
  try {
    await prisma.setting.upsert({
      where: { key: 'restaurant_config' },
      update: { value: JSON.stringify(updated) },
      create: { key: 'restaurant_config', value: JSON.stringify(updated) },
    })
  } catch (err) {
    // Database write bypassed; local store guarantees persistence
  }

  // 2. Save to file
  saveSettingsToFile(updated)
  return updated
}
