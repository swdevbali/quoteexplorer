import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  
  // Get all quotes for individual quote pages
  const supabase = createClient()
  const { data: quotes } = await supabase
    .from('quotes')
    .select('id, created_at, updated_at')
    .limit(1000) // Limit to prevent too large sitemaps

  // Get unique categories
  const { data: categoriesData } = await supabase
    .from('quotes')
    .select('category')
    .not('category', 'is', null)
    
  const uniqueCategories = [...new Set(categoriesData?.map(q => q.category) || [])]

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ]

  // Add category pages
  const categoryPages: MetadataRoute.Sitemap = uniqueCategories.map(category => ({
    url: `${baseUrl}/?category=${encodeURIComponent(category)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // Add individual quote pages
  const quotePages: MetadataRoute.Sitemap = quotes?.map(quote => ({
    url: `${baseUrl}/quote/${quote.id}`,
    lastModified: new Date(quote.updated_at || quote.created_at),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  })) || []

  return [...staticPages, ...categoryPages, ...quotePages]
}