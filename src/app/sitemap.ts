import type { MetadataRoute } from 'next';
import { getProducts } from '@/lib/data';
import { SITE_URL } from '@/lib/site';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE_URL;
  const pages = ['', '/produits', '/services', '/a-propos', '/avis', '/consultation', '/contact', '/mentions-legales', '/confidentialite'];
  const products = await getProducts();
  return [
    ...pages.map((p) => ({ url: `${base}${p}`, changeFrequency: 'weekly' as const, priority: p === '' ? 1 : 0.7 })),
    ...products.map((p) => ({ url: `${base}/produits/${p.slug}`, changeFrequency: 'monthly' as const, priority: 0.6 })),
  ];
}
