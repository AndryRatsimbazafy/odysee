-- Demo seed (T05), taken from docs/prototype/luxe-4.html ("Données" block and markup).
-- French only: English columns stay empty and the site falls back to French.
-- Every "[…]" placeholder of the prototype becomes "[à fournir]". No testimonial.
-- Idempotent: demo rows use fixed ids and are deleted before being re-inserted.
-- Run it in the Supabase SQL Editor (runs as postgres, bypasses RLS).

begin;

-- Cleanup --------------------------------------------------------------------
-- Child rows (items, decisions, images, project_technologies) cascade.
delete from public.projects
where id in (
    '10000000-0000-4000-8000-000000000001',
    '10000000-0000-4000-8000-000000000002',
    '10000000-0000-4000-8000-000000000003',
    '10000000-0000-4000-8000-000000000004'
  )
  or slug in ('plateforme-multi-espaces', 'gestion-des-membres', 'site-du-rotaract', 'odyssee');

delete from public.technologies
where id in (
    '20000000-0000-4000-8000-000000000001',
    '20000000-0000-4000-8000-000000000002',
    '20000000-0000-4000-8000-000000000003'
  )
  or name in ('React', 'TypeScript', 'Next.js');

delete from public.experiences where id::text like '30000000-0000-4000-8000-%';
delete from public.faq_items where id::text like '40000000-0000-4000-8000-%';
delete from public.skills where id::text like '50000000-0000-4000-8000-%';

-- Profile --------------------------------------------------------------------
insert into public.profile (
  id, full_name, title_fr, tagline_fr, recit_fr, hephaistos_fr, athena_fr,
  location, is_available, availability_modes, availability_fr, available_from, public_email
) values (
  true,
  'Andry',
  'Lead Front-End Developer',
  'Je dirige le front-end d’applications <em>React et TypeScript</em>.',
  'Lead technique chez Bocasay, en remote pour des clients français. J’apporte aussi la lecture du besoin métier (AMOA) avant d’écrire la première ligne.',
  'Mon métier principal. Je conçois et je fais tenir des interfaces React et TypeScript dans la durée, avec l’équipe qui les écrit.',
  'Des missions d’AMOA chez Bocasay : je traduis le besoin d’un client en spécifications, puis en interface.',
  'Antananarivo, Madagascar',
  true,
  array['cdi', 'freelance', 'remote'],
  'CDI ou freelance, remote',
  null, -- [à fournir]
  ''    -- [à fournir]
)
on conflict (id) do update set
  full_name = excluded.full_name,
  title_fr = excluded.title_fr,
  tagline_fr = excluded.tagline_fr,
  recit_fr = excluded.recit_fr,
  hephaistos_fr = excluded.hephaistos_fr,
  athena_fr = excluded.athena_fr,
  location = excluded.location,
  is_available = excluded.is_available,
  availability_modes = excluded.availability_modes,
  availability_fr = excluded.availability_fr,
  available_from = excluded.available_from,
  public_email = excluded.public_email;

-- Skills (chant I) -----------------------------------------------------------
insert into public.skills (id, domain, label_fr, description_fr, sort_order) values
  ('50000000-0000-4000-8000-000000000001', 'hephaistos', 'Architecture', 'Découpage des composants, gestion de l’état, conventions de projet.', 1),
  ('50000000-0000-4000-8000-000000000002', 'hephaistos', 'Qualité', 'Typage strict, revue de code, dette technique suivie.', 2),
  ('50000000-0000-4000-8000-000000000003', 'hephaistos', 'Équipe', 'Lead d’une équipe front, mentorat des développeurs.', 3),
  ('50000000-0000-4000-8000-000000000004', 'athena', 'Écoute', 'Recueil du besoin, ateliers avec le métier.', 4),
  ('50000000-0000-4000-8000-000000000005', 'athena', 'Écrit', 'Spécifications fonctionnelles.', 5),
  ('50000000-0000-4000-8000-000000000006', 'athena', 'Lien', 'Pont entre le client et l’équipe.', 6);

