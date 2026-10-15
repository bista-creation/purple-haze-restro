import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'
import { QueryProvider } from '@/components/providers/QueryProvider'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { AiChatbot } from '@/components/chat/AiChatbot'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'Purple Haze Restro & Garden | Biratnagar',
    template: '%s | Purple Haze Restro & Garden',
  },
  description:
    'Purple Haze Restro & Garden — a premier dining destination in Biratnagar offering authentic Nepali, Indian, Chinese, and Italian cuisine in an elegant garden setting. Book your table or order online.',
  keywords: [
    'restaurant Biratnagar',
    'Purple Haze restaurant',
    'best restaurant Biratnagar',
    'garden restaurant Nepal',
    'Nepali food',
    'Indian food Biratnagar',
    'banquet hall Biratnagar',
    'event venue Morang',
    'online food order Biratnagar',
    'wedding venue Koshi',
  ],
  authors: [{ name: 'Purple Haze Restro & Garden' }],
  creator: 'Purple Haze Restro & Garden',
  publisher: 'Purple Haze Restro & Garden',
  openGraph: {
    type: 'website',
    locale: 'en_NP',
    url: APP_URL,
    siteName: 'Purple Haze Restro & Garden',
    title: 'Purple Haze Restro & Garden | Biratnagar, Nepal',
    description:
      'Fusion dining in Biratnagar — Nepali, Indian, Chinese & Italian cuisine in a stunning garden setting. Online ordering, event bookings, and table reservations.',
    images: [
      {
        url: `${APP_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Purple Haze Restro & Garden — Biratnagar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Purple Haze Restro & Garden | Biratnagar',
    description: 'Fusion dining in Biratnagar — Nepali, Indian, Chinese & Italian cuisine.',
    images: [`${APP_URL}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#5B21B6' },
    { media: '(prefers-color-scheme: dark)', color: '#1A1025' },
  ],
}

const restaurantJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: 'Purple Haze Restro & Garden',
  description:
    'A premier fusion dining destination in Biratnagar offering Nepali, Indian, Chinese, and Italian cuisine.',
  url: APP_URL,
  telephone: ['+977 21-464193', '+977 9852022202'],
  priceRange: '$$',
  servesCuisine: ['Nepali', 'Indian', 'Chinese', 'Italian'],
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Airport Line / Airport Road',
    addressLocality: 'Biratnagar',
    addressRegion: 'Morang',
    addressCountry: 'NP',
    postalCode: '56700',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '26.4521',
    longitude: '87.2690',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
      opens: '10:00',
      closes: '22:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Friday', 'Saturday'],
      opens: '10:00',
      closes: '23:00',
    },
  ],
  hasMap: 'https://maps.google.com/?q=Purple+Haze+Restro+Garden+Biratnagar',
  sameAs: [
    'https://fb.com/purplehaze.biratnagar',
    'https://instagram.com/purplehaze.brt',
  ],
  image: `${APP_URL}/og-image.jpg`,
  menu: `${APP_URL}/menu`,
  acceptsReservations: true,
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Menu',
    url: `${APP_URL}/menu`,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd) }}
        />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            <QueryProvider>
              {children}
              <AiChatbot />
              <Toaster
                position="top-right"
                richColors
                closeButton
                toastOptions={{
                  duration: 4000,
                  classNames: {
                    toast: 'font-body rounded-xl shadow-brand',
                    title: 'font-semibold',
                  },
                }}
              />
            </QueryProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
