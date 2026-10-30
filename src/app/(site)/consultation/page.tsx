import type { Metadata } from 'next';
import { ConsultationForm } from '@/components/forms';
import Faq from '@/components/Faq';
import { getFaqs } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Consultation en aromathérapie',
  description: "Réservez une consultation en aromathérapie avec Pur'Essence, à Yaoundé ou à distance (téléphone, WhatsApp).",
};

const STEPS = [
  ['Réservation', 'Choisissez une date, un créneau et décrivez votre besoin.'],
  ['Échange', 'Nous écoutons vos attentes et vos habitudes.'],
  ['Recommandations', 'Des huiles adaptées, avec leur mode d’emploi et leurs précautions.'],
  ['Suivi', 'Nous restons disponibles sur WhatsApp pour ajuster.'],
];

export default async function ConsultationPage() {
  const faqs = await getFaqs();
  return (
    <>
      <section className="page-hero hero-static" style={{ height: 'auto', minHeight: 280, padding: '4rem 0 2rem' }}>
        <div className="container page-hero-content reveal">
          <span className="eyebrow">Consultation</span>
          <h1>Votre bien-être commence ici</h1>
          <p>30 à 45 minutes, à la boutique de Mimboman ou à distance par téléphone ou WhatsApp.</p>
        </div>
      </section>

      <section className="section bg-white" style={{ paddingTop: '2rem' }}>
        <div className="container steps-timeline reveal-stagger">
          {STEPS.map(([t, d], i) => (
            <div key={t} className="step-item">
              <div className="step-number">{i + 1}</div>
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section bg-ivory organic-bg">
        <div className="container" style={{ maxWidth: 760, position: 'relative', zIndex: 1 }}>
          <ConsultationForm />
          <div className="notice" style={{ marginTop: '1.5rem' }}>
            Nos consultations portent sur l'usage des huiles essentielles et le bien-être. Elles ne remplacent pas une
            consultation médicale : en cas de symptômes, de grossesse ou de traitement en cours, parlez-en à votre médecin.
          </div>
        </div>
      </section>

      {faqs.length > 0 && (
        <section className="section bg-white">
          <div className="container text-center">
            <span className="eyebrow">FAQ</span>
            <h2>Questions fréquentes</h2>
          </div>
          <div className="container">
            <Faq items={faqs} />
          </div>
        </section>
      )}
    </>
  );
}
