-- ============================================================
-- PUR'ESSENCE — Schéma Supabase
-- À exécuter une fois dans l'éditeur SQL du projet Supabase.
-- ============================================================

-- ---------- Administrateurs ----------
create table if not exists public.admins (
  email text primary key,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

drop policy if exists "admins lisent admins" on public.admins;
create policy "admins lisent admins" on public.admins for select to authenticated using (public.is_admin());

-- ---------- Réglages (numéros, adresses, réseaux) ----------
create table if not exists public.settings (
  key text primary key,
  value text not null default '',
  updated_at timestamptz not null default now()
);
alter table public.settings enable row level security;
drop policy if exists "lecture publique réglages" on public.settings;
create policy "lecture publique réglages" on public.settings for select using (true);
drop policy if exists "admin écrit réglages" on public.settings;
create policy "admin écrit réglages" on public.settings for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------- Produits ----------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null,
  short text not null default '',
  description text not null default '',
  benefits text[] not null default '{}',
  usage_tips text not null default '',
  precautions text,
  category text not null default 'huile-essentielle' check (category in ('huile-essentielle','huile-vegetale','synergie','hydrolat-absolue','soin','melange','diffuseur','coffret')),
  latin_name text,
  english_name text,
  origin text,
  sizes text,
  domain text,
  identity jsonb,
  fiche text,
  usage text not null default 'sante' check (usage in ('relaxation','sante','beaute','energie','digestion')),
  price_fcfa integer check (price_fcfa is null or price_fcfa >= 0),
  volume text,
  image_url text,
  in_stock boolean not null default true,
  featured boolean not null default false,
  published boolean not null default true,
  sort integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.products enable row level security;
drop policy if exists "lecture publique produits" on public.products;
create policy "lecture publique produits" on public.products for select using (published or public.is_admin());
drop policy if exists "admin écrit produits" on public.products;
create policy "admin écrit produits" on public.products for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------- Avis clients (modérés) ----------
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 40),
  city text check (city is null or char_length(city) <= 40),
  product text check (product is null or char_length(product) <= 60),
  rating smallint not null check (rating between 1 and 5),
  text text not null check (char_length(text) between 10 and 600),
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);
alter table public.reviews enable row level security;
drop policy if exists "lecture avis approuvés" on public.reviews;
create policy "lecture avis approuvés" on public.reviews for select using (status = 'approved' or public.is_admin());
drop policy if exists "dépôt avis public" on public.reviews;
create policy "dépôt avis public" on public.reviews for insert to anon, authenticated with check (status = 'pending');
drop policy if exists "admin gère avis" on public.reviews;
create policy "admin gère avis" on public.reviews for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin supprime avis" on public.reviews;
create policy "admin supprime avis" on public.reviews for delete to authenticated using (public.is_admin());

-- ---------- Demandes (consultation, contact, commande) ----------
create table if not exists public.requests (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('consultation','contact','commande')),
  name text not null check (char_length(name) between 2 and 80),
  phone text check (phone is null or char_length(phone) <= 30),
  email text check (email is null or char_length(email) <= 120),
  subject text check (subject is null or char_length(subject) <= 120),
  message text check (message is null or char_length(message) <= 2000),
  consult_date date,
  consult_time text check (consult_time is null or char_length(consult_time) <= 10),
  consult_type text check (consult_type is null or char_length(consult_type) <= 40),
  status text not null default 'nouveau' check (status in ('nouveau','en_cours','traite','archive')),
  admin_note text,
  created_at timestamptz not null default now()
);
alter table public.requests enable row level security;
drop policy if exists "dépôt demande public" on public.requests;
create policy "dépôt demande public" on public.requests for insert to anon, authenticated with check (status = 'nouveau' and admin_note is null);
drop policy if exists "admin lit demandes" on public.requests;
create policy "admin lit demandes" on public.requests for select to authenticated using (public.is_admin());
drop policy if exists "admin modifie demandes" on public.requests;
create policy "admin modifie demandes" on public.requests for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin supprime demandes" on public.requests;
create policy "admin supprime demandes" on public.requests for delete to authenticated using (public.is_admin());

-- Anti-spam : 30 dépôts max par tranche de 10 minutes (avis + demandes)
create or replace function public.limit_public_inserts()
returns trigger language plpgsql security definer set search_path = public as $$
declare n integer;
begin
  if public.is_admin() then return new; end if;
  execute format('select count(*) from public.%I where created_at > now() - interval ''10 minutes''', tg_table_name) into n;
  if n >= 30 then
    raise exception 'Trop de demandes en peu de temps. Réessayez dans quelques minutes.';
  end if;
  return new;
