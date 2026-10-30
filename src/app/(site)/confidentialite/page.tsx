import Link from 'next/link';
import type { Metadata } from 'next';
import { getSettings } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Politique de confidentialité',
  description: "Comment Pur'Essence collecte, utilise et protège vos données personnelles, et comment exercer vos droits.",
};

export default async function ConfidentialitePage() {
  const s = await getSettings();
  const contact = s.email || 'notre adresse email';
  return (
    <section className="section bg-ivory">
      <div className="container legal-page" style={{ maxWidth: 820 }}>
        <span className="eyebrow">Vos données</span>
        <h1 style={{ fontSize: '2.2rem', margin: '.4rem 0 1rem' }}>Politique de confidentialité</h1>
        <p>
          Pur'Essence respecte votre vie privée. Cette page explique quelles informations nous recueillons sur ce site,
          pourquoi, combien de temps nous les gardons et comment exercer vos droits, conformément à la loi camerounaise
          n° 2024/017 du 23 décembre 2024 relative à la protection des données à caractère personnel.
        </p>

        <h2>Qui est responsable de vos données ?</h2>
        <p>
          Pur'Essence{s.address ? `, ${s.address}` : ''}. Pour toute question : <a href={`mailto:${s.email}`}>{contact}</a>
          {s.phone_cm ? ` ou ${s.phone_cm}` : ''}.
        </p>

        <h2>Ce que nous recueillons, et pourquoi</h2>
        <table>
          <thead>
            <tr>
              <th>Formulaire</th>
              <th>Informations</th>
              <th>Utilisation</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Réservation de consultation</td>
              <td>Nom, téléphone, type de consultation, date et créneau souhaités, objectif, précisions</td>
              <td>Organiser et confirmer votre rendez-vous</td>
            </tr>
            <tr>
              <td>Contact</td>
              <td>Nom, téléphone et/ou email, sujet, message</td>
              <td>Répondre à votre demande</td>
            </tr>
            <tr>
              <td>Avis client</td>
              <td>Prénom et initiale, ville, note, produit, avis</td>
              <td>Publier votre avis après vérification (seuls le prénom, la ville, la note et le texte sont affichés)</td>
            </tr>
          </tbody>
        </table>
        <p>
          Nous ne demandons que ce qui est nécessaire. Merci de ne pas indiquer d'informations médicales détaillées dans
          les formulaires : elles seront abordées de vive voix pendant la consultation.
        </p>
        <p>
          Chaque formulaire n'est envoyé qu'après avoir coché la case de consentement. Vous pouvez retirer ce consentement
          à tout moment en nous écrivant.
        </p>

        <h2>Commandes et échanges sur WhatsApp</h2>
        <p>
          Les boutons « Commander sur WhatsApp » ouvrent l'application WhatsApp avec un message pré-rempli. Ce message
          n'est envoyé que si vous le validez. Les échanges sur WhatsApp sont alors soumis aux conditions de WhatsApp
          (Meta).
        </p>

        <h2>Combien de temps nous les gardons</h2>
        <ul>
          <li>Demandes de consultation et de contact : 12 mois après notre dernier échange, puis suppression.</li>
          <li>Avis clients : tant qu'ils sont publiés, ou jusqu'à votre demande de suppression.</li>
        </ul>

        <h2>Qui peut y accéder</h2>
        <p>
          Uniquement l'équipe Pur'Essence. Vos données ne sont ni vendues, ni louées, ni utilisées pour de la publicité.
          Elles sont stockées chez nos prestataires techniques, qui agissent pour notre compte :
        </p>
        <ul>
          <li>Supabase (base de données sécurisée)</li>
          <li>Vercel (hébergement du site)</li>
        </ul>
        <p>
          Les serveurs de ces prestataires sont situés hors du Cameroun. L'accès aux données est protégé par mot de passe
          et limité aux administrateurs du site.
        </p>

        <h2>Cookies et mesure d'audience</h2>
        <p>
          Ce site n'utilise ni cookie publicitaire ni outil de suivi des visiteurs. Seul l'espace d'administration utilise
          un cookie de connexion, indispensable à son fonctionnement. Les polices de caractères et les icônes sont
          chargées depuis Google Fonts et Cloudflare, qui reçoivent à cette occasion l'adresse IP de votre appareil.
        </p>

        <h2>Vos droits</h2>
        <p>Vous pouvez à tout moment :</p>
        <ul>
          <li>savoir quelles données nous détenons sur vous et en obtenir une copie ;</li>
          <li>les faire corriger ou supprimer ;</li>
          <li>vous opposer à leur utilisation ou retirer votre consentement.</li>
        </ul>
        <p>
          Écrivez-nous à <a href={`mailto:${s.email}`}>{contact}</a>. Nous vous répondons dans un délai d'un mois. Si
          vous estimez que vos droits ne sont pas respectés, vous pouvez saisir l'autorité camerounaise de protection
          des données à caractère personnel.
        </p>

        <h2>Modifications</h2>
        <p>
          Cette politique peut évoluer. La version en ligne est la seule applicable. Dernière mise à jour : octobre 2026.
        </p>
        <p style={{ marginTop: '2rem' }}>
          Voir aussi : <Link href="/mentions-legales">mentions légales et précautions</Link>.
        </p>
      </div>
    </section>
  );
}
