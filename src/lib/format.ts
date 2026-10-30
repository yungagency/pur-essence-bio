export function formatFcfa(n: number | null | undefined): string | null {
  if (n === null || n === undefined) return null;
  return new Intl.NumberFormat('fr-FR').format(n).replace(/ | /g, ' ') + ' FCFA';
}

export function waLink(number: string, text?: string): string {
  const digits = (number || '').replace(/\D/g, '');
  const base = `https://wa.me/${digits}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export function telHref(display: string): string {
  return 'tel:' + (display || '').replace(/[^\d+]/g, '');
}

/** Encode un chemin d'image local (les anciens dossiers contiennent des espaces). */
export function imgSrc(url: string | null | undefined): string | null {
  if (!url) return null;
  if (/^https?:\/\//.test(url)) return url;
  return encodeURI(url);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function slugify(s: string): string {
  return s
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
