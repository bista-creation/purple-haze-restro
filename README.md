# Purple Haze Restro & Garden — Production Web & Ordering Platform

> **Biratnagar's Premier Multi-Cuisine Restro, Open Garden & Grand Banquet Platform**  
> Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, Prisma ORM, Auth.js, and Zustand.

---

## 🏛️ About the Business

- **Name:** Purple Haze Restro & Garden
- **Location:** Airport Line, Airport Road, Biratnagar - 4, Morang, Koshi Province, Nepal
- **Contact:** +977 21-464193, 021-465192 | Mobile: +977 9852022202, +977 9841537347
- **Facebook:** [fb.com/purplehaze.biratnagar](https://www.facebook.com/purplehaze.biratnagar) (5,140+ followers)
- **Instagram:** `@purplehaze.brt`
- **Cuisines:** Nepali (Thakali, Newari, Momos), Indian (Butter Chicken, Biryani), Chinese (Chowmein, Chilli Paneer), Italian (Wood-Fired Pizza, Pasta)
- **Facilities:**
  1. **Royal Heritage Banquet Hall** (350+ guests capacity, weddings & receptions)
  2. **Lush Open Garden & Water Fountains Area** (250+ capacity, live music, fairy lights)
  3. **Executive Corporate Meeting Suite** (45 capacity, board meetings, AV system)

---

## ⚡ Tech Stack & Architecture

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling & UI:** Tailwind CSS, shadcn/ui primitives, Radix UI
- **Design Tokens:** Deep Royal Purple (`#5B21B6`), Warm Gold (`#F5B942`), Soft Lavender (`#EDE9FE`), Charcoal Dark (`#1A1025`)
- **Typography:** Playfair Display (Headings) + Inter (Body)
- **Database:** PostgreSQL with Prisma ORM (Neon / Supabase ready; SQLite for local dev)
- **Authentication:** Auth.js v5 (NextAuth) with email/password bcrypt and Google OAuth; Role-based access (`CUSTOMER`, `STAFF`, `ADMIN`)
- **State Management:** Zustand for Cart (persisted in `localStorage` + synced to database)
- **Validation:** Zod schemas + React Hook Form
- **Payment Integrations:**
  - Cash on Delivery (COD) / Fonepay QR — 100% functional
  - eSewa Mobile Wallet (Sandbox configured)
  - Khalti Digital Wallet (Sandbox configured)
- **SEO & PWA:** Metadata, Open Graph, Sitemap.xml, Robots.txt, JSON-LD Schema.org Restaurant markup, PWA manifest

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js 18+ (tested on v20.18 LTS)
- npm or pnpm or bun

### 2. Installation
```bash
git clone <repo-url> purple-haze-restro
cd purple-haze-restro

# Install dependencies
npm install --legacy-peer-deps
```

### 3. Environment Setup
Copy the example environment file:
```bash
cp .env.example .env.local
```

Configure your `.env.local`:
```env
DATABASE_URL="postgresql://username:password@ep-host.neon.tech/purplehaze?sslmode=require"
AUTH_SECRET="your-32-character-secret-key"
AUTH_URL="http://localhost:3000"

NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Purple Haze Restro & Garden"
```

### 4. Database Setup & Seeding
```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Run seed script (loads Nepali, Indian, Chinese, Italian dishes, venues, reviews, and admin)
npm run db:seed
```

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Default Credentials (Seed Data)

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **Admin** | `admin@purplehaze.com` | `Admin@123456` | Full Admin Console (`/admin`) |
| **Kitchen Staff** | `staff@purplehaze.com` | `Staff@123456` | Live Orders Queue & Status |
| **Customer** | `customer@purplehaze.com` | `Customer@123456` | Ordering, History, Profile |

*(You can also click the quick-autofill buttons on `/login` to test each role with 1 click)*

---

## 📱 Public Pages & Features

1. **Home (`/`)**:
   - Full-bleed hero banner with brand tagline and dual CTA ("Order Online" & "Book Event")
   - 4-Cuisines showcase with category counts
   - Signature & bestselling dishes with quick add-to-cart
   - 3 Venue previews (Banquet, Garden, Meeting suite)
   - Promotional coupons with 1-click clipboard copy
   - Real diner reviews from Biratnagar patrons
   - Airport Line location, opening hours, WhatsApp quick chat, and Google Map

2. **Digital Menu (`/menu`)**:
   - Live real-time search across names, ingredients, and tags
   - Pure Veg / Non-Veg filter toggle
   - Spicy level meter (Mild to Hot)
   - Category tabs (Nepali, Indian, Chinese, Italian, Beverages)
   - Customization modal (portion size, extra ghee, extra achar, cheese burst, special notes)

3. **Venues & Events (`/events`)**:
   - Detailed specifications of Royal Heritage Banquet, Open Garden, and Corporate Conference suite
   - Capacity indicators, photo galleries, starting prices
   - Online Event Booking & Quotation Request form with automated reference codes

4. **Table Reservations (`/reservations`)**:
   - Direct online reservation for Open Garden, Indoor AC hall, Gazebo Cabanas, or Family Lounge
   - Date, time slot, and guest count selector

5. **Cart & Checkout (`/cart`, `/checkout`)**:
   - Slide-out MiniCart from anywhere on the site + full Cart page
   - Order types: Doorstep Delivery, Restaurant Takeaway, Dine-In table
   - Biratnagar delivery zone selector (Core Airport Line, Roadcess, Rani, Kanchanbari)
   - Promo code validation (e.g. `PURPLE10`, `FLAT100`, `GARDENFEAST`)
   - Payment method selector (Cash on Delivery, eSewa, Khalti)

6. **Order Confirmation & Live Tracker (`/order-confirmation/[id]`, `/track-order`)**:
   - Printable kitchen ticket and itemized customer invoice
   - Live status pipeline: `Placed` → `Confirmed` → `Preparing` → `Out for Delivery` → `Delivered`
   - Real-time status simulation button for demo
   - Post-delivery 5-star rating & review prompt

7. **About & Gallery (`/about`, `/gallery`)**:
   - Biratnagar origin story, milestones timeline, chef profiles
   - Filterable photo gallery with full-screen lightbox modal

---

## 🛡️ Admin Dashboard (`/admin`) Guide for the Owner

The Admin Portal is available at `/admin` (accessible by logging in with `admin@purplehaze.com`):

1. **Overview Dashboard (`/admin`)**:
   - Real-time revenue, orders count, pending kitchen tickets
   - 7-day revenue performance visualizer in NPR
   - Top-selling dishes breakdown by volume and revenue
   - Quick one-click status buttons on recent orders

2. **Live Orders Queue (`/admin/orders`)**:
   - View orders by status: `Placed`, `Preparing`, `Ready`, `Out for Delivery`, `Delivered`
   - Filter by delivery, takeaway, or dine-in
   - Audio bell alert toggle for incoming orders
   - Print instant kitchen ticket / dispatch slip

3. **Menu & Dishes (`/admin/menu`)**:
   - Toggle dish availability (`Available` vs `Sold Out`) with 1 click
   - Mark dishes as Bestseller / Chef's Recommendation
   - Add new dishes with price, description, veg/non-veg flag, and portion sizes

4. **Events & Venues (`/admin/events`)**:
   - Review incoming banquet and garden party inquiries
   - Approve, schedule, or decline customer requests with 1 click

5. **Coupons & Marketing (`/admin/promotions`)**:
   - Create new promo codes (Percentage or Flat NPR)
   - Set minimum order values and maximum discount caps

6. **Customer Directory (`/admin/customers`)**:
   - View customer order counts, lifetime spend in NPR, and block/unblock controls

7. **Restaurant Settings (`/admin/settings`)**:
   - Update phone numbers, opening hours, and address
   - Configure Biratnagar delivery zone fees (Airport Line, Roadcess, Rani)
   - Enable or disable payment gateways (COD, eSewa, Khalti)

---

## 🌐 Deployment to Vercel

1. Push your repository to GitHub / GitLab.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import the repository.
4. Under **Environment Variables**, add all keys from `.env.example`:
   - `DATABASE_URL` (from Neon / Supabase PostgreSQL)
   - `AUTH_SECRET`
   - `NEXT_PUBLIC_APP_URL` (your custom domain or vercel.app domain)
5. Click **Deploy**. Vercel will build and launch your production application with automatic SSL and global CDN distribution.
