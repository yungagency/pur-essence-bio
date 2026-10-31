import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getSettings } from '@/lib/data';
import { waLink } from '@/lib/format';
import { SITE_URL } from '@/lib/site';

// Les contenus publiés depuis l'admin apparaissent au plus tard après 60 s
// (et immédiatement après chaque enregistrement, via revalidatePath).
export const revalidate = 60;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Store',
            name: "Pur'Essence",
            description: 'Huiles essentielles, huiles végétales et synergies aromatiques bio. Conseils et consultations en aromathérapie.',
            url: SITE_URL,
            logo: `${SITE_URL}/images/logo.png`,
            image: `${SITE_URL}/images/og-default.jpg`,
            telephone: s.phone_cm || undefined,
            email: s.email || undefined,
            address: s.address ? { '@type': 'PostalAddress', streetAddress: s.address, addressCountry: 'CM' } : undefined,
            areaServed: 'Worldwide',
            sameAs: [s.facebook, s.instagram, s.tiktok].filter(Boolean),
          }).replace(/</g, '\\u003c'),
        }}
      />
      <a href="#contenu" className="skip-link">
        Aller au contenu
      </a>
      {s.whatsapp_cm && (
        <a
          href={waLink(s.whatsapp_cm, "Bonjour Pur'Essence, j'ai une question.")}
          target="_blank"
          rel="noopener"
          className="whatsapp-float"
          aria-label="Écrire sur WhatsApp"
        >
          <i className="fab fa-whatsapp"></i>
        </a>
      )}
      <Header />
      <main id="contenu">{children}</main>
      <Footer s={s} />
    </>
  );
}
