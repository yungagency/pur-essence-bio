import Link from 'next/link';
import { requireAdmin } from '@/lib/admin';
import { formatDate } from '@/lib/format';
import type { RequestRow } from '@/lib/types';

export default async function Dashboard() {
  const { supabase } = await requireAdmin();
  const [products, noPrice, pending, newReq, latest] = await Promise.all([
    supabase.from('products').select('id', { count: 'exact', head: true }),
    supabase.from('products').select('id', { count: 'exact', head: true }).is('price_fcfa', null),
    supabase.from('reviews').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('requests').select('id', { count: 'exact', head: true }).eq('status', 'nouveau'),
    supabase.from('requests').select('*').order('created_at', { ascending: false }).limit(6),
  ]);
  const rows = (latest.data as RequestRow[]) ?? [];

  return (
    <>
      <h1>Tableau de bord</h1>
      <p className="sub">Vue d'ensemble de Pur'Essence.</p>
      <div className="kpis">
        <Link href="/admin/demandes?statut=nouveau" className="kpi">
          <b>{newReq.count ?? 0}</b>
          <span>Nouvelles demandes</span>
        </Link>
        <Link href="/admin/avis" className="kpi">
          <b>{pending.count ?? 0}</b>
          <span>Avis à modérer</span>
        </Link>
        <Link href="/admin/produits" className="kpi">
          <b>{products.count ?? 0}</b>
          <span>Produits</span>
        </Link>
        <Link href="/admin/produits?filtre=sans-prix" className="kpi">
          <b>{noPrice.count ?? 0}</b>
          <span>Produits sans prix</span>
        </Link>
      </div>

      <div className="panel">
        <div className="admin-head">
          <h2 style={{ fontSize: '1.1rem' }}>Dernières demandes</h2>
          <Link href="/admin/demandes" className="btn">
            Tout voir
          </Link>
        </div>
        {rows.length === 0 ? (
          <p className="muted">Aucune demande pour le moment.</p>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td>{formatDate(r.created_at)}</td>
                    <td>{r.kind}</td>
                    <td>
                      <strong>{r.name}</strong>
                      <div className="muted small">{r.subject}</div>
                    </td>
                    <td>
                      <span className={`status ${r.status}`}>{r.status.replace('_', ' ')}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {(noPrice.count ?? 0) > 0 && (
        <div className="panel notice">
          <strong>À faire :</strong> {noPrice.count} produit(s) affichent « Prix sur demande ». Ajoutez les prix et contenances
          dans <Link href="/admin/produits?filtre=sans-prix">Produits</Link>.
        </div>
      )}
    </>
  );
}
