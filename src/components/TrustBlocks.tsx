import { imgSrc } from '@/lib/format';
import type { Certification, Result, Settings } from '@/lib/types';

/** Chiffres clés (modifiables dans Admin → Coordonnées ; un champ vide masque le chiffre). */
export function Stats({ s }: { s: Settings }) {
  const items = [
    { v: s.stat_satisfaction, suffix: '%', label: 'Taux de satisfaction' },
    { v: s.stat_consultations, suffix: '+', label: 'Consultations réalisées' },
    { v: s.stat_clients, suffix: '+', label: 'Clients satisfaits' },
  ].filter((i) => i.v && i.v.trim() !== '');
  if (items.length === 0) return null;
  return (
    <div className="stats-grid">
      {items.map((i) => (
        <div key={i.label} className="stat-card">
          <span className="stat-number">
            {Number(i.v).toLocaleString('fr-FR')}
            {i.suffix}
          </span>
          <span className="stat-label">{i.label}</span>
        </div>
      ))}
    </div>
  );
}

export function Certifications({ items }: { items: Certification[] }) {
  if (items.length === 0) return null;
  return (
    <div className="certif-grid">
      {items.map((c) => (
        <div key={c.id} className="certif-item">
          <div className="certif-icon">
            <i className={`fas ${c.icon}`} style={{ color: 'var(--green)' }}></i>
          </div>
          <span>{c.label}</span>
        </div>
      ))}
    </div>
  );
}

function BaSide({ url, label, kind }: { url: string | null; label: string; kind: 'before' | 'after' }) {
  const src = imgSrc(url);
  return (
    <div
      className={kind === 'before' ? 'ba-before' : 'ba-after'}
      style={
        src
          ? undefined
          : { background: kind === 'before' ? 'linear-gradient(135deg, #d4c4a8, #c5b89a)' : 'linear-gradient(135deg, #c8d4c2, #a8c4a0)' }
      }
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <i className={`fas ${kind === 'before' ? 'fa-hourglass-start' : 'fa-leaf'}`} style={{ color: '#fff', opacity: 0.8 }}></i>
      )}
      <span className="ba-label">{label}</span>
    </div>
  );
}

export function Results({ items }: { items: Result[] }) {
  if (items.length === 0) return null;
  return (
    <div className="ba-grid">
      {items.map((r) => (
        <div key={r.id} className="ba-card">
          <div className="ba-images">
            <BaSide url={r.before_url} label="Avant" kind="before" />
            <BaSide url={r.after_url} label="Après" kind="after" />
          </div>
          <div className="ba-info">
            <h4>{r.title}</h4>
            <p>{r.text}</p>
          </div>
        </div>
      ))}
      <p className="muted small" style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
        Résultats individuels, variables d'une personne à l'autre.
      </p>
    </div>
  );
}
