/**
 * Adresse publique du site. Priorité : NEXT_PUBLIC_SITE_URL (nom de domaine définitif),
 * sinon l'adresse de production fournie automatiquement par Vercel.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '') ||
  'http://localhost:3000'
).replace(/\/$/, '');
