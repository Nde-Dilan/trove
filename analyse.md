# Analyse du Projet Bookmarks

Ce document récapitule les fonctionnalités actuelles du projet et propose une structure pour le passage sur un backend **Supabase**.

## 1. Fonctionnalités Actuelles

### Gestion des Bookmarks

- **Affichage** : Vue en grille (Grid) et vue en liste (List).
- **Création/Lecture** : Visualisation de tous les favoris enregistrés.
- **Favoris** : Marquer des signets comme "Favoris".
- **Recherche** : Filtrage en temps réel par titre, description ou URL.
- **Tri** :
  - Date (Plus récent / Plus ancien)
  - Alphabétique (A-Z / Z-A)
- **États des Bookmarks** :
  - **Actif** : Signets visibles dans le tableau de bord principal.
  - **Archive** : Mise en archive pour désencombrer (avec possibilité de restauration).
  - **Corbeille** : Signets supprimés temporairement (restauration possible) ou définitivement.

### Organisation

- **Collections** : Catégorisation par thématiques (ex: Design, Développement, Outils, Lecture).
- **Tags** : Système de mots-clés multiples par signet avec codes couleurs.
- **Statistiques** : Décompte automatique du nombre de signets par collection et tags.

### UI / UX

- **Mode Sombre/Clair** : Support complet via `next-themes`.
- **Responsive Design** : Sidebar rétractable et mise en page adaptée aux mobiles.

## 2. Structure de Données (Types existants)

- **Bookmark** : `id`, `title`, `url`, `description`, `favicon`, `collectionId`, `tags[]`, `createdAt`, `isFavorite`, `status` (inféré).
- **Collection** : `id`, `name`, `icon`, `color`, `count`.
- **Tag** : `id`, `name`, `color`, `count`.

## 3. Plan d'implémentation avec Supabase

Pour transformer ce projet en application full-stack, voici les tables à créer dans Supabase :

### Tables de la Base de Données

#### 1. `profiles`

Stocke les informations utilisateurs liées à Supabase Auth.

- `id` (uuid, primary key)
- `email` (text)
- `avatar_url` (text)

#### 2. `collections`

- `id` (uuid, primary key)
- `user_id` (uuid, foreign key)
- `name` (text)
- `icon` (text)
- `color` (text)
- `created_at` (timestamp)

#### 3. `tags`

- `id` (uuid, primary key)
- `user_id` (uuid, foreign key)
- `name` (text)
- `color` (text)

#### 4. `bookmarks`

- `id` (uuid, primary key)
- `user_id` (uuid, foreign key)
- `collection_id` (uuid, foreign key, nullable)
- `title` (text)
- `url` (text)
- `description` (text)
- `favicon_url` (text)
- `is_favorite` (boolean)
- `status` (text: 'active', 'archived', 'trash')
- `created_at` (timestamp)

#### 5. `bookmark_tags` (Table de liaison)

Gère la relation Many-to-Many entre les bookmarks et les tags.

- `bookmark_id` (uuid, foreign key)
- `tag_id` (uuid, foreign key)

## 4. Prochaines Étapes

1. **Configuration Supabase** : Création du projet et des tables ci-dessus.
2. **Authentification** : Mise en place de Supabase Auth (Login/Register).
3. **Migration du Store** : Remplacer la logique Zustand (mock data) par des appels `supabase-js`.
4. **Synchronisation en Temps Réel** : Utiliser Supabase Realtime pour mettre à jour l'interface instantanément.
