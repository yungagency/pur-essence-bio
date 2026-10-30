'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createSupabaseServer } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/admin';
import { slugify } from '@/lib/format';
import { SETTING_LABELS } from '@/lib/types';

const s = (fd: FormData, k: string) => {
  const v = fd.get(k);
  return typeof v === 'string' ? v.trim() : '';
};
const bool = (fd: FormData, k: string) => fd.get(k) === 'on';
const int = (fd: FormData, k: string) => {
  const v = s(fd, k).replace(/\s/g, '');
  if (v === '') return null;
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) && n >= 0 ? n : null;
};

function refreshSite() {
  revalidatePath('/', 'layout');
}

/* ---------------- Connexion ---------------- */
export async function login(_prev: { error?: string } | null, fd: FormData): Promise<{ error?: string } | null> {
  const supabase = await createSupabaseServer();
  const { error } = await supabase.auth.signInWithPassword({ email: s(fd, 'email'), password: s(fd, 'password') });
  if (error) return { error: 'Email ou mot de passe incorrect.' };
  redirect('/admin');
}

export async function logout() {
  const supabase = await createSupabaseServer();
  await supabase.auth.signOut();
  redirect('/admin/login');
}

/* ---------------- Images ---------------- */
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];

async function uploadImage(supabase: Awaited<ReturnType<typeof createSupabaseServer>>, file: FormDataEntryValue | null, folder: string) {
  if (!(file instanceof File) || file.size === 0) return null;
  if (!ALLOWED.includes(file.type)) throw new Error('Image refusée : formats acceptés JPG, PNG ou WebP.');
  if (file.size > 5 * 1024 * 1024) throw new Error('Image trop lourde (5 Mo maximum).');
  const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from('media').upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw new Error("L'envoi de l'image a échoué.");
  return supabase.storage.from('media').getPublicUrl(path).data.publicUrl;
}

/* ---------------- Produits ---------------- */
export async function saveProduct(_prev: { error?: string } | null, fd: FormData): Promise<{ error?: string } | null> {
  const { supabase } = await requireAdmin();
  const id = s(fd, 'id');
  const name = s(fd, 'name');
  if (!name) return { error: 'Le nom est obligatoire.' };
  const slug = slugify(s(fd, 'slug') || name);

  let image_url: string | null = s(fd, 'image_url') || null;
  try {
    const uploaded = await uploadImage(supabase, fd.get('image'), 'produits');
    if (uploaded) image_url = uploaded;
  } catch (e) {
    return { error: (e as Error).message };
  }

  const row = {
    name,
    slug,
    short: s(fd, 'short'),
    description: s(fd, 'description'),
    benefits: s(fd, 'benefits')
      .split('\n')
      .map((b) => b.trim())
      .filter(Boolean),
    usage_tips: s(fd, 'usage_tips'),
    precautions: s(fd, 'precautions') || null,
    category: s(fd, 'category') || 'huile-essentielle',
    usage: s(fd, 'usage') || 'sante',
    price_fcfa: int(fd, 'price_fcfa'),
    volume: s(fd, 'volume') || null,
    image_url,
    in_stock: bool(fd, 'in_stock'),
    featured: bool(fd, 'featured'),
    published: bool(fd, 'published'),
    sort: int(fd, 'sort') ?? 0,
  };

  const { error } = id
    ? await supabase.from('products').update(row).eq('id', id)
    : await supabase.from('products').insert(row);
  if (error) {
    return { error: error.code === '23505' ? 'Ce lien (slug) est déjà utilisé par un autre produit.' : `Erreur : ${error.message}` };
  }
  refreshSite();
  redirect('/admin/produits?ok=1');
}

export async function deleteProduct(fd: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from('products').delete().eq('id', s(fd, 'id'));
  refreshSite();
  redirect('/admin/produits');
}

export async function toggleProduct(fd: FormData) {
  const { supabase } = await requireAdmin();
  const field = s(fd, 'field');
  if (!['published', 'in_stock', 'featured'].includes(field)) return;
  await supabase.from('products').update({ [field]: s(fd, 'value') === 'true' }).eq('id', s(fd, 'id'));
  refreshSite();
  revalidatePath('/admin/produits');
}

/* ---------------- Avis ---------------- */
export async function setReviewStatus(fd: FormData) {
  const { supabase } = await requireAdmin();
  const status = s(fd, 'status');
  if (!['pending', 'approved', 'rejected'].includes(status)) return;
  await supabase.from('reviews').update({ status }).eq('id', s(fd, 'id'));
  refreshSite();
  revalidatePath('/admin', 'layout');
}

export async function deleteReview(fd: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from('reviews').delete().eq('id', s(fd, 'id'));
  refreshSite();
  revalidatePath('/admin', 'layout');
}

