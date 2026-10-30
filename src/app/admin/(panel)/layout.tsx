import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/admin';
import AdminNav from './AdminNav';
import { logout } from '../actions';

export const metadata: Metadata = { title: 'Admin', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const { supabase, user } = await requireAdmin();
  const [{ count: pendingReviews }, { count: newRequests }] = await Promise.all([
    supabase.from('reviews').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('requests').select('id', { count: 'exact', head: true }).eq('status', 'nouveau'),
  ]);

  return (
    <div className="admin-body">
      <div className="admin-shell">
        <aside className="admin-side">
          <span className="brand-text">
            Pur<span>'</span>Essence
          </span>
          <AdminNav counts={{ avis: pendingReviews ?? 0, demandes: newRequests ?? 0 }} />
          <div className="side-bottom">
            <a href="/" target="_blank" rel="noopener">
              Voir le site ↗
            </a>
            <span className="small" style={{ opacity: 0.6, padding: '0 .8rem', wordBreak: 'break-all' }}>
              {user.email}
            </span>
            <form action={logout}>
              <button type="submit">Se déconnecter</button>
            </form>
          </div>
        </aside>
        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
}
