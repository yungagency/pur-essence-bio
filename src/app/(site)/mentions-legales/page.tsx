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
          (usages traditionnels, conseils d'utilisation) sont données à titre informatif. Elles ne constituent ni un
          diagnostic, ni un traitement, et ne remplacent pas l'avis d'un médecin ou d'un pharmacien. Toujours diluer avant
          application cutanée, ne pas avaler sans avis d'un professionnel, tenir hors de portée des enfants. Demandez conseil
          avant usage en cas de grossesse, d'allaitement, d'épilepsie, d'allergie, chez l'enfant ou en cas de traitement en
          cours.
        </p>

        <h2 style={{ fontSize: '1.2rem', margin: '1.5rem 0 .5rem' }}>Données personnelles</h2>
        <p className="muted">
          Les informations envoyées via les formulaires (nom, téléphone, email, message, demande de consultation, avis) sont
          utilisées uniquement pour vous répondre et organiser votre rendez-vous. Elles ne sont ni vendues ni partagées. Vous
          pouvez demander leur suppression en écrivant à {s.email}. Les avis publiés n'affichent que le prénom et la ville
          indiqués.
        </p>

        <h2 style={{ fontSize: '1.2rem', margin: '1.5rem 0 .5rem' }}>Hébergement</h2>
        <p className="muted">Site hébergé par Vercel Inc. Données stockées chez Supabase.</p>
      </div>
    </section>
  );
}
