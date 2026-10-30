import { cache } from 'react';
import { createSupabasePublic, isSupabaseConfigured } from './supabase/server';
import { seedProducts } from '@/data/seed-products';
import type { Faq, Product, Review, Settings, TeamMember } from './types';

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
};

const SEED_FAQS: Faq[] = [
  { id: 'f1', question: 'Combien de temps dure une consultation ?', answer: 'Une consultation dure en moyenne 30 à 45 minutes.', published: true, sort: 0 },
  { id: 'f2', question: 'Puis-je consulter à distance ?', answer: 'Oui, par appel téléphonique ou appel vidéo WhatsApp.', published: true, sort: 1 },
  { id: 'f3', question: 'Les huiles essentielles sont-elles sans danger ?', answer: "Ce sont des produits très concentrés : ils doivent être dilués et utilisés avec précaution. Nos conseils ne remplacent pas l'avis d'un médecin.", published: true, sort: 2 },
];

export const getSettings = cache(async (): Promise<Settings> => {
  if (!isSupabaseConfigured) return DEFAULT_SETTINGS;
  const { data, error } = await createSupabasePublic().from('settings').select('key,value');
  if (error || !data) return DEFAULT_SETTINGS;
  const s = { ...DEFAULT_SETTINGS } as Record<string, string>;
  for (const row of data) if (row.key in s) s[row.key] = row.value ?? '';
  return s as Settings;
});

export const getProducts = cache(async (): Promise<Product[]> => {
  if (!isSupabaseConfigured) return seedProducts;
  const { data, error } = await createSupabasePublic()
    .from('products')
    .select('*')
    .eq('published', true)
    .order('sort', { ascending: true })
    .order('name', { ascending: true });
  if (error || !data) return [];
  return data as Product[];
});

export async function getProduct(slug: string): Promise<Product | null> {
  const all = await getProducts();
  return all.find((p) => p.slug === slug) ?? null;
}

export async function getApprovedReviews(limit = 60): Promise<Review[]> {
  if (!isSupabaseConfigured) return [];
  const { data } = await createSupabasePublic()
    .from('reviews')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(limit);
  return (data as Review[]) ?? [];
}

export async function getTeam(): Promise<TeamMember[]> {
  if (!isSupabaseConfigured) return [{ id: 't1', name: 'M. AWAWO William', role: 'PDG', photo_url: null, published: true, sort: 0 }];
  const { data } = await createSupabasePublic().from('team').select('*').eq('published', true).order('sort');
  return (data as TeamMember[]) ?? [];
}

export async function getFaqs(): Promise<Faq[]> {
  if (!isSupabaseConfigured) return SEED_FAQS;
  const { data } = await createSupabasePublic().from('faqs').select('*').eq('published', true).order('sort');
  return (data as Faq[]) ?? [];
}
