# Mise en route Supabase

Cette base sert trois besoins :

- suivre les visites et les pages consultees apres consentement analytics ;
- stocker les demandes envoyees depuis les formulaires ;
- stocker les diagnostics et les traiter depuis `espace-client.html` selon le role connecte.

## Projet cree

- Nom : `MBL Site Vitrine`
- Reference : `cfricrjvmeamzbvhpufr`
- Region : Europe Ouest, Ireland
- Dashboard : https://supabase.com/dashboard/project/cfricrjvmeamzbvhpufr

## 1. Creer le projet

1. Le projet `MBL Site Vitrine` est deja cree.
2. Ouvre SQL Editor.
3. Le schema a ete applique via la migration `20260415103939_site_dashboard_schema.sql`.

Le script cree les tables, les index, les regles RLS et la fonction `get_admin_dashboard`.

## 2. Creer le premier admin

Le compte `contact@mybusinesslife.fr` est cree dans Supabase Auth et active avec le role `admin`.

Les roles disponibles sont :

- `client` : espace client, suivi de ses propres demandes ;
- `pending` : compte inscrit, en attente d'activation ;
- `viewer` : consultation du dashboard ;
- `editor` : consultation et traitement des demandes ;
- `admin` : gestion des demandes et des utilisateurs ;
- `owner` : role reserve au proprietaire.

Les nouvelles inscriptions publiques creent automatiquement un profil `client` actif.

Pour rattacher manuellement un utilisateur a un role, remplace l'email et le role :

```sql
insert into public.user_profiles (user_id, email, role, active)
select id, email, 'admin', true
from auth.users
where email = 'admin@mybusinesslife.fr'
on conflict (user_id) do update
set role = excluded.role, active = excluded.active, updated_at = now();
```

## 3. Connecter le site

Dans Supabase, recupere :

- Project URL ;
- anon public key.

Puis remplis `site-config.js` :

```js
window.MBL_SUPABASE = {
  enabled: true,
  url: "https://cfricrjvmeamzbvhpufr.supabase.co",
  anonKey: "PUBLIC_ANON_KEY",
};
```

Le site est deja connecte avec la cle `anon` publique. Ne mets jamais la cle `service_role` dans le site.

## 4. Activer la connexion Google

Le site declenche deja l'authentification Google depuis `espace-client.html`. Il faut maintenant activer le fournisseur dans les consoles externes.

Dans Google Cloud Console :

1. Cree un client OAuth de type application Web.
2. Ajoute ces origines JavaScript autorisees :

```text
https://apicg.mybusinesslife.fr
http://51.91.78.192
https://mybusinesslife.fr
https://www.mybusinesslife.fr
```

3. Ajoute cette URI de redirection autorisee :

```text
https://cfricrjvmeamzbvhpufr.supabase.co/auth/v1/callback
```

Dans Supabase Dashboard > Authentication > Providers > Google :

1. Active Google.
2. Colle le Client ID et le Client Secret Google.

Dans Supabase Dashboard > Authentication > URL Configuration, ajoute les URL de redirection autorisees :

```text
https://apicg.mybusinesslife.fr/test/espace-client.html
http://51.91.78.192/espace-client.html
https://mybusinesslife.fr/espace-client.html
https://www.mybusinesslife.fr/espace-client.html
```

Ne stocke jamais le secret Google dans le depot. Les nouvelles connexions Google creent un profil `client` actif par defaut ; le compte `contact@mybusinesslife.fr` garde son role `admin` si Google renvoie la meme adresse.

## 5. Tester

1. Ouvre une page du site.
2. Accepte la mesure d'audience dans le bandeau cookies.
3. Envoie une demande depuis `contact.html`.
4. Envoie un diagnostic depuis `diagnostic.html`.
5. Ouvre `espace-client.html` et connecte-toi avec le compte admin.
6. Clique sur `Continuer avec Google` et verifie le retour vers `espace-client.html`.

## 6. Evolution conseillee

Pour la suite, les ajouts utiles seront :

- notifications email via Supabase Edge Functions ou un webhook ;
- protection anti-spam avec honeypot et captcha sur les formulaires ;
- export CSV des demandes ;
- filtres par statut, source et periode dans le dashboard ;
- relance automatique quand une demande reste en statut `new`.
