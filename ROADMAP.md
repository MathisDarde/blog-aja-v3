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

- [x] Quiz en base : 10 questions tirées au hasard, correction côté serveur, classement des joueurs connectés, admin `/admin/quiz`
- [x] Page `/methodes-expert` : toutes les méthodes par type, recherche, fiche en popup partageable (`?m=`), articles qui les citent
- [x] Boutique retirée (redirigée vers l'accueil) ; menu « Divers » séparé en « Histoire » (historique, palmarès, méthodes expert) et « Divers » (effectif, calendrier, classement, quiz, chants)
- [x] Effectif actuel : cartes par poste, 4 par ligne, infos toujours visibles
- [x] Historique : saisons archivées depuis 1974-1975, sélecteur de saison sur le calendrier et le classement, page `/historique` (trajectoire L1/L2, confrontations, toutes les saisons)
- [x] Logos des clubs selon la saison partout (Wikipédia FR + `logos-historiques-manuels.json` des scrapers)
- [x] Page admin `/admin/logos` : versions des logos par club (nom, période, image), clubs hors registre (Zenit…)

## 5. Fiabilité

- [x] Scrapers automatiques : saison et championnat détectés, passage toutes les 2 h, défi anti-robot de Transfermarkt résolu, échecs signalés par mail
- [x] Tests des parseurs sur pages réelles : 43 tests pytest (scrapers) + 28 tests Vitest (blog), à chaque push
- [ ] Migrer `next lint` vers l'ESLint CLI (`npx @next/codemod@canary next-lint-to-eslint-cli .`) avant Next 16
