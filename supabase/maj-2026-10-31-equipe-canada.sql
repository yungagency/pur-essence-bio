-- À exécuter seulement si schema.sql a DÉJÀ été exécuté avant cette correction.
update public.team set name = 'Dr William AWAWO', role = 'Consultant' where name = 'M. AWAWO William';
update public.certifications set label = 'Made in Canada' where label = 'Made in Cameroun & Canada';
