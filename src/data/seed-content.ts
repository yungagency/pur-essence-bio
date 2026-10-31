// Contenu d'origine du site (repris tel quel à la demande du client).
// Utilisé seulement tant que la base n'est pas branchée ; ensuite tout se gère dans l'admin.
import type { Certification, Result, Review, TeamMember } from '@/lib/types';

export const seedTeam: TeamMember[] = [
  { id: 't1', name: 'Dr William AWAWO', role: 'Consultant', photo_url: null, published: true, sort: 0 },
  { id: 't2', name: 'Dr. Nathalie M.', role: 'Responsable Qualité', photo_url: null, published: true, sort: 1 },
  { id: 't3', name: 'Amina B.', role: 'Conseillère Bien-être', photo_url: null, published: true, sort: 2 },
  { id: 't4', name: 'Emmanuel T.', role: 'Expert Botanique', photo_url: null, published: true, sort: 3 },
];

export const seedCertifications: Certification[] = [
  { id: 'c1', label: 'Bio Certifié', icon: 'fa-leaf', published: true, sort: 0 },
  { id: 'c2', label: 'Testé en Laboratoire', icon: 'fa-flask', published: true, sort: 1 },
  { id: 'c3', label: 'Non Testé sur Animaux', icon: 'fa-paw', published: true, sort: 2 },
  { id: 'c4', label: 'Made in Canada', icon: 'fa-flag', published: true, sort: 3 },
  { id: 'c5', label: 'Éco-Responsable', icon: 'fa-recycle', published: true, sort: 4 },
  { id: 'c6', label: 'ISO 9001', icon: 'fa-certificate', published: true, sort: 5 },
];

export const seedResults: Result[] = [
  {
    id: 'r1',
    title: 'Peau revitalisée — Soin Carotte + Palmarosa',
    text: "Après 4 semaines d'utilisation quotidienne, la peau retrouve son éclat naturel et sa souplesse. Les imperfections diminuent significativement.",
    before_url: null,
    after_url: null,
    published: true,
    sort: 0,
  },
  {
    id: 'r2',
    title: 'Sommeil retrouvé — Protocole Lavande + Mandarine',
    text: "En 2 semaines de diffusion nocturne, le temps d'endormissement passe de 45 min à 15 min. Un sommeil profond et réparateur retrouvé.",
    before_url: null,
    after_url: null,
    published: true,
    sort: 1,
  },
];

const r = (id: string, name: string, city: string, product: string | null, rating: number, text: string, created_at: string): Review => ({
  id, name, city, product, rating, text, status: 'approved', created_at,
});

export const seedReviews: Review[] = [
  r('v6', 'Fatima L.', 'Douala', 'Brûle Graisse', 5, "Le Brûle Graisse est incroyablement efficace ! Combiné aux conseils de l'équipe sur l'alimentation et l'exercice, j'ai vu des résultats remarquables en un mois.", '2025-06-01'),
  r('v4', 'Marie N.', 'Kribi', 'Palmarosa', 5, "Les consultations personnalisées m'ont aidée à trouver les produits parfaits pour ma peau. Résultats visibles en 2 semaines ! La Palmarosa est devenue mon indispensable.", '2025-04-01'),
  r('v2', 'Samuel K.', 'Douala', null, 5, "Service premium et huiles authentiques. J'ai redécouvert un bien-être profond. La consultation m'a permis de trouver les produits parfaits pour mes besoins.", '2025-02-01'),
  r('v5', 'Jean T.', 'Yaoundé', 'Eucalyptus', 4, "L'Eucalyptus est incroyable pour dégager les voies respiratoires. Depuis que je l'utilise en diffusion dans mon bureau, je suis beaucoup plus productif et concentré.", '2024-11-01'),
  r('v3', 'Chloé B.', 'Bafoussam', 'Menthe Poivrée', 5, 'Un rituel de luxe qui transforme ma routine quotidienne. Élégance et pureté dans chaque flacon. Je recommande vivement la Menthe Poivrée contre les migraines.', '2024-09-01'),
  r('v1', 'Amina M.', 'Yaoundé', 'Lavande', 5, "Chaque goutte est une invitation au calme, avec une qualité qui se ressent immédiatement. L'huile de Lavande m'a aidée à retrouver un sommeil paisible après des mois d'insomnie.", '2024-06-01'),
];
