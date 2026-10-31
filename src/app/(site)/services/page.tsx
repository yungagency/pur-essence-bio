import Link from 'next/link';
import type { Metadata } from 'next';
import { getSettings } from '@/lib/data';
import { waLink } from '@/lib/format';

export const metadata: Metadata = {
  alternates: { canonical: '/services' },
  title: 'Services',
  description: "Consultation en aromathérapie, conseils bien-être, accompagnement beauté naturelle et ateliers : les services Pur'Essence à Yaoundé.",
};

const SERVICES = [
  {
    icon: 'fa-leaf',
    img: '/images/ambiance/service-consultation.webp',
    title: 'Consultation en aromathérapie',
    text: 'Un entretien pour comprendre vos besoins et vous orienter vers les huiles adaptées, avec leur mode d’emploi.',
    items: ['Écoute de vos besoins', 'Recommandations d’huiles adaptées', 'Mode d’utilisation détaillé', 'Suivi sur WhatsApp'],
    cta: { label: 'Réserver une consultation', href: '/consultation', wa: '' },
  },
  {
    icon: 'fa-spa',
    img: '/images/ambiance/service-bien-etre.webp',
    title: 'Conseils bien-être',
    text: 'Intégrer les huiles essentielles à votre routine : détente, sommeil, respiration, énergie.',
    items: ['Routine personnalisée', 'Conseils de dilution', 'Réponses à vos questions', 'Support continu via WhatsApp'],
    cta: { label: 'Demander un conseil', href: '', wa: "Bonjour Pur'Essence, je souhaite des conseils bien-être personnalisés." },
  },
  {
    icon: 'fa-wand-magic-sparkles',
    img: '/images/ambiance/service-beaute.webp',
    title: 'Accompagnement beauté naturelle',
    text: 'Visage, cheveux, corps : des recettes simples à base d’huiles essentielles et végétales.',
    items: ['Choix selon votre type de peau', 'Recettes cosmétiques maison', 'Sélection de produits adaptés', 'Suivi des résultats'],
    cta: { label: 'En savoir plus', href: '', wa: "Bonjour Pur'Essence, je souhaite un accompagnement beauté naturelle." },
  },
  {
    icon: 'fa-book-open',
    img: '/images/ambiance/service-ateliers.webp',
    title: 'Ateliers',
    text: 'Apprendre à utiliser les huiles essentielles en sécurité, en petit groupe. Ouverts aux particuliers et aux professionnels.',
    items: ['Ateliers pratiques en petit groupe', 'Supports fournis', 'Bases de l’aromathérapie', 'Dates annoncées sur nos réseaux'],
    cta: { label: 'M’inscrire au prochain atelier', href: '', wa: "Bonjour Pur'Essence, je souhaite m'inscrire au prochain atelier." },
  },
];

export default async function ServicesPage() {
  const s = await getSettings();
  return (
    <>
      <section className="page-hero hero-photo" style={{ height: 'auto', minHeight: 280, padding: '4rem 0 2rem' }}>
        <div className="page-hero-bg" style={{ backgroundImage: "url('/images/ambiance/lavande.webp')" }} aria-hidden="true" />
        <div className="page-hero-overlay" aria-hidden="true" />
        <div className="container page-hero-content reveal">
          <span className="eyebrow">Services</span>
          <h1>Un accompagnement sur mesure</h1>
          <p>Ce qui nous différencie : un conseil personnalisé et humain.</p>
        </div>
      </section>
      <section className="section bg-ivory pattern-leaf" style={{ paddingTop: '2rem' }}>
        <div className="container service-detail-grid">
          {SERVICES.map((sv) => (
            <div key={sv.title} className="service-detail reveal">
              <div className="service-illustration" style={{ backgroundImage: `url('${sv.img}')` }} aria-hidden="true" />
              <div className="service-content">
                <h3>{sv.title}</h3>
                <p>{sv.text}</p>
                <div className="service-advantages">
                  {sv.items.map((i) => (
                    <div key={i} className="advantage-item">
                      <i className="fas fa-check-circle"></i> {i}
                    </div>
                  ))}
                </div>
                {sv.cta.href ? (
                  <Link href={sv.cta.href} className="button button-primary">
                    <i className="fas fa-calendar-check"></i> {sv.cta.label}
                  </Link>
                ) : (
                  s.whatsapp_cm && (
                    <a href={waLink(s.whatsapp_cm, sv.cta.wa)} target="_blank" rel="noopener" className="button button-primary">
                      <i className="fab fa-whatsapp"></i> {sv.cta.label}
                    </a>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
