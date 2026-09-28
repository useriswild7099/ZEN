import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://zenguard.ai';
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];
}
