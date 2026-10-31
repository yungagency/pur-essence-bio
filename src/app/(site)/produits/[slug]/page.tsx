import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Fiche from '@/components/Fiche';
import OrderBox from '@/components/OrderBox';
import ProductCard from '@/components/ProductCard';
import ProductImage from '@/components/ProductImage';
import { getProduct, getProducts, getSettings } from '@/lib/data';
import { niceLabel } from '@/lib/format';
import { buildMentionIndex, listMentions } from '@/lib/mentions';
import Linked from '@/components/Linked';
import { CATEGORY_LABELS, USAGE_LABELS } from '@/lib/types';
import { SITE_URL } from '@/lib/site';

type Props = { params: Promise<{ slug: string }> };

/** « Huile essentielle de Lavande Vraie », « Huile végétale d'Argan »… */
function fullName(p: { name: string; category: string }) {
  const name = p.name.replace(/\s*\((huile essentielle|huile végétale)\)$/i, '');
  const kind = p.category === 'huile-essentielle' ? 'Huile essentielle' : p.category === 'huile-vegetale' ? 'Huile végétale' : '';
  if (!kind) return p.name;
  return /^[aeiouyhâéèêîôûAEIOUYHÂÉÈÊÎÔÛ]/.test(name) ? `${kind} d'${name}` : `${kind} de ${name}`;
}

/** Coupe un texte sans couper un mot. */
function cut(s: string, n: number) {
  if (s.length <= n) return s;
  return s.slice(0, n).replace(/\s+\S*$/, '') + '…';
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) return { title: 'Produit introuvable' };
  const title = `${fullName(p)}${p.latin_name ? ` (${p.latin_name})` : ''}`;
  const description = cut(p.short || p.description, 158);
  const image = p.image_url || '/images/og-default.jpg';
  return {
    title,
    description,
    alternates: { canonical: `/produits/${p.slug}` },
    openGraph: { type: 'website', title, description, url: `/produits/${p.slug}`, images: [{ url: image, alt: p.name }] },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const [p, all, s] = await Promise.all([getProduct(slug), getProducts(), getSettings()]);
  if (!p) notFound();

  const similar = all
    .filter((x) => x.slug !== p.slug && x.category === p.category && x.usage === p.usage)
    .sort((a, b) => Number(!!b.image_url) - Number(!!a.image_url))
    .slice(0, 4);
  const siteUrl = SITE_URL;
  const identity = (p.identity ?? []).filter((i) => i.value);
  const idx = buildMentionIndex(all.map((x) => ({ slug: x.slug, name: x.name })));
  const names = new Map(all.map((x) => [x.slug, x.name]));
  // Synergies : huiles qui la composent, en mots-clés cliquables.
  const compo = p.fiche?.match(/##[^\n]*composition[^\n]*\n([\s\S]*?)(?=\n## |$)/i)?.[1] ?? '';
  const ingredients = p.category === 'synergie' && compo ? listMentions(compo, idx, p.slug) : [];
  const presentationSeen = new Set<string>();

  return (
    <section className="section bg-ivory" style={{ paddingTop: '2.5rem' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'Product',
              name: fullName(p),
              description: cut(p.short || p.description, 300),
              image: p.image_url ? [`${SITE_URL}${p.image_url.startsWith('/') ? '' : '/'}${p.image_url}`] : undefined,
              brand: { '@type': 'Brand', name: "Pur'Essence" },
              category: CATEGORY_LABELS[p.category] ?? p.category,
              url: `${SITE_URL}/produits/${p.slug}`,
            },
            {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_URL },
                { '@type': 'ListItem', position: 2, name: 'Produits', item: `${SITE_URL}/produits` },
                { '@type': 'ListItem', position: 3, name: p.name, item: `${SITE_URL}/produits/${p.slug}` },
              ],
            },
          ]).replace(/</g, '\\u003c'),
        }}
      />
      <div className="container">
        <nav className="breadcrumb" aria-label="Fil d'Ariane">
          <Link href="/">Accueil</Link> › <Link href="/produits">Produits</Link> ›{' '}
          <Link href={`/produits?categorie=${p.category}`}>{CATEGORY_LABELS[p.category] ?? p.category}</Link> › <span>{p.name}</span>
        </nav>
        <div className="product-page">
          <div className="product-media">
            <ProductImage url={p.image_url} alt={p.name} label={p.name} category={p.category} eager />
          </div>
          <div>
            <div className="chips">
              <span className="chip">{CATEGORY_LABELS[p.category] ?? p.category}</span>
              <span className="chip">{USAGE_LABELS[p.usage] ?? p.usage}</span>
              {p.domain && <span className="chip">{niceLabel(p.domain)}</span>}
            </div>
            <h1>{p.name}</h1>
            {p.latin_name && <p className="latin">{p.latin_name}</p>}
            {p.short && !p.description && <p className="lead">{p.short}</p>}

            <OrderBox
              slug={p.slug}
              name={p.name}
              price={p.price_fcfa}
              volume={p.volume}
              sizes={p.sizes}
              inStock={p.in_stock}
              whatsappCm={s.whatsapp_cm}
              url={`${siteUrl}/produits/${p.slug}`}
            />

            {ingredients.length > 0 && (
              <div className="keywords">
                <p className="identity-title">Huiles de cette synergie</p>
                <div className="keyword-list">
                  {ingredients.map((s) => (
                    <Link key={s} href={`/produits/${s}`} className="keyword">
                      <i className="fas fa-leaf" aria-hidden="true"></i> {names.get(s)}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {identity.length > 0 && (
              <div className="identity-card" style={{ marginTop: '1.2rem' }}>
                <p className="identity-title">Carte d'identité</p>
                <dl>
                  {p.english_name && (
                    <div>
                      <dt>Nom anglais</dt>
                      <dd>{p.english_name}</dd>
                    </div>
                  )}
                  {identity.map((i) => (
                    <div key={i.label}>
                      <dt>{i.label}</dt>
                      <dd>{i.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {p.description && (
              <>
                <h2>Présentation</h2>
                {p.description.split(/\n\s*\n/).map((para, i) => (
                  <p key={i} style={{ marginBottom: '.8rem' }}>
                    <Linked text={para} idx={idx} seen={presentationSeen} exclude={p.slug} />
                  </p>
                ))}
              </>
            )}

            {p.fiche ? (
              <Fiche source={p.fiche} title={p.name} idx={idx} exclude={p.slug} />
            ) : (
              <>
                {p.benefits.length > 0 && (
                  <>
                    <h2>Usages traditionnels</h2>
                    <ul className="benefits">
                      {p.benefits.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  </>
                )}
                {p.usage_tips && (
                  <>
                    <h2>Conseils d'utilisation</h2>
                    <p>{p.usage_tips}</p>
                  </>
                )}
              </>
            )}

            {p.precautions && (
              <div className="notice" style={{ marginTop: '1.5rem' }}>
                <p>{p.precautions}</p>
              </div>
            )}
          </div>
        </div>

        {similar.length > 0 && (
          <div style={{ marginTop: '4rem' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Dans le même esprit</h2>
            <div className="product-grid">
              {similar.map((x) => (
                <ProductCard key={x.id} p={x} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