-- Projects (chant II) --------------------------------------------------------
insert into public.projects (
  id, slug, status, sort_order, kind, kind_label_fr, layout, emblem,
  is_confidential, is_associative, short_title_fr, title_fr, summary_fr,
  period_fr, role_fr, role_label_fr, team_fr, client_name, show_client,
  quest_fr, charon_line_fr, context_fr, problem_fr
) values
  (
    '10000000-0000-4000-8000-000000000001', 'plateforme-multi-espaces', 'published', 1,
    'client', 'Mission client · Bocasay', 'sealed', 'maze', true, false,
    'Multi-espaces', 'Plateforme multi-espaces',
    'Plusieurs espaces métier dans une même plateforme, pour un client sous confidentialité. Lead front-end et AMOA.',
    '[à fournir]', 'Lead front-end et AMOA',
    'Lead front-end, avec une mission d’AMOA en amont : Athéna avant Héphaïstos.',
    '[à fournir]', '', false,
    'Sortir du labyrinthe des espaces métier sans perdre le fil d’Ariane.',
    'La première est scellée par mon patron, Hadès. Je n’ai rien vu.',
    'Plusieurs espaces métier pour un client du secteur [à fournir].',
    '[à fournir]'
  ),
  (
    '10000000-0000-4000-8000-000000000002', 'gestion-des-membres', 'published', 2,
    'associative', 'Projet associatif', 'split', 'hydra', false, true,
    'Gestion des membres', 'Gestion des membres du Rotaract',
    'Un outil pour remplacer le fichier Excel partagé du club. [à fournir]',
    '[à fournir]', '[à fournir]', '[à fournir]',
    'Bénévole', 'Rotaract Club d’Ivandry', true,
    'Terrasser l’hydre du fichier Excel des membres.',
    'Une hydre en tableur. Chaque fois qu’on corrigeait une cellule, deux autres repoussaient.',
    '[à fournir]', '[à fournir]'
  ),
  (
    '10000000-0000-4000-8000-000000000003', 'site-du-rotaract', 'published', 3,
    'associative', 'Projet associatif', 'gallery', 'herald', false, true,
    'Site du Rotaract', 'Site du Rotaract Club d’Ivandry',
    'Un site public et un espace d’administration pour que les membres publient eux-mêmes les actions du club.',
    '[à fournir]', '[à fournir]', '[à fournir]',
    'Bénévole', 'Rotaract Club d’Ivandry', true,
    'Donner au club la voix d’un héraut : publier ses actions sans attendre personne.',
    'Un site pour son club, fait bénévolement. Comme moi, sauf que moi je suis payé en oboles.',
    '[à fournir]', '[à fournir]'
  ),
  (
    '10000000-0000-4000-8000-000000000004', 'odyssee', 'published', 4,
    'personal', 'Projet personnel', 'process', 'boat', false, false,
    'L’Odyssée', 'L’Odyssée, ce portfolio',
    'Ce site : un parcours raconté comme une traversée, éditable sans redéploiement.',
    '2026', 'Conception et développement',
    'Direction artistique, conception et développement.',
    'Seul, avec Claude Code', '', false,
    'Construire la barque sur laquelle vous voguez, sans qu’elle prenne l’eau.',
    'Et cette barque, c’est lui qui l’a construite. Pas de fuite pour l’instant. Je touche du bois.',
    'Un portfolio qui raconte un parcours au lieu d’aligner des cartes.',
    'Être mémorable sans ralentir : l’essentiel doit se lire dès l’embarcadère.'
  );

-- Contributions (no documented result yet: results stay empty) --------------
insert into public.project_items (project_id, kind, text_fr, sort_order) values
  ('10000000-0000-4000-8000-000000000001', 'contribution', 'Recueil du besoin et spécifications avec le client.', 1),
  ('10000000-0000-4000-8000-000000000001', 'contribution', 'Architecture des espaces côté front-end.', 2),
  ('10000000-0000-4000-8000-000000000001', 'contribution', 'Revue de code de l’équipe.', 3),
  ('10000000-0000-4000-8000-000000000001', 'contribution', '[à fournir]', 4),
  ('10000000-0000-4000-8000-000000000002', 'contribution', '[à fournir]', 1),
  ('10000000-0000-4000-8000-000000000002', 'contribution', '[à fournir]', 2),
  ('10000000-0000-4000-8000-000000000003', 'contribution', 'Site public.', 1),
  ('10000000-0000-4000-8000-000000000003', 'contribution', 'Espace d’administration pour que les membres publient eux-mêmes.', 2),
  ('10000000-0000-4000-8000-000000000004', 'contribution', 'Direction artistique et gravures au trait faites main.', 1),
  ('10000000-0000-4000-8000-000000000004', 'contribution', 'Développement Next.js et Supabase.', 2),
  ('10000000-0000-4000-8000-000000000004', 'contribution', 'Interface d’administration du contenu.', 3);

