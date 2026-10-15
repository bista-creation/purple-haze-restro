import {
  PrismaClient,
  Role,
  OrderStatus,
  OrderType,
  PaymentMethod,
  PaymentStatus,
  BookingStatus,
  CouponType,
} from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // ─── Users ────────────────────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash('Admin@123456', 12)
  const staffPassword = await bcrypt.hash('Staff@123456', 12)
  const customerPassword = await bcrypt.hash('Customer@123', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@purplehaze.com' },
    update: {},
    create: {
      email: 'admin@purplehaze.com',
      name: 'Purple Haze Admin',
      passwordHash: adminPassword,
      role: Role.ADMIN,
      phone: '+9779852022202',
      emailVerified: new Date(),
    },
  })

  const staff = await prisma.user.upsert({
    where: { email: 'staff@purplehaze.com' },
    update: {},
    create: {
      email: 'staff@purplehaze.com',
      name: 'Purple Haze Staff',
      passwordHash: staffPassword,
      role: Role.STAFF,
      phone: '+9779841537347',
      emailVerified: new Date(),
    },
  })

  const customer1 = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      name: 'Rajesh Sharma',
      passwordHash: customerPassword,
      role: Role.CUSTOMER,
      phone: '+9779800000001',
      emailVerified: new Date(),
    },
  })

  const customer2 = await prisma.user.upsert({
    where: { email: 'customer2@example.com' },
    update: {},
    create: {
      email: 'customer2@example.com',
      name: 'Priya Thapa',
      passwordHash: customerPassword,
      role: Role.CUSTOMER,
      phone: '+9779800000002',
      emailVerified: new Date(),
    },
  })

  console.log('✅ Users created')

  // ─── Addresses ────────────────────────────────────────────────────────────
  const address1 = await prisma.address.create({
    data: {
      userId: customer1.id,
      label: 'Home',
      street: 'Traffic Chowk',
      area: 'Ganesh Tole',
      city: 'Biratnagar',
      isDefault: true,
      deliveryZone: 'zone-1',
    },
  })

  const address2 = await prisma.address.create({
    data: {
      userId: customer2.id,
      label: 'Office',
      street: 'Mahendra Path',
      area: 'Biratnagar-2',
      city: 'Biratnagar',
      isDefault: true,
      deliveryZone: 'zone-1',
    },
  })

  console.log('✅ Addresses created')

  // ─── Categories ───────────────────────────────────────────────────────────
  const nepaliCat = await prisma.category.upsert({
    where: { slug: 'nepali' },
    update: {},
    create: {
      name: 'Nepali',
      slug: 'nepali',
      description: 'Authentic Nepali home-style cooking with traditional recipes',
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
      icon: '🇳🇵',
      cuisine: 'nepali',
      sortOrder: 1,
    },
  })

  const indianCat = await prisma.category.upsert({
    where: { slug: 'indian' },
    update: {},
    create: {
      name: 'Indian',
      slug: 'indian',
      description: 'Rich and flavorful Indian cuisine with aromatic spices',
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
      icon: '🇮🇳',
      cuisine: 'indian',
      sortOrder: 2,
    },
  })

  const chineseCat = await prisma.category.upsert({
    where: { slug: 'chinese' },
    update: {},
    create: {
      name: 'Chinese / Asian',
      slug: 'chinese',
      description: 'Asian fusion dishes with bold flavors and fresh ingredients',
      image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800',
      icon: '🥢',
      cuisine: 'chinese',
      sortOrder: 3,
    },
  })

  const italianCat = await prisma.category.upsert({
    where: { slug: 'italian' },
    update: {},
    create: {
      name: 'Italian / Western',
      slug: 'italian',
      description: 'Classic Italian and Western dishes with a Purple Haze twist',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800',
      icon: '🍕',
      cuisine: 'italian',
      sortOrder: 4,
    },
  })

  const startersCat = await prisma.category.upsert({
    where: { slug: 'starters' },
    update: {},
    create: {
      name: 'Starters & Appetizers',
      slug: 'starters',
      description: 'Begin your meal with our delightful starters',
      image: 'https://images.unsplash.com/photo-1541014741259-de529411b96a?w=800',
      icon: '🥗',
      cuisine: 'mixed',
      sortOrder: 5,
    },
  })

  const dessertsCat = await prisma.category.upsert({
    where: { slug: 'desserts' },
    update: {},
    create: {
      name: 'Desserts & Sweets',
      slug: 'desserts',
      description: 'End your dining experience on a sweet note',
      image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800',
      icon: '🍰',
      cuisine: 'mixed',
      sortOrder: 6,
    },
  })

  const drinksCat = await prisma.category.upsert({
    where: { slug: 'drinks' },
    update: {},
    create: {
      name: 'Beverages & Drinks',
      slug: 'drinks',
      description: 'Refreshing drinks, juices, teas and special mocktails',
      image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800',
      icon: '🥤',
      cuisine: 'mixed',
      sortOrder: 7,
    },
  })

  console.log('✅ Categories created')

  // ─── Dishes ───────────────────────────────────────────────────────────────
  // Nepali Dishes
  const nepaliDishes = await Promise.all([
    prisma.dish.upsert({
      where: { slug: 'dal-bhat-thali' },
      update: {},
      create: {
        name: 'Dal Bhat Thali',
        slug: 'dal-bhat-thali',
        description: 'Traditional Nepali set meal with steamed rice, lentil soup, seasonal vegetables, pickles, and your choice of curry. A complete and hearty meal.',
        price: 320,
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
        categoryId: nepaliCat.id,
        isVeg: false,
        spicyLevel: 2,
        isAvailable: true,
        isFeatured: true,
        isPopular: true,
        preparationTime: 15,
        calories: 650,
        tags: ['thali', 'traditional', 'set-meal', 'rice'],
        sortOrder: 1,
      },
    }),
    prisma.dish.upsert({
      where: { slug: 'chicken-momo' },
      update: {},
      create: {
        name: 'Chicken Momo',
        slug: 'chicken-momo',
        description: 'Steamed Nepali dumplings filled with seasoned minced chicken, served with spicy tomato achar. A beloved Nepali street food classic.',
        price: 220,
        image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800',
        categoryId: nepaliCat.id,
        isVeg: false,
        spicyLevel: 2,
        isAvailable: true,
        isFeatured: true,
        isPopular: true,
        preparationTime: 20,
        calories: 380,
        tags: ['momo', 'dumplings', 'steamed', 'popular'],
        sortOrder: 2,
      },
    }),
    prisma.dish.upsert({
      where: { slug: 'buff-momo' },
      update: {},
      create: {
        name: 'Buff Momo',
        slug: 'buff-momo',
        description: 'Traditional Newari-style steamed dumplings with spiced buffalo meat filling, served with fresh sesame-tomato achar.',
        price: 250,
        image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800',
        categoryId: nepaliCat.id,
        isVeg: false,
        spicyLevel: 3,
        isAvailable: true,
        isFeatured: false,
        isPopular: true,
        preparationTime: 20,
        calories: 420,
        tags: ['momo', 'buff', 'newari', 'traditional'],
        sortOrder: 3,
      },
    }),
    prisma.dish.upsert({
      where: { slug: 'veg-momo' },
      update: {},
      create: {
        name: 'Veg Momo',
        slug: 'veg-momo',
        description: 'Delicate steamed dumplings stuffed with seasoned mixed vegetables — cabbage, carrots, spinach, tofu — served with tangy achar.',
        price: 190,
        image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800',
        categoryId: nepaliCat.id,
        isVeg: true,
        spicyLevel: 1,
        isAvailable: true,
        isFeatured: false,
        isPopular: false,
        preparationTime: 18,
        calories: 290,
        tags: ['momo', 'vegetarian', 'veg', 'healthy'],
        sortOrder: 4,
      },
    }),
    prisma.dish.upsert({
      where: { slug: 'newari-samay-baji' },
      update: {},
      create: {
        name: 'Newari Samay Baji',
        slug: 'newari-samay-baji',
        description: 'An authentic Newari platter featuring beaten rice (chiura), buff meat, black soybeans, dried fish, eggs, and traditional fermented vegetables.',
        price: 480,
        image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800',
        categoryId: nepaliCat.id,
        isVeg: false,
        spicyLevel: 2,
        isAvailable: true,
        isFeatured: true,
        isPopular: false,
        preparationTime: 10,
        calories: 720,
        tags: ['newari', 'traditional', 'platter', 'authentic'],
        sortOrder: 5,
      },
    }),
    prisma.dish.upsert({
      where: { slug: 'dhido-gundruk' },
      update: {},
      create: {
        name: 'Dhido with Gundruk Soup',
        slug: 'dhido-gundruk',
        description: 'Buckwheat/millet flour dhido with tangy fermented leafy greens soup, served with ghee and seasonal vegetable curry. A Himalayan comfort meal.',
        price: 280,
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
        categoryId: nepaliCat.id,
        isVeg: true,
        spicyLevel: 2,
        isAvailable: true,
        isFeatured: false,
        isPopular: false,
        preparationTime: 20,
        calories: 480,
        tags: ['dhido', 'gundruk', 'traditional', 'healthy', 'vegetarian'],
        sortOrder: 6,
      },
    }),
    prisma.dish.upsert({
      where: { slug: 'sel-roti' },
      update: {},
      create: {
        name: 'Sel Roti with Achar',
        slug: 'sel-roti',
        description: 'Traditional Nepali ring-shaped sweet fried bread made from rice flour, served with tomato-sesame achar and yogurt. Perfect for breakfast or snack.',
        price: 150,
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800',
        categoryId: nepaliCat.id,
        isVeg: true,
        spicyLevel: 0,
        isAvailable: true,
        isFeatured: false,
        isPopular: true,
        preparationTime: 12,
        calories: 320,
        tags: ['sel-roti', 'breakfast', 'traditional', 'sweet'],
        sortOrder: 7,
      },
    }),
    prisma.dish.upsert({
      where: { slug: 'chicken-chilli' },
      update: {},
      create: {
        name: 'Chicken Chilli (Nepali Style)',
        slug: 'chicken-chilli',
        description: 'Crispy fried chicken tossed with Szechuan peppers, Nepali spices, onions, capsicum, and fresh chillies. A fiery crowd favorite.',
        price: 360,
        image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=800',
        categoryId: nepaliCat.id,
        isVeg: false,
        spicyLevel: 3,
        isAvailable: true,
        isFeatured: false,
        isPopular: true,
        preparationTime: 20,
        calories: 540,
        tags: ['chicken', 'spicy', 'chilli', 'popular'],
        sortOrder: 8,
      },
    }),
  ])

  // Indian Dishes
  const indianDishes = await Promise.all([
    prisma.dish.upsert({
      where: { slug: 'butter-chicken' },
      update: {},
      create: {
        name: 'Butter Chicken',
        slug: 'butter-chicken',
        description: 'Tender chicken pieces slow-cooked in a rich, creamy tomato-butter sauce with aromatic spices. A North Indian classic served with naan.',
        price: 420,
        image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800',
        categoryId: indianCat.id,
        isVeg: false,
        spicyLevel: 2,
        isAvailable: true,
        isFeatured: true,
        isPopular: true,
        preparationTime: 25,
        calories: 620,
        tags: ['chicken', 'curry', 'creamy', 'popular', 'north-indian'],
        sortOrder: 1,
      },
    }),
    prisma.dish.upsert({
      where: { slug: 'dal-makhani' },
      update: {},
      create: {
        name: 'Dal Makhani',
        slug: 'dal-makhani',
        description: 'Black lentils and kidney beans slow-cooked overnight with butter, cream, and spices. Rich, velvety, and deeply comforting.',
        price: 320,
        image: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=800',
        categoryId: indianCat.id,
        isVeg: true,
        spicyLevel: 1,
        isAvailable: true,
        isFeatured: true,
        isPopular: true,
        preparationTime: 20,
        calories: 480,
        tags: ['dal', 'lentils', 'vegetarian', 'north-indian', 'popular'],
        sortOrder: 2,
      },
    }),
    prisma.dish.upsert({
      where: { slug: 'paneer-tikka' },
      update: {},
      create: {
        name: 'Paneer Tikka',
        slug: 'paneer-tikka',
        description: 'Cubes of fresh cottage cheese marinated in yogurt and spices, grilled in a tandoor until charred and smoky. Served with mint chutney.',
        price: 380,
        image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800',
        categoryId: indianCat.id,
        isVeg: true,
        spicyLevel: 2,
        isAvailable: true,
        isFeatured: false,
        isPopular: true,
        preparationTime: 20,
        calories: 420,
        tags: ['paneer', 'tandoor', 'vegetarian', 'grilled'],
        sortOrder: 3,
      },
    }),
    prisma.dish.upsert({
      where: { slug: 'chicken-biryani' },
      update: {},
      create: {
        name: 'Chicken Biryani',
        slug: 'chicken-biryani',
        description: 'Aromatic basmati rice slow-cooked with tender chicken, saffron, whole spices, and caramelized onions. Served with raita and shorba.',
        price: 450,
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800',
        categoryId: indianCat.id,
        isVeg: false,
        spicyLevel: 2,
        isAvailable: true,
        isFeatured: true,
        isPopular: true,
        preparationTime: 35,
        calories: 720,
        tags: ['biryani', 'rice', 'chicken', 'aromatic', 'popular'],
        sortOrder: 4,
      },
    }),
    prisma.dish.upsert({
      where: { slug: 'garlic-naan' },
      update: {},
      create: {
        name: 'Garlic Naan',
        slug: 'garlic-naan',
        description: 'Soft, fluffy leavened bread baked in tandoor, brushed with garlic butter and fresh coriander. Perfect accompaniment to any curry.',
        price: 120,
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800',
        categoryId: indianCat.id,
        isVeg: true,
        spicyLevel: 0,
        isAvailable: true,
        isFeatured: false,
        isPopular: true,
        preparationTime: 10,
        calories: 220,
        tags: ['naan', 'bread', 'garlic', 'tandoor'],
        sortOrder: 5,
      },
    }),
    prisma.dish.upsert({
      where: { slug: 'samosa-chaat' },
      update: {},
      create: {
        name: 'Samosa Chaat',
        slug: 'samosa-chaat',
        description: 'Crispy samosas crushed and topped with spiced chickpeas, yogurt, tamarind chutney, green chutney, and crunchy sev. A street food delight.',
        price: 180,
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800',
        categoryId: indianCat.id,
        isVeg: true,
        spicyLevel: 2,
        isAvailable: true,
        isFeatured: false,
        isPopular: true,
        preparationTime: 10,
        calories: 380,
        tags: ['chaat', 'samosa', 'street-food', 'vegetarian'],
        sortOrder: 6,
      },
    }),
    prisma.dish.upsert({
      where: { slug: 'palak-paneer' },
      update: {},
      create: {
        name: 'Palak Paneer',
        slug: 'palak-paneer',
        description: 'Velvety spinach gravy cooked with aromatic spices and cubes of fresh paneer. A vibrant, nutritious, and deeply flavorful vegetarian curry.',
        price: 340,
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
        categoryId: indianCat.id,
        isVeg: true,
        spicyLevel: 1,
        isAvailable: true,
        isFeatured: false,
        isPopular: false,
        preparationTime: 20,
        calories: 420,
        tags: ['paneer', 'spinach', 'vegetarian', 'healthy'],
        sortOrder: 7,
      },
    }),
    prisma.dish.upsert({
      where: { slug: 'tandoori-chicken' },
      update: {},
      create: {
        name: 'Tandoori Chicken (Half)',
        slug: 'tandoori-chicken',
        description: 'Chicken marinated in yogurt, lemon juice, and aromatic spices, then roasted in a traditional clay tandoor for a smoky, charred finish.',
        price: 380,
        image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800',
        categoryId: indianCat.id,
        isVeg: false,
        spicyLevel: 2,
        isAvailable: true,
        isFeatured: false,
        isPopular: true,
        preparationTime: 30,
        calories: 560,
        tags: ['tandoori', 'chicken', 'grilled', 'smoky'],
        sortOrder: 8,
      },
    }),
  ])

  // Chinese Dishes
  const chineseDishes = await Promise.all([
    prisma.dish.upsert({
      where: { slug: 'chicken-chowmein' },
      update: {},
      create: {
        name: 'Chicken Chowmein',
        slug: 'chicken-chowmein',
        description: 'Stir-fried noodles with tender chicken strips, crisp vegetables, and savory sauces. A timeless classic with satisfying texture and flavor.',
        price: 280,
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800',
        categoryId: chineseCat.id,
        isVeg: false,
        spicyLevel: 1,
        isAvailable: true,
        isFeatured: true,
        isPopular: true,
        preparationTime: 15,
        calories: 520,
        tags: ['noodles', 'chowmein', 'stir-fry', 'popular'],
        sortOrder: 1,
      },
    }),
    prisma.dish.upsert({
      where: { slug: 'veg-fried-rice' },
      update: {},
      create: {
        name: 'Vegetable Fried Rice',
        slug: 'veg-fried-rice',
        description: 'Wok-tossed long-grain rice with seasonal vegetables, scrambled eggs, soy sauce, and aromatic sesame oil. Light yet satisfying.',
        price: 240,
        image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800',
        categoryId: chineseCat.id,
        isVeg: false,
        spicyLevel: 0,
        isAvailable: true,
        isFeatured: false,
        isPopular: true,
        preparationTime: 12,
        calories: 460,
        tags: ['rice', 'fried-rice', 'vegetables', 'wok'],
        sortOrder: 2,
      },
    }),
    prisma.dish.upsert({
      where: { slug: 'chicken-manchurian' },
      update: {},
      create: {
        name: 'Chicken Manchurian',
        slug: 'chicken-manchurian',
        description: 'Crispy fried chicken balls cooked in a tangy, spicy Manchurian sauce with ginger, garlic, and spring onions. Dry or gravy style.',
        price: 320,
        image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=800',
        categoryId: chineseCat.id,
        isVeg: false,
        spicyLevel: 2,
        isAvailable: true,
        isFeatured: true,
        isPopular: true,
        preparationTime: 20,
        calories: 580,
        tags: ['manchurian', 'chicken', 'indo-chinese', 'popular'],
        sortOrder: 3,
      },
    }),
    prisma.dish.upsert({
      where: { slug: 'spring-rolls' },
      update: {},
      create: {
        name: 'Vegetable Spring Rolls',
        slug: 'spring-rolls',
        description: 'Crispy golden rolls filled with stir-fried vegetables, glass noodles, and subtle seasonings. Served with sweet chilli dipping sauce.',
        price: 200,
        image: 'https://images.unsplash.com/photo-1641326998177-2edbd4fcba1a?w=800',
        categoryId: chineseCat.id,
        isVeg: true,
        spicyLevel: 1,
        isAvailable: true,
        isFeatured: false,
        isPopular: true,
        preparationTime: 15,
        calories: 340,
        tags: ['spring-rolls', 'vegetarian', 'crispy', 'appetizer'],
        sortOrder: 4,
      },
    }),
    prisma.dish.upsert({
      where: { slug: 'hakka-noodles' },
      update: {},
      create: {
        name: 'Hakka Noodles',
        slug: 'hakka-noodles',
        description: 'Thin, flat noodles wok-tossed with fresh vegetables and choice of protein in a savory Indo-Chinese sauce blend.',
        price: 260,
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800',
        categoryId: chineseCat.id,
        isVeg: false,
        spicyLevel: 2,
        isAvailable: true,
        isFeatured: false,
        isPopular: false,
        preparationTime: 15,
        calories: 490,
        tags: ['noodles', 'hakka', 'indo-chinese', 'spicy'],
        sortOrder: 5,
      },
    }),
    prisma.dish.upsert({
      where: { slug: 'dim-sum' },
      update: {},
      create: {
        name: 'Dim Sum Basket',
        slug: 'dim-sum',
        description: 'A steamer basket of assorted dim sum — prawn har gow, pork siu mai, and vegetable dumplings — with soy and chilli dips.',
        price: 380,
        image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800',
        categoryId: chineseCat.id,
        isVeg: false,
        spicyLevel: 1,
        isAvailable: true,
        isFeatured: true,
        isPopular: false,
        preparationTime: 25,
        calories: 420,
        tags: ['dim-sum', 'steamed', 'dumplings', 'assorted'],
        sortOrder: 6,
      },
    }),
    prisma.dish.upsert({
      where: { slug: 'sweet-sour-chicken' },
      update: {},
      create: {
        name: 'Sweet & Sour Chicken',
        slug: 'sweet-sour-chicken',
        description: 'Crispy battered chicken pieces tossed in a glossy sweet-and-sour sauce with pineapple, bell peppers, and onion.',
        price: 340,
        image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800',
        categoryId: chineseCat.id,
        isVeg: false,
        spicyLevel: 0,
        isAvailable: true,
        isFeatured: false,
        isPopular: true,
        preparationTime: 18,
        calories: 560,
        tags: ['sweet-sour', 'chicken', 'chinese', 'classic'],
        sortOrder: 7,
      },
    }),
    prisma.dish.upsert({
      where: { slug: 'hot-sour-soup' },
      update: {},
      create: {
        name: 'Hot & Sour Soup',
        slug: 'hot-sour-soup',
        description: 'A warming bowl of tangy, mildly spicy broth with tofu, mushrooms, bamboo shoots, and egg ribbons. A Chinese restaurant staple.',
        price: 180,
        image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800',
        categoryId: chineseCat.id,
        isVeg: false,
        spicyLevel: 2,
        isAvailable: true,
        isFeatured: false,
        isPopular: true,
        preparationTime: 10,
        calories: 220,
        tags: ['soup', 'hot-sour', 'chinese', 'starter'],
        sortOrder: 8,
      },
    }),
  ])

  // Italian / Western Dishes
  const italianDishes = await Promise.all([
    prisma.dish.upsert({
      where: { slug: 'margherita-pizza' },
      update: {},
      create: {
        name: 'Margherita Pizza',
        slug: 'margherita-pizza',
        description: 'Hand-stretched thin crust topped with San Marzano tomato sauce, fresh mozzarella, and aromatic basil leaves. The classic Italian pizza.',
        price: 480,
        image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800',
        categoryId: italianCat.id,
        isVeg: true,
        spicyLevel: 0,
        isAvailable: true,
        isFeatured: true,
        isPopular: true,
        preparationTime: 20,
        calories: 720,
        tags: ['pizza', 'vegetarian', 'classic', 'italian'],
        sortOrder: 1,
      },
    }),
    prisma.dish.upsert({
      where: { slug: 'chicken-pizza' },
      update: {},
      create: {
        name: 'BBQ Chicken Pizza',
        slug: 'chicken-pizza',
        description: 'Smoky BBQ sauce base topped with grilled chicken, caramelized onions, mozzarella, and coriander. A flavour-packed crowd-pleaser.',
        price: 580,
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800',
        categoryId: italianCat.id,
        isVeg: false,
        spicyLevel: 1,
        isAvailable: true,
        isFeatured: true,
        isPopular: true,
        preparationTime: 22,
        calories: 860,
        tags: ['pizza', 'chicken', 'bbq', 'popular'],
        sortOrder: 2,
      },
    }),
    prisma.dish.upsert({
      where: { slug: 'pasta-arrabiata' },
      update: {},
      create: {
        name: 'Pasta Arrabiata',
        slug: 'pasta-arrabiata',
        description: 'Al dente penne pasta in a fiery tomato sauce with garlic, red chillies, and fresh herbs. Simple, bold, and deeply satisfying.',
        price: 360,
        image: 'https://images.unsplash.com/photo-1551183053-bf91798d773e?w=800',
        categoryId: italianCat.id,
        isVeg: true,
        spicyLevel: 2,
        isAvailable: true,
        isFeatured: false,
        isPopular: true,
        preparationTime: 18,
        calories: 540,
        tags: ['pasta', 'vegetarian', 'spicy', 'italian'],
        sortOrder: 3,
      },
    }),
    prisma.dish.upsert({
      where: { slug: 'chicken-pasta' },
      update: {},
      create: {
        name: 'Chicken Alfredo Pasta',
        slug: 'chicken-pasta',
        description: 'Fettuccine pasta tossed in a luscious cream and parmesan sauce with grilled chicken strips, mushrooms, and fresh herbs.',
        price: 420,
        image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023882a?w=800',
        categoryId: italianCat.id,
        isVeg: false,
        spicyLevel: 0,
        isAvailable: true,
        isFeatured: false,
        isPopular: true,
        preparationTime: 20,
        calories: 680,
        tags: ['pasta', 'alfredo', 'chicken', 'creamy'],
        sortOrder: 4,
      },
    }),
    prisma.dish.upsert({
      where: { slug: 'bruschetta' },
      update: {},
      create: {
        name: 'Bruschetta al Pomodoro',
        slug: 'bruschetta',
        description: 'Toasted sourdough bread rubbed with garlic and topped with fresh diced tomatoes, basil, olive oil, and a pinch of fleur de sel.',
        price: 220,
        image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=800',
        categoryId: italianCat.id,
        isVeg: true,
        spicyLevel: 0,
        isAvailable: true,
        isFeatured: false,
        isPopular: false,
        preparationTime: 8,
        calories: 280,
        tags: ['bruschetta', 'starter', 'vegetarian', 'italian'],
        sortOrder: 5,
      },
    }),
    prisma.dish.upsert({
      where: { slug: 'tiramisu' },
      update: {},
      create: {
        name: 'Tiramisu',
        slug: 'tiramisu',
        description: 'Classic Italian dessert with espresso-soaked ladyfingers layered with mascarpone cream and dusted with cocoa powder.',
        price: 280,
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800',
        categoryId: dessertsCat.id,
        isVeg: true,
        spicyLevel: 0,
        isAvailable: true,
        isFeatured: true,
        isPopular: true,
        preparationTime: 5,
        calories: 380,
        tags: ['dessert', 'italian', 'coffee', 'classic'],
        sortOrder: 1,
      },
    }),
    prisma.dish.upsert({
      where: { slug: 'lasagna' },
      update: {},
      create: {
        name: 'Classic Lasagna',
        slug: 'lasagna',
        description: 'Layers of pasta sheets, slow-cooked Bolognese meat sauce, béchamel, and melted mozzarella baked to bubbly perfection.',
        price: 480,
        image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800',
        categoryId: italianCat.id,
        isVeg: false,
        spicyLevel: 1,
        isAvailable: true,
        isFeatured: true,
        isPopular: false,
        preparationTime: 30,
        calories: 820,
        tags: ['lasagna', 'pasta', 'baked', 'italian'],
        sortOrder: 6,
      },
    }),
    prisma.dish.upsert({
      where: { slug: 'chicken-burger' },
      update: {},
      create: {
        name: 'Crispy Chicken Burger',
        slug: 'chicken-burger',
        description: 'Juicy crispy fried chicken thigh, house sauce, pickled jalapeños, shredded lettuce, and cheese in a brioche bun. Served with fries.',
        price: 380,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800',
        categoryId: italianCat.id,
        isVeg: false,
        spicyLevel: 2,
        isAvailable: true,
        isFeatured: false,
        isPopular: true,
        preparationTime: 18,
        calories: 780,
        tags: ['burger', 'chicken', 'western', 'popular'],
        sortOrder: 7,
      },
    }),
  ])

  // Starters
  const starterDishes = await Promise.all([
    prisma.dish.upsert({
      where: { slug: 'onion-rings' },
      update: {},
      create: {
        name: 'Crispy Onion Rings',
        slug: 'onion-rings',
        description: 'Thick-cut onion rings in a seasoned beer batter, deep-fried until golden and crispy. Served with house aioli.',
        price: 160,
        image: 'https://images.unsplash.com/photo-1541014741259-de529411b96a?w=800',
        categoryId: startersCat.id,
        isVeg: true,
        spicyLevel: 0,
        isAvailable: true,
        isFeatured: false,
        isPopular: true,
        preparationTime: 10,
        calories: 320,
        tags: ['onion-rings', 'starter', 'vegetarian', 'crispy'],
        sortOrder: 1,
      },
    }),
    prisma.dish.upsert({
      where: { slug: 'chicken-wings' },
      update: {},
      create: {
        name: 'Buffalo Chicken Wings',
        slug: 'chicken-wings',
        description: 'Crispy chicken wings tossed in tangy buffalo sauce, served with blue cheese dip and celery sticks. Perfect for sharing.',
        price: 340,
        image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=800',
        categoryId: startersCat.id,
        isVeg: false,
        spicyLevel: 3,
        isAvailable: true,
        isFeatured: true,
        isPopular: true,
        preparationTime: 20,
        calories: 480,
        tags: ['wings', 'chicken', 'spicy', 'buffalo'],
        sortOrder: 2,
      },
    }),
  ])

  // Drinks
  const drinkDishes = await Promise.all([
    prisma.dish.upsert({
      where: { slug: 'mango-lassi' },
      update: {},
      create: {
        name: 'Mango Lassi',
        slug: 'mango-lassi',
        description: 'Creamy, chilled yogurt drink blended with ripe Alphonso mango pulp, sugar, and a hint of cardamom. Refreshing and sweet.',
        price: 150,
        image: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=800',
        categoryId: drinksCat.id,
        isVeg: true,
        spicyLevel: 0,
        isAvailable: true,
        isFeatured: false,
        isPopular: true,
        preparationTime: 5,
        calories: 240,
        tags: ['lassi', 'mango', 'drink', 'refreshing'],
        sortOrder: 1,
      },
    }),
    prisma.dish.upsert({
      where: { slug: 'purple-haze-mocktail' },
      update: {},
      create: {
        name: 'Purple Haze Mocktail',
        slug: 'purple-haze-mocktail',
        description: 'Our signature mocktail — butterfly pea flower tea, lemon juice, sparkling water, and lavender syrup. Stunning color-changing drink.',
        price: 220,
        image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800',
        categoryId: drinksCat.id,
        isVeg: true,
        spicyLevel: 0,
        isAvailable: true,
        isFeatured: true,
        isPopular: true,
        preparationTime: 5,
        calories: 120,
        tags: ['mocktail', 'signature', 'purple', 'special'],
        sortOrder: 2,
      },
    }),
    prisma.dish.upsert({
      where: { slug: 'masala-chai' },
      update: {},
      create: {
        name: 'Masala Chai',
        slug: 'masala-chai',
        description: 'Freshly brewed spiced tea with ginger, cardamom, cinnamon, and cloves simmered with full-fat milk. Warming and aromatic.',
        price: 80,
        image: 'https://images.unsplash.com/photo-1534353473418-4cfa0c771cee?w=800',
        categoryId: drinksCat.id,
        isVeg: true,
        spicyLevel: 1,
        isAvailable: true,
        isFeatured: false,
        isPopular: true,
        preparationTime: 5,
        calories: 120,
        tags: ['chai', 'tea', 'masala', 'hot'],
        sortOrder: 3,
      },
    }),
  ])

  // Desserts
  const dessertDishes = await Promise.all([
    prisma.dish.upsert({
      where: { slug: 'gulab-jamun' },
      update: {},
      create: {
        name: 'Gulab Jamun',
        slug: 'gulab-jamun',
        description: 'Soft, melt-in-mouth milk solid dumplings soaked in rose-cardamom sugar syrup. Served warm with a scoop of vanilla ice cream.',
        price: 150,
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800',
        categoryId: dessertsCat.id,
        isVeg: true,
        spicyLevel: 0,
        isAvailable: true,
        isFeatured: false,
        isPopular: true,
        preparationTime: 5,
        calories: 320,
        tags: ['dessert', 'sweet', 'indian', 'popular'],
        sortOrder: 2,
      },
    }),
    prisma.dish.upsert({
      where: { slug: 'chocolate-lava-cake' },
      update: {},
      create: {
        name: 'Chocolate Lava Cake',
        slug: 'chocolate-lava-cake',
        description: 'Warm dark chocolate fondant with a gooey molten center, served with vanilla bean ice cream and fresh berry coulis.',
        price: 280,
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800',
        categoryId: dessertsCat.id,
        isVeg: true,
        spicyLevel: 0,
        isAvailable: true,
        isFeatured: true,
        isPopular: true,
        preparationTime: 12,
        calories: 480,
        tags: ['dessert', 'chocolate', 'warm', 'lava'],
        sortOrder: 3,
      },
    }),
  ])

  console.log('✅ Dishes created')

  // ─── Dish Variants ────────────────────────────────────────────────────────
  // Add variants to Momo dishes
  const chickenMomoDish = nepaliDishes.find(d => d.slug === 'chicken-momo')!
  const buffMomoDish = nepaliDishes.find(d => d.slug === 'buff-momo')!
  const vegMomoDish = nepaliDishes.find(d => d.slug === 'veg-momo')!

  await Promise.all([
    prisma.dishVariant.createMany({
      data: [
        { dishId: chickenMomoDish.id, name: 'Steamed (8 pcs)', price: 220, isDefault: true },
        { dishId: chickenMomoDish.id, name: 'Fried (8 pcs)', price: 260, isDefault: false },
        { dishId: chickenMomoDish.id, name: 'Jhol Momo (8 pcs)', price: 280, isDefault: false },
      ],
      skipDuplicates: true,
    }),
    prisma.dishVariant.createMany({
      data: [
        { dishId: buffMomoDish.id, name: 'Steamed (8 pcs)', price: 250, isDefault: true },
        { dishId: buffMomoDish.id, name: 'Fried (8 pcs)', price: 290, isDefault: false },
      ],
      skipDuplicates: true,
    }),
    prisma.dishVariant.createMany({
      data: [
        { dishId: vegMomoDish.id, name: 'Steamed (8 pcs)', price: 190, isDefault: true },
        { dishId: vegMomoDish.id, name: 'Fried (8 pcs)', price: 220, isDefault: false },
      ],
      skipDuplicates: true,
    }),
  ])

  // Pizza variants
  const margheritaDish = italianDishes.find(d => d.slug === 'margherita-pizza')!
  const bbqChickenDish = italianDishes.find(d => d.slug === 'chicken-pizza')!

  await Promise.all([
    prisma.dishVariant.createMany({
      data: [
        { dishId: margheritaDish.id, name: 'Regular (8")', price: 480, isDefault: true },
        { dishId: margheritaDish.id, name: 'Large (12")', price: 680, isDefault: false },
      ],
      skipDuplicates: true,
    }),
    prisma.dishVariant.createMany({
      data: [
        { dishId: bbqChickenDish.id, name: 'Regular (8")', price: 580, isDefault: true },
        { dishId: bbqChickenDish.id, name: 'Large (12")', price: 780, isDefault: false },
      ],
      skipDuplicates: true,
    }),
  ])

  console.log('✅ Dish variants created')

  // ─── Add-ons ──────────────────────────────────────────────────────────────
  const dalBhatDish = nepaliDishes.find(d => d.slug === 'dal-bhat-thali')!
  await prisma.addOn.createMany({
    data: [
      { dishId: dalBhatDish.id, name: 'Extra Rice', price: 50 },
      { dishId: dalBhatDish.id, name: 'Mutton Curry', price: 150 },
      { dishId: dalBhatDish.id, name: 'Chicken Curry', price: 100 },
      { dishId: dalBhatDish.id, name: 'Extra Papad', price: 20 },
    ],
    skipDuplicates: true,
  })

  const margheritaAddOnDish = italianDishes.find(d => d.slug === 'margherita-pizza')!
  await prisma.addOn.createMany({
    data: [
      { dishId: margheritaAddOnDish.id, name: 'Extra Cheese', price: 80 },
      { dishId: margheritaAddOnDish.id, name: 'Mushrooms', price: 60 },
      { dishId: margheritaAddOnDish.id, name: 'Olives', price: 60 },
      { dishId: margheritaAddOnDish.id, name: 'Jalapeños', price: 40 },
    ],
    skipDuplicates: true,
  })

  console.log('✅ Add-ons created')

  // ─── Venues ───────────────────────────────────────────────────────────────
  await Promise.all([
    prisma.venue.upsert({
      where: { slug: 'grand-banquet-hall' },
      update: {},
      create: {
        name: 'Grand Banquet Hall',
        slug: 'grand-banquet-hall',
        description: 'Our flagship venue for grand celebrations. Elegantly decorated with crystal chandeliers, a professional stage, and premium sound system. Perfect for weddings, receptions, and large corporate events.',
        capacity: 300,
        priceFrom: 50000,
        features: ['AC', 'Stage & Podium', 'Professional Sound System', 'LED Projection', 'Bridal Room', 'Valet Parking'],
        amenities: ['Wi-Fi', 'Microphones', 'Projector Screen', 'Backup Generator', 'Dedicated Catering Kitchen', 'Floral Decoration'],
        images: [
          'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200',
          'https://images.unsplash.com/photo-1478147427282-58a87a433128?w=1200',
        ],
        isActive: true,
      },
    }),
    prisma.venue.upsert({
      where: { slug: 'garden-venue' },
      update: {},
      create: {
        name: 'Garden Venue',
        slug: 'garden-venue',
        description: 'A romantic outdoor space surrounded by lush greenery, water fountains, and fairy lights. Ideal for intimate weddings, birthday celebrations, and garden parties.',
        capacity: 150,
        priceFrom: 25000,
        features: ['Open Air', 'Water Fountains', 'String Lights', 'Garden Bar', 'Dance Floor', 'Kids Zone Access'],
        amenities: ['Wi-Fi', 'Portable Sound System', 'Outdoor Heaters', 'Marquee Options', 'Natural Decor'],
        images: [
          'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200',
          'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200',
        ],
        isActive: true,
      },
    }),
    prisma.venue.upsert({
      where: { slug: 'executive-meeting-hall' },
      update: {},
      create: {
        name: 'Executive Meeting Hall',
        slug: 'executive-meeting-hall',
        description: 'A sophisticated meeting space equipped with state-of-the-art conferencing technology. Suitable for corporate meetings, seminars, training sessions, and board meetings.',
        capacity: 30,
        priceFrom: 8000,
        features: ['AC', '4K Projector', 'Video Conferencing', 'Whiteboard', 'Executive Chairs', 'High-Speed Wi-Fi'],
        amenities: ['Coffee & Tea Service', 'Stationery', 'Printing', 'Dedicated Receptionist', 'Catering Available'],
        images: [
          'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200',
          'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200',
        ],
        isActive: true,
      },
    }),
  ])

  console.log('✅ Venues created')

  // ─── Coupons ──────────────────────────────────────────────────────────────
  const futureDate = new Date()
  futureDate.setFullYear(futureDate.getFullYear() + 1)

  await Promise.all([
    prisma.coupon.upsert({
      where: { code: 'WELCOME10' },
      update: {},
      create: {
        code: 'WELCOME10',
        type: CouponType.PERCENTAGE,
        value: 10,
        minOrderValue: 500,
        maxDiscount: 200,
        usageLimit: 500,
        isActive: true,
        expiresAt: futureDate,
        description: 'Welcome offer! Get 10% off on your first order above Rs. 500',
      },
    }),
    prisma.coupon.upsert({
      where: { code: 'FLAT100' },
      update: {},
      create: {
        code: 'FLAT100',
        type: CouponType.FLAT,
        value: 100,
        minOrderValue: 300,
        maxDiscount: 100,
        usageLimit: 1000,
        isActive: true,
        expiresAt: futureDate,
        description: 'Get Rs. 100 flat discount on orders above Rs. 300',
      },
    }),
    prisma.coupon.upsert({
      where: { code: 'GARDEN20' },
      update: {},
      create: {
        code: 'GARDEN20',
        type: CouponType.PERCENTAGE,
        value: 20,
        minOrderValue: 800,
        maxDiscount: 500,
        usageLimit: 200,
        isActive: true,
        expiresAt: futureDate,
        description: 'Special garden dining offer: 20% off orders above Rs. 800',
      },
    }),
    prisma.coupon.upsert({
      where: { code: 'FESTIVAL50' },
      update: {},
      create: {
        code: 'FESTIVAL50',
        type: CouponType.FLAT,
        value: 50,
        minOrderValue: 200,
        isActive: false,
        description: 'Festival season special (inactive)',
      },
    }),
  ])

  console.log('✅ Coupons created')

  // ─── Testimonials ─────────────────────────────────────────────────────────
  await prisma.testimonial.createMany({
    data: [
      {
        name: 'Sunita Rai',
        role: 'Regular Customer',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
        rating: 5,
        content: 'Purple Haze has become our family\'s favourite restaurant in Biratnagar. The garden ambiance is stunning, and the Dal Bhat Thali is the best I\'ve had outside home. Highly recommend the momo — absolutely divine!',
        isActive: true,
        sortOrder: 1,
      },
      {
        name: 'Bikash Agarwal',
        role: 'Business Executive',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
        rating: 5,
        content: 'We hosted our company\'s annual dinner in the Grand Banquet Hall. The team was incredibly professional, food quality was exceptional, and the setup was impeccable. Will definitely book again for our next event!',
        isActive: true,
        sortOrder: 2,
      },
      {
        name: 'Mira Shrestha',
        role: 'Food Blogger',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
        rating: 5,
        content: 'The fusion menu at Purple Haze genuinely surprised me. From Newari Samay Baji to Italian Lasagna, everything is executed with care and precision. The Purple Haze Mocktail is an absolute must-order!',
        isActive: true,
        sortOrder: 3,
      },
      {
        name: 'Rohan Gurung',
        role: 'Frequent Visitor',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
        rating: 4,
        content: 'Great atmosphere, attentive service, and consistently good food. I especially love their Butter Chicken and the garden seating during evenings. A perfect place to unwind after a long day.',
        isActive: true,
        sortOrder: 4,
      },
      {
        name: 'Anita Pokhrel',
        role: 'Wedding Client',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200',
        rating: 5,
        content: 'Had our wedding reception at Purple Haze Garden Venue. The decorations were breathtaking, catering was superb, and our guests couldn\'t stop complimenting the venue. Made our special day truly magical!',
        isActive: true,
        sortOrder: 5,
      },
      {
        name: 'Dev Karmacharya',
        role: 'Corporate Client',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
        rating: 5,
        content: 'The Executive Meeting Hall is exactly what professional meetings need — well-equipped, quiet, and with great catering options. Purple Haze understands business hospitality perfectly.',
        isActive: true,
        sortOrder: 6,
      },
    ],
    skipDuplicates: true,
  })

  console.log('✅ Testimonials created')

  // ─── Gallery Images ────────────────────────────────────────────────────────
  await prisma.galleryImage.createMany({
    data: [
      {
        url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200',
        caption: 'Fine dining experience at Purple Haze',
        category: 'ambiance',
        sortOrder: 1,
        isActive: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=1200',
        caption: 'Traditional Nepali Dal Bhat Thali',
        category: 'food',
        sortOrder: 2,
        isActive: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200',
        caption: 'Grand Banquet Hall setup',
        category: 'banquet',
        sortOrder: 3,
        isActive: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200',
        caption: 'Beautiful garden venue at night',
        category: 'garden',
        sortOrder: 4,
        isActive: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=1200',
        caption: 'Wood-fired Margherita Pizza',
        category: 'food',
        sortOrder: 5,
        isActive: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=1200',
        caption: 'Rich Butter Chicken Curry',
        category: 'food',
        sortOrder: 6,
        isActive: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1478147427282-58a87a433128?w=1200',
        caption: 'Corporate event in our banquet hall',
        category: 'events',
        sortOrder: 7,
        isActive: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200',
        caption: 'Garden party under string lights',
        category: 'garden',
        sortOrder: 8,
        isActive: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=1200',
        caption: 'Asian fusion delights',
        category: 'food',
        sortOrder: 9,
        isActive: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=1200',
        caption: 'Dessert platter',
        category: 'food',
        sortOrder: 10,
        isActive: true,
      },
    ],
    skipDuplicates: true,
  })

  console.log('✅ Gallery images created')

  // ─── Settings ─────────────────────────────────────────────────────────────
  const settings = [
    { key: 'tax_rate', value: '13' }, // 13% VAT Nepal
    { key: 'delivery_fee_base', value: '50' },
    { key: 'delivery_fee_per_km', value: '20' },
    { key: 'delivery_free_above', value: '1000' },
    { key: 'opening_hours_sun_thu', value: '10:00-22:00' },
    { key: 'opening_hours_fri_sat', value: '10:00-23:00' },
    { key: 'restaurant_name', value: 'Purple Haze Restro & Garden' },
    { key: 'restaurant_tagline', value: 'Where Every Meal Tells a Story' },
    { key: 'restaurant_address', value: 'Airport Line / Airport Road, Biratnagar, Morang, Koshi Province, Nepal' },
    { key: 'restaurant_phone_1', value: '+977 21-464193' },
    { key: 'restaurant_phone_2', value: '021-465192' },
    { key: 'restaurant_phone_3', value: '+977 9852022202' },
    { key: 'restaurant_phone_4', value: '+977 9841537347' },
    { key: 'restaurant_email', value: 'info@purplehaze.com.np' },
    { key: 'facebook_url', value: 'https://fb.com/purplehaze.biratnagar' },
    { key: 'instagram_url', value: 'https://instagram.com/purplehaze.brt' },
    { key: 'min_order_delivery', value: '200' },
    { key: 'max_delivery_radius_km', value: '10' },
    { key: 'reservation_advance_days', value: '30' },
    { key: 'maintenance_mode', value: 'false' },
    { key: 'currency', value: 'NPR' },
    { key: 'currency_symbol', value: 'Rs.' },
  ]

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    })
  }

  console.log('✅ Settings created')

  // ─── Sample Orders (for dashboard charts) ─────────────────────────────────
  const allDishes = [
    ...nepaliDishes,
    ...indianDishes,
    ...chineseDishes,
    ...italianDishes,
    ...starterDishes,
    ...drinkDishes,
    ...dessertDishes,
  ]

  const statuses = [
    OrderStatus.COMPLETED,
    OrderStatus.COMPLETED,
    OrderStatus.COMPLETED,
    OrderStatus.DELIVERED,
    OrderStatus.DELIVERED,
    OrderStatus.PLACED,
    OrderStatus.CONFIRMED,
    OrderStatus.PREPARING,
    OrderStatus.CANCELLED,
  ]

  const orderTypes = [OrderType.DELIVERY, OrderType.DINE_IN, OrderType.PICKUP]
  const paymentMethods = [PaymentMethod.CASH_ON_DELIVERY, PaymentMethod.ESEWA, PaymentMethod.KHALTI]

  const customers = [customer1, customer2]

  for (let i = 0; i < 20; i++) {
    const daysAgo = Math.floor(Math.random() * 30)
    const orderDate = new Date()
    orderDate.setDate(orderDate.getDate() - daysAgo)

    const customer = customers[i % 2]
    const status = statuses[i % statuses.length]
    const orderType = orderTypes[i % 3]
    const dish1 = allDishes[i % allDishes.length]
    const dish2 = allDishes[(i + 3) % allDishes.length]

    const qty1 = Math.floor(Math.random() * 3) + 1
    const qty2 = Math.floor(Math.random() * 2) + 1
    const subtotal = dish1.price * qty1 + dish2.price * qty2
    const deliveryFee = orderType === OrderType.DELIVERY ? 50 : 0
    const tax = Math.round(subtotal * 0.13)
    const total = subtotal + deliveryFee + tax

    const orderNum = `PH${String(1000 + i).padStart(5, '0')}`

    try {
      const order = await prisma.order.create({
        data: {
          orderNumber: orderNum,
          userId: customer.id,
          orderType,
          status,
          subtotal,
          deliveryFee,
          taxAmount: tax,
          discountAmount: 0,
          totalAmount: total,
          notes: i % 5 === 0 ? 'Please add extra spice' : null,
          estimatedTime: 30,
          createdAt: orderDate,
          updatedAt: orderDate,
          items: {
            create: [
              {
                dishId: dish1.id,
                dishName: dish1.name,
                quantity: qty1,
                unitPrice: dish1.price,
                totalPrice: dish1.price * qty1,
              },
              {
                dishId: dish2.id,
                dishName: dish2.name,
                quantity: qty2,
                unitPrice: dish2.price,
                totalPrice: dish2.price * qty2,
              },
            ],
          },
          statusHistory: {
            create: [
              { status: OrderStatus.PLACED, createdAt: orderDate },
            ],
          },
        },
      })

      // Create payment for completed orders
      if (status === OrderStatus.COMPLETED || status === OrderStatus.DELIVERED) {
        await prisma.payment.create({
          data: {
            orderId: order.id,
            method: paymentMethods[i % 3],
            status: PaymentStatus.PAID,
            amount: total,
            paidAt: orderDate,
          },
        })
      } else {
        await prisma.payment.create({
          data: {
            orderId: order.id,
            method: paymentMethods[i % 3],
            status: status === OrderStatus.CANCELLED ? PaymentStatus.FAILED : PaymentStatus.PENDING,
            amount: total,
          },
        })
      }
    } catch (e) {
      // Skip duplicate order numbers
    }
  }

  console.log('✅ Sample orders created')

  // ─── Sample Reviews ────────────────────────────────────────────────────────
  await prisma.review.createMany({
    data: [
      {
        userId: customer1.id,
        dishId: nepaliDishes.find(d => d.slug === 'chicken-momo')!.id,
        rating: 5,
        comment: 'Best momos in Biratnagar! The jhol momo variant is exceptional. Will definitely order again.',
        isApproved: true,
      },
      {
        userId: customer2.id,
        dishId: indianDishes.find(d => d.slug === 'butter-chicken')!.id,
        rating: 5,
        comment: 'Creamy, rich, and perfectly spiced. The butter chicken here rivals any restaurant in Kathmandu!',
        isApproved: true,
      },
      {
        userId: customer1.id,
        dishId: italianDishes.find(d => d.slug === 'margherita-pizza')!.id,
        rating: 4,
        comment: 'Great thin crust pizza with fresh ingredients. The large size is very filling for two people.',
        isApproved: true,
      },
    ],
    skipDuplicates: true,
  })

  console.log('✅ Reviews created')

  // ─── Newsletter subscriptions ──────────────────────────────────────────────
  await prisma.newsletter.createMany({
    data: [
      { email: 'newsletter1@example.com' },
      { email: 'newsletter2@example.com' },
      { email: 'newsletter3@example.com' },
    ],
    skipDuplicates: true,
  })

  console.log('✅ Newsletter subscriptions created')

  console.log('\n🎉 Seed completed successfully!')
  console.log('\n📋 Login credentials:')
  console.log('  Admin: admin@purplehaze.com / Admin@123456')
  console.log('  Staff: staff@purplehaze.com / Staff@123456')
  console.log('  Customer: customer@example.com / Customer@123')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
