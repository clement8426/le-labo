# Exercice 1 : auditer une boutique en ligne, avec et sans IA

**Durée** : 30 minutes. **Blocs** : les six.

Tilleul est une boutique de céramiques fictive, très soignée… et pleine de défauts d'UX. Elle est en ligne, rien à installer :

- **Sans aide** : <https://plateforme-cours-three.vercel.app/tilleul/?cours=non>
- **Avec le mode cours** (la solution) : <https://plateforme-cours-three.vercel.app/tilleul/>

Aucune commande n'est réelle, aucune donnée n'est envoyée.

## Le prompt à copier dans votre agent

Pour l'étape 2. Rien à installer : la boutique est en ligne.

```
Tu vas m'aider à auditer l'UX d'une boutique en ligne fictive, Tilleul :
https://plateforme-cours-three.vercel.app/tilleul/?cours=non
Lis d'abord les consignes et les prompts du cours dans ce dépôt :
https://github.com/clement8426/le-labo (dossier ux/ux-ia/01-audit-tilleul et fichier ux/ux-ia/prompts/six-blocs.md).
La cible : des personnes de 30 à 60 ans qui achètent un cadeau, surtout sur téléphone.
Ouvre la boutique dans un navigateur, fais le parcours d'un client jusqu'au tunnel de commande,
et arrête-toi avant de valider la commande. Passe ensuite les six blocs, un par un.
Pour chaque défaut : la page, ce qui gêne, qui ça gêne, le bloc, et si c'est mesuré, un indice ou ton avis.
```

## Étape 1 : à l'œil, sans IA (10 min)

1. Ouvrez Tilleul **sans aide**.
2. Faites le parcours d'un client : accueil, collection, fiche produit, ajout au panier, panier, commande.
3. Notez chaque moment où vous **hésitez, attendez ou vous trompez** dans la grille [`grille.md`](grille.md), rangé dans l'un des six blocs.
4. Refaites une partie du parcours **au clavier seulement**, avec la touche Tab.

## Étape 2 : avec un agent IA (15 min)

1. Collez d'abord **les clés** de [`../prompts/six-blocs.md`](../prompts/six-blocs.md), avec cette cible : *« des personnes de 30 à 60 ans qui achètent un cadeau, surtout sur téléphone »*.
2. Lancez les prompts des six blocs, un par un.
3. Ajoutez à votre grille ce que l'agent a trouvé et que vous aviez raté, **et ce qu'il a raté**.

L'agent doit s'arrêter avant de valider la commande, même ici.

## Étape 3 : la solution (5 min)

Ouvrez Tilleul **avec le mode cours** : il révèle les douze défauts un par un.
Combien en aviez-vous trouvé seul ? Combien avec l'agent ?

## C'est réussi si

- Vous avez au moins un défaut dans chacun des six blocs.
- Pour chaque défaut, vous savez dire **qui** il gêne.
- Vous savez citer un défaut que l'IA a trouvé et vous non, et un que vous avez trouvé et l'IA non.