-- Decisions ------------------------------------------------------------------
insert into public.project_decisions (project_id, title_fr, why_fr, tradeoff_fr, sort_order) values
  ('10000000-0000-4000-8000-000000000001', '[à fournir]', '[à fournir]', '[à fournir]', 1),
  ('10000000-0000-4000-8000-000000000001', '[à fournir]', '[à fournir]', '[à fournir]', 2),
  ('10000000-0000-4000-8000-000000000002', '[à fournir]', '[à fournir]', '[à fournir]', 1),
  ('10000000-0000-4000-8000-000000000003', '[à fournir]', '[à fournir]', '[à fournir]', 1),
  ('10000000-0000-4000-8000-000000000004', 'Les projets au centre',
    'La carte et les archives portent le récit ; l’arsenal et les escales y renvoient.',
    'Moins de place pour les compétences en tête de page.', 1),
  ('10000000-0000-4000-8000-000000000004', 'Des animations qui servent la lecture',
    'La carte s’allume, les routes se tracent, les gravures se dessinent.',
    'Moins spectaculaire qu’un site de démonstration, mais lisible et accessible.', 2),
  ('10000000-0000-4000-8000-000000000004', 'Next.js et Supabase',
    'Rendu serveur pour le référencement, contenu éditable sans redéploiement.',
    'Une base à maintenir pour un site personnel.', 3);

-- Plates: slots only (path null = "[à fournir]", alt added with the file) ---
insert into public.project_images (project_id, path, kind_fr, caption_fr, ratio, sort_order) values
  ('10000000-0000-4000-8000-000000000001', null, 'Logo de l’entreprise', 'Logo Bocasay, à la place des captures du client.', '16/10', 1),
  ('10000000-0000-4000-8000-000000000001', null, 'Schéma d’architecture', 'Les espaces et leurs liens, sans nom de client.', '1/1', 2),
  ('10000000-0000-4000-8000-000000000001', null, 'Maquette redessinée', 'Écran principal redessiné, sans donnée réelle.', '16/10', 3),
  ('10000000-0000-4000-8000-000000000001', null, 'Détail flouté', 'Composant clé, données anonymisées.', '4/5', 4),
  ('10000000-0000-4000-8000-000000000002', null, 'Avant', 'Le fichier Excel d’origine, données masquées.', '16/10', 1),
  ('10000000-0000-4000-8000-000000000002', null, 'Après', 'L’écran principal de l’outil.', '16/10', 2),
  ('10000000-0000-4000-8000-000000000002', null, 'Fiche membre', 'Détail d’une fiche.', '4/5', 3),
  ('10000000-0000-4000-8000-000000000002', null, 'Mobile', 'L’outil sur téléphone.', '1/1', 4),
  ('10000000-0000-4000-8000-000000000002', null, 'Export', 'Liste exportée ou imprimée.', '21/9', 5),
  ('10000000-0000-4000-8000-000000000003', null, 'Page d’accueil', 'Accueil du site public.', '21/9', 1),
  ('10000000-0000-4000-8000-000000000003', null, 'Page action', 'Une action du club publiée.', '4/5', 2),
  ('10000000-0000-4000-8000-000000000003', null, 'Administration', 'Formulaire de publication.', '16/10', 3),
  ('10000000-0000-4000-8000-000000000003', null, 'Mobile', 'Le site sur téléphone.', '3/4', 4),
  ('10000000-0000-4000-8000-000000000003', null, 'Détail', 'Typographie ou composant.', '16/9', 5),
  ('10000000-0000-4000-8000-000000000004', null, 'Embarcadère', 'L’ouverture du site.', '16/10', 1),
  ('10000000-0000-4000-8000-000000000004', null, 'Carte et archives', 'La carte qui suit la lecture.', '4/5', 2),
  ('10000000-0000-4000-8000-000000000004', null, 'Récit', 'Un dossier ouvert.', '16/10', 3),
  ('10000000-0000-4000-8000-000000000004', null, 'Admin', 'L’interface d’administration.', '16/9', 4),
  ('10000000-0000-4000-8000-000000000004', null, 'Mobile', 'Le site sur téléphone.', '3/4', 5);

