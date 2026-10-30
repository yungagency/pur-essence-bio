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
  category text not null default 'huile-essentielle' check (category in ('huile-essentielle','huile-vegetale','melange','diffuseur','coffret')),
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
  ('tiktok', '')
on conflict (key) do nothing;

insert into public.team (name, role, sort) values ('M. AWAWO William', 'PDG', 0);

insert into public.faqs (question, answer, sort) values
 ('Combien de temps dure une consultation ?', 'Une consultation dure en moyenne 30 à 45 minutes. La première séance peut être un peu plus longue, le temps de bien comprendre vos besoins.', 0),
 ('La consultation est-elle payante ?', 'Contactez-nous pour connaître les tarifs en vigueur et les conditions de la première consultation.', 1),
 ('Puis-je consulter à distance ?', 'Oui. Les consultations peuvent se faire à la boutique à Yaoundé, par appel téléphonique ou par appel vidéo WhatsApp.', 2),
 ('Les huiles essentielles sont-elles sans danger ?', 'Ce sont des produits naturels très concentrés : ils doivent être dilués et utilisés avec précaution. Certaines huiles sont déconseillées aux femmes enceintes ou allaitantes, aux jeunes enfants et aux personnes épileptiques. Nos conseils ne remplacent pas l''avis d''un médecin.', 3),
 ('Comment se passe le suivi ?', 'Après votre consultation, nous restons joignables sur WhatsApp pour répondre à vos questions et ajuster vos routines si nécessaire.', 4),
 ('Comment commander ?', 'Choisissez vos produits puis cliquez sur « Commander sur WhatsApp » : votre message est pré-rempli. Nous vous confirmons la disponibilité, le prix et la livraison.', 5);
