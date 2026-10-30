import Link from 'next/link';
import { requireAdmin } from '@/lib/admin';
import { formatDate } from '@/lib/format';
import type { Review } from '@/lib/types';
import { deleteReview, setReviewStatus } from '../../actions';

const TABS = [
  ['pending', 'À modérer'],
  ['approved', 'Publiés'],
  ['rejected', 'Refusés'],
] as const;

function StatusBtn({ id, status, label, cls = '' }: { id: string; status: string; label: string; cls?: string }) {
  return (
    <form action={setReviewStatus}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
      <button className={`btn ${cls}`}>{label}</button>
    </form>
  );
}

export default async function AdminReviews({ searchParams }: { searchParams: Promise<{ statut?: string }> }) {
  const { statut = 'pending' } = await searchParams;
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from('reviews').select('*').eq('status', statut).order('created_at', { ascending: false });
  const reviews = (data as Review[]) ?? [];

  return (
    <>
      <h1>Avis clients</h1>
      <p className="sub">Un avis n'apparaît sur le site qu'une fois publié. Ne publiez que des avis réels.</p>
      <div className="filters">
        {TABS.map(([k, v]) => (
          <Link key={k} href={`/admin/avis?statut=${k}`} className={statut === k ? 'active' : ''}>
            {v}
          </Link>
        ))}
      </div>
      {reviews.length === 0 ? (
        <div className="panel muted">Aucun avis dans cette catégorie.</div>
      ) : (
        reviews.map((r) => (
          <div key={r.id} className="panel">
            <div className="admin-head" style={{ marginBottom: '.5rem' }}>
              <div>
                <strong>{r.name}</strong>
                <span className="muted small">
                  {' '}
                  · {r.city || 'ville non précisée'} · {formatDate(r.created_at)}
                </span>
                <div style={{ color: '#c9a84c' }}>
                  {'★'.repeat(r.rating)}
                  <span style={{ color: '#ddd' }}>{'★'.repeat(5 - r.rating)}</span>
                  {r.product && <span className="muted small"> · {r.product}</span>}
                </div>
              </div>
              <div className="btn-row">
                {r.status !== 'approved' && <StatusBtn id={r.id} status="approved" label="Publier" cls="primary" />}
                {r.status !== 'rejected' && <StatusBtn id={r.id} status="rejected" label="Refuser" />}
                {r.status !== 'pending' && <StatusBtn id={r.id} status="pending" label="Remettre en attente" />}
                <form action={deleteReview}>
                  <input type="hidden" name="id" value={r.id} />
                  <button className="btn danger">Supprimer</button>
                </form>
              </div>
            </div>
            <p style={{ whiteSpace: 'pre-wrap' }}>{r.text}</p>
          </div>
        ))
      )}
    </>
  );
}
