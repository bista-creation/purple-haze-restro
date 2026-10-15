import { z } from 'zod'

export const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number (min 10 digits)'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/[A-Za-z]/, 'Password must contain at least one letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
})

export const LoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const ForgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

export const ResetPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm password is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

export const ProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Valid phone number is required'),
  image: z.string().optional(),
})

export const AddressSchema = z.object({
  label: z.string().default('Home'),
  street: z.string().min(3, 'Street/House details required'),
  area: z.string().min(2, 'Area or locality required (e.g. Tintoliya, Roadcess)'),
  city: z.string().default('Biratnagar'),
  landmark: z.string().optional(),
  deliveryZone: z.string().default('Biratnagar Core (Airport / Main Rd)'),
  isDefault: z.boolean().default(false),
})

export const CheckoutSchema = z.object({
  // Customer info (guest or logged-in)
  name: z.string().min(2, 'Full name is required'),
  phone: z.string().min(10, 'Valid contact phone number is required'),
  email: z.string().email('Valid email address is required'),
  
  // Order details
  orderType: z.enum(['DELIVERY', 'PICKUP', 'DINE_IN']),
  scheduledTime: z.enum(['ASAP', 'SCHEDULED']).default('ASAP'),
  scheduledFor: z.string().optional(),
  
  // Delivery address (required if DELIVERY)
  street: z.string().optional(),
  area: z.string().optional(),
  city: z.string().default('Biratnagar'),
  landmark: z.string().optional(),
  deliveryZone: z.string().default('Biratnagar Core (Airport / Main Rd)'),
  
  // Table info (if DINE_IN)
  tableNumber: z.string().optional(),
  
  // Payment
  paymentMethod: z.enum(['CASH_ON_DELIVERY', 'ESEWA', 'KHALTI']),
  orderNotes: z.string().optional(),
}).refine(
  (data) => {
    if (data.orderType === 'DELIVERY') {
      return Boolean(data.street && data.area)
    }
    return true
  },
  {
    message: 'Delivery street and area are required for home delivery',
    path: ['street'],
  }
)

export const EventBookingSchema = z.object({
  name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  venue: z.string().min(1, 'Please select a venue'),
  eventType: z.string().min(1, 'Please select an event type'),
  eventDate: z.string().min(1, 'Event date is required'),
  guests: z.coerce.number().min(5, 'Minimum 5 guests required for venue booking'),
  message: z.string().optional(),
})

export const ReservationSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Phone number is required'),
  date: z.string().min(1, 'Reservation date is required'),
  time: z.string().min(1, 'Reservation time is required'),
  guests: z.coerce.number().min(1, 'At least 1 guest').max(50, 'Max 50 for online table booking'),
  tableArea: z.enum(['OPEN_GARDEN', 'INDOOR_DINING', 'WATER_FOUNTAIN_SIDE', 'FAMILY_LOUNGE']).default('OPEN_GARDEN'),
  specialRequests: z.string().optional(),
})

export const ContactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export const ReviewSchema = z.object({
  rating: z.coerce.number().min(1).max(5),
  comment: z.string().min(5, 'Please provide at least a few words in your review'),
  dishId: z.string().optional(),
  orderId: z.string().optional(),
})

export const DishFormSchema = z.object({
  name: z.string().min(2, 'Dish name required'),
  slug: z.string().min(2, 'Slug required'),
  description: z.string().optional(),
  price: z.coerce.number().min(1, 'Price must be positive'),
  image: z.string().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  isVeg: z.boolean().default(false),
  spicyLevel: z.coerce.number().min(0).max(3).default(0),
  isAvailable: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isPopular: z.boolean().default(false),
  preparationTime: z.coerce.number().optional(),
  tags: z.string().optional(), // comma-separated in form
})

export const CouponFormSchema = z.object({
  code: z.string().min(3, 'Code must be at least 3 characters').toUpperCase(),
  type: z.enum(['PERCENTAGE', 'FLAT']),
  value: z.coerce.number().min(1, 'Value must be greater than 0'),
  minOrderValue: z.coerce.number().min(0).default(0),
  maxDiscount: z.coerce.number().optional(),
  usageLimit: z.coerce.number().optional(),
  isActive: z.boolean().default(true),
  expiresAt: z.string().optional(),
  description: z.string().optional(),
})
