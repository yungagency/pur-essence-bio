import { redirect } from 'next/navigation';
import { createSupabaseServer, isSupabaseConfigured } from './supabase/server';

/**
 * Vérifie que la personne connectée est administratrice.
 * La vraie protection est en base (RLS + is_admin) : ceci évite seulement d'afficher l'admin à un non-admin.
 */
export async function requireAdmin() {
  if (!isSupabaseConfigured) redirect('/admin/login?e=config');
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');
  const { data: ok } = await supabase.rpc('is_admin');
  if (!ok) redirect('/admin/login?e=droits');
  return { supabase, user };
}