-- Technologies (chant III) ---------------------------------------------------
insert into public.technologies (
  id, name, years_of_use, duration_label_fr, weapon, role_fr, context_fr, is_featured, sort_order
) values
  ('20000000-0000-4000-8000-000000000001', 'React', 6, '6 ans', 'foudre',
    'Socle de toutes mes interfaces : composants, état, performance.',
    'Usage quotidien chez Bocasay, sur des projets pour des clients français.', true, 1),
  ('20000000-0000-4000-8000-000000000002', 'TypeScript', 5, '5 ans', 'egide',
    'Typage strict des modèles métier et des composants.',
    'Sur tous mes projets React depuis cinq ans. [à fournir]', true, 2),
  ('20000000-0000-4000-8000-000000000003', 'Next.js', null, '2026', 'caducee',
    'App Router, Server Components et Server Actions.',
    'Appris et appliqué sur ce portfolio.', false, 3);

insert into public.project_technologies (project_id, technology_id, usage_fr, sort_order) values
  ('10000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', '[à fournir]', 1),
  ('10000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000002', '[à fournir]', 2),
  ('10000000-0000-4000-8000-000000000004', '20000000-0000-4000-8000-000000000003', 'Routage, rendu serveur, cache.', 1);

-- Ports of call (chant IV) ---------------------------------------------------
-- start_date is required by the schema: 2000-01-01 is a placeholder ([à fournir]).
insert into public.experiences (
  id, company, role_fr, start_date, end_date, location, is_remote, message_fr, sort_order
) values
  ('30000000-0000-4000-8000-000000000001', 'Bocasay', 'Lead Front-End Developer',
    date '2000-01-01', null, 'Antananarivo', true,
    'Lead technique front-end, et missions d’AMOA ponctuelles pour des clients français.', 1),
  ('30000000-0000-4000-8000-000000000002', '[à fournir]', '[à fournir]',
    date '2000-01-01', date '2000-01-01', '[à fournir]', false,
    '[à fournir]', 2);

-- The oracle (chant V) -------------------------------------------------------
insert into public.faq_items (id, question_fr, answer_fr, is_published, sort_order) values
  ('40000000-0000-4000-8000-000000000001', 'Es-tu disponible ?',
    'Oui, pour un CDI ou une mission freelance, en remote. [à fournir]', true, 1),
  ('40000000-0000-4000-8000-000000000002', 'Travailles-tu déjà à distance avec la France ?',
    'Oui, c’est mon quotidien chez Bocasay : des projets pour des clients français, depuis Madagascar. Le décalage est d’une à deux heures selon la saison.', true, 2),
  ('40000000-0000-4000-8000-000000000003', 'Quelle est ton expertise technique ?',
    'React et TypeScript au quotidien, l’architecture front-end et le lead d’équipe. Node.js pour l’outillage. Ce site est construit avec Next.js et Supabase.', true, 3),
  ('40000000-0000-4000-8000-000000000004', 'Comment travailles-tu avec une équipe ?',
    'Revue de code systématique, conventions écrites, et un pont direct avec le métier grâce à l’AMOA : l’équipe sait pourquoi elle construit ce qu’elle construit.', true, 4),
  ('40000000-0000-4000-8000-000000000005', 'Peut-on voir du code ?',
    'Les projets clients sont sous confidentialité. Le code de ce portfolio sera public sur GitHub. [à fournir]', true, 5);

commit;
