import type { Faq as FaqItem } from '@/lib/types';

/** Accordéon natif (details/summary) : accessible et sans JavaScript. */
export default function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="faq-list">
      {items.map((f) => (
        <details key={f.id} className="faq-item faq-details">
          <summary className="faq-question">
            {f.question} <i className="fas fa-chevron-down" aria-hidden="true"></i>
          </summary>
          <div style={{ paddingBottom: '1.3rem' }}>
            <p className="muted" style={{ fontSize: '.92rem' }}>
              {f.answer}
            </p>
          </div>
        </details>
      ))}
    </div>
  );
}
