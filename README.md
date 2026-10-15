# Mémoire d'Auxerrois

Blog consacré à l'histoire de l'AJ Auxerre : articles, méthodes expert (fiches joueur, coach, match et saison), effectif, calendrier, classement, palmarès, chants et quiz.

## Stack

- **Next.js 15** (App Router, Server Actions), React 19, Tailwind CSS
- **Neon Postgres** + **Drizzle ORM**
- **Better Auth** (email/mot de passe et Google)
- **Tiptap** pour l'éditeur d'articles
- **Cloudinary** (images), **Resend** (emails et newsletter), **Upstash Redis** (rate limiting), **PostHog** (analytics)

## Démarrer

```bash
pnpm install
pnpm dev
```

Le site tourne sur [http://localhost:3000](http://localhost:3000).

## Variables d'environnement

Deux fichiers, non versionnés :

- `.env.local` : configuration complète (et base de **prod** pour drizzle-kit) ;
- `.env.development.local` : `DATABASE_URL` de la base de **dev**, qui surcharge celle de `.env.local` en local.

| Variable | Rôle |
| --- | --- |
| `DATABASE_URL` | Chaîne de connexion Neon |
| `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` | Better Auth |
| `NEXT_PUBLIC_API_URL` | URL de base du client d'authentification |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Connexion Google |
| `NEXT_PUBLIC_SITE_URL` | URL publique (SEO, sitemap, emails) |
| `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Upload d'images |
| `RESEND_API_KEY`, `RESEND_WEBHOOK_SECRET` | Emails et webhook entrant |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Rate limiting |
| `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST` | Analytics |

## Base de données

Les bases dev et prod sont synchronisées avec **`db:push`**, pas `db:migrate` (l'historique des migrations en base n'est pas à jour).

```bash
pnpm db:generate   # génère la migration (pour l'historique)
pnpm db:push       # applique le schéma sur la base de dev
pnpm db:push:prod  # applique le schéma sur la base de prod
pnpm db:studio     # explorer la base
```

## Données sportives

Le calendrier, le classement, les statistiques et l'effectif viennent du dépôt [AJA-Website-Scrapers](https://github.com/mathisdarde/AJA-Website-Scrapers), qui publie des JSON sur GitHub Pages toutes les 2 heures (saison et championnat détectés automatiquement, cf. `meta.json`). Ils sont lus par `lib/scraped-data.ts`, avec 15 minutes de cache. `public/data/players_data.json` sert de copie de secours pour l'effectif.

## Tests

Les lecteurs fragiles (infobox et palmarès Wikipédia, effectifs de saison, recherche d'articles, méthodes citées, logos d'époque) sont testés sur de vraies pages enregistrées dans `tests/fixtures/` :

```bash
pnpm test                      # Vitest
node tests/record-fixtures.mjs # réenregistre les pages Wikipédia
```

Ils tournent à chaque push avec TypeScript et le lint (`.github/workflows/tests.yml`).

## Déploiement

Vercel déploie automatiquement chaque push sur `main`. Le `prebuild` (`generate-assets.js`) régénère la liste des drapeaux et logos de clubs à partir de `public/_assets`.
