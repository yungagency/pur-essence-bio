import Link from 'next/link';
import type { Metadata } from 'next';
import { getTeam } from '@/lib/data';
import { imgSrc } from '@/lib/format';

export const metadata: Metadata = {
  title: 'À propos',
  description: "L'histoire de Pur'Essence, née à Yaoundé : notre mission, nos valeurs et notre équipe.",
};

const VALUES = [
  { icon: 'fa-bullseye', title: 'Mission', text: 'Rendre les solutions naturelles de bien-être accessibles, avec des conseils clairs pour bien les utiliser.' },
  { icon: 'fa-binoculars', title: 'Vision', text: 'Devenir une référence de confiance en aromathérapie naturelle en Afrique centrale.' },
  { icon: 'fa-gem', title: 'Valeurs', text: 'Authenticité, transparence et respect de la nature dans chacune de nos actions.' },
  { icon: 'fa-hands-helping', title: 'Engagement', text: 'Accompagner chaque client personnellement, avant et après son achat.' },
];

export default async function AboutPage() {
  const team = await getTeam();
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
              Pur'Essence est née à Yaoundé d'une idée simple : rendre accessibles les bienfaits des plantes à travers des
              huiles essentielles et des mélanges naturels, tout en expliquant comment les utiliser correctement.
            </p>
            <p>
              Notre marque allie les savoirs traditionnels et une approche prudente de l'aromathérapie : chaque produit est
              présenté avec ses usages, ses conseils d'utilisation et ses précautions.
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
