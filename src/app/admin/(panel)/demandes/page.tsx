import Link from 'next/link';
import { requireAdmin } from '@/lib/admin';
import { formatDate, waLink } from '@/lib/format';
import type { RequestRow } from '@/lib/types';
import { deleteRequest, updateRequest } from '../../actions';

const STATUSES = [
  ['nouveau', 'Nouveau'],
  ['en_cours', 'En cours'],
  ['traite', 'Traité'],
  ['archive', 'Archivé'],
] as const;

const KINDS = [
  ['', 'Tout'],
  ['consultation', 'Consultations'],
  ['contact', 'Messages'],
] as const;

export default async function AdminRequests({ searchParams }: { searchParams: Promise<{ statut?: string; type?: string }> }) {
  const { statut = '', type = '' } = await searchParams;
  const { supabase } = await requireAdmin();
  let q = supabase.from('requests').select('*').order('created_at', { ascending: false }).limit(200);
  if (statut) q = q.eq('status', statut);
  else q = q.neq('status', 'archive');
  if (type) q = q.eq('kind', type);
  const { data } = await q;
  const rows = (data as RequestRow[]) ?? [];
  const qs = (o: Record<string, string>) => {
    const p = new URLSearchParams({ statut, type, ...o });
    for (const [k, v] of Array.from(p.entries())) if (!v) p.delete(k);
    const str = p.toString();
    return str ? `?${str}` : '';
  };

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>Demandes</h1>
          <p className="sub" style={{ marginBottom: 0 }}>
            Consultations et messages envoyés depuis le site.
          </p>
        </div>
        <a href={`/admin/export${qs({})}`} className="btn">
          Exporter (Excel / CSV)
        </a>
      </div>
      <div className="filters">
        {KINDS.map(([k, v]) => (
          <Link key={k} href={`/admin/demandes${qs({ type: k })}`} className={type === k ? 'active' : ''}>
            {v}
          </Link>
        ))}
        <span style={{ width: 12 }} />
        <Link href={`/admin/demandes${qs({ statut: '' })}`} className={!statut ? 'active' : ''}>
          Actives
        </Link>
        {STATUSES.map(([k, v]) => (
          <Link key={k} href={`/admin/demandes${qs({ statut: k })}`} className={statut === k ? 'active' : ''}>
            {v}
          </Link>
        ))}
      </div>

      {rows.length === 0 && <div className="panel muted">Aucune demande.</div>}
      {rows.map((r) => (
        <div key={r.id} className="panel">
          <div className="admin-head" style={{ marginBottom: '.6rem' }}>
            <div>
              <span className={`status ${r.status}`}>{r.status.replace('_', ' ')}</span>{' '}
              <strong>{r.kind === 'consultation' ? 'Consultation' : 'Message'}</strong> · {r.name}
              <span className="muted small"> · reçu le {formatDate(r.created_at)}</span>
            </div>
            <div className="btn-row">
              {r.phone && (
                <a
                  className="btn primary"
                  target="_blank"
                  rel="noopener"
                  href={waLink(r.phone, `Bonjour ${r.name}, c'est Pur'Essence. Nous avons bien reçu votre demande.`)}
                >
                  WhatsApp
                </a>
              )}
              {r.phone && (
                <a className="btn" href={`tel:${r.phone.replace(/[^\d+]/g, '')}`}>
                  Appeler
                </a>
              )}
              {r.email && (
                <a className="btn" href={`mailto:${r.email}`}>
                  Email
                </a>
              )}
            </div>
          </div>
          <div className="grid-2 small" style={{ marginBottom: '.6rem' }}>
            <div>
              {r.phone && <div>📞 {r.phone}</div>}
              {r.email && <div>✉️ {r.email}</div>}
              {r.subject && <div>Objet : {r.subject}</div>}
            </div>
            {r.kind === 'consultation' && (
              <div>
                {r.consult_type && <div>Type : {r.consult_type}</div>}
                <div>
                  Date souhaitée : {r.consult_date ? new Date(r.consult_date + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) : 'non précisée'}
                </div>
                <div>Créneau : {r.consult_time || 'indifférent'}</div>
              </div>
            )}
          </div>
          {r.message && <p style={{ whiteSpace: 'pre-wrap', marginBottom: '.8rem' }}>{r.message}</p>}
          <form action={updateRequest} className="btn-row">
            <input type="hidden" name="id" value={r.id} />
            <select name="status" defaultValue={r.status} className="btn">
              {STATUSES.map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="admin_note"
              defaultValue={r.admin_note ?? ''}
              placeholder="Note interne (non visible du client)"
              className="btn"
              style={{ flex: 1, minWidth: 200, fontWeight: 400 }}
            />
            <button className="btn primary">Enregistrer</button>
          </form>
          <form action={deleteRequest} style={{ marginTop: '.5rem' }}>
            <input type="hidden" name="id" value={r.id} />
            <button className="btn danger small">Supprimer définitivement</button>
          </form>
        </div>
      ))}
    </>
  );
}
