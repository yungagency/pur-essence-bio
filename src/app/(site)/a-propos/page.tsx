import Link from 'next/link';
import type { Metadata } from 'next';
import { getCertifications, getTeam } from '@/lib/data';
import { Certifications } from '@/components/TrustBlocks';
import { imgSrc } from '@/lib/format';

export const metadata: Metadata = {
  title: 'À propos',
  description: "L'histoire de Pur'Essence, née à Yaoundé : notre mission, nos valeurs et notre équipe.",
};

const VALUES = [
  { icon: 'fa-bullseye', title: 'Mission', text: 'Offrir des solutions naturelles de bien-être accessibles et de qualité premium à tous les Camerounais et Canadiens.' },
  { icon: 'fa-binoculars', title: 'Vision', text: 'Devenir la référence incontournable en aromathérapie naturelle en Afrique centrale.' },
  { icon: 'fa-gem', title: 'Valeurs', text: 'Authenticité, excellence, transparence et respect de la nature dans chacune de nos actions.' },
  { icon: 'fa-globe-africa', title: 'Impact', text: 'Contribuer au bien-être communautaire tout en soutenant l’agriculture locale et durable.' },
];

const ENGAGEMENTS = [
  { icon: 'fa-seedling', title: 'Nature', text: 'Des ingrédients 100% naturels, récoltés avec soin et respect de l’environnement.' },
  { icon: 'fa-recycle', title: 'Durabilité', text: 'Emballages éco-responsables et processus de production respectueux de la planète.' },
  { icon: 'fa-flask', title: 'Qualité', text: 'Chaque lot est testé en laboratoire pour garantir pureté, efficacité et sécurité.' },
  { icon: 'fa-handshake', title: 'Confiance', text: 'Transparence totale sur nos ingrédients, nos sources et nos processus de fabrication.' },
];

export default async function AboutPage() {
  const [team, certifs] = await Promise.all([getTeam(), getCertifications()]);
  return (
    <>
      <section className="page-hero hero-static" style={{ height: 'auto', minHeight: 280, padding: '4rem 0 2rem' }}>
        <div className="container page-hero-content reveal">
          <span className="eyebrow">À propos</span>
          <h1>L'histoire de Pur'Essence</h1>
          <p>Une passion pour la nature, au service de votre bien-être.</p>
        </div>
      </section>

      <section className="section bg-ivory pattern-leaf" style={{ paddingTop: '2rem' }}>
        <div className="container" style={{ maxWidth: 820 }}>
          <div className="about-copy reveal">
            <span className="eyebrow">Notre histoire</span>
            <h2>Comment tout a commencé</h2>
            <p>
              Pur'Essence est née à Yaoundé, Cameroun, d'une vision simple mais puissante : rendre accessible le pouvoir
              guérisseur de la nature à travers des huiles essentielles pures et authentiques.
            </p>
            <p>
              Fondée par des passionnés de bien-être naturel, notre marque allie les savoirs traditionnels camerounais à une
              approche scientifique rigoureuse pour offrir des produits d'une qualité exceptionnelle.
            </p>
          </div>
          <div className="mission-vision reveal-stagger">
            {VALUES.map((v) => (
              <div key={v.title} className="mv-card">
                <h3>
                  <i className={`fas ${v.icon}`} style={{ color: 'var(--green)', marginRight: '.4rem' }}></i> {v.title}
                </h3>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container text-center reveal">
          <span className="eyebrow">Nos engagements</span>
          <h2>Ce en quoi nous croyons</h2>
          <p className="section-subtitle">Quatre piliers qui guident chaque décision chez Pur'Essence.</p>
        </div>
        <div className="container engagements-grid reveal-stagger">
          {ENGAGEMENTS.map((e) => (
            <div key={e.title} className="engagement-card">
              <span className="engagement-icon">
                <i className={`fas ${e.icon}`} style={{ color: 'var(--green)' }}></i>
              </span>
              <h3>{e.title}</h3>
              <p>{e.text}</p>
            </div>
          ))}
        </div>
      </section>

      {team.length > 0 && (
        <section className="section bg-white">
          <div className="container text-center reveal">
            <span className="eyebrow">L'équipe</span>
            <h2>Les personnes derrière Pur'Essence</h2>
          </div>
          <div className="container team-grid" style={{ marginTop: '2rem', justifyContent: 'center' }}>
            {team.map((m) => (
              <div key={m.id} className="team-card">
                <div
                  className="team-photo"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', color: 'var(--accent)' }}
                >
                  {m.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={imgSrc(m.photo_url) ?? ''} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <i className="fas fa-user"></i>
                  )}
                </div>
                <div className="team-info">
                  <h3>{m.name}</h3>
                  <p>{m.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {certifs.length > 0 && (
        <section className="section bg-ivory">
          <div className="container text-center reveal">
            <span className="eyebrow">Certifications</span>
            <h2>Nos labels et partenaires</h2>
            <p className="section-subtitle">Des certifications qui attestent de notre engagement qualité.</p>
          </div>
          <div className="container">
            <Certifications items={certifs} />
          </div>
        </section>
      )}

      <section className="cta-section">
        <div className="cta-content">
          <h2>Venez nous rencontrer</h2>
          <p>Boutique à Mimboman (Yaoundé) ou consultation à distance.</p>
          <Link href="/contact" className="button button-primary">
            Nous contacter
          </Link>
        </div>
      </section>
    </>
  );
}
