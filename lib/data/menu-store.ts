import fs from 'fs'
import path from 'path'
import { DishItem } from '@/types'
import { DISHES_DATA, CATEGORIES_DATA } from '@/lib/data/restaurant-data'
import prisma from '@/lib/prisma'

const DATA_DIR = path.join(process.cwd(), '.data')
const DISHES_FILE = path.join(DATA_DIR, 'dishes.json')

let dishesCache: DishItem[] | null = null
let dbInitDone = false

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    } catch {
      // Ignore read-only filesystem in serverless environments
    }
  }
}

function saveBase64Image(dataUrl: string, dishId: string): string {
  if (!dataUrl || !dataUrl.startsWith('data:image/')) return dataUrl
  try {
    const matches = dataUrl.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/)
    if (matches) {
      const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1]
      const buffer = Buffer.from(matches[2], 'base64')
      const dishesImgDir = path.join(process.cwd(), 'public', 'images', 'dishes')
      if (!fs.existsSync(dishesImgDir)) {
        fs.mkdirSync(dishesImgDir, { recursive: true })
      }
      const fileName = `dish-${dishId.replace(/[^a-zA-Z0-9-]/g, '')}-${Date.now()}.${ext}`
      const filePath = path.join(dishesImgDir, fileName)
      fs.writeFileSync(filePath, buffer)
      return `/images/dishes/${fileName}`
    }
  } catch {
    // In serverless / read-only environment, keep the base64 string directly
  }
  return dataUrl
}

function loadDishesFromDisk(): DishItem[] {
  if (dishesCache && dishesCache.length > 0) return dishesCache

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
  } catch {
    // Ignore read errors
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
  } catch {
    // In serverless environments, file write fails silently, memory cache remains
    dishesCache = dishes
  }
}

