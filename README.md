# LoL Coach — DEV

Application web statique pour préparer des parties classées de League of Legends.

## Première version

- Interface responsive ordinateur / tablette / mobile.
- Navigation : Vue d'ensemble, Préparer une partie, Builds & runes, Matchups.
- Profil initial : Nasus jungle.
- Sélection des cinq champions adverses avec autocomplétion.
- Première analyse heuristique : dégâts physiques/magiques, contrôles, soins, mobilité et portée.
- Récupération de la version et de la liste des champions via Riot Data Dragon (données publiques).

## Déploiement GitHub Pages

Dans le dépôt GitHub : **Settings → Pages → Build and deployment → Deploy from a branch**. Choisir la branche `main` et le dossier `/ (root)`, puis enregistrer.

Le site sera publié à l'adresse :

`https://thib1950.github.io/lol-coach-dev/`

La publication peut prendre quelques minutes après activation.

## Limites connues de la version 0.1

Les recommandations sont une première base heuristique et ne prétendent pas être un build compétitif vérifié en temps réel. Les profils détaillés sont encore limités. Les prix, statistiques d'objets, runes et taux de victoire seront intégrés dans les prochaines étapes à partir de sources de données actualisées. Aucune clé API privée n'est stockée dans le navigateur.

## Structure

- `index.html` : structure de l'application
- `style.css` : interface responsive
- `app.js` : navigation, données champion et moteur de première analyse
