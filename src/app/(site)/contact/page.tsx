import type { Metadata } from 'next';
import { ContactForm } from '@/components/forms';
import { getSettings } from '@/lib/data';
import { telHref, waLink } from '@/lib/format';

export const metadata: Metadata = {
  alternates: { canonical: '/contact' },
  title: 'Contact',
  description: "Contactez Pur'Essence à Yaoundé (Mimboman) : téléphone, WhatsApp, email et formulaire de contact.",
};

export default async function ContactPage() {
  const s = await getSettings();
  const mapQuery = encodeURIComponent(s.address || 'Mimboman, Yaoundé');
  return (
    <>
      <section className="page-hero hero-static" style={{ height: 'auto', minHeight: 280, padding: '4rem 0 2rem' }}>
        <div className="container page-hero-content reveal">
          <span className="eyebrow">Contact</span>
          <h1>Une question ? Nous sommes à votre écoute.</h1>
        </div>
      </section>

      <section className="section bg-ivory pattern-drop" style={{ paddingTop: '2rem' }}>
        <div className="container contact-grid">
          <div className="contact-info-cards">
            <div className="contact-item">
              <div className="contact-item-icon">
                <i className="fas fa-phone-alt"></i>
              </div>
              <div>
                <h4>Téléphone</h4>
                <p>
                  {s.phone_cm && <a href={telHref(s.phone_cm)}>🇨🇲 {s.phone_cm}</a>}
                  {s.phone_ca && (
                    <>
                      <br />
                      <a href={telHref(s.phone_ca)}>🇨🇦 {s.phone_ca}</a>
                    </>
                  )}
                </p>
              </div>
            </div>
            {(s.whatsapp_cm || s.whatsapp_ca) && (
              <div className="contact-item">
                <div className="contact-item-icon">
                  <i className="fab fa-whatsapp"></i>
                </div>
                <div>
                  <h4>WhatsApp</h4>
                  <p>
                    {s.whatsapp_cm && (
                      <a href={waLink(s.whatsapp_cm)} target="_blank" rel="noopener">
                        🇨🇲 WhatsApp Cameroun
                      </a>
                    )}
                    {s.whatsapp_ca && (
                      <>
                        <br />
                        <a href={waLink(s.whatsapp_ca)} target="_blank" rel="noopener">
                          🇨🇦 WhatsApp Canada
                        </a>
                      </>
                    )}
                  </p>
                </div>
              </div>
            )}
            {s.email && (
              <div className="contact-item">
                <div className="contact-item-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <div>
                  <h4>Email</h4>
                  <p>
                    <a href={`mailto:${s.email}`}>{s.email}</a>
                  </p>
                </div>
              </div>
            )}
            <div className="contact-item">
              <div className="contact-item-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <div>
                <h4>Adresse</h4>
                <p>
                  {s.address}
                  {s.address_ca && (
                    <>
                      <br />
                      {s.address_ca}
                    </>
                  )}
                </p>
              </div>
            </div>
            {s.hours && (
              <div className="contact-item">
                <div className="contact-item-icon">
                  <i className="fas fa-clock"></i>
                </div>
                <div>
                  <h4>Horaires</h4>
                  <p>{s.hours}</p>
                </div>
              </div>
            )}
          </div>
          <ContactForm />
        </div>
      </section>

      <section className="section bg-white">
        <div className="container text-center">
          <span className="eyebrow">Localisation</span>
          <h2>Retrouvez-nous à Yaoundé</h2>
        </div>
        <div className="container">
          <div className="map-frame">
            <iframe
              title="Carte : Pur'Essence à Yaoundé"
              src={`https://maps.google.com/maps?q=${mapQuery}&z=14&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </>
  );
}
