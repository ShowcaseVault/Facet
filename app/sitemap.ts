import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()
  
  // Fetch all users with public profiles
  const { data: users } = await supabase
    .from('users')
    .select('username')
    .not('username', 'is', null)
  
  const userUrls = users?.map((user) => ({
    url: `https://facet-one.vercel.app/${user.username}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  })) || []

  return [
    {
      url: 'https://facet-one.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: 'https://facet-one.vercel.app/login',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    ...userUrls,
  ]
}
