# Exercice 2 : réparer un formulaire d'adresse avec l'IA

**Durée** : 30 minutes. **Blocs** : les six, un défaut par bloc.

Atelier Rayon est une boutique fictive. Son formulaire d'adresse est très soigné à l'écran… et cache un défaut par bloc du cours. Il n'envoie aucune donnée.

## Le prompt à copier dans votre agent

```
Récupère le dépôt https://github.com/clement8426/le-labo et ouvre le dossier ux/ux-ia/02-formulaire-adresse.
Lis son README, puis ouvre index.html dans un navigateur pour que je puisse remplir le formulaire.
Ne corrige rien tant que je ne t'ai pas dit ce qui me gêne.
Ensuite, corrige les défauts un par un, en m'expliquant chaque fois ce que tu changes et pourquoi,
puis recharge la page pour que je vérifie.
```

Sans agent : téléchargez le dépôt (bouton « Code », puis « Download ZIP ») et double-cliquez sur `index.html`.

## Les étapes

1. **Remplissez le formulaire**, chrono lancé, avec une adresse **fictive** en Suisse. Jamais vos vraies coordonnées.
2. **Notez tout ce qui vous gêne**, même un détail : ce qui ralentit, ce qui fait douter, ce qui énerve. L'écran est soigné : cherchez ailleurs.
3. **Corrigez avec l'IA** : donnez à votre agent les clés de [`../prompts/six-blocs.md`](../prompts/six-blocs.md) et la liste de ce qui vous a gêné, puis demandez-lui de corriger **défaut par défaut**.
   - **Pas d'agent ?** Ouvrez `index.html`, `script.js` et `style.css` dans un éditeur de texte (Bloc-notes, TextEdit), collez-les dans un chat (ChatGPT, Claude) avec votre liste, et demandez les fichiers corrigés. Remplacez les fichiers, puis rouvrez `index.html`.
4. **Dernière étape, l'autocomplétion** :

```
Ajoute l'autocomplétion d'adresse sur le champ « Rue et numéro » avec l'API Photon
(https://photon.komoot.io/api/), gratuite et sans clé. Limite les résultats à la Suisse,
attends 300 ms après la dernière frappe et 3 caractères minimum avant de chercher,
propose 5 adresses au plus, sans doublons, en tenant compte de la ville tapée,
remplis le NPA et la localité au clic, rends la liste
utilisable au clavier, garde la saisie manuelle possible si rien ne convient,
et affiche l'attribution « © contributeurs OpenStreetMap ».
```

5. **Refaites le chrono** avec la version corrigée.

## Bon à savoir

- Le serveur public de Photon est gratuit pour un **usage raisonnable** : pas de recherche à chaque frappe sans délai.
- L'autocomplétion envoie ce que vous tapez à un service tiers : d'où l'adresse fictive.

## La solution

La version réparée, avec les six défauts expliqués, et l'autocomplétion en plus : <https://plateforme-cours-three.vercel.app/ux/ux-ia/demos/formulaire-adresse/>

## C'est réussi si

- Vous avez trouvé au moins un défaut dans quatre blocs différents.
- La version corrigée se remplit plus vite que la première.
- Elle reste utilisable au clavier seul, et chaque erreur dit quoi corriger.
