# Pur'Essence — site v2

Site vitrine et catalogue de Pur'Essence (huiles essentielles, Yaoundé), avec espace d'administration.
Réalisé par Yung's Agency.

**Stack** : Next.js 15 (App Router) · Supabase (base de données, connexion, stockage d'images) · Vercel.

## Ce que fait le site

| Côté public | Côté admin (`/admin`) |
|---|---|
| Accueil, catalogue avec recherche et filtres | Tableau de bord (demandes, avis à modérer, produits sans prix) |
| Fiche par produit (`/produits/lavande`…) avec commande WhatsApp pré-remplie et quantité | Produits : ajout, modification, photo, prix, stock, « à la une », publication |
| Services, À propos, équipe | Avis : publier, refuser, supprimer |
| Avis clients (publiés après modération) | Demandes : statut, note interne, WhatsApp/appel en un clic, export Excel (CSV) |
| Réservation de consultation (date, créneau, type) enregistrée en base + envoi WhatsApp | Équipe, FAQ, labels/certifications, résultats avant/après |
| Contact (enregistré en base + WhatsApp), carte Mimboman | Coordonnées : numéros (Cameroun / Canada), email, adresses, horaires, réseaux, chiffres clés |
| Mentions légales et avertissement santé, sitemap, robots | |

Le catalogue compte **141 produits** issus des fiches techniques du client : 69 huiles essentielles, 35 huiles végétales, 32 synergies, 4 hydrolats ou absolues et la vitamine E. 57 produits ont déjà leur photo, dans `public/images/produits/`. Tant que Supabase n'est pas branché, le site public fonctionne avec ce catalogue (`src/data/seed-products.ts`). Les formulaires et l'admin ont besoin de la base.

## Mise en route

1. **Supabase** : créer un projet (région Paris `eu-west-3`). Dans *SQL Editor*, exécuter d'abord `supabase/schema.sql` (tables, sécurité, stockage d'images, contenu de départ), puis `supabase/seed-produits.sql` (les 141 produits). **Une seule fois chacun.**
2. **Compte admin** : dans *Authentication → Users → Add user*, créer l'utilisateur avec email et mot de passe. Ajouter son email à la table `admins` si ce n'est pas `yungagency3@gmail.com` :
   ```sql
   insert into public.admins (email) values ('pur.essencebio2000@gmail.com');
   ```
3. **Vercel** : importer ce dépôt et ajouter les variables d'environnement (voir `.env.example`) :
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`.
4. **Logo** : déposer le logo dans `public/images/logo.png` (sinon le nom s'affiche en texte). Les photos manquantes s'ajoutent produit par produit depuis l'admin (filtre « Sans photo »).

## Sécurité

- Toutes les écritures sont protégées en base (RLS) : seul un email listé dans `admins` peut modifier le contenu.
- Le public peut seulement *déposer* un avis (toujours en attente) ou une demande. Il ne peut pas les lire.
- Anti-spam : champ piège invisible + 30 dépôts maximum par tranche de 10 minutes.
- Aucune clé secrète dans le code : seule la clé publique Supabase est utilisée.

## À compléter par le client

- Prix (le tableau de bord indique les produits sans prix) et 84 photos manquantes (filtre « Sans photo » dans l'admin).
- 4 synergies importées **non publiées** car elles visent des maladies (AVC, glycémie, tension, cholestérol) : à valider avant publication.
- Vrai numéro WhatsApp Canada (Admin → Coordonnées). Il est masqué tant que le champ est vide.
- Photos de l'équipe et des résultats avant/après, liens des réseaux sociaux.
- Justificatifs du contenu repris de l'ancien site (ISO 9001, Bio, tests en laboratoire, chiffres, avis) : tout est modifiable ou masquable dans l'admin.
- Faire relire par un professionnel les textes santé des produits.
