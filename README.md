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

Tant que Supabase n'est pas branché, le site public fonctionne avec les 30 produits de l'ancien site (fichier `src/data/seed-products.ts`). Les formulaires et l'admin ont besoin de la base.

## Mise en route

1. **Supabase** : créer un projet (région Paris `eu-west-3`), puis dans *SQL Editor* exécuter `supabase/schema.sql` en entier. Le fichier crée les tables, les règles de sécurité, le stockage d'images et les 30 produits.
2. **Compte admin** : dans *Authentication → Users → Add user*, créer l'utilisateur avec email et mot de passe. Ajouter son email à la table `admins` si ce n'est pas `yungagency3@gmail.com` :
   ```sql
   insert into public.admins (email) values ('pur.essencebio2000@gmail.com');
   ```
3. **Vercel** : importer ce dépôt et ajouter les variables d'environnement (voir `.env.example`) :
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`.
4. **Images de l'ancien site** : copier les dossiers `images/` et `image produit 3D/` dans `public/`. Les chemins des produits pointent déjà dessus (le logo doit être `public/images/logo.png`). On peut ensuite remplacer chaque photo depuis l'admin.

## Sécurité

- Toutes les écritures sont protégées en base (RLS) : seul un email listé dans `admins` peut modifier le contenu.
- Le public peut seulement *déposer* un avis (toujours en attente) ou une demande. Il ne peut pas les lire.
- Anti-spam : champ piège invisible + 30 dépôts maximum par tranche de 10 minutes.
- Aucune clé secrète dans le code : seule la clé publique Supabase est utilisée.

## À compléter par le client

- Prix et contenances (le tableau de bord indique les produits sans prix).
- Vrai numéro WhatsApp Canada (Admin → Coordonnées). Il est masqué tant que le champ est vide.
- Photos de l'équipe et des résultats avant/après, liens des réseaux sociaux.
- Justificatifs du contenu repris de l'ancien site (ISO 9001, Bio, tests en laboratoire, chiffres, avis) : tout est modifiable ou masquable dans l'admin.
- Faire relire par un professionnel les textes santé des produits.
