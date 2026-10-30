import type { Metadata } from 'next';
import { isSupabaseConfigured } from '@/lib/supabase/server';
import LoginForm from './LoginForm';

export const metadata: Metadata = { title: 'Connexion admin', robots: { index: false, follow: false } };

const ERRORS: Record<string, string> = {
  config: "La base de données n'est pas encore branchée (variables Supabase manquantes sur Vercel).",
  droits: "Ce compte n'a pas les droits d'administration.",
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ e?: string }> }) {
  const { e } = await searchParams;
  const err = e ? ERRORS[e] : !isSupabaseConfigured ? ERRORS.config : '';
  return (
    <div className="login-wrap">
      <div className="login-card">
        <p className="brand-text" style={{ marginBottom: '.3rem' }}>
          Pur<span>'</span>Essence
        </p>
        <h1 style={{ fontSize: '1.3rem', marginBottom: '1.2rem' }}>Espace administration</h1>
        {err && <div className="form-msg err">{err}</div>}
        <LoginForm disabled={!isSupabaseConfigured} />
      </div>
    </div>
  );
}
