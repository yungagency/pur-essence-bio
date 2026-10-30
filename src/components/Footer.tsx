import Link from 'next/link';
import Logo from './Logo';
import { telHref, waLink } from '@/lib/format';
import type { Settings } from '@/lib/types';

export default function Footer({ s }: { s: Settings }) {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Logo light />
            <p>Huiles essentielles, huiles végétales et mélanges naturels pour votre bien-être au quotidien.</p>
          </div>
          <div className="footer-col">
            <h4>Navigation</h4>
            <Link href="/">Accueil</Link>
            <Link href="/produits">Produits</Link>
            <Link href="/services">Services</Link>
            <Link href="/a-propos">À propos</Link>
          </div>
          <div className="footer-col">
            <h4>Accompagnement</h4>
            <Link href="/consultation">Consultation</Link>
            <Link href="/avis">Avis clients</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/mentions-legales">Mentions & précautions</Link>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            {s.phone_cm && <a href={telHref(s.phone_cm)}>🇨🇲 {s.phone_cm}</a>}
            {s.phone_ca && <a href={telHref(s.phone_ca)}>🇨🇦 {s.phone_ca}</a>}
            {s.email && <a href={`mailto:${s.email}`}>{s.email}</a>}
            {s.address && <span className="plain">{s.address}</span>}
            {s.address_ca && <span className="plain">{s.address_ca}</span>}
          </div>
        </div>
        <div className="footer-bottom">
          <div>
            <p>© {new Date().getFullYear()} Pur'Essence. Tous droits réservés.</p>
            <p className="footer-legal">Nos produits et conseils ne remplacent pas un avis médical.</p>
          </div>
          <div className="social-links">
            {s.whatsapp_cm && (
              <a href={waLink(s.whatsapp_cm)} target="_blank" rel="noopener" aria-label="WhatsApp">
                <i className="fab fa-whatsapp"></i>
              </a>
            )}
            {s.email && (
              <a href={`mailto:${s.email}`} aria-label="Email">
                <i className="fas fa-envelope"></i>
              </a>
            )}
            {s.instagram && (
              <a href={s.instagram} target="_blank" rel="noopener" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
            )}
            {s.facebook && (
              <a href={s.facebook} target="_blank" rel="noopener" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
            )}
            {s.tiktok && (
              <a href={s.tiktok} target="_blank" rel="noopener" aria-label="TikTok">
                <i className="fab fa-tiktok"></i>
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
