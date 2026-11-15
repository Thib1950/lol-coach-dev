# LoL Coach — DEV

Application web statique responsive pour préparer une ranked avec Nasus jungle et consulter l'historique Solo/Duo.

## Fonctionnalités
- Deux onglets : Historique des parties et Préparer une partie.
- Synchronisation au chargement avec la dernière version publiée de Riot Data Dragon : champions, objets et icônes.
- Analyse de draft sur cinq champions ennemis : ordre d'achat illustré, timings indicatifs de back, départ RED/BLUE, focus estimé et plan de jeu par phase.
- Historique Solo/Duo avec Riot Account-V1 et Match-V5 via un Cloudflare Worker sécurisé.

## Patch à jour
À chaque ouverture, la page interroge l'API publique Data Dragon `versions.json`, puis télécharge les données françaises de la version la plus récente publiée. Data Dragon peut être mis à jour avec un léger décalage après le patch officiel ; les notes de patch Riot restent la référence pour les modifications d'équilibrage.

## Activer l'historique Riot (une seule configuration nécessaire)
GitHub Pages est public et ne peut pas garder une clé secrète. Le Worker fourni dans `worker/` fait les appels Riot côté serveur.

1. Créer un compte Cloudflare et installer Wrangler.
2. Dans un terminal, depuis le dossier `worker`, déployer avec `npx wrangler deploy`.
3. Ajouter la clé Riot Developer Portal comme secret : `npx wrangler secret put RIOT_API_KEY`.
4. Dans les variables du Worker, définir `ALLOWED_ORIGIN` à `https://thib1950.github.io`.
5. Dans la console du navigateur, une fois sur l'application, enregistrer l'adresse du Worker :
   `localStorage.setItem("lolcoach_history_endpoint","https://NOM-DU-WORKER.workers.dev/api/history")`
6. Recharger l'application. Le Riot ID **HeeerosFR#EUW** est prérempli ; clique sur « Charger mes parties ».

L'historique récupère les parties classées Solo/Duo (queue 420), jusqu'à 20 matchs récents. La clé reste côté Cloudflare et n'est jamais envoyée au navigateur. Une clé Riot de développement doit être renouvelée conformément aux conditions du portail.

## Limites du coach de draft
Le moteur actuel est une première analyse tactique heuristique, avec profils manuels pour une sélection de champions. Il ne prétend pas calculer un build statistiquement optimal en temps réel. Les timings de back sont des repères, pas des prescriptions. Le choix RED/BLUE dépend aussi du côté de carte, des lanes alliées, du leash et de leur priorité ; ces informations ne sont pas encore saisies. Les conseils seront affinés avec davantage de profils et des données de matchup.

## GitHub Pages
Le dépôt utilise un workflow GitHub Actions dans `.github/workflows/deploy-pages.yml`. Dans **Settings → Pages**, choisir **GitHub Actions** comme source de publication. L'application sera accessible à :
https://thib1950.github.io/lol-coach-dev/

Ce projet n'est pas affilié à Riot Games. League of Legends et Riot Games sont des marques de Riot Games, Inc.
