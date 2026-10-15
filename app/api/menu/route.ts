import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import {
  getAllDishes,
  getDishById,
  addDish,
  updateDish,
  deleteDish,
  toggleDishAvailability,
  toggleDishFeatured,
} from '@/lib/data/menu-store'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')
    const search = searchParams.get('search')?.toLowerCase()

    let dishes = getAllDishes()

    if (categoryId && categoryId !== 'all') {
      dishes = dishes.filter(
        (d) => d.categoryId === categoryId || d.category?.cuisine === categoryId
      )
    }

    if (search) {
      dishes = dishes.filter(
        (d) =>
          d.name.toLowerCase().includes(search) ||
          d.tags.some((t) => t.toLowerCase().includes(search))
      )
    }

    return NextResponse.json({ success: true, count: dishes.length, dishes })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve menu dishes.' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()

    // Verify user is logged in as ADMIN
    const userRole = session?.user?.role
    if (!session?.user || userRole !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Administrator clearance required to add new menu dishes.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    if (!body.name || !body.price || !body.categoryId) {
      return NextResponse.json(
        { success: false, error: 'Dish name, price, and category are required.' },
        { status: 400 }
      )
    }

    const created = addDish({
      name: body.name,
      price: Number(body.price),
      categoryId: body.categoryId,
      description: body.description,
      image: body.image,
      isVeg: Boolean(body.isVeg),
      spicyLevel: Number(body.spicyLevel ?? 1),
      preparationTime: Number(body.preparationTime ?? 20),
      isPopular: Boolean(body.isPopular),
      isFeatured: Boolean(body.isFeatured),
      tags: body.tags || ['Chef Special'],
    })

    return NextResponse.json({ success: true, dish: created }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to create menu item.' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth()
    const userRole = session?.user?.role

    // Must be either ADMIN or STAFF
    if (!session?.user || (userRole !== 'ADMIN' && userRole !== 'STAFF')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Staff or Admin authentication required.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { id, action, ...updates } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'Dish ID is required.' }, { status: 400 })
    }

    // Quick action: Stock toggle (allowed for both STAFF and ADMIN)
    if (action === 'toggle-stock') {
      const toggled = toggleDishAvailability(id)
      if (!toggled) {
        return NextResponse.json({ success: false, error: 'Dish not found.' }, { status: 404 })
      }
      return NextResponse.json({ success: true, dish: toggled })
    }

    // Quick action: Featured toggle (ADMIN only)
    if (action === 'toggle-featured') {
      if (userRole !== 'ADMIN') {
        return NextResponse.json(
          { success: false, error: 'Administrator clearance required to feature dishes.' },
          { status: 403 }
        )
      }
      const toggled = toggleDishFeatured(id)
      return NextResponse.json({ success: true, dish: toggled })
    }

    // Full dish update: Editing name, picture, price, etc. (ADMIN only)
    if (userRole !== 'ADMIN') {
      return NextResponse.json(
        {
          success: false,
          error: 'Administrator clearance required to modify dish recipes, prices, and pictures.',
        },
        { status: 403 }
      )
    }

    const updated = updateDish(id, updates)
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Dish not found.' }, { status: 404 })
    }

    return NextResponse.json({ success: true, dish: updated })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to update menu dish.' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth()
    const userRole = session?.user?.role

    // Only ADMIN can delete dishes from the menu
    if (!session?.user || userRole !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Administrator clearance required to delete dishes.' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'Dish ID is required.' }, { status: 400 })
    }

    const deleted = deleteDish(id)
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Dish not found.' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Dish removed successfully.' })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to delete dish.' },
      { status: 500 }
    )
  }
}
