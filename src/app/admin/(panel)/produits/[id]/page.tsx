import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/admin';
import type { Product } from '@/lib/types';
import ProductForm from './ProductForm';
import { deleteProduct } from '../../../actions';

export default async function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase } = await requireAdmin();
  let product: Product | null = null;
  if (id !== 'nouveau') {
    const { data } = await supabase.from('products').select('*').eq('id', id).maybeSingle();
    if (!data) notFound();
    product = data as Product;
  }

  return (
    <>
      <div className="admin-head">
        <div>
          <Link href="/admin/produits" className="muted small">
            ← Produits
          </Link>
          <h1>{product ? product.name : 'Nouveau produit'}</h1>
        </div>
        {product && (
          <div className="btn-row">
            <a href={`/produits/${product.slug}`} target="_blank" rel="noopener" className="btn">
              Voir sur le site ↗
            </a>
            <form action={deleteProduct}>
              <input type="hidden" name="id" value={product.id} />
              <button className="btn danger">Supprimer</button>
            </form>
          </div>
        )}
      </div>
      <ProductForm product={product} />
    </>
  );
}
