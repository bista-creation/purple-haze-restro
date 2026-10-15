import { RESTAURANT_INFO, DISHES_DATA, VENUES_DATA, AVAILABLE_COUPONS } from '@/lib/data/restaurant-data'

export const SYSTEM_PROMPT = `
You are HazeBot, the warm, hospitable, and knowledgeable AI Dining Concierge for "Purple Haze Restro & Garden" located in Biratnagar, Nepal.

ABOUT THE RESTAURANT:
- Name: Purple Haze Restro & Garden
- Tagline: "Flavors Under the Open Sky"
- Location: Airport Line, Airport Road, Biratnagar - 4, Morang, Koshi Province, Nepal
- Phone: +977 9852022202 / +977 21-464193
- Opening Hours: Sunday - Thursday: 10:00 AM - 10:00 PM; Friday - Saturday: 10:00 AM - 11:00 PM
- Cuisines: Authentic Nepali, Royal Indian, Sizzling Chinese, and Artisan Italian
- Currency: NPR (Rs. / Nepali Rupees)
- Facilities:
  1. Open-air Garden Dining with fairy lights, water fountain, and private cabanas
  2. Grand Banquet Hall (Capacity 350+ guests, from Rs. 45,000)
  3. Garden Event Lawn (Capacity 180+ guests, from Rs. 25,000)
  4. Executive Meeting & Conference Suite (Capacity 45 guests, from Rs. 12,000)
- Online Ordering: Available for Delivery, Takeaway, and Dine-in pre-orders. Free delivery promotions and zone-based fees (Rs. 50-120).
- Payment methods: Cash on Delivery (COD), eSewa, Khalti.
- Active Coupons:
  - PURPLE10: 10% OFF on orders over Rs. 500 (Max discount Rs. 200)
  - FLAT100: Flat Rs. 100 OFF on orders over Rs. 800
  - GARDENFEAST: 15% OFF on family feast orders over Rs. 1,200

YOUR TONE & PERSONALITY:
- Warm, polite, welcoming (use Namaste when greeting).
- Helpful and concise with accurate menu details, prices in NPR (Rs.), and venue specs.
- You understand both English and Nepali/Romanized Nepali (e.g., "Momo kasto cha?", "Thali ko price kati ho?").
- Suggest specific dishes with their prices, highlight vegetarian/non-vegetarian options, and recommend visiting or ordering online.
`

export interface ChatAction {
  label: string
  url: string
}

export interface ChatResponse {
  reply: string
  actions?: ChatAction[]
}

/**
 * Built-in intelligent rule & semantic matching engine.
 * Provides instant, zero-latency, high-accuracy responses for Purple Haze queries
 * even when an external LLM API key is not configured.
 */