end $$;
drop trigger if exists trg_limit_reviews on public.reviews;
create trigger trg_limit_reviews before insert on public.reviews for each row execute function public.limit_public_inserts();
drop trigger if exists trg_limit_requests on public.requests;
create trigger trg_limit_requests before insert on public.requests for each row execute function public.limit_public_inserts();

-- ---------- Équipe ----------
create table if not exists public.team (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null default '',
  photo_url text,
  published boolean not null default true,
  sort integer not null default 0,
  created_at timestamptz not null default now()
);
alter table public.team enable row level security;
drop policy if exists "lecture publique équipe" on public.team;
create policy "lecture publique équipe" on public.team for select using (published or public.is_admin());
drop policy if exists "admin écrit équipe" on public.team;
create policy "admin écrit équipe" on public.team for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------- FAQ ----------
create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  published boolean not null default true,
  sort integer not null default 0,
  created_at timestamptz not null default now()
);
alter table public.faqs enable row level security;
drop policy if exists "lecture publique faq" on public.faqs;
create policy "lecture publique faq" on public.faqs for select using (published or public.is_admin());
drop policy if exists "admin écrit faq" on public.faqs;
create policy "admin écrit faq" on public.faqs for all to authenticated using (public.is_admin()) with check (public.is_admin());


-- ---------- Labels / certifications ----------
create table if not exists public.certifications (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  icon text not null default 'fa-certificate',
  published boolean not null default true,
  sort integer not null default 0,
  created_at timestamptz not null default now()
);
alter table public.certifications enable row level security;
drop policy if exists "lecture publique labels" on public.certifications;
create policy "lecture publique labels" on public.certifications for select using (published or public.is_admin());
drop policy if exists "admin écrit labels" on public.certifications;
create policy "admin écrit labels" on public.certifications for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------- Résultats avant / après ----------
create table if not exists public.results (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  text text not null default '',
  before_url text,
  after_url text,
  published boolean not null default true,
  sort integer not null default 0,
  created_at timestamptz not null default now()
);
alter table public.results enable row level security;
drop policy if exists "lecture publique résultats" on public.results;
create policy "lecture publique résultats" on public.results for select using (published or public.is_admin());
drop policy if exists "admin écrit résultats" on public.results;
create policy "admin écrit résultats" on public.results for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------- updated_at ----------
create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
drop trigger if exists trg_products_updated on public.products;
create trigger trg_products_updated before update on public.products for each row execute function public.touch_updated_at();
drop trigger if exists trg_settings_updated on public.settings;
create trigger trg_settings_updated before update on public.settings for each row execute function public.touch_updated_at();

-- ---------- Stockage des images ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;
drop policy if exists "admin envoie médias" on storage.objects;
create policy "admin envoie médias" on storage.objects for insert to authenticated with check (bucket_id = 'media' and public.is_admin());
drop policy if exists "admin modifie médias" on storage.objects;
create policy "admin modifie médias" on storage.objects for update to authenticated using (bucket_id = 'media' and public.is_admin());
drop policy if exists "admin supprime médias" on storage.objects;
create policy "admin supprime médias" on storage.objects for delete to authenticated using (bucket_id = 'media' and public.is_admin());

-- ============================================================
-- DONNÉES DE DÉPART
-- ============================================================
insert into public.admins (email) values ('yungagency3@gmail.com') on conflict do nothing;

insert into public.settings (key, value) values
  ('phone_cm', '+237 6 50 82 67 38'),
  ('whatsapp_cm', '237650826738'),
  ('phone_ca', ''),
  ('whatsapp_ca', ''),
  ('email', 'pur.essencebio2000@gmail.com'),
  ('address', 'Mimboman, Yaoundé, Cameroun'),
  ('address_ca', ''),
  ('hours', 'Lundi – Vendredi : 08h00 – 18h00 · Samedi : 09h00 – 15h00 · Dimanche : fermé'),
  ('instagram', ''),
  ('facebook', ''),
  ('tiktok', ''),
  ('stat_satisfaction', '98'),
  ('stat_consultations', '500'),
  ('stat_clients', '1000')
on conflict (key) do nothing;

