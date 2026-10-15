# Du scan au compte rendu

**Objectif** : transformer un rapport médical scanné et une note vocale en texte, **sans que rien ne quitte votre ordinateur**. Puis constater que la machine se trompe, et que la relecture n'est pas optionnelle.

**Durée** : 30 minutes avec l'application, 10 minutes pour la version courte.

## Ce qu'il y a dans ce dossier

- `scans/` : trois documents fictifs, volontairement abîmés.
  - Un rapport médical photocopié.
  - Une décision d'assurance reçue par fax.
  - Un rapport en allemand pris en photo au téléphone.
- `audio/note-vocale.wav` : la note vocale fictive d'un collègue, environ 30 secondes. Son texte est plus bas.
- `app/` : une petite application qui tourne dans votre navigateur.
  - **Lire** : la reconnaissance de texte (OCR), avec deux moteurs au choix, PaddleOCR et Tesseract.
  - **Transcrire** : la voix en texte, avec trois modèles au choix, Whisper Small, Whisper Base et Vosk.
  - **Assembler** : les deux textes sont réunis dans un aperçu.

Tout est inventé : le client, l'entreprise, la clinique, l'assurance.

## Ce qu'il vous faut

- Un ordinateur récent, avec Chrome ou Edge.
- Une connexion internet **la première fois** : l'application télécharge ses modèles (plusieurs centaines de Mo, quelques minutes). Vos documents, eux, ne sont jamais envoyés.
- Pour installer l'application : un **agent IA** (Claude Code, Codex…) qui le fait pour vous avec le prompt ci-dessous. Si vous êtes à l'aise avec le terminal, `app/README.md` explique comment faire à la main.

Pas d'agent ? Faites la **version courte** : elle ne demande rien à installer.

## La version courte, sans rien installer (10 min)

Votre ordinateur sait déjà lire le texte d'un scan, sans internet.

1. Ouvrez `scans/01-rapport-medical-photocopie.pdf` :
   - **sur Mac**, avec Aperçu : sélectionnez le texte directement sur l'image, puis copiez-le ;
   - **sur Windows 11**, avec l'Outil Capture : faites une capture de la page, puis cliquez sur « Actions de texte » et copiez le texte.
2. Collez le texte dans un document, à côté du scan. Comparez mot par mot : les noms, les dates, le côté blessé (gauche ou droit). L'ordinateur s'est-il trompé quelque part ?
3. Passez à l'étape 4, « Rédiger », plus bas.

## La version complète, avec l'application (30 min)

### Le prompt à copier dans votre agent

```
Récupère le dépôt https://github.com/clement8426/le-labo et ouvre le dossier
ia-legislation/ia-donnees/01-du-scan-au-compte-rendu.
Lis son README, puis lance l'application du dossier app/ en suivant app/README.md
(installation, modèles Vosk, serveur de développement). Donne-moi l'adresse à ouvrir.
N'envoie aucun fichier à un service en ligne : tout doit rester sur cet ordinateur.
```

### Les étapes

1. **Lire un scan.**
   - Chargez `scans/01-rapport-medical-photocopie.pdf` et cliquez sur **Lire le PDF**, d'abord avec PaddleOCR, puis avec Tesseract.
   - Comparez chaque texte avec le scan. Regardez surtout les noms, les dates et le côté blessé. Notez chaque erreur, même petite.
2. **Transcrire une note vocale.**
   - Importez `audio/note-vocale.wav`, ou enregistrez-vous au micro en lisant la note ci-dessous. Transcrivez avec Whisper Small.
   - Changez de modèle (Whisper Base, puis Vosk) et cliquez sur **Retranscrire cet audio**, sans reparler.
   - Quel modèle oublie un mot ? Lequel se trompe sur la date ?
3. **Assembler.**
   - Corrigez les deux textes, puis cliquez sur **Créer l'aperçu local**.
   - Relisez les noms, les dates et les chiffres avec le scan d'origine sous les yeux.
4. **Rédiger.** L'application n'envoie rien : c'est voulu. Copiez les deux textes corrigés dans l'IA de votre choix, avec ce prompt :

   ```
   Voici le texte d'un rapport médical et d'une note vocale (fictifs).
   Rédige un compte rendu d'une page pour l'assurance : les faits, les dates,
   ce qui est demandé. N'invente rien : si une information manque, écris « à vérifier ».
   ```

   Ici, les documents sont fictifs : n'importe quel outil convient. **Avec un vrai dossier**, ce serait une IA hébergée en Suisse, sous contrat, et jamais un chat grand public.
5. **Pour aller plus loin.** Essayez le fax (deux pages, un tableau) et le rapport en allemand (choisissez la langue allemande pour la voix).

### La note vocale (fictive)

C'est le texte de `audio/note-vocale.wav`. Vous pouvez aussi la lire vous-même au micro.

> Note pour le dossier Exemple. Jean Exemple, frontalier de Morteau, s'est fracturé le poignet gauche le 12 août 2026, chez Horlogerie Fictive au Locle. L'assurance refuse l'indemnité journalière : selon elle, l'accident est survenu en dehors des horaires de travail. Il faut demander le témoignage de Paul Fictif et former opposition avant le 24 octobre.

## C'est réussi si…

- Vous avez obtenu un texte lisible du scan, et de la note si vous avez fait la version complète, sans envoyer aucun fichier en ligne.
- Vous avez repéré et corrigé les erreurs de la machine, ou vérifié mot par mot qu'il n'y en avait pas.
- Vous savez répondre à cette question : **à quel moment une donnée a-t-elle quitté l'ordinateur ?** (Réponse : jamais, jusqu'à l'étape « Rédiger ». Les modèles sont venus d'internet, dans l'autre sens.)

## Pourquoi c'est important

Un rapport médical, c'est **rouge** : une donnée sensible, et souvent un secret professionnel. Le lire et le transcrire sur l'ordinateur évite tout transfert. Seule la rédaction finale part, en texte relu, vers une IA hébergée en Suisse sous contrat.

## Limites

- PDF de 10 pages et 15 Mo au maximum.
- Audio de 90 secondes au maximum.
- Chrome ou Edge conseillés.
- Détails techniques, modèles et licences : [`app/README.md`](app/README.md).
