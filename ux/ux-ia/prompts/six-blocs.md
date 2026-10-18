# Les prompts du cours, un par bloc

À copier dans votre assistant (Claude, ChatGPT…). Remplacez ce qui est entre crochets.
Ils marchent mieux avec un **agent** qui peut ouvrir le site lui-même (Claude Code, Claude dans Chrome, Codex, l'agent de l'application ChatGPT).

## À coller en premier : les clés

```
Avant de commencer, voici le contexte.
- Le site : [adresse, ou dossier du code].
- L'intention : [ce qui est voulu dans le design, par exemple « un seul style de titre », « des boutons arrondis »].
- La cible : [qui, quel âge, quelle aisance avec le numérique, sur quel appareil].
- L'objectif principal d'un visiteur : [acheter, réserver, s'inscrire…].
- Le ton de la marque : [tutoiement ou vouvoiement, sérieux ou léger] ; exemples : « [phrase 1] », « [phrase 2] ».
- Les pages qui comptent : [accueil, liste, fiche, formulaire, panier…].
Si une information te manque, pose-moi la question avant d'agir.
Pour chaque constat, dis s'il est mesuré par un outil, s'il s'agit d'un indice à confirmer, ou de ton avis.
```

## 1. Design system

```
Visite l'accueil, une liste, une fiche et un formulaire, à 375, 768 et 1440 px de large.
Compare titres, boutons, champs, couleurs et espacements d'une page à l'autre.
Liste les incohérences avec les valeurs mesurées. Demande-moi l'intention avant de corriger.
```

**La clé** : l'intention. Deux styles de titre, c'est voulu ou non ?
**À vérifier** : que ses corrections respectent vos choix.

## 2. Friction

```
Tu es [la cible], sur téléphone. Objectif : [acheter un vase, démarrer un essai, réserver].
Fais le parcours et arrête-toi avant de payer ou d'envoyer quoi que ce soit.
Note chaque pop-up, hésitation, détour et étape inutile. Compte les clics.
```

**À vérifier** : ce sont des pistes. Les utilisateurs simulés ne se comportent pas comme de vraies personnes : confirmez avec de vraies personnes : cinq par groupe d'usagers pour commencer, puis on corrige et on recommence.

## 3. Accessibilité

```
Audite ces pages avec Pa11y et Lighthouse. Parcours-les uniquement au clavier.
Explique chaque erreur simplement et dis qui elle gêne.
Vérifie que chaque image informative a un texte alternatif utile, et que les images décoratives sont ignorées. Puis corrige.
```

**Sans accès au code du site** (comme sur Tilleul), retirez « Puis corrige » : c'est un audit, rien à modifier.

**Bon à savoir** : une image décrite « image », ou un champ étiqueté « Champ 1 », passent l'audit automatique : le texte existe, mais ne dit rien. L'IA peut aider à le repérer, à vérifier. Un contrôle avec un vrai lecteur d'écran reste nécessaire.

## 4. Analyse comportementale

À utiliser avec les données d'usage d'un outil comme Hotjar (ou Clarity), exportées ou branchées à l'agent.

```
À partir de ces données d'usage, quelles pages montrent des clics sans effet
ou des abandons sur mobile ? Distingue les constats des hypothèses.
Si les données ne permettent pas de le mesurer, dis ce qui manque.
```

**À vérifier** : les chiffres disent où, pas pourquoi. Ce que l'outil fournit dépend de son offre (période, métriques). Et le consentement des visiteurs.

## 5. Microcopie

```
Sur le formulaire et le panier, envoie le formulaire vide, puis avec un e-mail mal écrit.
Relève boutons, erreurs et aides. Pour [la cible], lesquels sont vagues, techniques ou inquiétants ?
Deux variantes chacun, dans ce ton : [exemples].
```

**À vérifier** : que les textes ne sont pas devenus passe-partout.

## 6. Performance perçue

```
Simule un téléphone avec une connexion lente. Après chaque clic important,
combien de temps reste-t-on sans retour visible ? Propose un retour immédiat
ou un squelette de chargement, sans jamais ajouter d'attente.
```

**À vérifier** : aucune fausse attente. L'utilisateur serait-il d'accord s'il le savait ? Une simulation aide au diagnostic mais ne remplace pas un vrai téléphone, et ces outils web n'auditent pas une application native.