insert into public.team (name, role, sort) values
  ('M. AWAWO William', 'PDG', 0),
  ('Dr. Nathalie M.', 'Responsable Qualité', 1),
  ('Amina B.', 'Conseillère Bien-être', 2),
  ('Emmanuel T.', 'Expert Botanique', 3);

insert into public.certifications (label, icon, sort) values
  ('Bio Certifié', 'fa-leaf', 0),
  ('Testé en Laboratoire', 'fa-flask', 1),
  ('Non Testé sur Animaux', 'fa-paw', 2),
  ('Made in Cameroun & Canada', 'fa-flag', 3),
  ('Éco-Responsable', 'fa-recycle', 4),
  ('ISO 9001', 'fa-certificate', 5);

insert into public.results (title, text, sort) values
  ('Peau revitalisée — Soin Carotte + Palmarosa', 'Après 4 semaines d''utilisation quotidienne, la peau retrouve son éclat naturel et sa souplesse. Les imperfections diminuent significativement.', 0),
  ('Sommeil retrouvé — Protocole Lavande + Mandarine', 'En 2 semaines de diffusion nocturne, le temps d''endormissement passe de 45 min à 15 min. Un sommeil profond et réparateur retrouvé.', 1);

insert into public.reviews (name, city, product, rating, text, status, created_at) values
  ('Amina M.', 'Yaoundé', 'Lavande', 5, 'Chaque goutte est une invitation au calme, avec une qualité qui se ressent immédiatement. L''huile de Lavande m''a aidée à retrouver un sommeil paisible après des mois d''insomnie.', 'approved', '2024-06-01'),
  ('Samuel K.', 'Douala', null, 5, 'Service premium et huiles authentiques. J''ai redécouvert un bien-être profond. La consultation m''a permis de trouver les produits parfaits pour mes besoins.', 'approved', '2025-02-01'),
  ('Chloé B.', 'Bafoussam', 'Menthe Poivrée', 5, 'Un rituel de luxe qui transforme ma routine quotidienne. Élégance et pureté dans chaque flacon. Je recommande vivement la Menthe Poivrée contre les migraines.', 'approved', '2024-09-01'),
  ('Marie N.', 'Kribi', 'Palmarosa', 5, 'Les consultations personnalisées m''ont aidée à trouver les produits parfaits pour ma peau. Résultats visibles en 2 semaines ! La Palmarosa est devenue mon indispensable.', 'approved', '2025-04-01'),
  ('Jean T.', 'Yaoundé', 'Eucalyptus', 4, 'L''Eucalyptus est incroyable pour dégager les voies respiratoires. Depuis que je l''utilise en diffusion dans mon bureau, je suis beaucoup plus productif et concentré.', 'approved', '2024-11-01'),
  ('Fatima L.', 'Douala', 'Brûle Graisse', 5, 'Le Brûle Graisse est incroyablement efficace ! Combiné aux conseils de l''équipe sur l''alimentation et l''exercice, j''ai vu des résultats remarquables en un mois.', 'approved', '2025-06-01');

insert into public.faqs (question, answer, sort) values
 ('Combien de temps dure une consultation ?', 'Une consultation dure en moyenne 30 à 45 minutes. La première séance peut être un peu plus longue, le temps de bien comprendre vos besoins.', 0),
 ('La consultation est-elle payante ?', 'Contactez-nous pour connaître les tarifs en vigueur et les conditions de la première consultation.', 1),
 ('Puis-je consulter à distance ?', 'Oui. Les consultations peuvent se faire à la boutique à Yaoundé, par appel téléphonique ou par appel vidéo WhatsApp.', 2),
 ('Les huiles essentielles sont-elles sans danger ?', 'Ce sont des produits naturels très concentrés : ils doivent être dilués et utilisés avec précaution. Certaines huiles sont déconseillées aux femmes enceintes ou allaitantes, aux jeunes enfants et aux personnes épileptiques. Nos conseils ne remplacent pas l''avis d''un médecin.', 3),
 ('Comment se passe le suivi ?', 'Après votre consultation, nous restons joignables sur WhatsApp pour répondre à vos questions et ajuster vos routines si nécessaire.', 4),
 ('Comment commander ?', 'Choisissez vos produits puis cliquez sur « Commander sur WhatsApp » : votre message est pré-rempli. Nous vous confirmons la disponibilité, le prix et la livraison.', 5);
-- Le catalogue (141 produits issus des fiches techniques) est dans supabase/seed-produits.sql : à exécuter juste après ce fichier.
