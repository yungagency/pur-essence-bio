import Link from 'next/link';
import type { Metadata } from 'next';
import { preload } from 'react-dom';
import ProductCard from '@/components/ProductCard';
import Quiz from '@/components/Quiz';
import { getApprovedReviews, getProducts, getSettings } from '@/lib/data';
import { Stats } from '@/components/TrustBlocks';

const UNIVERS = [
  { icon: 'fa-leaf', color: 'var(--green)', title: 'Huiles essentielles', text: 'Plus de 65 huiles essentielles bio, de la lavande vraie au néroli.', q: '?categorie=huile-essentielle' },
  { icon: 'fa-tint', color: '#c2a56f', title: 'Huiles végétales', text: 'Jojoba, argan, rose musquée… pressées à froid, pour la peau, les cheveux et la cuisine.', q: '?categorie=huile-vegetale' },
  { icon: 'fa-flask', color: '#8a6fb0', title: 'Synergies', text: 'Des formules prêtes à l’emploi : sommeil, digestion, peau, articulations…', q: '?categorie=synergie' },
  { icon: 'fa-spa', color: '#b98b5e', title: 'Hydrolats & absolues', text: 'Hamamélis, lotus, orchidée blanche : douceur et parfums d’exception.', q: '?categorie=hydrolat-absolue' },
];

export const metadata: Metadata = {
  title: { absolute: "Pur'Essence | Huiles essentielles et huiles végétales bio à Yaoundé" },
  description:
    "Huiles essentielles, huiles végétales et synergies aromatiques bio à Yaoundé (Mimboman). Conseils personnalisés, consultations en aromathérapie, commande sur WhatsApp et livraison partout dans le monde.",
  alternates: { canonical: '/' },
};

const STRIP = [
  { icon: 'fa-leaf', title: '100 % naturel', text: 'Purs et authentiques' },
  { icon: 'fa-flask', title: 'Science & tradition', text: 'Formulés avec expertise' },
  { icon: 'fa-user-doctor', title: 'Consultation', text: 'En boutique ou à distance' },
  { icon: 'fa-truck', title: 'Livraison', text: 'Partout dans le monde' },
];

const WHY = [
  { icon: 'fa-seedling', title: 'Produits naturels', text: '100% d’ingrédients naturels, sans additifs chimiques ni conservateurs nocifs.' },
  { icon: 'fa-shield-alt', title: 'Qualité contrôlée', text: 'Chaque lot est testé en laboratoire pour garantir pureté et efficacité.' },
  { icon: 'fa-user-md', title: 'Conseils personnalisés', text: 'Des experts en aromathérapie vous accompagnent dans vos choix.' },
  { icon: 'fa-shipping-fast', title: 'Livraison rapide', text: 'Nous livrons vos commandes partout dans le monde.' },
];

