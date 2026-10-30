'use client';
import { useState } from 'react';
import Link from 'next/link';

type Need = 'relaxation' | 'sommeil' | 'beaute' | 'energie';

const RECS: Record<Need, { icon: string; title: string; text: string; usage: string; products: [string, string][] }> = {
  relaxation: {
    icon: 'fa-spa',
    title: 'Relaxation',
    text: "La lavande et l'ylang-ylang sont traditionnellement associées à la détente. En diffusion ou en massage dilué sur les poignets, pour un moment de calme.",
    usage: 'relaxation',
    products: [['lavande-vraie', 'Lavande vraie'], ['ylang-ylang', 'Ylang-Ylang'], ['orange-douce', 'Orange douce']],
  },
  sommeil: {
    icon: 'fa-moon',
    title: 'Sommeil',
    text: "Notre Synergie Insomnie associe camomille romaine, petit grain bigarade, lavande vraie et angélique. La lavande vraie seule, en diffusion 30 minutes avant le coucher, est aussi très appréciée.",
    usage: 'relaxation',
    products: [['synergie-insomnie', 'Synergie Insomnie'], ['lavande-vraie', 'Lavande vraie'], ['petit-grain-bigarade', 'Petit grain bigarade']],
  },
  beaute: {
    icon: 'fa-wand-magic-sparkles',
    title: 'Beauté',
    text: "L'huile végétale de rose musquée nourrit les peaux sèches et matures ; quelques gouttes d'huile essentielle de carotte ou d'hélichryse s'y ajoutent pour l'éclat du teint.",
    usage: 'beaute',
    products: [['rose-musquee', 'HV Rose musquée'], ['carotte', 'Carotte'], ['helichryse-italienne', 'Hélichryse italienne']],
  },
  energie: {
    icon: 'fa-bolt',
    title: 'Énergie',
    text: "Notre Synergie Fatigue & Asthénie accompagne les baisses de tonus. La menthe poivrée et le romarin sont aussi stimulants en inhalation (déconseillés aux jeunes enfants).",
    usage: 'energie',
    products: [['synergie-fatigue-asthenie', 'Synergie Fatigue'], ['menthe-poivree', 'Menthe poivrée'], ['romarin-a-verbenone', 'Romarin à verbénone']],
  },
};

export default function Quiz() {
  const [need, setNeed] = useState<Need | null>(null);
  const rec = need ? RECS[need] : null;
  return (
    <>
      <div className="quiz-options" role="group" aria-label="Votre besoin">
        {(Object.keys(RECS) as Need[]).map((k) => (
          <button
            key={k}
            type="button"
            className={`quiz-option${need === k ? ' selected' : ''}`}
            aria-pressed={need === k}
            onClick={() => setNeed(k)}
          >
            <span className="quiz-emoji">
              <i className={`fas ${RECS[k].icon}`}></i>
            </span>
            {RECS[k].title}
          </button>
        ))}
      </div>
      {rec && (
        <div className="quiz-result visible" aria-live="polite">
          <h3>
            <i className={`fas ${rec.icon}`}></i> Nos suggestions : {rec.title}
          </h3>
          <p>{rec.text}</p>
          <div className="btn-row" style={{ justifyContent: 'center', marginTop: '1.2rem' }}>
            {rec.products.map(([slug, label]) => (
              <Link key={slug} href={`/produits/${slug}`} className="button button-secondary button-sm">
                {label}
              </Link>
            ))}
          </div>
          <p style={{ fontSize: '.8rem', marginTop: '1rem', opacity: 0.75 }}>
            Suggestions générales, à adapter : demandez conseil en consultation en cas de grossesse, de traitement ou de maladie.
          </p>
        </div>
      )}
    </>
  );
}
