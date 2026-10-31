import { cache } from 'react';
import { createSupabasePublic, isSupabaseConfigured } from './supabase/server';
import { seedProducts } from '@/data/seed-products';
import type { Certification, Faq, Product, Result, Review, Settings, TeamMember } from './types';
import { seedCertifications, seedResults, seedReviews, seedTeam } from '@/data/seed-content';

export const DEFAULT_SETTINGS: Settings = {
  phone_cm: '+237 6 50 82 67 38',
  whatsapp_cm: '237650826738',
  phone_ca: '',
  whatsapp_ca: '',
  email: 'pur.essencebio2000@gmail.com',
  address: 'Mimboman, Yaoundé, Cameroun',
  address_ca: '',
  hours: 'Lundi – Vendredi : 08h00 – 18h00 · Samedi : 09h00 – 15h00 · Dimanche : fermé',
  instagram: '',
  facebook: '',
  tiktok: '',
  stat_satisfaction: '98',
  stat_consultations: '500',
  stat_clients: '1000',
  order_info: '',
};

const SEED_FAQS: Faq[] = [
  { id: 'f1', question: 'Combien de temps dure une consultation ?', answer: 'Une consultation dure en moyenne 30 à 45 minutes.', published: true, sort: 0 },
  { id: 'f2', question: 'Puis-je consulter à distance ?', answer: 'Oui, par appel téléphonique ou appel vidéo WhatsApp.', published: true, sort: 1 },
  { id: 'f3', question: 'Les huiles essentielles sont-elles sans danger ?', answer: "Ce sont des produits très concentrés : ils doivent être dilués et utilisés avec précaution.", published: true, sort: 2 },
];

export const getSettings = cache(async (): Promise<Settings> => {
  if (!isSupabaseConfigured) return DEFAULT_SETTINGS;
  const { data, error } = await createSupabasePublic().from('settings').select('key,value');
  if (error || !data) return DEFAULT_SETTINGS;
  const s = { ...DEFAULT_SETTINGS } as Record<string, string>;
  for (const row of data) if (row.key in s) s[row.key] = row.value ?? '';
  return s as Settings;
});

/** Champs utiles aux listes (catalogue, cartes) : sans la fiche complète, trop lourde à envoyer au navigateur. */
const LIST_COLUMNS =
  'id,slug,name,short,category,usage,price_fcfa,volume,image_url,in_stock,featured,published,sort,latin_name,sizes,domain';

function toListItem(p: Product): Product {
  return { ...p, description: '', benefits: [], usage_tips: '', precautions: null, identity: null, fiche: null, english_name: null, origin: null };
}

export const getProducts = cache(async (): Promise<Product[]> => {
  if (!isSupabaseConfigured) return seedProducts.filter((p) => p.published).map(toListItem);
  const { data, error } = await createSupabasePublic()
    .from('products')
    .select(LIST_COLUMNS)
    .eq('published', true)
    .order('sort', { ascending: true })
    .order('name', { ascending: true });
  if (error || !data) return [];
  return (data as unknown as Product[]).map((p) => toListItem({ ...p } as Product));
});

/** Produit complet (fiche incluse) pour sa page. */
export const getProduct = cache(async (slug: string): Promise<Product | null> => {
  if (!isSupabaseConfigured) return seedProducts.find((p) => p.slug === slug && p.published) ?? null;
  const { data } = await createSupabasePublic().from('products').select('*').eq('slug', slug).eq('published', true).maybeSingle();
  return (data as Product) ?? null;
});

export async function getApprovedReviews(limit = 60): Promise<Review[]> {
  if (!isSupabaseConfigured) return seedReviews.slice(0, limit);
  const { data } = await createSupabasePublic()
    .from('reviews')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(limit);
  return (data as Review[]) ?? [];
}

export async function getTeam(): Promise<TeamMember[]> {
  if (!isSupabaseConfigured) return seedTeam;
  const { data } = await createSupabasePublic().from('team').select('*').eq('published', true).order('sort');
  return (data as TeamMember[]) ?? [];
}

export async function getFaqs(): Promise<Faq[]> {
  if (!isSupabaseConfigured) return SEED_FAQS;
  const { data } = await createSupabasePublic().from('faqs').select('*').eq('published', true).order('sort');
  return (data as Faq[]) ?? [];
}

export async function getCertifications(): Promise<Certification[]> {
  if (!isSupabaseConfigured) return seedCertifications;
  const { data } = await createSupabasePublic().from('certifications').select('*').eq('published', true).order('sort');
  return (data as Certification[]) ?? [];
}

export async function getResults(): Promise<Result[]> {
  if (!isSupabaseConfigured) return seedResults;
  const { data } = await createSupabasePublic().from('results').select('*').eq('published', true).order('sort');
  return (data as Result[]) ?? [];
}
