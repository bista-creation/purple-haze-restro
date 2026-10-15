import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow } from 'date-fns'

/**
 * Merges Tailwind CSS class names intelligently.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a number as Nepali Rupees.
 * @example formatPrice(1250) => "Rs. 1,250"
 */
export function formatPrice(amount: number): string {
  return `Rs. ${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`
}

/**
 * Formats a date to a readable string.
 * @example formatDate(new Date()) => "October 14, 2026"
 */
export function formatDate(date: Date | string, formatStr = 'MMMM d, yyyy'): string {
  return format(new Date(date), formatStr)
}

/**
 * Formats a date to a short readable string.
 * @example formatDateShort(new Date()) => "Oct 14, 2026"
 */
export function formatDateShort(date: Date | string): string {
  return format(new Date(date), 'MMM d, yyyy')
}

/**
 * Formats a datetime to include time.
 * @example formatDateTime(new Date()) => "Oct 14, 2026, 2:30 PM"
 */
export function formatDateTime(date: Date | string): string {
  return format(new Date(date), 'MMM d, yyyy, h:mm a')
}

/**
 * Returns a relative time string.
 * @example formatRelativeTime(yesterday) => "1 day ago"
 */
export function formatRelativeTime(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

/**
 * Generates a unique order number.
 * Format: PH + YYMMDD + 4-random-digits
 * @example generateOrderNumber() => "PH261014A3F2"
 */
export function generateOrderNumber(): string {
  const now = new Date()
  const yy = String(now.getFullYear()).slice(2)
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `PH${yy}${mm}${dd}${random}`
}

/**
 * Truncates a string to a maximum length.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return `${str.slice(0, maxLength)}...`
}

/**
 * Converts a string to a URL-friendly slug.
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Calculates the discounted price from a coupon.
 */
export function calculateDiscount(
  subtotal: number,
  couponType: 'PERCENTAGE' | 'FLAT',
  couponValue: number,
  maxDiscount?: number | null
): number {
  let discount = 0
  if (couponType === 'PERCENTAGE') {
    discount = (subtotal * couponValue) / 100
    if (maxDiscount) {
      discount = Math.min(discount, maxDiscount)
    }
  } else {
    discount = couponValue
  }
  return Math.round(Math.min(discount, subtotal))
}

/**
 * Calculates delivery fee based on order total.
 */
export function calculateDeliveryFee(subtotal: number, freeAbove = 1000, baseFee = 50): number {
  if (subtotal >= freeAbove) return 0
  return baseFee
}

/**
 * Calculates VAT (13% in Nepal).
 */
export function calculateTax(subtotal: number, rate = 13): number {
  return Math.round((subtotal * rate) / 100)
}

/**
 * Returns initials from a name.
 * @example getInitials("Rajesh Sharma") => "RS"
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Returns spicy level label.
 */
export function getSpicyLabel(level: number): string {
  const labels = ['Mild', 'Medium', 'Spicy', 'Extra Spicy']
  return labels[Math.min(level, 3)] ?? 'Mild'
}

/**
 * Returns spicy level color.
 */
export function getSpicyColor(level: number): string {
  const colors = ['text-green-600', 'text-yellow-500', 'text-orange-500', 'text-red-600']
  return colors[Math.min(level, 3)] ?? 'text-green-600'
}

/**
 * Returns order status label and color.
 */
export function getOrderStatusInfo(status: string): { label: string; color: string; bgColor: string } {
  const map: Record<string, { label: string; color: string; bgColor: string }> = {
    PLACED:           { label: 'Order Placed',       color: 'text-blue-700',   bgColor: 'bg-blue-100' },
    CONFIRMED:        { label: 'Confirmed',           color: 'text-indigo-700', bgColor: 'bg-indigo-100' },
    PREPARING:        { label: 'Preparing',           color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
    OUT_FOR_DELIVERY: { label: 'Out for Delivery',    color: 'text-orange-700', bgColor: 'bg-orange-100' },
    READY_FOR_PICKUP: { label: 'Ready for Pickup',    color: 'text-teal-700',   bgColor: 'bg-teal-100' },
    DELIVERED:        { label: 'Delivered',           color: 'text-green-700',  bgColor: 'bg-green-100' },
    COMPLETED:        { label: 'Completed',           color: 'text-green-700',  bgColor: 'bg-green-100' },
    CANCELLED:        { label: 'Cancelled',           color: 'text-red-700',    bgColor: 'bg-red-100' },
  }
  return map[status] ?? { label: status, color: 'text-gray-700', bgColor: 'bg-gray-100' }
}

/**
 * Returns booking status info.
 */
export function getBookingStatusInfo(status: string): { label: string; color: string; bgColor: string } {
  const map: Record<string, { label: string; color: string; bgColor: string }> = {
    PENDING:   { label: 'Pending',   color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
    CONFIRMED: { label: 'Confirmed', color: 'text-green-700',  bgColor: 'bg-green-100' },
    REJECTED:  { label: 'Rejected',  color: 'text-red-700',    bgColor: 'bg-red-100' },
    CANCELLED: { label: 'Cancelled', color: 'text-gray-700',   bgColor: 'bg-gray-100' },
  }
  return map[status] ?? { label: status, color: 'text-gray-700', bgColor: 'bg-gray-100' }
}

/**
 * Converts a file to a base64 string.
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}

/**
 * Checks if a restaurant is currently open.
 */
export function isRestaurantOpen(): boolean {
  const now = new Date()
  const day = now.getDay() // 0=Sun, 5=Fri, 6=Sat
  const hours = now.getHours()
  const minutes = now.getMinutes()
  const currentTime = hours * 60 + minutes

  const openTime = 10 * 60   // 10:00 AM
  const closeTimeWeekday = 22 * 60  // 10:00 PM
  const closeTimeWeekend = 23 * 60  // 11:00 PM

  if (day === 5 || day === 6) {
    return currentTime >= openTime && currentTime < closeTimeWeekend
  }
  return currentTime >= openTime && currentTime < closeTimeWeekday
}

/**
 * Debounce function.
 */
export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), wait)
  }
}

/**
 * Returns a random item from an array.
 */
export function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

/**
 * Safely parses JSON, returning null on failure.
 */
export function safeJsonParse<T>(json: string): T | null {
  try {
    return JSON.parse(json) as T
  } catch {
    return null
  }
}
