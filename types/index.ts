export type Role = 'CUSTOMER' | 'STAFF' | 'ADMIN'

export type OrderStatus =
  | 'PLACED'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'OUT_FOR_DELIVERY'
  | 'READY_FOR_PICKUP'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED'

export type OrderType = 'DELIVERY' | 'PICKUP' | 'DINE_IN'

export type PaymentMethod = 'CASH_ON_DELIVERY' | 'ESEWA' | 'KHALTI'

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'CANCELLED'

export type CouponType = 'PERCENTAGE' | 'FLAT'

export interface DishVariantItem {
  id: string
  dishId: string
  name: string
  price: number
  isDefault: boolean
}

export interface AddOnItem {
  id: string
  dishId: string
  name: string
  price: number
  isAvailable: boolean
}

export interface DishItem {
  id: string
  name: string
  slug: string
  description?: string | null
  price: number
  image?: string | null
  categoryId: string
  category?: {
    id: string
    name: string
    slug: string
    cuisine?: string | null
  }
  isVeg: boolean
  spicyLevel: number
  isAvailable: boolean
  isFeatured: boolean
  isPopular: boolean
  preparationTime?: number | null
  calories?: number | null
  tags: string[]
  variants?: DishVariantItem[]
  addOns?: AddOnItem[]
  rating?: number
  reviewCount?: number
}

export interface CategoryItem {
  id: string
  name: string
  slug: string
  description?: string | null
  image?: string | null
  icon?: string | null
  cuisine?: string | null
  sortOrder: number
  isActive: boolean
  dishCount?: number
}

export interface CartItemType {
  id: string
  dishId: string
  dish: DishItem
  quantity: number
  variant?: DishVariantItem | null
  selectedAddOns: AddOnItem[]
  specialNote?: string
  unitPrice: number
  totalPrice: number
}

export interface AppliedCoupon {
  id: string
  code: string
  type: CouponType
  value: number
  minOrderValue: number
  maxDiscount?: number | null
  discountAmount: number
}

export interface DeliveryAddress {
  id?: string
  label?: string
  street: string
  area: string
  city: string
  landmark?: string
  deliveryZone?: string
}

export interface VenueItem {
  id: string
  name: string
  slug: string
  description?: string | null
  capacity: number
  priceFrom: number
  features: string[]
  amenities: string[]
  images: string[]
  isActive: boolean
}

export interface EventBookingItem {
  id: string
  venueId?: string | null
  venue?: VenueItem | null
  name: string
  email: string
  phone: string
  eventType: string
  eventDate: string | Date
  guests: number
  message?: string | null
  status: BookingStatus
  adminNotes?: string | null
  createdAt: string | Date
}

export interface OrderItemSummary {
  id: string
  dishId: string
  dishName: string
  quantity: number
  unitPrice: number
  variantName?: string | null
  selectedAddOns: string[]
  specialNote?: string | null
  totalPrice: number
}

export interface OrderDetail {
  id: string
  orderNumber: string
  userId?: string | null
  guestName?: string | null
  guestPhone?: string | null
  guestEmail?: string | null
  orderType: OrderType
  status: OrderStatus
  subtotal: number
  deliveryFee: number
  taxAmount: number
  discountAmount: number
  totalAmount: number
  notes?: string | null
  estimatedTime?: number | null
  createdAt: string | Date
  updatedAt: string | Date
  items: OrderItemSummary[]
  deliveryAddress?: DeliveryAddress | null
  statusHistory?: {
    id: string
    status: OrderStatus
    note?: string | null
    createdAt: string | Date
    updatedBy?: string | null
  }[]
  payment?: {
    id: string
    method: PaymentMethod
    status: PaymentStatus
    amount: number
    transactionId?: string | null
  } | null
}
