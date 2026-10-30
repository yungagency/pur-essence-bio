import type { Metadata, Viewport } from 'next';
import './globals.css';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pur-essence.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Pur'Essence | Huiles essentielles naturelles à Yaoundé",
    template: "%s | Pur'Essence",
  },
  description:
    "Pur'Essence : huiles essentielles, huiles végétales et mélanges naturels à Yaoundé (Mimboman). Conseils personnalisés, consultations en aromathérapie et commande sur WhatsApp.",
  openGraph: { type: 'website', locale: 'fr_FR', siteName: "Pur'Essence" },
};

export const viewport: Viewport = { themeColor: '#566d4e' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
