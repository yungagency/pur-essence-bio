import type { Metadata } from 'next';
import { ReviewForm } from '@/components/forms';
import { getApprovedReviews } from '@/lib/data';
import { formatDate } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Avis clients',
  description: "Les avis de nos clients sur les produits et conseils Pur'Essence. Partagez aussi votre expérience.",
};

export default async function AvisPage() {
  const reviews = await getApprovedReviews();
  const avg = reviews.length ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length : 0;

  return (
    <>
      <section className="page-hero hero-static" style={{ height: 'auto', minHeight: 280, padding: '4rem 0 2rem' }}>
        <div className="container page-hero-content reveal">
          <span className="eyebrow">Avis clients</span>
          <h1>Ils nous ont fait confiance</h1>
          <p>
            {reviews.length > 0
              ? `${avg.toFixed(1).replace('.', ',')}/5 · ${reviews.length} avis vérifiés`
              : 'Soyez parmi les premiers à partager votre expérience.'}
          </p>
        </div>
      </section>
      <section className="section bg-ivory pattern-leaf" style={{ paddingTop: '2rem' }}>
        <div className="container reviews-layout">
          <div>
            {reviews.length === 0 ? (
              <p className="empty-state">Aucun avis publié pour le moment.</p>
            ) : (
              <div className="review-grid">
                {reviews.map((r) => (
                  <article key={r.id} className="testimonial-card">
                    <div className="testimonial-header">
                      <div className="testimonial-photo">
                        {r.name
                          .split(/\s+/)
                          .map((w) => w[0])
                          .join('')
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                      <div className="testimonial-meta">
                        <h4>{r.name}</h4>
                        <span>
                          {r.city ? `${r.city} · ` : ''}
                          {formatDate(r.created_at)}
                        </span>
                      </div>
                    </div>
                    <div className="stars" aria-label={`${r.rating} sur 5`}>
                      {'★'.repeat(r.rating)}
                      <span style={{ color: '#ddd' }}>{'★'.repeat(5 - r.rating)}</span>
                    </div>
                    {r.product && (
                      <span className="review-product-tag">
                        <i className="fas fa-leaf"></i> {r.product}
                      </span>
                    )}
                    <p>« {r.text} »</p>
                  </article>
                ))}
              </div>
            )}
          </div>
          <ReviewForm />
        </div>
      </section>
    </>
  );
}
