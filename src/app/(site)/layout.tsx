import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getSettings } from '@/lib/data';
import { waLink } from '@/lib/format';

// Les contenus publiés depuis l'admin apparaissent au plus tard après 60 s
// (et immédiatement après chaque enregistrement, via revalidatePath).
export const revalidate = 60;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  return (
    <>
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