export function generateLocalAiResponse(userQuery: string): ChatResponse {
  const query = userQuery.toLowerCase().trim()

  // 1. GREETINGS & CASUAL
  if (/^(hi|hello|hey|namaste|namaskar|hola|greetings|good\s*(morning|afternoon|evening))/i.test(query)) {
    return {
      reply: `**Namaste! 🙏 Welcome to Purple Haze Restro & Garden!**\n\nI am your AI Dining Concierge. How can I help you today?\n\n• Browse our **Nepali, Indian, Chinese & Italian** menu\n• Check dish recommendations & prices\n• Enquire about **Banquet & Garden Venue bookings**\n• Table reservations & online food delivery`,
      actions: [
        { label: '📖 Browse Menu', url: '/menu' },
        { label: '🎉 Book Venue', url: '/events' },
        { label: '🍽️ Reserve Table', url: '/reservations' },
      ],
    }
  }

  // 2. NEPALI CUISINE & THALI / MOMO
  if (query.includes('thali') || query.includes('thakali') || query.includes('nepali') || query.includes('momo') || query.includes('choila') || query.includes('samay baji')) {
    const nepaliDishes = DISHES_DATA.filter((d) => d.categoryId === 'cat-nepali').slice(0, 4)
    const list = nepaliDishes.map((d) => `• **${d.name}** — **Rs. ${d.price}**\n  _${d.description}_`).join('\n\n')

    return {
      reply: `🇳🇵 **Authentic Nepali Delicacies at Purple Haze:**\n\nOur most-loved Nepali dishes prepared with authentic Himalayan spices:\n\n${list}\n\n💡 *Tip: Our Steamed Chicken Momo comes in Kothey (pan-fried), Chilli Sizzler, and warm Jhol Momo variants!*`,
      actions: [
        { label: 'Order Nepali Food', url: '/menu?cuisine=nepali' },
        { label: 'View Full Menu', url: '/menu' },
      ],
    }
  }

  // 3. INDIAN CUISINE / BUTTER CHICKEN / BIRYANI
  if (query.includes('indian') || query.includes('butter chicken') || query.includes('biryani') || query.includes('paneer') || query.includes('dal makhani') || query.includes('tandoori') || query.includes('naan')) {
    const indianDishes = DISHES_DATA.filter((d) => d.categoryId === 'cat-indian').slice(0, 4)
    const list = indianDishes.map((d) => `• **${d.name}** — **Rs. ${d.price}**\n  _${d.description}_`).join('\n\n')

    return {
      reply: `🍛 **Royal Indian Favorites at Purple Haze:**\n\nRich gravies, clay-oven tandoori specialties, and aromatic rice:\n\n${list}\n\nAll curries pair wonderfully with our freshly baked Garlic Butter Naan (Rs. 90) or Tandoori Roti!`,
      actions: [
        { label: 'Order Indian Delicacies', url: '/menu?cuisine=indian' },
        { label: 'Order Online', url: '/menu' },
      ],
    }
  }

  // 4. CHINESE & ASIAN / CHOWMEIN / MANCHURIAN
  if (query.includes('chinese') || query.includes('chowmein') || query.includes('fried rice') || query.includes('manchurian') || query.includes('noodles') || query.includes('chilli chicken')) {
    const chineseDishes = DISHES_DATA.filter((d) => d.categoryId === 'cat-chinese').slice(0, 4)
    const list = chineseDishes.map((d) => `• **${d.name}** — **Rs. ${d.price}**\n  _${d.description}_`).join('\n\n')

    return {
      reply: `🥢 **Wok-Tossed Asian & Chinese Delights:**\n\nPrepared on high-heat woks for signature smoky wok-hei flavor:\n\n${list}\n\nAvailable in custom spice levels from mild to extra spicy!`,
      actions: [
        { label: 'Browse Chinese Menu', url: '/menu?cuisine=chinese' },
      ],
    }
  }

  // 5. ITALIAN / PIZZA / PASTA
  if (query.includes('italian') || query.includes('pizza') || query.includes('pasta') || query.includes('lasagna') || query.includes('spaghetti') || query.includes('tiramisu')) {
    const italianDishes = DISHES_DATA.filter((d) => d.categoryId === 'cat-italian').slice(0, 4)
    const list = italianDishes.map((d) => `• **${d.name}** — **Rs. ${d.price}**\n  _${d.description}_`).join('\n\n')

    return {
      reply: `🍕 **Handcrafted Italian & Continental Fare:**\n\nStone-baked pizzas, slow-simmered sauces, and fresh creamy pastas:\n\n${list}\n\nOur Margherita Pizza uses fresh basil, whole mozzarella, and San Marzano style tomato sauce!`,
      actions: [
        { label: 'Order Pizza & Pasta', url: '/menu?cuisine=italian' },
      ],
    }
  }

  // 6. VEGETARIAN & VEGAN
  if (query.includes('veg') || query.includes('vegetarian') || query.includes('shakahari') || query.includes('paneer') || query.includes('vegan')) {
    const vegDishes = DISHES_DATA.filter((d) => d.isVeg).slice(0, 5)
    const list = vegDishes.map((d) => `• **${d.name}** (${d.category?.name}) — **Rs. ${d.price}**`).join('\n')

    return {
      reply: `🌿 **Delicious Pure Vegetarian Specialties at Purple Haze:**\n\nWe maintain dedicated hygienic preparation areas for pure vegetarian orders:\n\n${list}\n\nWe also feature Crispy Mustang Aloo Sandeko (Rs. 220), Veg Chowmein (Rs. 210), and Artisan Margherita Pizza (Rs. 450)!`,
      actions: [
        { label: 'Filter Veg Dishes', url: '/menu?veg=true' },
      ],
    }
  }

  // 7. DRINKS / MOCKTAILS / BEVERAGES
  if (query.includes('drink') || query.includes('mocktail') || query.includes('beverage') || query.includes('coffee') || query.includes('shake') || query.includes('tea')) {
    return {
      reply: `🍹 **Refreshing Garden Mocktails & Brews:**\n\n• **Purple Haze Signature Galaxy Mocktail** — **Rs. 280** (Blue pea flower, lychee, sparkling citrus)\n• **Fresh Mint Mojito** — **Rs. 220**\n• **Himalayan Iced Masala Latte** — **Rs. 210**\n• **Creamy Alphonso Mango Shake** — **Rs. 240**\n\nPerfect for cooling off in our open garden terrace!`,
      actions: [
        { label: 'View Beverages', url: '/menu?cuisine=beverages' },
      ],
    }
  }

  // 8. SPECIFIC DISH SEARCH / PRICE QUERY
  const matchedDish = DISHES_DATA.find((d) => query.includes(d.name.toLowerCase()) || query.includes(d.slug.toLowerCase().replace(/-/g, ' ')))
  if (matchedDish) {
    return {
      reply: `🍽️ **${matchedDish.name}**\n\n• **Price:** Rs. ${matchedDish.price}\n• **Cuisine:** ${matchedDish.category?.name}\n• **Dietary:** ${matchedDish.isVeg ? '🟢 Pure Vegetarian' : '🔴 Non-Vegetarian'}\n• **Spice Level:** ${matchedDish.spicyLevel > 0 ? '🌶️'.repeat(matchedDish.spicyLevel) : 'Mild'}\n• **Preparation Time:** ~${matchedDish.preparationTime || 20} mins\n\n_${matchedDish.description}_`,
      actions: [
        { label: `Order ${matchedDish.name}`, url: '/menu' },
      ],
    }
  }

  // 9. VENUES / BANQUET / EVENTS / WEDDINGS / PARTIES
  if (query.includes('banquet') || query.includes('hall') || query.includes('venue') || query.includes('event') || query.includes('wedding') || query.includes('party') || query.includes('birthday') || query.includes('conference') || query.includes('meeting') || query.includes('capacity')) {
    const venuesList = VENUES_DATA.map((v) => `• **${v.name}**\n  - Capacity: **${v.capacity}+ guests**\n  - Starting from: **Rs. ${v.priceFrom.toLocaleString()}**\n  - Best for: ${v.features.slice(0, 2).join(', ')}`).join('\n\n')

    return {
      reply: `🎉 **Event Venues at Purple Haze Restro & Garden, Biratnagar:**\n\n${venuesList}\n\nWe provide complete event catering, DJ sound system, stage decoration, bridal suites, and free parking for over 50 vehicles!`,
      actions: [
        { label: 'Explore Venues & Pricing', url: '/events' },
        { label: 'Submit Event Enquiry', url: '/events#booking-form' },
      ],
    }
  }

  // 10. TABLE RESERVATIONS
  if (query.includes('reservation') || query.includes('reserve') || query.includes('book a table') || query.includes('table') || query.includes('seat')) {
    return {
      reply: `🥂 **Table Reservations at Purple Haze:**\n\nYou can easily reserve a table in either our **Open Garden Terrace**, **Cozy Family Indoor Area**, or **Private Cabana**.\n\n• Instant confirmation\n• Choice of indoor or garden seating\n• Special requests accommodated (candlelight, birthday cake setup)`,
      actions: [
        { label: 'Book a Table Now', url: '/reservations' },
        { label: 'Call for Urgent Reservation', url: 'tel:+9779852022202' },
      ],
    }
  }

  // 11. ONLINE ORDERING & DELIVERY ZONES / FEES
  if (query.includes('delivery') || query.includes('order online') || query.includes('home delivery') || query.includes('zone') || query.includes('how long')) {
    const zones = RESTAURANT_INFO.deliveryZones.map((z) => `• **${z.name}**: Rs. ${z.fee} (${z.estTime})`).join('\n')

    return {
      reply: `🛵 **Online Food Delivery in Biratnagar:**\n\nWe deliver piping hot meals right to your doorstep across Biratnagar!\n\n**Delivery Zones & Rates:**\n${zones}\n\n• **Payment Methods:** Cash on Delivery (COD), eSewa, Khalti\n• **Estimated Time:** 30 - 45 minutes on average`,
      actions: [
        { label: 'Start Food Order', url: '/menu' },
        { label: 'Track Existing Order', url: '/track-order' },
      ],
    }
  }

  // 12. TRACKING AN ORDER
  if (query.includes('track') || query.includes('where is my order') || query.includes('status of order')) {
    return {
      reply: `📍 **Live Order Tracking:**\n\nYou can track the real-time preparation and delivery status of your meal using your **Order Number** (e.g., #PH-8492) and phone number.`,
      actions: [
        { label: 'Open Live Order Tracker', url: '/track-order' },
      ],
    }
  }

  // 13. COUPONS & DISCOUNTS
  if (query.includes('coupon') || query.includes('discount') || query.includes('offer') || query.includes('promo') || query.includes('code') || query.includes('voucher')) {
    const couponList = AVAILABLE_COUPONS.map((c) => `• **${c.code}** — ${c.description}`).join('\n')

    return {
      reply: `🏷️ **Active Discount Coupons at Purple Haze:**\n\n${couponList}\n\nSimply apply any of these coupon codes during checkout in your cart to receive instant savings!`,
      actions: [
        { label: 'Order with Discount', url: '/menu' },
      ],
    }
  }

  // 14. LOCATION, OPENING HOURS & ADDRESS
  if (query.includes('location') || query.includes('where') || query.includes('address') || query.includes('hours') || query.includes('time') || query.includes('open') || query.includes('close')) {
    const hours = RESTAURANT_INFO.openingHours.map((h) => `• **${h.days}:** ${h.hours}`).join('\n')

    return {
      reply: `📍 **Location & Operating Hours:**\n\n• **Address:** ${RESTAURANT_INFO.address}\n• **Primary Phone:** ${RESTAURANT_INFO.primaryPhone}\n\n**Opening Hours:**\n${hours}\n\nWe are located right along the scenic Airport Line road with ample vehicle parking and lush gardens.`,
      actions: [
        { label: 'Get Google Maps Directions', url: RESTAURANT_INFO.socials.googleMaps },
        { label: 'Contact Us', url: '/contact' },
      ],
    }
  }

  // 15. CONTACT & PHONE / WHATSAPP
  if (query.includes('phone') || query.includes('contact') || query.includes('whatsapp') || query.includes('call') || query.includes('email') || query.includes('number')) {
    return {
      reply: `📞 **Contact Purple Haze Restro & Garden:**\n\n• **Direct Hotline:** ${RESTAURANT_INFO.primaryPhone}\n• **Landline:** +977 21-464193\n• **Email:** ${RESTAURANT_INFO.email}\n• **WhatsApp:** Instant chat available on ${RESTAURANT_INFO.primaryPhone}`,
      actions: [
        { label: 'Chat on WhatsApp', url: RESTAURANT_INFO.socials.whatsapp },
        { label: 'Send a Message', url: '/contact' },
      ],
    }
  }

  // 16. ROMANIZED NEPALI / CASUAL QUERIES
  if (query.includes('kasto') || query.includes('kati') || query.includes('cha') || query.includes('hunchha') || query.includes('garne')) {
    return {
      reply: `Namaste! 🙏 Purple Haze Restro & Garden Biratnagar ma tapaai lai swagat cha!\n\n• **Momo ra Thakali Thali** yaha ko best seller ho.\n• Biratnagar bhari **Home Delivery** pani available cha.\n• Bihe, birthday, ra meeting ko laagi **Banquet Hall & Garden** book garna saknu huncha.\n\nTapaai lai ke ko barema jankari chahiyeko thiyo?`,
      actions: [
        { label: 'Menu Hernuhos', url: '/menu' },
        { label: 'Table Book Garnuhos', url: '/reservations' },
        { label: 'Venue Booking', url: '/events' },
      ],
    }
  }

  // 17. GENERAL FALLBACK (Helpful overview)
  return {
    reply: `I would love to help you with that! At **Purple Haze Restro & Garden** in Biratnagar, we offer:\n\n• **Multicuisine Dining:** Nepali, Indian, Chinese & Italian dishes with home delivery\n• **Grand Venues:** Banquet hall (350+ pax), Garden Lawn (180+ pax) & Meeting Hall\n• **Table Reservations:** Indoor and romantic open-garden seating\n\nYou can also ask me about specific dish prices, vegetarian items, discount coupons, or opening hours!`,
    actions: [
      { label: 'Explore Menu', url: '/menu' },
      { label: 'Book Table', url: '/reservations' },
      { label: 'Event Enquiry', url: '/events' },
    ],
  }
}
