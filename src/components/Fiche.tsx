import Linked from './Linked';
import type { MentionIndex } from '@/lib/mentions';

/**
 * Affiche une fiche produit écrite en texte simple :
 *   ## Titre de section   → section repliable
 *   ### Sous-titre        → sous-titre
 *   #### Petit titre      → libellé
 *   - élément             → liste à puces
 *   autre ligne           → paragraphe
 */
type Block =
  | { t: 'h3' | 'h4' | 'p'; text: string }
  | { t: 'ul'; items: string[] };
type Section = { title: string; blocks: Block[] };

function parse(src: string): Section[] {
  const sections: Section[] = [];
  let cur: Section = { title: '', blocks: [] };
  for (const raw of src.split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith('## ')) {
      if (cur.title || cur.blocks.length) sections.push(cur);
      cur = { title: line.slice(3).trim(), blocks: [] };
    } else if (line.startsWith('#### ')) {
      cur.blocks.push({ t: 'h4', text: line.slice(5) });
    } else if (line.startsWith('### ')) {
      cur.blocks.push({ t: 'h3', text: line.slice(4) });
    } else if (line.startsWith('- ')) {
      const last = cur.blocks[cur.blocks.length - 1];
      if (last && last.t === 'ul') last.items.push(line.slice(2));
      else cur.blocks.push({ t: 'ul', items: [line.slice(2)] });
    } else {
      cur.blocks.push({ t: 'p', text: line });
    }
  }
  if (cur.title || cur.blocks.length) sections.push(cur);
  return sections;
}

const OPEN_BY_DEFAULT = ['bienfaits pour la santé', 'conseils d', 'précaution', 'composition', 'objectifs', 'actifs nutritionnels'];

function Blocks({ blocks, idx, exclude }: { blocks: Block[]; idx?: MentionIndex; exclude?: string }) {
  const seen = new Set<string>();
  const L = (text: string) => <Linked text={text} idx={idx} seen={seen} exclude={exclude} />;
  return (
    <>
      {blocks.map((b, i) =>
        b.t === 'ul' ? (
          <ul key={i} className="fiche-list">
            {b.items.map((it, j) => (
              <li key={j}>{L(it)}</li>
            ))}
          </ul>
        ) : b.t === 'h3' ? (
          <h4 key={i} className="fiche-h3">
            {b.text}
          </h4>
        ) : b.t === 'h4' ? (
          <p key={i} className="fiche-h4">
            {b.text}
          </p>
        ) : (
          <p key={i}>{L(b.text)}</p>
        )
      )}
    </>
  );
}

export default function Fiche({
  source,
  title,
  idx,
  exclude,
}: {
  source: string;
  title?: string;
  idx?: MentionIndex;
  exclude?: string;
}) {
  const sections = parse(source);
  // Première ligne qui ne fait que répéter le nom du produit (« Huile Végétale d'Argan Bio ») : inutile.
  const first = sections[0];
  if (first && !first.title && first.blocks[0]?.t === 'p') {
    const txt = first.blocks[0].text;
    const looksLikeTitle = txt.length < 70 && !/[.:!?]$/.test(txt) && (!title || txt.toLowerCase().includes(title.toLowerCase().split(' ')[0]));
    if (looksLikeTitle) first.blocks.shift();
    if (first.blocks.length === 0) sections.shift();
  }
  if (sections.length === 0) return null;
  return (
    <div className="fiche">
      {sections.map((s, i) =>
        s.title ? (
          <details
            key={i}
            className="fiche-section"
            open={OPEN_BY_DEFAULT.some((k) => s.title.toLowerCase().includes(k))}
          >
            <summary>
              <span>{s.title}</span>
              <i className="fas fa-chevron-down" aria-hidden="true"></i>
            </summary>
            <div className="fiche-body">
              <Blocks blocks={s.blocks} idx={idx} exclude={exclude} />
            </div>
          </details>
        ) : (
          <div key={i} className="fiche-intro">
            <Blocks blocks={s.blocks} idx={idx} exclude={exclude} />
          </div>
        )
      )}
    </div>
  );
}
