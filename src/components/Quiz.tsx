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
    products: [['lavande', 'Lavande'], ['ylang-ylang', 'Ylang Ylang'], ['orange-douce', 'Orange douce']],
  },
  sommeil: {
    icon: 'fa-moon',
    title: 'Sommeil',
    text: "Diffusez de la lavande ou de la mandarine rouge dans la chambre 30 minutes avant le coucher. Le petit grain est aussi apprécié pour favoriser l'endormissement.",
    usage: 'relaxation',
    products: [['lavande', 'Lavande'], ['mandarine-rouge', 'Mandarine rouge'], ['petit-grain', 'Petit grain']],
  },
  beaute: {
    icon: 'fa-wand-magic-sparkles',
    title: 'Beauté',
    text: "La carotte est appréciée pour l'éclat du teint, la palmarosa pour les peaux mixtes à grasses. Ajoutez 2 à 3 gouttes à votre crème ou à une huile végétale.",
    usage: 'beaute',
    products: [['carotte', 'Carotte'], ['palmarosa', 'Palmarosa'], ['helichryse', 'Hélichryse']],
  },
  energie: {
    icon: 'fa-bolt',
    title: 'Énergie',
    text: "La menthe poivrée et le romarin sont stimulants. En inhalation le matin ou en diffusion pendant le travail (déconseillés aux jeunes enfants).",
    usage: 'energie',
    products: [['menthe-poivree', 'Menthe poivrée'], ['romarin', 'Romarin'], ['eucalyptus', 'Eucalyptus']],
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
