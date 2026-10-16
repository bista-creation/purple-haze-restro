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
    url: '/images/my-cuisine-photo.jpg',
  },
  {
    id: 'np-samaya-baji',
    title: 'Newari Samay Baji Platter',
    category: 'nepali',
    url: '/images/samaya-baji.jpg',
  },
  {
    id: 'np-momo-steam',
    title: 'Steamed Momo with Achar',
    category: 'nepali',
    url: '/images/momo.webp',
  },
  {
    id: 'np-sekuwa',
    title: 'Charcoal Grilled Mutton Sekuwa',
    category: 'nepali',
    url: '/images/mutton-sekuwa.webp',
  },
  {
    id: 'np-choila',
    title: 'Traditional Mutton Choila',
    category: 'nepali',
    url: '/images/mutton-chhoila.jpg',
  },
  {
    id: 'np-pakku',
    title: 'Slow-Braised Mutton Pakku',
    category: 'nepali',
    url: '/images/mutton-pakku.jpg',
  },

  // Indian Cuisine
  {
    id: 'in-chicken-lajawab',
    title: 'Chicken Lajawab Mughlai',
    category: 'indian',
    url: '/images/chicken-lajawab.jpg',
  },
  {
    id: 'in-biryani-dum',
    title: 'Hyderabadi Dum Handi Biryani',
    category: 'indian',
    url: '/images/chicken-biryani.jpg',
  },
  {
    id: 'in-biryani-saffron',
    title: 'Royal Saffron Basmati Biryani',
    category: 'indian',
    url: '/images/biryani.jpg',
  },
  {
    id: 'in-paneer-lababdar',
    title: 'Shahi Paneer Lababdar',
    category: 'indian',
    url: '/images/paneer-lababdar.jpg',
  },
  {
    id: 'in-malai-tikka',
    title: 'Murgh Malai Tikka Kebab',
    category: 'indian',
    url: '/images/chicken-malai-tikka.jpg',
  },
  {
    id: 'in-dilkhush-kabab',
    title: 'Dilkhush Flame-Grilled Kabab',
    category: 'indian',
    url: '/images/dilkhus-kabab.jpg',
  },

  // Chinese & Asian Cuisine
  {
    id: 'ch-hakka-noodles',
    title: 'Stir-Fried Hakka Noodles',
    category: 'chinese',
    url: '/images/hakka-noodles.png',
  },
  {
    id: 'ch-hunan-chicken',
    title: 'Spicy Hunan Chilli Chicken',
    category: 'chinese',
    url: '/images/Hunan-Chicken.jpg',
  },
  {
    id: 'ch-szechuan-noodles',
    title: 'Spicy Szechuan Dan Dan Noodles',
    category: 'chinese',
    url: '/images/szechuan-noodles.jpg',
  },
  {
    id: 'ch-devil-chicken',
    title: 'Smoking Hot Devil Chicken Sizzler',
    category: 'chinese',
    url: '/images/devil-chicken.jpg',
  },

  // Continental & Grill
  {
    id: 'it-burger',
    title: 'Purple Haze Gourmet Brioche Burger',
    category: 'italian',
    url: '/images/burger.jpg',
  },
  {
    id: 'it-wings',
    title: 'Crispy Garlic Parmesan Wings',
    category: 'italian',
    url: '/images/garlic-parmesan-wings.jpg',
  },
  {
    id: 'it-sea-bass',
    title: 'Crispy Golden Sea Bass Fillet',
    category: 'italian',
    url: '/images/crispy-sea-bass.jpg',
  },
  {
    id: 'it-whole-fish',
    title: 'Whole Herb Grilled Fish Sizzler',
    category: 'italian',
    url: '/images/whole-fish.jpg',
  },

  // Ambiance & Venues
  {
    id: 'gr-garden-day',
    title: 'Purple Haze Lush Garden Oasis',
    category: 'grill',
    url: '/images/purple-haze-garden.jpg',
  },
  {
    id: 'gr-garden-lawn',
    title: 'Open Garden Lawn Dining',
    category: 'grill',
    url: '/images/garden-lawn.jpg',
  },
  {
    id: 'gr-garden-night',
    title: 'Twilight Garden Fairy Lights',
    category: 'grill',
    url: '/images/purple-night.jpg',
  },

  // Desserts & Chef Presentation
  {
    id: 'ds-presentation',
    title: 'Master Chef Food Presentation Platter',
    category: 'desserts',
    url: '/images/food-presentation.jpg',
  },
  {
    id: 'ds-pastry',
    title: 'Handcrafted Dessert & Pastry Symphony',
    category: 'desserts',
    url: '/images/dessert-min.png',
  },
]
