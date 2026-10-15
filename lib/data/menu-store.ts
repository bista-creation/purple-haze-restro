import fs from 'fs'
import path from 'path'
import { DishItem } from '@/types'
import { DISHES_DATA, CATEGORIES_DATA } from '@/lib/data/restaurant-data'

const DATA_DIR = path.join(process.cwd(), '.data')
const DISHES_FILE = path.join(DATA_DIR, 'dishes.json')

let dishesCache: DishItem[] | null = null

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    } catch {
      // Ignore
    }
  }
}

function loadDishesFromDisk(): DishItem[] {
  if (dishesCache) return dishesCache

  ensureDataDir()
  try {
    if (fs.existsSync(DISHES_FILE)) {
      const content = fs.readFileSync(DISHES_FILE, 'utf-8')
      const parsed = JSON.parse(content)
      if (Array.isArray(parsed) && parsed.length > 0) {
        dishesCache = parsed
        return dishesCache!
      }
    }
  } catch (err) {
    console.error('Error reading dishes.json:', err)
  }

  // Fallback to DISHES_DATA
  dishesCache = [...DISHES_DATA]
  saveDishesToDisk(dishesCache)
  return dishesCache
}

function saveDishesToDisk(dishes: DishItem[]) {
  ensureDataDir()
  try {
    fs.writeFileSync(DISHES_FILE, JSON.stringify(dishes, null, 2), 'utf-8')
    dishesCache = dishes
  } catch (err) {
    console.error('Error writing dishes.json:', err)
  }
}

export function getAllDishes(): DishItem[] {
  return loadDishesFromDisk()
}

export function getDishById(id: string): DishItem | undefined {
  const all = loadDishesFromDisk()
  return all.find((d) => d.id === id)
}

export function addDish(newDishData: {
  name: string
  price: number
  categoryId: string
  description?: string
  image?: string
  isVeg: boolean
  spicyLevel?: number
  preparationTime?: number
  isPopular?: boolean
  isFeatured?: boolean
  tags?: string[]
}): DishItem {
  const all = loadDishesFromDisk()
  const cat = CATEGORIES_DATA.find((c) => c.id === newDishData.categoryId)

  const dish: DishItem = {
    id: `dish-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: newDishData.name.trim(),
    slug: newDishData.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, ''),
    description: newDishData.description?.trim() || '',
    price: Number(newDishData.price) || 0,
    categoryId: newDishData.categoryId,
    category: cat
      ? {
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          cuisine: cat.cuisine,
        }
      : undefined,
    image:
      newDishData.image?.trim() ||
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop',
    isVeg: Boolean(newDishData.isVeg),
    spicyLevel: Number(newDishData.spicyLevel ?? 1),
    isAvailable: true,
    isFeatured: Boolean(newDishData.isFeatured),
    isPopular: Boolean(newDishData.isPopular),
    preparationTime: Number(newDishData.preparationTime ?? 20),
    tags: newDishData.tags && newDishData.tags.length > 0 ? newDishData.tags : ['Chef Special'],
  }

  const updated = [dish, ...all]
  saveDishesToDisk(updated)
  return dish
}

export function updateDish(id: string, updates: Partial<DishItem>): DishItem | null {
  const all = loadDishesFromDisk()
  const index = all.findIndex((d) => d.id === id)
  if (index === -1) return null

  const current = all[index]
  let updatedCategory = current.category
  if (updates.categoryId && updates.categoryId !== current.categoryId) {
    const cat = CATEGORIES_DATA.find((c) => c.id === updates.categoryId)
    if (cat) {
      updatedCategory = {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        cuisine: cat.cuisine,
      }
    }
  }

  const updatedDish: DishItem = {
    ...current,
    ...updates,
    category: updatedCategory,
  }

  all[index] = updatedDish
  saveDishesToDisk(all)
  return updatedDish
}

export function deleteDish(id: string): boolean {
  const all = loadDishesFromDisk()
  const filtered = all.filter((d) => d.id !== id)
  if (filtered.length === all.length) return false
  saveDishesToDisk(filtered)
  return true
}

export function toggleDishAvailability(id: string): DishItem | null {
  const all = loadDishesFromDisk()
  const dish = all.find((d) => d.id === id)
  if (!dish) return null

  dish.isAvailable = !dish.isAvailable
  saveDishesToDisk(all)
  return dish
}

export function toggleDishFeatured(id: string): DishItem | null {
  const all = loadDishesFromDisk()
  const dish = all.find((d) => d.id === id)
  if (!dish) return null

  dish.isFeatured = !dish.isFeatured
  saveDishesToDisk(all)
  return dish
}