insert into public.products (slug,name,short,description,benefits,usage_tips,category,usage,image_url,featured,sort) values
('lavande','Lavande','Relaxation profonde et sommeil réparateur.','L''huile essentielle de Lavande est reconnue pour ses propriétés calmantes et relaxantes. Elle favorise un sommeil réparateur et apaise les tensions nerveuses et musculaires. Emblème de la phytothérapie, elle est incontournable dans toute aromathérapie de qualité.',array['Favorise le sommeil','Réduit le stress','Apaise les tensions musculaires','Parfum doux et floral','Cicatrisante légère']::text[],'En diffusion le soir dans la chambre ou en massage dilué sur les tempes et poignets. Quelques gouttes sur l''oreiller pour un sommeil apaisé.','huile-essentielle','relaxation','/images/Lavande.jpg',true,0),
('brule-graisse','Brûle Graisse','Mélange d''huiles pour massage, en accompagnement d''une routine minceur.','Un mélange d''huiles essentielles sélectionnées par Pur''Essence, à utiliser en massage sur les zones ciblées. Le massage régulier aide à tonifier la peau et accompagne une alimentation équilibrée et une activité physique. Formule exclusive Pur''Essence.',array['Mélange prêt à l''emploi pour massage','Accompagne une routine minceur','Sensation de peau tonifiée','À associer à une alimentation équilibrée et à une activité physique']::text[],'Appliquer en massage circulaire sur les zones ciblées (ventre, cuisses, hanches). Utiliser quotidiennement matin et soir pour de meilleurs résultats.','melange','beaute','/images/brulegraisse.png',true,1),
('menthe-poivree','Menthe Poivrée','Revitalisante et apaisante pour les maux de tête.','La Menthe Poivrée est un stimulant naturel puissant, idéal contre les maux de tête, les nausées et la fatigue mentale. Son effet frais et vivifiant agit rapidement sur l''esprit et le corps, redonnant énergie et clarté.',array['Soulage les maux de tête','Stimule la concentration','Effet rafraîchissant immédiat','Aide à la digestion','Anti-nausées']::text[],'Appliquer 1 goutte diluée sur les tempes pour les maux de tête. En diffusion pour stimuler la concentration. Déconseillée aux enfants de moins de 6 ans.','huile-essentielle','energie','/images/menthepoivree.png',true,2),
('ail','Ail','Traditionnellement utilisée pour ses propriétés assainissantes.','L''huile essentielle d''Ail est l''une des plus puissantes de la nature en termes de propriétés antibactériennes et antivirales. Utilisée depuis l''Antiquité comme remède naturel, elle soutient efficacement le système immunitaire et combat les agents infectieux.',array['Antibactérien puissant','Antiviral naturel','Renforce l''immunité','Antifongique']::text[],'En diffusion atmosphérique très diluée ou en application cutanée fortement diluée dans une huile végétale. Consulter un spécialiste avant utilisation interne.','huile-essentielle','sante','/image produit 3D/AIL.png',false,3),
('basilic-tropical','Basilic Tropical','Antispasmodique puissant et aide digestive.','Le Basilic Tropical est reconnu comme l''un des meilleurs antispasmodiques naturels. Il soulage efficacement les crampes digestives, les spasmes musculaires et les douleurs abdominales. Son action apaisante sur le système nerveux en fait aussi un excellent anti-stress.',array['Antispasmodique majeur','Soulage les crampes digestives','Réduit les spasmes musculaires','Apaisant nerveux','Anti-stress']::text[],'En massage doux sur le ventre, dilué dans une huile végétale. Peut également être utilisé en diffusion pour ses vertus apaisantes.','huile-essentielle','digestion','/image produit 3D/BASILIC TROPICAL.png',false,4),
('cannelle','Cannelle','Réchauffante et stimulante, combat la fatigue.','La Cannelle est une huile chaude, épicée et enveloppante aux propriétés tonifiantes et anti-infectieuses exceptionnelles. Elle stimule la circulation sanguine, réchauffe le corps et apporte une énergie vivifiante en période de fatigue ou de convalescence.',array['Tonifiante et énergisante','Anti-infectieuse puissante','Réchauffante naturelle','Stimule la circulation','Aphrodisiaque douce']::text[],'En diffusion pour réchauffer l''atmosphère. Toujours fortement diluer pour l''usage cutané. Usage interne réservé aux spécialistes.','huile-essentielle','sante','/image produit 3D/CANNELLE.png',false,5),
('carotte','Carotte','Régénérante cutanée pour un teint éclatant.','L''huile essentielle de Carotte est un soin beauté d''exception, riche en bêta-carotène et en vitamine A. Elle régénère les cellules cutanées en profondeur, illumine le teint terne et est reconnue pour ses propriétés anti-âge remarquables.',array['Régénère les cellules de la peau','Illumine et unifie le teint','Action anti-âge naturelle','Nourrit les peaux sèches','Revitalise le cuir chevelu']::text[],'Ajouter 2 à 3 gouttes à votre crème de nuit ou à une huile végétale. Idéale pour les peaux matures, ternes ou marquées.','huile-essentielle','beaute','/image produit 3D/CAROTTE.png',false,6),
('cedre','Cèdre','Boisé et apaisant, favorise la méditation.','Le Cèdre offre un parfum boisé, chaud et profondément apaisant qui invite à la méditation et à la reconnexion intérieure. Il possède également des propriétés décongestionnantes respiratoires et stimulantes pour la circulation lymphatique.',array['Favorise la méditation et le calme','Parfum boisé et enveloppant','Décongestionnant respiratoire','Stimule la lymphe','Anti-stress profond']::text[],'En diffusion pendant la méditation, le yoga ou la prière. En massage dilué sur le thorax pour les congestions.','huile-essentielle','relaxation','/image produit 3D/CEDRE.png',false,7),
('citronnelle','Citronnelle','Anti-moustique naturel et purifiant atmosphérique.','La Citronnelle est le répulsif d''insectes naturel par excellence, indispensable sous les tropiques. Son parfum frais et citronné purifie l''air, éloigne les moustiques et autres insectes, tout en apportant une note revigorante dans l''atmosphère.',array['Répulsif insectes naturel','Purifie et assainit l''air','Effet rafraîchissant','Antiseptique atmosphérique','Soulage les courbatures']::text[],'En diffusion le soir pour éloigner les moustiques. Application cutanée fortement diluée. Peut aussi être intégré à un spray corporel naturel.','huile-essentielle','sante','/image produit 3D/CITRONNELLE.png',false,8),
('clou-de-girofle','Clou de Girofle','Antalgique naturel, soulage les douleurs dentaires.','Le Clou de Girofle est l''une des huiles les plus puissantes en termes d''action antalgique et antiseptique. Reconnue depuis des siècles pour soulager les douleurs dentaires, elle est aussi un remarquable anti-infectieux à large spectre.',array['Antalgique puissant','Antiseptique majeur','Soulage les douleurs dentaires','Anti-infectieux large spectre','Stimulant général']::text[],'Appliquer 1 goutte sur un coton pour les douleurs dentaires. Toujours diluer pour l''usage cutané. Déconseillé pur sur les muqueuses.','huile-essentielle','sante','/image produit 3D/CLOU GIROFLE.png',false,9),
('curcuma','Curcuma','Anti-inflammatoire puissant et antioxydant.','Le Curcuma est l''une des épices les plus étudiées pour ses vertus thérapeutiques. En huile essentielle, ses propriétés anti-inflammatoires et antioxydantes sont décuplées. Il soutient la digestion.',array['Anti-inflammatoire puissant','Antioxydant majeur','Soutient et stimule la digestion','Protège les cellules']::text[],'En massage dilué sur les articulations douloureuses ou les zones inflammées. En diffusion pour ses propriétés purifiantes. Consulter un spécialiste pour usage interne.','huile-essentielle','sante','/image produit 3D/CURCUMA.png',false,10),
('cypres','Cyprès','Favorise la circulation et décongestionne.','Le Cyprès est l''huile de référence pour les troubles circulatoires et veineux. Il soulage les jambes lourdes, réduit les varices et les hémorroïdes, et tonifie les parois veineuses. Son action drainante en fait aussi un excellent allié minceur.',array['Améliore la circulation sanguine','Tonique veineux et lymphatique','Réduit les jambes lourdes','Décongestionnant','Drainant naturel']::text[],'En massage des jambes du bas vers le haut, dilué dans une huile végétale. En diffusion pour ses vertus respiratoires.','huile-essentielle','sante','/image produit 3D/CYPRES.png',false,11),
('eucalyptus','Eucalyptus','Fraîcheur naturelle pour une respiration libre.','L''Eucalyptus est un puissant décongestionnant respiratoire qui libère les voies aériennes et purifie l''air ambiant. Son action antivirale et antibactérienne en fait un indispensable en cas de rhume, bronchite ou grippe.',array['Libère les voies respiratoires','Purifie et assainit l''air','Effet rafraîchissant intense','Antibactérien et antiviral','Fébrifuge naturel']::text[],'En inhalation dans un bol d''eau chaude ou en diffusion. Appliquer dilué sur la poitrine et le dos.','huile-essentielle','sante','/image produit 3D/EUCALYPTUS.png',true,12),
('gaultherie','Gaulthérie','Anti-douleur musculaire et articulaire naturel.','La Gaulthérie couchée est le remède naturel par excellence pour les douleurs musculaires, articulaires et rhumatismales. Riche en salicylate de méthyle, elle agit rapidement en profondeur sur les douleurs, à l''instar de l''aspirine naturelle.',array['Anti-douleur musculaire et articulaire','Anti-inflammatoire rapide','Soulage les contractures','Effet chauffant et pénétrant','Idéale après le sport']::text[],'En massage dilué (max 30%) sur les zones douloureuses. Ne pas appliquer sur une peau lésée. Déconseillée aux personnes sensibles à l''aspirine.','huile-essentielle','sante','/image produit 3D/GAULTHERIE.png',false,13),
('genevrier','Genévrier','Détoxifiant et diurétique naturel.','Le Genévrier est un puissant détoxifiant qui aide l''organisme à éliminer les toxines accumulées. Ses propriétés diurétiques et dépuratives en font un allié de choix pour les cures de détox, les rhumatismes et la rétention d''eau.',array['Détoxifiant majeur','Diurétique naturel','Anti-rhumatismal','Tonique nerveux']::text[],'En massage dilué sur les zones de rétention d''eau et les reins. En diffusion pour purifier l''atmosphère. Déconseillé en cas de problèmes rénaux.','huile-essentielle','sante','/image produit 3D/GENEVRIER.png',false,14),
('helichryse','Hélichryse','Anti-hématome et cicatrisante exceptionnelle.','L''Hélichryse italienne est considérée comme la reine des huiles anti-hématomes et cicatrisantes. Précieuse et rare, elle efface les bleus, réduit les cicatrices et lutte contre le vieillissement cutané avec une efficacité reconnue par les spécialistes.',array['Anti-hématome remarquable','Cicatrisante et régénérante','Action anti-âge puissante','Réduit les cicatrices','Régénère les tissus']::text[],'Appliquer pure ou légèrement diluée sur les bleus, hématomes ou cicatrices. À intégrer dans votre soin anti-âge quotidien.','huile-essentielle','beaute','/image produit 3D/HELICHRYSE.png',false,15),
('laurier','Laurier','Équilibrant, renforce la confiance en soi.','Le Laurier noble est réputé depuis l''Antiquité pour ses vertus psychiques et physiques. Il renforce la confiance en soi, stimule le courage et aide à surmonter les blocages émotionnels. Il possède aussi de puissantes propriétés antibactériennes et antivirales.',array['Renforce la confiance en soi','Stimule le courage','Antibactérien et antiviral','Équilibrant nerveux','Favorise la créativité']::text[],'En diffusion avant un événement important ou une prise de parole. Application diluée sur le plexus solaire ou les poignets.','huile-essentielle','sante','/image produit 3D/LAURIER.png',false,16),
('mandarine-rouge','Mandarine Rouge','Calmante et réconfortante, idéale le soir.','La Mandarine Rouge offre un parfum doux, fruité et réconfortant, parfait pour apaiser l''anxiété et préparer au sommeil. Sa douceur en fait l''une des rares huiles utilisables pour les enfants (toujours diluée). Elle aide aussi à la digestion après les repas.',array['Calmante et apaisante','Favorise l''endormissement','Réconfortante et rassurante','Aide à la digestion','Adaptée aux enfants (diluée)']::text[],'En diffusion le soir pour la détente ou avant le coucher. Parfaite dans les chambres d''enfants agités. En massage abdominal après le repas.','huile-essentielle','relaxation','/image produit 3D/MANDARINE ROUGE.png',false,17),
('oliban','Oliban (Encens)','Spirituel et méditatif, favorise la sérénité.','L''Oliban, aussi appelé Encens, est utilisé depuis des millénaires dans les rituels spirituels et religieux du monde entier. Il favorise la méditation profonde, purifie l''espace énergétique et apaise l''esprit. En dermatologie, il est reconnu pour ses propriétés cicatrisantes et anti-inflammatoires.',array['Favorise la méditation profonde','Purifie l''espace et l''énergie','Apaise l''anxiété','Cicatrisant cutané','Anti-inflammatoire']::text[],'En diffusion pendant la méditation, la prière ou le yoga. Application cutanée diluée sur les cicatrices ou les peaux matures.','huile-essentielle','relaxation','/image produit 3D/OLIBAN.png',false,18),
('orange-douce','Orange Douce','Joyeuse et apaisante, pour une atmosphère chaleureuse.','L''Orange Douce est l''huile de la joie et de la convivialité. Son parfum ensoleillé et chaleureux crée instantanément une ambiance festive et réconfortante. Elle apaise l''anxiété, aide à la digestion et est très bien tolérée par tous, y compris les enfants.',array['Apaisante et anti-anxiété','Crée une atmosphère chaleureuse','Aide à la digestion','Joyeuse et tonique','Purifiante atmosphérique']::text[],'En diffusion pour créer une ambiance chaleureuse et festive. Ajouter quelques gouttes à votre eau de nettoyage pour parfumer l''espace. Parfaite pour les réunions de famille.','huile-essentielle','relaxation','/image produit 3D/ORANGE DOUCE.png',false,19),
('origan','Origan','Anti-infectieux majeur, à manier avec précaution.','L''Origan compact est l''une des huiles essentielles les plus puissantes en termes d''action anti-infectieuse. Il est traditionnellement utilisé contre les bactéries, virus, champignons et parasites. Son usage doit être encadré en raison de sa haute concentration en phénols.',array['Anti-infectieux très puissant','Puissante action antiseptique','Renforce l''immunité','Antiparasitaire','Antifongique']::text[],'Usage exclusivement cutané très dilué (max 2-3%) ou par voie orale uniquement sous contrôle d''un spécialiste. Ne pas inhaler pur.','huile-essentielle','sante','/image produit 3D/ORIGAN.png',true,20),
('palmarosa','Palmarosa','Hydratante et purifiante, parfaite pour la peau.','Le Palmarosa est un véritable trésor pour les soins cutanés. Il hydrate intensément, régule la production de sébum et possède de puissantes propriétés antibactériennes qui combattent l''acné. Son parfum fleuri et doux rappelle la rose, ce qui en fait aussi un excellent parfum naturel.',array['Hydratante et repulpante','Régule le sébum','Antibactérienne – combat l''acné','Cicatrisante douce','Parfum floral naturel']::text[],'Ajouter quelques gouttes à votre crème hydratante quotidienne ou à une huile végétale. Idéale pour les peaux mixtes à grasses.','huile-essentielle','beaute','/image produit 3D/PALMAROSA.png',true,21),
('petit-grain','Petit Grain','Apaisant nerveux, régule le stress et l''anxiété.','L''huile essentielle de Petit Grain Bigarade est extraite des feuilles et petites brindilles de l''oranger amer. Reconnue pour ses vertus apaisantes sur le système nerveux, elle régule le stress, et favorise l''endormissement.',array['Apaisant nerveux majeur','Régule le stress et l''anxiété','Combat l''insomnie','Rééquilibrant émotionnel']::text[],'En diffusion dans les moments de tension ou avant le coucher. En massage dilué sur le plexus solaire ou en inhalation sur les poignets.','huile-essentielle','relaxation','/image produit 3D/PETIT GRAIN.png',false,22),
('ravintsara','Ravintsara','Antiviral puissant, boost l''immunité.','Le Ravintsara est l''huile antivirale par excellence, très appréciée en période hivernale ou lors d''épidémies. Native de Madagascar, elle stimule les défenses immunitaires, combat les virus respiratoires et contribue à une récupération rapide. Bien tolérée et polyvalente.',array['Antiviral de référence','Stimule les défenses immunitaires','Tonifiant général','Expectorant respiratoire','Facilite la récupération']::text[],'En diffusion pour purifier l''air ou appliquer diluée sur les poignets, le thorax et le dos en prévention ou au premier signe d''infection.','huile-essentielle','sante','/image produit 3D/RAVINTSARA.png',false,23),
('romarin','Romarin','Stimulant intellectuel et énergisant naturel.','Le Romarin est l''huile des étudiants et des intellectuels. Il stimule la mémoire, améliore la concentration et combat la fatigue mentale. En massage capillaire, il renforce les cheveux, stimule leur croissance et combat les pellicules.',array['Stimule la mémoire','Améliore la concentration','Tonique capillaire – pousse des cheveux','Antifatigue mental','Stimulant circulatoire']::text[],'En diffusion pendant le travail ou les révisions pour booster les performances. En massage du cuir chevelu dilué dans une huile végétale.','huile-essentielle','energie','/image produit 3D/ROMARIN.png',false,24),
('sarriette','Sarriette','Anti-infectieux puissant, tonique général.','La Sarriette des montagnes est une huile essentielle d''une exceptionnelle puissance anti-infectieuse. Riche en carvacrol, elle combat une large palette d''agents pathogènes (bactéries, virus, champignons, parasites). Tonique physique et intellectuel, elle est aussi connue pour ses propriétés aphrodisiaques.',array['Anti-infectieux à très large spectre','Immunostimulant puissant','Antiparasitaire','Tonique physique et sexuel','Antifongique']::text[],'Usage exclusivement dilué (très corrosive à l''état pur). En massage dilué sur le plexus solaire ou la voûte plantaire. Consulter un spécialiste.','huile-essentielle','sante','/image produit 3D/SARRIETTE.png',false,25),
('sauge','Sauge','Tonifiante et purifiante, usage encadré.','La Sauge officinale est l''huile régulatrice hormonale par excellence, précieuse compagne des femmes à chaque étape de leur vie. Elle réduit les bouffées de chaleur, régule les cycles irréguliers et lutte contre la transpiration excessive. Son action purifiante en fait aussi un excellent assainissant.',array['Traditionnellement utilisée lors de la ménopause','Peut aider à limiter la transpiration','Tonifiante et purifiante','Assainissante en diffusion']::text[],'En diffusion ou massage dilué. Déconseillée aux femmes enceintes, allaitantes et aux personnes épileptiques.','huile-essentielle','sante','/image produit 3D/SAUGE.png',false,26),
('terebenthine','Térébenthine','Antiseptique respiratoire et anti-rhumatismal.','L''huile essentielle de Térébenthine est extraite de la résine des pins. Puissant antiseptique des voies respiratoires, elle est utilisée traditionnellement pour les bronchites, les rhumatismes et les douleurs musculaires. Son action revulsive procure une chaleur bienfaisante sur les zones douloureuses.',array['Antiseptique respiratoire','Anti-rhumatismal reconnu','Soulage les douleurs musculaires','Effet revulsif chauffant','Diurétique naturel']::text[],'En massage dilué sur les zones rhumatismales ou musculaires douloureuses. En inhalation très diluée pour les affections respiratoires.','huile-essentielle','sante','/image produit 3D/TEREBENTHINE.png',false,27),
('thym','Thym','Anti-infectieux majeur et stimulant immunitaire.','Le Thym à thymol est l''un des anti-infectieux les plus puissants du règne végétal. Il combat efficacement les infections respiratoires (bronchites, sinusites, rhumes), stimule l''immunité et redonne de l''énergie en période de convalescence.',array['Anti-infectieux majeur','Stimule l''immunité','Expectorant et mucolytique','Tonique général','Antifongique']::text[],'En inhalation pour les infections respiratoires. En massage dilué sur le thorax et le dos. Toujours fortement diluer pour l''usage cutané.','huile-essentielle','sante','/image produit 3D/THYM.png',false,28),
('ylang-ylang','Ylang Ylang','Envoûtante et voluptueuse, soin capillaire d''exception.','L''Ylang Ylang est une huile précieuse aux multiples facettes : relaxante profonde, aphrodisiaque réputée, soin capillaire d''exception. Son parfum floral envoûtant et oriental est l''un des plus recherchés en parfumerie.',array['Soin capillaire exceptionnel','Relaxante profonde','Aphrodisiaque naturelle','Harmonisante émotionnelle']::text[],'En soin capillaire : ajouter quelques gouttes à votre huile ou shampoing. En diffusion pour une ambiance romantique et apaisante.','huile-essentielle','beaute','/image produit 3D/YLANG YLANG.png',false,29)
on conflict (slug) do nothing;
