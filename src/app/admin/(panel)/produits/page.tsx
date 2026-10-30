import Link from 'next/link';
import { requireAdmin } from '@/lib/admin';
import { formatFcfa, imgSrc } from '@/lib/format';
import { USAGE_LABELS } from '@/lib/types';
import type { Product } from '@/lib/types';
import { toggleProduct } from '../../actions';

function Toggle({ p, field, label }: { p: Product; field: 'published' | 'in_stock' | 'featured'; label: string }) {
  const on = p[field];
  return (
    <form action={toggleProduct}>
      <input type="hidden" name="id" value={p.id} />
      <input type="hidden" name="field" value={field} />
      <input type="hidden" name="value" value={String(!on)} />
      <button className={`status ${on ? 'oui' : 'non'}`} style={{ border: 0, cursor: 'pointer' }} title={`Basculer « ${label} »`}>
        {on ? 'Oui' : 'Non'}
      </button>
    </form>
  );
}

export default async function AdminProducts({ searchParams }: { searchParams: Promise<{ filtre?: string; ok?: string }> }) {
  const { filtre, ok } = await searchParams;
  const { supabase } = await requireAdmin();
  let q = supabase.from('products').select('*').order('sort').order('name');
  if (filtre === 'sans-prix') q = q.is('price_fcfa', null);
  const { data } = await q;
  const products = (data as Product[]) ?? [];

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>Produits</h1>
          <p className="sub" style={{ marginBottom: 0 }}>
            {products.length} produit(s). Cliquez sur Oui/Non pour basculer rapidement.
          </p>
        </div>
        <Link href="/admin/produits/nouveau" className="btn primary">
          + Nouveau produit
        </Link>
      </div>
      {ok && <div className="form-msg ok">Produit enregistré. Le site est mis à jour.</div>}
      <div className="filters">
        <Link href="/admin/produits" className={!filtre ? 'active' : ''}>
          Tous
        </Link>
        <Link href="/admin/produits?filtre=sans-prix" className={filtre === 'sans-prix' ? 'active' : ''}>
          Sans prix
        </Link>
      </div>
      <div className="panel table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>Produit</th>
              <th>Prix</th>
              <th>Publié</th>
              <th>En stock</th>
              <th>À la une</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {p.image_url ? <img className="thumb" src={imgSrc(p.image_url) ?? ''} alt="" /> : <div className="thumb" />}
                </td>
                <td>
                  <strong>{p.name}</strong>
                  <div className="muted small">{USAGE_LABELS[p.usage] ?? p.usage}</div>
                </td>
                <td>{formatFcfa(p.price_fcfa) ?? <span className="muted">—</span>}</td>
                <td>
                  <Toggle p={p} field="published" label="Publié" />
                </td>
                <td>
                  <Toggle p={p} field="in_stock" label="En stock" />
                </td>
                <td>
                  <Toggle p={p} field="featured" label="À la une" />
                </td>
                <td>
                  <Link href={`/admin/produits/${p.id}`} className="btn">
                    Modifier
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
