import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SITE_URL } from '@/lib/site';

const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Pur'Essence | Huiles essentielles naturelles à Yaoundé",
    template: "%s | Pur'Essence",
  },
  description:
    "Pur'Essence : huiles essentielles, huiles végétales et mélanges naturels à Yaoundé (Mimboman). Conseils personnalisés, consultations en aromathérapie et commande sur WhatsApp.",
  openGraph: { type: 'website', locale: 'fr_FR', siteName: "Pur'Essence", images: [{ url: '/images/og-default.jpg', width: 1200, height: 630, alt: "Pur'Essence, huiles essentielles" }] },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = { themeColor: '#566d4e' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
