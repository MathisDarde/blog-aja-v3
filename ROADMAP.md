# Feuille de route

## 1. Corrections rapides

- [x] Effectif 2026-2027 : nouveau scraper `aja_effectif_scrape.py` (dépôt AJA-Website-Scrapers), page servie par `lib/scraped-data.ts` avec repli sur `public/data/players_data.json` (rafraîchi)
- [x] Statistiques : le scraper Transfermarkt calcule la saison en cours au lieu de 2025 en dur
- [x] Fetchs des scrapers centralisés dans `lib/scraped-data.ts` : contrôle `res.ok`, repli sans plantage, cache d'une heure (fin du `?t=Date.now()`)
- [x] Accueil : plus de plantage quand aucun match n'a encore été joué
- [x] Pages `error.tsx` et `global-error.tsx`
- [x] Ménage : `temp.html`, `PagesTest` → `PagesTilt`, logs de debug côté client, README
- [x] Avertissements `react-hooks/exhaustive-deps` (lint propre)

## 2. Articles

- [x] Recherche sur `/articles` : titre, tags, chapô, auteur et texte brut ; sans accents ni casse, tous les mots requis, classée par pertinence (`lib/article-search.ts`)
- [ ] Pagination de `/articles`

## 3. Admin

- [x] Modération des commentaires : signalement avec motif, masquage auto à 3 signalements, masquer / réafficher / ignorer / supprimer dans le dashboard

## 4. Contenus

- [ ] Quiz en base, édité depuis l'admin, questions tirées au hasard, classement des scores
- [x] Page `/methodes-expert` : toutes les méthodes par type, recherche, fiche en popup partageable (`?m=`), articles qui les citent
- [ ] Boutique : la remplir (liens vers boutique.aja.fr) ou la retirer du menu

## 5. Fiabilité

- [ ] Tests des parseurs Wikipédia/Wikidata (`lib/wikitext.ts`, `lib/wikidata.ts`, `lib/squad.ts`)
- [ ] Migrer `next lint` vers l'ESLint CLI (`npx @next/codemod@canary next-lint-to-eslint-cli .`) avant Next 16