/* ---------------- Demandes ---------------- */
export async function updateRequest(fd: FormData) {
  const { supabase } = await requireAdmin();
  const status = s(fd, 'status');
  const patch: Record<string, string | null> = {};
  if (['nouveau', 'en_cours', 'traite', 'archive'].includes(status)) patch.status = status;
  if (fd.has('admin_note')) patch.admin_note = s(fd, 'admin_note') || null;
  await supabase.from('requests').update(patch).eq('id', s(fd, 'id'));
  revalidatePath('/admin', 'layout');
}

export async function deleteRequest(fd: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from('requests').delete().eq('id', s(fd, 'id'));
  revalidatePath('/admin', 'layout');
}

/* ---------------- Équipe ---------------- */
export async function saveTeamMember(fd: FormData) {
  const { supabase } = await requireAdmin();
  const id = s(fd, 'id');
  let photo_url: string | null = s(fd, 'photo_url') || null;
  try {
    const up = await uploadImage(supabase, fd.get('photo'), 'equipe');
    if (up) photo_url = up;
  } catch {
    // image invalide : on garde l'ancienne
  }
  const row = { name: s(fd, 'name'), role: s(fd, 'role'), photo_url, published: bool(fd, 'published'), sort: int(fd, 'sort') ?? 0 };
  if (!row.name) return;
  if (id) await supabase.from('team').update(row).eq('id', id);
  else await supabase.from('team').insert(row);
  refreshSite();
  revalidatePath('/admin/equipe');
}

export async function deleteTeamMember(fd: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from('team').delete().eq('id', s(fd, 'id'));
  refreshSite();
  revalidatePath('/admin/equipe');
}

/* ---------------- FAQ ---------------- */
export async function saveFaq(fd: FormData) {
  const { supabase } = await requireAdmin();
  const id = s(fd, 'id');
  const row = { question: s(fd, 'question'), answer: s(fd, 'answer'), published: bool(fd, 'published'), sort: int(fd, 'sort') ?? 0 };
  if (!row.question || !row.answer) return;
  if (id) await supabase.from('faqs').update(row).eq('id', id);
  else await supabase.from('faqs').insert(row);
  refreshSite();
  revalidatePath('/admin/faq');
}

export async function deleteFaq(fd: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from('faqs').delete().eq('id', s(fd, 'id'));
  refreshSite();
  revalidatePath('/admin/faq');
}

/* ---------------- Réglages ---------------- */
export async function saveSettings(fd: FormData) {
  const { supabase } = await requireAdmin();
  const rows = Object.keys(SETTING_LABELS).map((key) => {
    let value = s(fd, key);
    if (key.startsWith('whatsapp_') || key.startsWith('stat_')) value = value.replace(/\D/g, '');
    return { key, value };
  });
  await supabase.from('settings').upsert(rows);
  refreshSite();
  redirect('/admin/reglages?ok=1');
}

/* ---------------- Labels / certifications ---------------- */
export async function saveCertification(fd: FormData) {
  const { supabase } = await requireAdmin();
  const id = s(fd, 'id');
  const row = { label: s(fd, 'label'), icon: s(fd, 'icon') || 'fa-certificate', published: bool(fd, 'published'), sort: int(fd, 'sort') ?? 0 };
  if (!row.label) return;
  if (id) await supabase.from('certifications').update(row).eq('id', id);
  else await supabase.from('certifications').insert(row);
  refreshSite();
  revalidatePath('/admin/confiance');
}

export async function deleteCertification(fd: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from('certifications').delete().eq('id', s(fd, 'id'));
  refreshSite();
  revalidatePath('/admin/confiance');
}

/* ---------------- Résultats avant / après ---------------- */
export async function saveResult(fd: FormData) {
  const { supabase } = await requireAdmin();
  const id = s(fd, 'id');
  let before_url: string | null = s(fd, 'before_url_old') || null;
  let after_url: string | null = s(fd, 'after_url_old') || null;
  try {
    before_url = (await uploadImage(supabase, fd.get('before'), 'resultats')) ?? before_url;
    after_url = (await uploadImage(supabase, fd.get('after'), 'resultats')) ?? after_url;
  } catch {
    // image invalide : on garde les anciennes
  }
  const row = { title: s(fd, 'title'), text: s(fd, 'text'), before_url, after_url, published: bool(fd, 'published'), sort: int(fd, 'sort') ?? 0 };
  if (!row.title) return;
  if (id) await supabase.from('results').update(row).eq('id', id);
  else await supabase.from('results').insert(row);
  refreshSite();
  revalidatePath('/admin/confiance');
}

export async function deleteResult(fd: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from('results').delete().eq('id', s(fd, 'id'));
  refreshSite();
  revalidatePath('/admin/confiance');
}
