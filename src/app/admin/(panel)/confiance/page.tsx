import { requireAdmin } from '@/lib/admin';
import { imgSrc } from '@/lib/format';
import type { Certification, Result } from '@/lib/types';
import { deleteCertification, deleteResult, saveCertification, saveResult } from '../../actions';

const ICONS = [
  ['fa-certificate', 'Certificat'],
  ['fa-leaf', 'Feuille'],
  ['fa-flask', 'Laboratoire'],
  ['fa-paw', 'Patte'],
  ['fa-flag', 'Drapeau'],
  ['fa-recycle', 'Recyclage'],
  ['fa-award', 'Médaille'],
  ['fa-handshake', 'Partenaire'],
];

function CertForm({ c }: { c?: Certification }) {
  return (
    <form action={saveCertification} className="btn-row admin-form" style={{ display: 'flex' }}>
      {c && <input type="hidden" name="id" value={c.id} />}
      <input type="text" name="label" required defaultValue={c?.label} placeholder="Ex. ISO 9001" style={{ flex: 2, minWidth: 180 }} />
      <select name="icon" defaultValue={c?.icon ?? 'fa-certificate'} style={{ flex: 1, minWidth: 130 }}>
        {ICONS.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
      <input type="number" name="sort" defaultValue={c?.sort ?? 0} style={{ width: 80 }} aria-label="Ordre" />
      <label className="checks" style={{ display: 'flex' }}>
        <input type="checkbox" name="published" defaultChecked={c?.published ?? true} /> Visible
      </label>
      <button className="btn primary">{c ? 'Enregistrer' : 'Ajouter'}</button>
    </form>
  );
}

function ResultForm({ r }: { r?: Result }) {
  return (
    <form action={saveResult} className="admin-form">
      {r && <input type="hidden" name="id" value={r.id} />}
      <input type="hidden" name="before_url_old" value={r?.before_url ?? ''} />
      <input type="hidden" name="after_url_old" value={r?.after_url ?? ''} />
      <label>
        Titre
        <input type="text" name="title" required defaultValue={r?.title} placeholder="Ex. Peau revitalisée — Soin Carotte + Palmarosa" />
      </label>
      <label>
        Texte
        <textarea name="text" defaultValue={r?.text} rows={2} />
      </label>
      <div className="grid-2">
        <label>
          Photo « avant »
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {r?.before_url && <img src={imgSrc(r.before_url) ?? ''} alt="" className="img-preview" style={{ width: 80, height: 80 }} />}
          <input type="file" name="before" accept="image/jpeg,image/png,image/webp" />
        </label>
        <label>
          Photo « après »
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {r?.after_url && <img src={imgSrc(r.after_url) ?? ''} alt="" className="img-preview" style={{ width: 80, height: 80 }} />}
          <input type="file" name="after" accept="image/jpeg,image/png,image/webp" />
        </label>
      </div>
      <div className="btn-row">
        <label>
          Ordre <input type="number" name="sort" defaultValue={r?.sort ?? 0} style={{ width: 80 }} />
        </label>
        <label className="checks" style={{ display: 'flex' }}>
          <input type="checkbox" name="published" defaultChecked={r?.published ?? true} /> Visible
        </label>
        <button className="btn primary">{r ? 'Enregistrer' : 'Ajouter'}</button>
      </div>
    </form>
  );
}

export default async function AdminTrust() {
  const { supabase } = await requireAdmin();
  const [{ data: c }, { data: r }] = await Promise.all([
    supabase.from('certifications').select('*').order('sort'),
    supabase.from('results').select('*').order('sort'),
  ]);
  const certs = (c as Certification[]) ?? [];
  const results = (r as Result[]) ?? [];

  return (
    <>
      <h1>Labels et résultats</h1>
      <p className="sub">
        Labels affichés sur « À propos », résultats avant/après sur « Avis ». Les chiffres clés se règlent dans{' '}
        <a href="/admin/reglages">Coordonnées</a>.
      </p>
      <div className="notice small" style={{ marginBottom: '1.2rem' }}>
        Conservez les justificatifs (certificats, analyses, accord des clients pour les photos). Une certification affichée
        doit pouvoir être prouvée en cas de contrôle ou de réclamation.
      </div>

      <div className="panel">
        <h2 style={{ fontSize: '1.05rem', marginBottom: '.8rem' }}>Labels et certifications</h2>
        <div style={{ display: 'grid', gap: '.6rem' }}>
          {certs.map((x) => (
            <div key={x.id} className="btn-row" style={{ alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <CertForm c={x} />
              </div>
              <form action={deleteCertification}>
                <input type="hidden" name="id" value={x.id} />
                <button className="btn danger">×</button>
              </form>
            </div>
          ))}
          <div style={{ borderTop: '1px solid #eee', paddingTop: '.8rem' }}>
            <CertForm />
          </div>
        </div>
      </div>

      <h2 style={{ fontSize: '1.1rem', margin: '1.5rem 0 .8rem' }}>Résultats avant / après</h2>
      {results.map((x) => (
        <div key={x.id} className="panel">
          <ResultForm r={x} />
          <form action={deleteResult} style={{ marginTop: '.6rem' }}>
            <input type="hidden" name="id" value={x.id} />
            <button className="btn danger">Supprimer</button>
          </form>
        </div>
      ))}
      <div className="panel">
        <h3 style={{ fontSize: '1rem', marginBottom: '.8rem' }}>Nouveau résultat</h3>
        <ResultForm />
      </div>
    </>
  );
}
