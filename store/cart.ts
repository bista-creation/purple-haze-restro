import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { CartItemType, DishItem, DishVariantItem, AddOnItem, AppliedCoupon } from '@/types'

interface CartStore {
  items: CartItemType[]
  appliedCoupon: AppliedCoupon | null
  deliveryZone: string
  orderType: 'DELIVERY' | 'PICKUP' | 'DINE_IN'
  deliveryFee: number
  taxRate: number // e.g. 0.13 (13% VAT in Nepal) or 0 (if inclusive)
  isOpen: boolean // slide-out mini-cart open state

  // Actions
  addItem: (
    dish: DishItem,
    variant?: DishVariantItem | null,
    addOns?: AddOnItem[],
    quantity?: number,
    specialNote?: string
  ) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  updateItemNote: (itemId: string, note: string) => void
  clearCart: () => void
  applyCoupon: (coupon: AppliedCoupon) => void
  removeCoupon: () => void
  setOrderType: (type: 'DELIVERY' | 'PICKUP' | 'DINE_IN') => void
  setDeliveryZone: (zone: string, fee: number) => void
  setIsOpen: (isOpen: boolean) => void
  toggleCart: () => void

  // Computed values
  getSubtotal: () => number
  getDiscountAmount: () => number
  getTaxAmount: () => number
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      appliedCoupon: null,
      deliveryZone: 'Biratnagar Core (Airport / Main Rd)',
      orderType: 'DELIVERY',
      deliveryFee: 50, // default Biratnagar core delivery fee Rs. 50
      taxRate: 0, // In Nepal restaurant menus are typically inclusive or 0 tax added
      isOpen: false,

      addItem: (dish, variant = null, addOns = [], quantity = 1, specialNote = '') => {
        set((state) => {
          // Calculate unit price based on variant or base price + addOns
          const basePrice = variant ? variant.price : dish.price
          const addOnsPrice = addOns.reduce((acc, item) => acc + item.price, 0)
          const unitPrice = basePrice + addOnsPrice

          // Create a composite identifier for exact match (same dish + same variant + same add-ons)
          const addOnIds = addOns.map((a) => a.id).sort().join(',')
          const uniqueId = `${dish.id}-${variant?.id || 'base'}-${addOnIds}`

          const existingIndex = state.items.findIndex((item) => item.id === uniqueId)

          if (existingIndex > -1) {
            const updatedItems = [...state.items]
            const existingItem = updatedItems[existingIndex]
            const newQuantity = existingItem.quantity + quantity
            updatedItems[existingIndex] = {
              ...existingItem,
              quantity: newQuantity,
              totalPrice: newQuantity * existingItem.unitPrice,
              specialNote: specialNote || existingItem.specialNote,
            }
            return { items: updatedItems, isOpen: true }
          }

          const newItem: CartItemType = {
            id: uniqueId,
            dishId: dish.id,
            dish,
            variant,
            selectedAddOns: addOns,
            quantity,
            specialNote,
            unitPrice,
            totalPrice: unitPrice * quantity,
          }

          return { items: [...state.items, newItem], isOpen: true }
        })
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }))
      },

      updateQuantity: (itemId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter((item) => item.id !== itemId) }
          }
          return {
            items: state.items.map((item) =>
              item.id === itemId
                ? {
                    ...item,
                    quantity,
                    totalPrice: item.unitPrice * quantity,
                  }
                : item
            ),
          }
        })
      },

      updateItemNote: (itemId, specialNote) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, specialNote } : item
          ),
        }))
      },

      clearCart: () => {
        set({ items: [], appliedCoupon: null })
      },

      applyCoupon: (coupon) => {
        set({ appliedCoupon: coupon })
      },

      removeCoupon: () => {
        set({ appliedCoupon: null })
      },

      setOrderType: (orderType) => {
        set((state) => ({
          orderType,
          deliveryFee: orderType === 'DELIVERY' ? (state.deliveryFee || 50) : 0,
        }))
      },

      setDeliveryZone: (deliveryZone, fee) => {
        set((state) => ({
          deliveryZone,
          deliveryFee: state.orderType === 'DELIVERY' ? fee : 0,
        }))
      },

      setIsOpen: (isOpen) => set({ isOpen }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      getSubtotal: () => {
        return get().items.reduce((acc, item) => acc + item.totalPrice, 0)
      },

      getDiscountAmount: () => {
        const { appliedCoupon } = get()
        if (!appliedCoupon) return 0
        const subtotal = get().getSubtotal()
        if (subtotal < appliedCoupon.minOrderValue) return 0

        let discount = 0
        if (appliedCoupon.type === 'PERCENTAGE') {
          discount = (subtotal * appliedCoupon.value) / 100
          if (appliedCoupon.maxDiscount && discount > appliedCoupon.maxDiscount) {
            discount = appliedCoupon.maxDiscount
          }
        } else {
          discount = appliedCoupon.value
        }
        return Math.min(discount, subtotal)
      },

      getTaxAmount: () => {
        const { taxRate } = get()
        if (!taxRate) return 0
        const taxableSubtotal = get().getSubtotal() - get().getDiscountAmount()
        return Math.max(0, taxableSubtotal * taxRate)
      },

      getTotal: () => {
        const subtotal = get().getSubtotal()
        const discount = get().getDiscountAmount()
        const tax = get().getTaxAmount()
        const delivery = get().orderType === 'DELIVERY' ? get().deliveryFee : 0
        return Math.max(0, subtotal - discount + tax + delivery)
      },

      getItemCount: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0)
      },
    }),
    {
      name: 'purple-haze-cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        appliedCoupon: state.appliedCoupon,
        orderType: state.orderType,
        deliveryZone: state.deliveryZone,
        deliveryFee: state.deliveryFee,
      }),
    }
  )
)
