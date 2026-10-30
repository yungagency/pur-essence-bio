import type { MetadataRoute } from 'next';
import { getProducts } from '@/lib/data';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://pur-essence.vercel.app';
  const pages = ['', '/produits', '/services', '/a-propos', '/avis', '/consultation', '/contact', '/mentions-legales'];
  const products = await getProducts();
  return [
    ...pages.map((p) => ({ url: `${base}${p}`, changeFrequency: 'weekly' as const, priority: p === '' ? 1 : 0.7 })),
    ...products.map((p) => ({ url: `${base}/produits/${p.slug}`, changeFrequency: 'monthly' as const, priority: 0.6 })),
  ];
}
