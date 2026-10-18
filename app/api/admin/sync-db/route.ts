import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { CATEGORIES_DATA, DISHES_DATA } from '@/lib/data/restaurant-data'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const totalCategories = await prisma.category.count()
    const totalDishes = await prisma.dish.count()
    const totalOrders = await prisma.order.count()

    return NextResponse.json({
      success: true,
      status: 'connected',
      stats: { totalCategories, totalDishes, totalOrders },
    })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Database connection error.' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    // 1. Sync Categories into Neon
    let catsCount = 0
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
      catsCount++
    }

    // 2. Sync Dishes into Neon
    let dishesCount = 0
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
      dishesCount++
    }

    const totalCategories = await prisma.category.count()
    const totalDishes = await prisma.dish.count()
    const totalOrders = await prisma.order.count()

    return NextResponse.json({
      success: true,
      message: 'Successfully populated and synchronized Neon PostgreSQL database!',
      stats: {
        syncedCategories: catsCount,
        syncedDishes: dishesCount,
        totalCategories,
        totalDishes,
        totalOrders,
      },
    })
  } catch (err: any) {
    console.error('[DB Sync Route Error]:', err)
    return NextResponse.json(
      { success: false, error: err?.message || 'Database synchronization failed.' },
      { status: 500 }
    )
  }
}
