import Link from 'next/link';
import { splitMentions, type MentionIndex } from '@/lib/mentions';

/** Texte dont les noms de produits deviennent des liens vers leurs fiches. */
export default function Linked({
  text,
  idx,
  seen,
  exclude,
}: {
  text: string;
  idx?: MentionIndex;
  seen: Set<string>;
  exclude?: string;
}) {
  return (
    <>
      {splitMentions(text, idx, seen, exclude).map((p, i) =>
        typeof p === 'string' ? (
          p
        ) : (
          <Link key={i} href={`/produits/${p.slug}`} className="mention" title={`Voir la fiche ${p.text}`}>
            {p.text}
          </Link>
        )
      )}
    </>
  );
}
