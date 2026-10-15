export interface FoodPhotoPreset {
  id: string
  title: string
  category: 'nepali' | 'indian' | 'chinese' | 'italian' | 'drinks' | 'desserts' | 'grill'
  url: string
}

export const FOOD_PHOTO_PRESETS: FoodPhotoPreset[] = [
  // Nepali Cuisine
  {
    id: 'np-thali',
    title: 'Thakali Thali Set',
    category: 'nepali',
    url: 'https://images.unsplash.com/photo-1625398407795-856638847727?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'np-momo-steam',
    title: 'Steamed Momo with Achar',
    category: 'nepali',
    url: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'np-momo-fried',
    title: 'Crispy Fried Kothey Momo',
    category: 'nepali',
    url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'np-sekuwa',
    title: 'Charcoal Grilled Sekuwa',
    category: 'nepali',
    url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'np-choila',
    title: 'Spicy Newari Choila',
    category: 'nepali',
    url: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop',
  },

  // Indian Cuisine
  {
    id: 'in-butter-chicken',
    title: 'Royal Butter Chicken',
    category: 'indian',
    url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'in-biryani',
    title: 'Hyderabadi Dum Biryani',
    category: 'indian',
    url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'in-dal-makhani',
    title: 'Creamy Dal Makhani',
    category: 'indian',
    url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'in-tikka',
    title: 'Tandoori Paneer / Chicken Tikka',
    category: 'indian',
    url: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'in-naan',
    title: 'Butter & Garlic Naan',
    category: 'indian',
    url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800&auto=format&fit=crop',
  },

  // Chinese & Asian Cuisine
  {
    id: 'ch-chowmein',
    title: 'Wok Hakka Chowmein',
    category: 'chinese',
    url: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'ch-fried-rice',
    title: 'Yangzhou Special Fried Rice',
    category: 'chinese',
    url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'ch-chilli-chicken',
    title: 'Crispy Dry Chilli Chicken',
    category: 'chinese',
    url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'ch-spring-roll',
    title: 'Golden Crispy Spring Rolls',
    category: 'chinese',
    url: 'https://images.unsplash.com/photo-1548946526-f69e2424cf45?q=80&w=800&auto=format&fit=crop',
  },

  // Italian Cuisine
  {
    id: 'it-margherita',
    title: 'Wood-Fired Margherita Pizza',
    category: 'italian',
    url: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'it-supreme-pizza',
    title: 'Loaded Garden Supreme Pizza',
    category: 'italian',
    url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'it-pasta-alfredo',
    title: 'Creamy Fettuccine Alfredo',
    category: 'italian',
    url: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'it-pasta-arrabiata',
    title: 'Spicy Tomato Penne Arrabiata',
    category: 'italian',
    url: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281724?q=80&w=800&auto=format&fit=crop',
  },

  // Grill & Snacks
  {
    id: 'gr-sizzler',
    title: 'Smoking Hot Sizzler Platter',
    category: 'grill',
    url: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'gr-fries',
    title: 'Seasoned French Fries & Dips',
    category: 'grill',
    url: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?q=80&w=800&auto=format&fit=crop',
  },

  // Bar, Drinks & Beverages
  {
    id: 'dr-purple-haze',
    title: 'Purple Galaxy Signature Mocktail',
    category: 'drinks',
    url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'dr-mojito',
    title: 'Fresh Mint & Lime Mojito',
    category: 'drinks',
    url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'dr-coffee',
    title: 'Iced Caramel Latte',
    category: 'drinks',
    url: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=800&auto=format&fit=crop',
  },

  // Desserts
  {
    id: 'ds-lava-cake',
    title: 'Warm Molten Lava Cake',
    category: 'desserts',
    url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'ds-tiramisu',
    title: 'Classic Italian Tiramisu',
    category: 'desserts',
    url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'ds-icecream',
    title: 'Artisanal Ice Cream Sundae',
    category: 'desserts',
    url: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=800&auto=format&fit=crop',
  },
]
