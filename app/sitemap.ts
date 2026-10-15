import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://purplehazerestro.com'

  const routes = [
    '',
    '/menu',
    '/events',
    '/reservations',
    '/about',
    '/gallery',
    '/contact',
    '/track-order',
    '/cart',
    '/checkout',
    '/login',
    '/register',
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '/menu' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : route === '/menu' ? 0.9 : 0.8,
  }))
}