export default async function HomePage() {
  preload('/images/ambiance/conseillere.webp', { as: 'image', fetchPriority: 'high' });
  const [products, reviews, settings] = await Promise.all([getProducts(), getApprovedReviews(3), getSettings()]);
  const featured = products.filter((p) => p.featured).slice(0, 6);

  return (
    <>
      <section className="hero hero-photo">
        <div className="hero-bg" style={{ backgroundImage: "url('/images/ambiance/conseillere.webp')" }} aria-hidden="true" />
        <div className="hero-overlay" aria-hidden="true" />
        <div className="container hero-copy reveal">
          <span className="eyebrow">Pur'Essence · Yaoundé</span>
          <h1>Retrouvez l'essence pure de la nature</h1>
          <p>Huiles essentielles, huiles végétales et mélanges naturels, avec des conseils personnalisés pour les utiliser en toute sécurité.</p>
          <div className="hero-actions">
            <Link href="/produits" className="button button-primary">
              <i className="fas fa-leaf"></i> Découvrir nos produits
            </Link>
            <Link href="/consultation" className="button button-secondary">
              <i className="fas fa-calendar-check"></i> Réserver une consultation
            </Link>
          </div>
        </div>
      </section>

      <section className="hero-strip" aria-label="Nos atouts">
        <div className="container hero-strip-inner">
          {STRIP.map((x) => (
            <div key={x.title} className="hero-strip-item">
              <i className={`fas ${x.icon}`} aria-hidden="true"></i>
              <div>
                <strong>{x.title}</strong>
                <span>{x.text}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section bg-ivory pattern-leaf">
        <div className="container text-center reveal">
          <span className="eyebrow">Nos univers</span>
          <h2>Explorez notre monde de bien-être</h2>
          <p className="section-subtitle">Trouvez rapidement ce qui correspond à votre besoin.</p>
        </div>
        <div className="container univers-grid reveal-stagger">
          {UNIVERS.map((u) => (
            <Link key={u.title} href={`/produits${u.q}`} className="univers-card">
              <span className="univers-icon">
                <i className={`fas ${u.icon}`} style={{ color: u.color }}></i>
              </span>
              <h3>{u.title}</h3>
              <p>{u.text}</p>
            </Link>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="section bg-white">
          <div className="container text-center reveal">
            <span className="eyebrow">Sélection</span>
            <h2>Nos produits phares</h2>
            <p className="section-subtitle">Une sélection de nos huiles les plus demandées.</p>
          </div>
          <div className="container product-grid grid-3 reveal-stagger">
            {featured.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
          <div className="container text-center" style={{ marginTop: '2rem' }}>
            <Link href="/produits" className="button button-outline">
              Voir tout le catalogue ({products.length} produits)
            </Link>
          </div>
        </section>
      )}

      <section className="diagnostic-section">
        <div className="container text-center reveal">
          <span className="eyebrow" style={{ color: 'var(--gold-light)' }}>
            Diagnostic
          </span>
          <h2>Quel est votre besoin ?</h2>
          <p className="section-subtitle">Choisissez un objectif et découvrez nos suggestions.</p>
          <Quiz />
        </div>
      </section>

      <section className="section bg-ivory">
        <div className="container text-center reveal">
          <span className="eyebrow">Pourquoi nous choisir</span>
          <h2>Pourquoi choisir Pur'Essence</h2>
        </div>
        <div className="container why-grid reveal-stagger" style={{ marginTop: '2rem' }}>
          {WHY.map((w) => (
            <div key={w.title} className="why-card">
              <div className="why-icon">
                <i className={`fas ${w.icon}`}></i>
              </div>
              <h3>{w.title}</h3>
              <p>{w.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section bg-white" style={{ paddingBottom: '2rem' }}>
        <div className="container">
          <Stats s={settings} />
        </div>
      </section>

      {reviews.length > 0 && (
        <section className="section bg-white pattern-leaf">
          <div className="container text-center reveal">
            <span className="eyebrow">Avis clients</span>
            <h2>Ce que nos clients disent</h2>
          </div>
          <div className="container review-grid" style={{ marginTop: '2rem' }}>
            {reviews.map((r) => (
              <article key={r.id} className="testimonial-card">
                <div className="stars" aria-label={`${r.rating} sur 5`}>
                  {'★'.repeat(r.rating)}
                  {'☆'.repeat(5 - r.rating)}
                </div>
                <p>« {r.text} »</p>
                <strong className="small">
                  {r.name}
                  {r.city ? ` · ${r.city}` : ''}
                </strong>
              </article>
            ))}
          </div>
          <div className="container text-center" style={{ marginTop: '2rem' }}>
            <Link href="/avis" className="button button-outline">
              Tous les avis
            </Link>
          </div>
        </section>
      )}

      <section className="cta-section">
        <div className="cta-content reveal">
          <span className="eyebrow">Accompagnement</span>
          <h2>Besoin de conseils personnalisés ?</h2>
          <p>Nous vous aidons à choisir les bonnes huiles et à les utiliser en toute sécurité.</p>
          <Link href="/consultation" className="button button-primary">
            <i className="fas fa-calendar-alt"></i> Prendre rendez-vous
          </Link>
        </div>
      </section>
    </>
  );
}
