/**
 * Repère, dans un texte, les noms des produits du catalogue (« Lavande Vraie », « Camomille Romaine »…)
 * pour en faire des liens vers leurs fiches.
 */
export type MentionTarget = { slug: string; name: string };
export type MentionIndex = { re: RegExp; terms: Map<string, string> };
export type Piece = string | { text: string; slug: string };

// Premiers mots trop vagues pour servir de raccourci (« Huile », « Orange » de « peau d'orange »…).
const GENERIC = new Set([
  'huile', 'synergie', 'graines', 'pépins', 'germe', 'noyaux', 'absolue', 'hydrolat', 'oléorésine', 'vitamine',
  'poivre', 'bois', 'orange', 'petit', 'arbre', 'clou', 'eucalyptus', 'ricin', 'santal', 'mandarine',
]);

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function buildMentionIndex(products: MentionTarget[]): MentionIndex {
  const terms = new Map<string, string>();
  const firstWords = new Map<string, number>();
  for (const p of products) {
    const fw = p.name.split(/\s+/)[0].toLowerCase();
    firstWords.set(fw, (firstWords.get(fw) ?? 0) + 1);
  }
  for (const p of products) terms.set(p.name.toLowerCase(), p.slug);
  // Raccourci par le premier mot (« Lavande » → Lavande Vraie) quand il est unique et précis.
  for (const p of products) {
    const words = p.name.split(/\s+/);
    if (words.length < 2) continue;
    const fw = words[0].toLowerCase();
    if (fw.length >= 6 && firstWords.get(fw) === 1 && !GENERIC.has(fw) && !terms.has(fw)) terms.set(fw, p.slug);
  }
  const alternatives = [...terms.keys()].sort((a, b) => b.length - a.length).map(escape);
  const re = new RegExp(`(?<![\\p{L}])(${alternatives.join('|')})(?![\\p{L}])`, 'giu');
  return { re, terms };
}

/** Découpe le texte en morceaux : texte simple, ou mention liée à une fiche (une seule fois par produit grâce à `seen`). */
export function splitMentions(text: string, idx: MentionIndex | undefined, seen: Set<string>, exclude?: string): Piece[] {
  if (!idx || !text) return [text];
  const out: Piece[] = [];
  let last = 0;
  for (const m of text.matchAll(idx.re)) {
    const slug = idx.terms.get(m[0].toLowerCase());
    if (!slug || slug === exclude || seen.has(slug) || m.index === undefined) continue;
    seen.add(slug);
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push({ text: m[0], slug });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/** Tous les produits cités dans un texte, dans l'ordre d'apparition. */
export function listMentions(text: string, idx: MentionIndex, exclude?: string): string[] {
  const seen = new Set<string>();
  splitMentions(text, idx, seen, exclude);
  return [...seen];
}