function updateDishInDisk(id: string, updates: Partial<DishItem>): DishItem | null {
  const all = loadDishesFromDisk()
  const index = all.findIndex((d) => d.id === id)
  if (index === -1) return null

  const current = all[index]
  let updatedCategory = current.category
  if (updates.categoryId && updates.categoryId !== current.categoryId) {
    const cat = CATEGORIES_DATA.find(
      (c) => c.id === updates.categoryId || c.slug === updates.categoryId
    )
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

export async function ensureDbMenuInitialized() {
  if (dbInitDone) return
  try {
    const catCount = await prisma.category.count()
    if (catCount === 0) {
      for (const cat of CATEGORIES_DATA) {
        await prisma.category.upsert({
          where: { id: cat.id },
          update: {
            name: cat.name,
            slug: cat.slug,
            cuisine: cat.cuisine,
            image: cat.image,
          },
          create: {
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            description: cat.description,
            image: cat.image,
            cuisine: cat.cuisine,
            sortOrder: cat.sortOrder,
            isActive: cat.isActive ?? true,
          },
        })
      }
    }

    const dishCount = await prisma.dish.count()
    if (dishCount === 0) {
      for (const dish of DISHES_DATA) {
        await prisma.dish.upsert({
          where: { id: dish.id },
          update: {
            name: dish.name,
            price: dish.price,
            image: dish.image,
            isAvailable: dish.isAvailable,
            isFeatured: dish.isFeatured,
            isPopular: dish.isPopular,
          },
          create: {
            id: dish.id,
            name: dish.name,
            slug: dish.slug || dish.id,
            description: dish.description,
            price: dish.price,
            image: dish.image,
            categoryId: dish.categoryId,
            isVeg: dish.isVeg ?? false,
            spicyLevel: dish.spicyLevel ?? 1,
            isAvailable: dish.isAvailable ?? true,
            isFeatured: dish.isFeatured ?? false,
            isPopular: dish.isPopular ?? false,
            preparationTime: dish.preparationTime ?? 20,
            tags: dish.tags || [],
          },
        })
      }
    }
    dbInitDone = true
  } catch (err) {
    // Database connection may not be reachable in all environments
    console.warn('[MenuStore] ensureDbMenuInitialized deferred:', err)
  }
}

async function ensureCategoryExists(categoryId: string) {
  try {
    const existing = await prisma.category.findUnique({
      where: { id: categoryId },
    })
    if (!existing) {
      const fromData = CATEGORIES_DATA.find((c) => c.id === categoryId || c.slug === categoryId)
      await prisma.category.create({
        data: {
          id: categoryId,
          name: fromData ? fromData.name : 'Chef Specialties',
          slug: fromData ? fromData.slug : categoryId.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          cuisine: fromData ? fromData.cuisine : 'fusion',
        },
      })
    }
  } catch {
    // Ignore
  }
}

export async function getAllDishes(): Promise<DishItem[]> {
  try {
    await ensureDbMenuInitialized()
    const dbDishes = await prisma.dish.findMany({
      include: { category: true, variants: true, addOns: true },
      orderBy: { createdAt: 'desc' },
    })

    if (dbDishes && dbDishes.length > 0) {
      const mapped: DishItem[] = dbDishes.map((d) => ({
        id: d.id,
        name: d.name,
        slug: d.slug,
        description: d.description || '',
        price: d.price,
        image: d.image || '/images/food-presentation.jpg',
        categoryId: d.categoryId,
        category: d.category
          ? {
              id: d.category.id,
              name: d.category.name,
              slug: d.category.slug,
              cuisine: d.category.cuisine || 'nepali',
            }
          : undefined,
        isVeg: d.isVeg,
        spicyLevel: d.spicyLevel,
        isAvailable: d.isAvailable,
        isFeatured: d.isFeatured,
        isPopular: d.isPopular,
        preparationTime: d.preparationTime || 20,
        tags: d.tags || [],
        variants: d.variants?.map((v) => ({
          id: v.id,
          dishId: v.dishId,
          name: v.name,
          price: v.price,
          isDefault: v.isDefault,
        })),
        addOns: d.addOns?.map((a) => ({
          id: a.id,
          dishId: a.dishId,
          name: a.name,
          price: a.price,
          isAvailable: a.isAvailable,
        })),
      }))

      dishesCache = mapped
      return mapped
    }
  } catch (err) {
    console.warn('[MenuStore] Prisma fetch failed, using fallback:', err)
  }

  return loadDishesFromDisk()
}

export async function getDishById(id: string): Promise<DishItem | undefined> {
  try {
    const d = await prisma.dish.findUnique({
      where: { id },
      include: { category: true, variants: true, addOns: true },
    })
    if (d) {
      return {
        id: d.id,
        name: d.name,
        slug: d.slug,
        description: d.description || '',
        price: d.price,
        image: d.image || '/images/food-presentation.jpg',
        categoryId: d.categoryId,
        category: d.category
          ? {
              id: d.category.id,
              name: d.category.name,
              slug: d.category.slug,
              cuisine: d.category.cuisine || 'nepali',
            }
          : undefined,
        isVeg: d.isVeg,
        spicyLevel: d.spicyLevel,
        isAvailable: d.isAvailable,
        isFeatured: d.isFeatured,
        isPopular: d.isPopular,
        preparationTime: d.preparationTime || 20,
        tags: d.tags || [],
      }
    }
  } catch {
    // Ignore
  }

  const all = loadDishesFromDisk()
  return all.find((d) => d.id === id)
}

export async function addDish(newDishData: {
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
}): Promise<DishItem> {
  const cat = CATEGORIES_DATA.find(
    (c) => c.id === newDishData.categoryId || c.slug === newDishData.categoryId
  )

  const dishId = `dish-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
  const rawImage = newDishData.image?.trim() || '/images/food-presentation.jpg'
  const finalImage = rawImage.startsWith('data:image/')
    ? saveBase64Image(rawImage, dishId)
    : rawImage

  const targetCategoryId = cat ? cat.id : newDishData.categoryId

  const dish: DishItem = {
    id: dishId,
    name: newDishData.name.trim(),
    slug:
      (
        newDishData.name
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '') || dishId
      ) +
      '-' +
      Math.random().toString(36).substring(2, 6),
    description: newDishData.description?.trim() || '',
    price: Number(newDishData.price) || 0,
    categoryId: targetCategoryId,
    category: cat
      ? {
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          cuisine: cat.cuisine,
        }
      : undefined,
    image: finalImage,
    isVeg: Boolean(newDishData.isVeg),
    spicyLevel: Number(newDishData.spicyLevel ?? 1),
    isAvailable: true,
    isFeatured: Boolean(newDishData.isFeatured),
    isPopular: Boolean(newDishData.isPopular),
    preparationTime: Number(newDishData.preparationTime ?? 20),
    tags:
      newDishData.tags && newDishData.tags.length > 0
        ? newDishData.tags
        : ['Chef Special'],
  }

  // 1. Persist to Prisma Database
  try {
    await ensureCategoryExists(targetCategoryId)
    const dbDish = await prisma.dish.create({
      data: {
        id: dish.id,
        name: dish.name,
        slug: dish.slug,
        description: dish.description,
        price: dish.price,
        image: dish.image,
        categoryId: targetCategoryId,
        isVeg: dish.isVeg,
        spicyLevel: dish.spicyLevel,
        isAvailable: dish.isAvailable,
        isFeatured: dish.isFeatured,
        isPopular: dish.isPopular,
        preparationTime: dish.preparationTime,
        tags: dish.tags,
      },
      include: { category: true },
    })

    if (dbDish.category) {
      dish.category = {
        id: dbDish.category.id,
        name: dbDish.category.name,
        slug: dbDish.category.slug,
        cuisine: dbDish.category.cuisine || 'nepali',
      }
    }
  } catch (err) {
    console.warn('[MenuStore] Prisma create dish fallback:', err)
  }

  // 2. Also keep local disk/memory backup
  const all = loadDishesFromDisk()
  const updated = [dish, ...all.filter((d) => d.id !== dish.id)]
  saveDishesToDisk(updated)

  return dish
}

export async function updateDish(
  id: string,
  updates: Partial<DishItem>
): Promise<DishItem | null> {
  let finalImage = updates.image
  if (finalImage && finalImage.startsWith('data:image/')) {
    finalImage = saveBase64Image(finalImage, id)
    updates.image = finalImage
  }

  // 1. Update in Prisma
  try {
    if (updates.categoryId) {
      await ensureCategoryExists(updates.categoryId)
    }

    const dbUpdated = await prisma.dish.update({
      where: { id },
      data: {
        ...(updates.name ? { name: updates.name.trim() } : {}),
        ...(updates.price !== undefined ? { price: Number(updates.price) } : {}),
        ...(updates.categoryId ? { categoryId: updates.categoryId } : {}),
        ...(updates.description !== undefined ? { description: updates.description } : {}),
        ...(updates.image ? { image: updates.image } : {}),
        ...(updates.isVeg !== undefined ? { isVeg: Boolean(updates.isVeg) } : {}),
        ...(updates.spicyLevel !== undefined ? { spicyLevel: Number(updates.spicyLevel) } : {}),
        ...(updates.isAvailable !== undefined ? { isAvailable: Boolean(updates.isAvailable) } : {}),
        ...(updates.isFeatured !== undefined ? { isFeatured: Boolean(updates.isFeatured) } : {}),
        ...(updates.isPopular !== undefined ? { isPopular: Boolean(updates.isPopular) } : {}),
        ...(updates.preparationTime !== undefined
          ? { preparationTime: Number(updates.preparationTime) }
          : {}),
        ...(updates.tags ? { tags: updates.tags } : {}),
      },
      include: { category: true },
    })

    if (dbUpdated) {
      updateDishInDisk(id, updates)
      return {
        id: dbUpdated.id,
        name: dbUpdated.name,
        slug: dbUpdated.slug,
        description: dbUpdated.description || '',
        price: dbUpdated.price,
        image: dbUpdated.image,
        categoryId: dbUpdated.categoryId,
        category: dbUpdated.category
          ? {
              id: dbUpdated.category.id,
              name: dbUpdated.category.name,
              slug: dbUpdated.category.slug,
              cuisine: dbUpdated.category.cuisine || 'nepali',
            }
          : undefined,
        isVeg: dbUpdated.isVeg,
        spicyLevel: dbUpdated.spicyLevel,
        isAvailable: dbUpdated.isAvailable,
        isFeatured: dbUpdated.isFeatured,
        isPopular: dbUpdated.isPopular,
        preparationTime: dbUpdated.preparationTime || 20,
        tags: dbUpdated.tags || [],
      }
    }
  } catch (err) {
    console.warn('[MenuStore] Prisma updateDish fallback:', err)
  }

  return updateDishInDisk(id, updates)
}

export async function toggleDishAvailability(id: string): Promise<DishItem | null> {
  try {
    const existing = await prisma.dish.findUnique({ where: { id } })
    if (existing) {
      const updated = await prisma.dish.update({
        where: { id },
        data: { isAvailable: !existing.isAvailable },
        include: { category: true },
      })
      updateDishInDisk(id, { isAvailable: updated.isAvailable })
      return {
        id: updated.id,
        name: updated.name,
        slug: updated.slug,
        description: updated.description || '',
        price: updated.price,
        image: updated.image,
        categoryId: updated.categoryId,
        category: updated.category
          ? {
              id: updated.category.id,
              name: updated.category.name,
              slug: updated.category.slug,
              cuisine: updated.category.cuisine || 'nepali',
            }
          : undefined,
        isVeg: updated.isVeg,
        spicyLevel: updated.spicyLevel,
        isAvailable: updated.isAvailable,
        isFeatured: updated.isFeatured,
        isPopular: updated.isPopular,
        preparationTime: updated.preparationTime || 20,
        tags: updated.tags || [],
      }
    }
  } catch (err) {
    console.warn('[MenuStore] Prisma toggleDishAvailability fallback:', err)
  }

  const all = loadDishesFromDisk()
  const dish = all.find((d) => d.id === id)
  if (!dish) return null
  dish.isAvailable = !dish.isAvailable
  saveDishesToDisk(all)
  return dish
}

export async function toggleDishFeatured(id: string): Promise<DishItem | null> {
  try {
    const existing = await prisma.dish.findUnique({ where: { id } })
    if (existing) {
      const updated = await prisma.dish.update({
        where: { id },
        data: { isFeatured: !existing.isFeatured },
        include: { category: true },
      })
      updateDishInDisk(id, { isFeatured: updated.isFeatured })
      return {
        id: updated.id,
        name: updated.name,
        slug: updated.slug,
        description: updated.description || '',
        price: updated.price,
        image: updated.image,
        categoryId: updated.categoryId,
        category: updated.category
          ? {
              id: updated.category.id,
              name: updated.category.name,
              slug: updated.category.slug,
              cuisine: updated.category.cuisine || 'nepali',
            }
          : undefined,
        isVeg: updated.isVeg,
        spicyLevel: updated.spicyLevel,
        isAvailable: updated.isAvailable,
        isFeatured: updated.isFeatured,
        isPopular: updated.isPopular,
        preparationTime: updated.preparationTime || 20,
        tags: updated.tags || [],
      }
    }
  } catch (err) {
    console.warn('[MenuStore] Prisma toggleDishFeatured fallback:', err)
  }

  const all = loadDishesFromDisk()
  const dish = all.find((d) => d.id === id)
  if (!dish) return null
  dish.isFeatured = !dish.isFeatured
  saveDishesToDisk(all)
  return dish
}

export async function deleteDish(id: string): Promise<boolean> {
  try {
    await prisma.dish.delete({ where: { id } })
  } catch (err) {
    // If foreign key constraint prevents deletion (e.g. historical orders), soft-delete
    try {
      await prisma.dish.update({
        where: { id },
        data: { isAvailable: false },
      })
    } catch {}
  }

  const all = loadDishesFromDisk()
  const filtered = all.filter((d) => d.id !== id)
  if (filtered.length !== all.length) {
    saveDishesToDisk(filtered)
  }
  return true
}
