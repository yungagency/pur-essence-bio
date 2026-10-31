import Link from 'next/link';
import type { Metadata } from 'next';
import { getSettings } from '@/lib/data';

export const metadata: Metadata = { title: 'Mentions légales et précautions', robots: { index: true } };

export default async function MentionsPage() {
  const s = await getSettings();
  return (
    <section className="section bg-ivory">
      <div className="container" style={{ maxWidth: 780 }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '1.5rem' }}>Mentions légales et précautions</h1>

        <h2 style={{ fontSize: '1.2rem', margin: '1.5rem 0 .5rem' }}>Éditeur du site</h2>
        <p className="muted">
          Pur'Essence — {s.address}. Contact : {s.email}
          {s.phone_cm ? ` · ${s.phone_cm}` : ''}.
        </p>

        <h2 style={{ fontSize: '1.2rem', margin: '1.5rem 0 .5rem' }}>Avertissement santé</h2>
        <p className="muted">
          Les huiles essentielles sont des substances naturelles très concentrées. Les informations présentées sur ce site
          (usages traditionnels, conseils d'utilisation) sont données à titre informatif. Toujours diluer avant
          application cutanée, ne pas avaler sans avis d'un professionnel, tenir hors de portée des enfants. Demandez conseil
          avant usage en cas de grossesse, d'allaitement, d'épilepsie, d'allergie, chez l'enfant ou en cas de traitement en
          cours.
        </p>

        <h2 style={{ fontSize: '1.2rem', margin: '1.5rem 0 .5rem' }}>Données personnelles</h2>
        <p className="muted">
          La collecte et l'utilisation de vos données sont décrites dans notre{' '}
          <Link href="/confidentialite">politique de confidentialité</Link>.
        </p>

        <h2 style={{ fontSize: '1.2rem', margin: '1.5rem 0 .5rem' }}>Hébergement</h2>
        <p className="muted">Site hébergé par Vercel Inc. Données stockées chez Supabase.</p>

        <h2 style={{ fontSize: '1.2rem', margin: '1.5rem 0 .5rem' }}>Conception et réalisation</h2>
        <p className="muted">
          Site conçu et développé par Dannielle Nnomo, pour{' '}
          <a href="https://yungs-agency.vercel.app" target="_blank" rel="noopener">
            Yung's Agency
          </a>{' '}
          (Yaoundé, Cameroun).
        </p>
      </div>
    </section>
  );
}
