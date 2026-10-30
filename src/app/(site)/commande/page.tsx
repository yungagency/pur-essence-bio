import type { Metadata } from 'next';
import CartView from '@/components/CartView';
import { getSettings } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Mon panier',
  description: "Rassemblez vos produits Pur'Essence et envoyez votre commande en un seul message WhatsApp.",
  robots: { index: false },
};

const STEPS = [
  { icon: 'fa-basket-shopping', title: 'Choisissez', text: 'Ajoutez vos produits au panier, avec la contenance et la quantité.' },
  { icon: 'fa-paper-plane', title: 'Envoyez', text: 'Votre panier part en un seul message WhatsApp, déjà rédigé.' },
  { icon: 'fa-comments', title: 'Confirmation', text: 'Nous vous répondons avec les prix, la disponibilité et la livraison.' },
  { icon: 'fa-truck', title: 'Réception', text: 'Vous validez, puis recevez votre commande ou passez la récupérer.' },
];

export default async function CommandePage() {
  const s = await getSettings();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pur-essence.vercel.app';
  return (
    <>
      <section className="section bg-ivory" style={{ paddingTop: '2.5rem' }}>
        <div className="container">
          <span className="eyebrow">Commande</span>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', margin: '.4rem 0 1.5rem' }}>Mon panier</h1>
          <CartView whatsappCm={s.whatsapp_cm} whatsappCa={s.whatsapp_ca} siteUrl={siteUrl} />
        </div>
      </section>
      <section className="section bg-white" id="comment-commander">
        <div className="container text-center">
          <span className="eyebrow">Simple et sans paiement en ligne</span>
          <h2>Comment commander ?</h2>
        </div>
        <div className="container why-grid" style={{ marginTop: '2rem' }}>
          {STEPS.map((st, n) => (
            <div key={st.title} className="why-card">
              <div className="why-icon">
                <i className={`fas ${st.icon}`}></i>
              </div>
              <h3>
                {n + 1}. {st.title}
              </h3>
              <p>{st.text}</p>
            </div>
          ))}
        </div>
        {s.order_info && (
          <div className="container" style={{ maxWidth: 760, marginTop: '2.5rem' }}>
            <div className="notice">
              <strong>Livraison et paiement</strong>
              {s.order_info.split(/\n+/).map((l, i) => (
                <p key={i} style={{ margin: '.4rem 0 0' }}>
                  {l}
                </p>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
