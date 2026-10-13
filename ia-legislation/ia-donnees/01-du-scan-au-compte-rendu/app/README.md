# Du scan au compte rendu : l’application

Première version de la démonstration de l’atelier « IA, données et responsabilité ». L’interface montre trois blocs reliés : OCR d’un PDF, transcription d’une note vocale et préparation d’un aperçu. Les blocs ont chacun une entrée, une sortie et une responsabilité ; leurs connexions sont décrites dans `src/main.js`.

## Démarrer

Il faut Node.js 20.19+ et un navigateur récent (Chrome ou Edge conseillés).

```bash
cd app
npm install
npm run models:vosk
npm run dev
```

Ouvrir l’adresse locale affichée. `npm run build` vérifie que l’application peut être construite.

`npm run models:vosk` prépare les modèles français et allemand depuis les archives officielles (environ 90 Mo de téléchargement au total). Ces fichiers restent dans `public/models/`, exclu de Git. La commande peut être relancée sans retélécharger les modèles déjà prêts. Pour une version distribuée, la lancer avant `npm run build`. Whisper télécharge son modèle depuis Hugging Face au premier usage dans le navigateur.

## Démo

1. Choisir un PDF fictif, puis lancer l’OCR avec **PaddleOCR PP-OCRv6 small** ou **Tesseract.js**. Le texte peut être corrigé avant la suite.
2. Choisir le **moteur et modèle STT**, puis la langue. Cliquer sur **Enregistrer au micro** et regarder la forme d’onde en parlant ; cliquer sur **Arrêter et transcrire** pour lancer le modèle choisi. On peut aussi importer une courte note vocale fictive ou saisir une note à la main. La transcription peut être corrigée.
3. Créer l’aperçu local. Il assemble les deux textes et rappelle les vérifications à faire. **Il ne s’agit pas encore d’un résumé généré par une IA.**

Les documents et audios restent dans le navigateur. Les bibliothèques téléchargent leurs modèles et certains composants de calcul au premier usage ; prévoir une connexion et tester la démo avant l’atelier. Le premier chargement peut prendre du temps. Aucune clé API n’est nécessaire et aucun appel Infomaniak n’est effectué dans cette version.

## Comparer les transcriptions

- **Whisper Small** : choix initial, multilingue, plus volumineux. Modèle `Xenova/whisper-small` en calcul local WASM et poids q8.
- **Whisper Base** : modèle `Xenova/whisper-base`, plus léger, pour comparer vitesse et qualité.
- **Vosk Small** : autre famille de modèles open source, `vosk-model-small-fr-0.22` en français et `vosk-model-small-de-0.15` en allemand. Pas de ponctuation automatique.

Après un enregistrement, changer le modèle et cliquer sur **Retranscrire cet audio** : il n’est pas nécessaire de reparler. La durée réellement décodée est affichée et le lecteur permet de vérifier que l’enregistrement contient toute la phrase. Le texte précédent reste disponible si le traitement échoue. Un changement de moteur libère le modèle précédent pour limiter la mémoire utilisée.

Les modèles ne garantissent pas une transcription exacte. Comparer sur la même note, dans la bonne langue, et relire les noms, dates et chiffres. Le temps affiché comprend le chargement si nécessaire : comparer les vitesses après un premier passage.

Exemple observé pendant les essais : sur un audio de synthèse de 8,46 secondes répétant deux fois « Je vais tester un vocal, voir si tout est retranscrit », Whisper Small a renvoyé la phrase une seule fois dès sa sortie brute. Vosk a conservé les deux occurrences, avec des erreurs de mots. L’application n’applique aucun filtre supprimant les phrases identiques. Ce test illustre une omission possible du modèle, sans établir un classement général des moteurs. Utiliser la réécoute pour vérifier ce qui a réellement été enregistré.

## Contenu du dossier

Le dossier contient le code, cette documentation et `package-lock.json`, qui permet de retrouver les dépendances utilisées. `node_modules/`, `dist/` et les modèles téléchargés restent exclus par le `.gitignore` du dépôt. Les scans fictifs de l'exercice sont dans `../scans/`.

Sources et licences : [Whisper (MIT)](https://github.com/openai/whisper), [modèles Vosk (Apache 2.0 pour les deux modèles choisis)](https://alphacephei.com/vosk/models), [Vosk Browser (Apache 2.0)](https://github.com/ccoreilly/vosk-browser).

## Structure pédagogique

- `src/workflow.js` : classe de base `Block` et connexions du `Workflow`.
- `src/ocr-block.js` : OCR et choix entre deux moteurs interchangeables.
- `src/voice-block.js` : préparation audio commune et appel au moteur choisi.
- `src/stt-models.js` : catalogue et adaptateurs `WhisperAdapter` / `VoskAdapter`, avec les mêmes méthodes `transcribe` et `dispose`.
- `scripts/prepare-vosk.js` : préparation des modèles Vosk, sans les ajouter au dépôt.
- `src/microphone-recorder.js` et `src/waveform.js` : capture micro et forme d’onde en direct.
- `src/report-block.js` : aperçu local, remplaçable plus tard par un fournisseur Infomaniak.
- `src/pdf-pages.js` : conversion des pages PDF en images pour l’OCR.
- `src/main.js` : branche les trois blocs à l’interface.

Cette première version est un support de cours. Elle accepte des PDF de 10 pages et 15 Mo maximum, et des audios de 90 secondes maximum. L’enregistrement s’arrête automatiquement à 90 secondes. Le navigateur demande l’autorisation du microphone au premier usage. Utiliser uniquement des fichiers fictifs. Le rapport médical et le fax du dossier de cours forment un cas ; le rapport allemand est un autre cas.
