# Du scan au compte rendu

**Objectif** : transformer un rapport médical scanné et une note vocale en texte, **sans que rien ne quitte votre ordinateur**. Puis constater que la machine se trompe, et que la relecture n'est pas optionnelle.

**Durée** : 30 minutes.

## Ce qu'il y a dans ce dossier

- `scans/` : trois documents fictifs, volontairement abîmés.
  - Un rapport médical photocopié.
  - Une décision d'assurance reçue par fax.
  - Un rapport en allemand pris en photo au téléphone.
- `app/` : une petite application qui tourne dans votre navigateur.
  - **Lire** : la reconnaissance de texte (OCR), avec deux moteurs au choix, PaddleOCR et Tesseract.
  - **Transcrire** : la voix en texte, avec trois modèles au choix, Whisper Small, Whisper Base et Vosk.
  - **Assembler** : les deux textes sont réunis dans un aperçu.

Tout se passe dans le navigateur. Au premier usage, l'application **télécharge** ses modèles : il faut une connexion, et cela peut prendre quelques minutes. Vos documents, eux, ne sont jamais envoyés.

## Le prompt à copier dans votre agent

```
Récupère le dépôt https://github.com/clement8426/le-labo et ouvre le dossier
ia-legislation/ia-donnees/01-du-scan-au-compte-rendu.
Lis son README, puis lance l'application du dossier app/ en suivant app/README.md
(installation, modèles Vosk, serveur de développement). Donne-moi l'adresse à ouvrir.
N'envoie aucun fichier à un service en ligne : tout doit rester sur cet ordinateur.
```

## Les étapes

1. **Lire un scan.**
   - Chargez `scans/01-rapport-medical-photocopie.pdf` et lancez l'OCR avec PaddleOCR, puis avec Tesseract.
   - Comparez les deux textes. Cherchez au moins trois erreurs : un nom, une date, le côté blessé (gauche ou droit).
2. **Transcrire une note vocale.**
   - Enregistrez-vous au micro en lisant la note ci-dessous, puis transcrivez avec Whisper Small.
   - Changez de modèle (Whisper Base, puis Vosk) et cliquez sur **Retranscrire cet audio**, sans reparler.
   - Quel modèle oublie un mot ? Lequel se trompe sur la date ?
3. **Assembler.**
   - Corrigez les deux textes, puis créez l'aperçu.
   - Relisez les noms, les dates et les chiffres avec le scan d'origine sous les yeux.
4. **Pour aller plus loin.**
   - Essayez le fax (deux pages, un tableau) et le rapport en allemand (choisissez la langue allemande pour la voix).

### La note vocale à lire (fictive)

> Note pour le dossier Exemple. Jean Exemple, frontalier de Morteau, s'est fracturé le poignet gauche le 12 août 2026, chez Horlogerie Fictive au Locle. L'assurance refuse l'indemnité journalière : selon elle, l'accident est survenu en dehors des horaires de travail. Il faut demander le témoignage de Paul Fictif et former opposition avant le 24 octobre.

## C'est réussi si…

- Vous avez obtenu un texte lisible du scan et de la note, sans envoyer aucun fichier en ligne.
- Vous avez trouvé au moins une erreur de l'OCR et une erreur de la transcription, et vous les avez corrigées.
- Vous savez répondre à cette question : **à quel moment une donnée a-t-elle quitté l'ordinateur ?** (Réponse : jamais. Seuls les modèles sont venus d'internet, dans l'autre sens.)

## Pourquoi c'est important

Un rapport médical, c'est **rouge** : une donnée sensible, et souvent un secret professionnel. Le lire et le transcrire sur l'ordinateur évite tout transfert. Seule la rédaction finale pourrait partir, en texte, vers une IA hébergée en Suisse sous contrat. Cette dernière étape n'est pas encore dans l'application.

## Limites

- PDF de 10 pages et 15 Mo au maximum.
- Audio de 90 secondes au maximum.
- Chrome ou Edge conseillés.
- Détails techniques, modèles et licences : [`app/README.md`](app/README.md).
