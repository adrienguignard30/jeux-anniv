# 🎮 Les Détectives du Mystère Magique

Jeu interactif pour anniversaire - Intro digitale de chasse au trésor

## 🚀 Lancement

1. Ouvrir `index.html` dans un navigateur
2. Brancher sur une TV via HDMI
3. Laisser les enfants devant l'écran
4. Contrôler le jeu depuis la tablette/ordi

## 🎯 Déroulement (5min30)

1. Vidéo intro du magicien (45s)
2. Épreuve 1 : Cri magique (30s)
3. Épreuve 2 : Silence absolu (1min)
4. Traversée du portail (15s)
5. Appel des 14 enfants (2min)
6. Vidéo finale + écran de fin (40s)

## 📁 Assets à ajouter

### Vidéos (à générer)
- `assets/videos/intro.mp4` - Le magicien présente la quête
- `assets/videos/silence.mp4` - Le magicien fait "chut"
- `assets/videos/finale.mp4` - Message final du magicien

### Sons (optionnels)
- `assets/sounds/ambiance.mp3` - Musique de fond mystique
- `assets/sounds/thunder.mp3` - Tonnerre d'ouverture portail
- `assets/sounds/success.mp3` - Son de validation
- `assets/sounds/whoosh.mp3` - Son magique

### Images (optionnelles)
- `assets/images/background.jpg` - Fond bibliothèque
- `assets/images/portal.png` - Image du portail

## 🎨 Personnalisation

Dans `game.js`, ligne 2-3, modifier les prénoms des enfants.

## 🌐 Déploiement Vercel
```bash 
git init
git add .
git commit -m "Init jeu anniversaire"
vercel deploy --prod

## 📱 Mode Micro

Par défaut : Mode hybride (détection auto + boutons manuels)
Pour désactiver le micro : Dans `game.js`, mettre `useMicrophone = false






🎮 Les Détectives du Mystère Magique
Jeu interactif pour anniversaire - Intro digitale de chasse au trésor

🚀 LANCEMENT RAPIDE

Ouvrir index.html dans un navigateur (Google Chrome recommandé)
Brancher sur une TV via HDMI
Laisser les enfants devant l'écran
Contrôler le jeu depuis la tablette/ordi


🎯 DÉROULEMENT DU JEU (5min30)
ÉtapeDuréeDescriptionÉcran d'accueil10sBouton "Commencer l'aventure"Vidéo intro45sLe magicien présente la quêteÉpreuve 1 : Cri magique30sLes enfants crient pour activer le portailVidéo silence15sLe magicien explique l'épreuve suivanteÉpreuve 2 : Silence absolu1min30 secondes de silence completOuverture portail15sAnimation du portail qui s'ouvreTraversée tunnel6sEffet visuel de passageBibliothèque intro20sExplication de l'appel des livresAppel des 14 enfants2minChaque enfant répond "Présent !"Formation carte5sLes runes fusionnentVidéo finale30sMessage final du magicienÉcran final10sDirection vers l'aire de jeux

⚙️ PERSONNALISATION COMPLÈTE
👶 1. MODIFIER LES PRÉNOMS DES ENFANTS
Fichier : game.js (ligne ~7)
CHERCHEZ :
javascriptconst CHILDREN_NAMES = [
    'Nina', 'Helena', 'Tiago', 'Rose', 'Luna', 'Hugo', 'Louna',
    'Esteban', 'Malo', 'Léa', 'Lilia', 'Lilio', 'Nour', 'Yakine'
];
REMPLACEZ par vos prénoms :
javascriptconst CHILDREN_NAMES = [
    'Tom', 'Emma', 'Lucas', 'Chloé', 'Louis', 'Léa', 'Jules',
    'Manon', 'Hugo', 'Alice', 'Arthur', 'Zoé', 'Théo', 'Lola'
];
⚠️ RÈGLES IMPORTANTES :

Format : 'Prénom' (majuscule initiale uniquement, sinon la voix épelle les lettres)
Nombre : Exactement 14 prénoms (sinon ajuster BOOK_EMOJIS)
Accents : Autorisés ('Léa', 'Maël', 'Zoé')
Affichage : Le CSS met automatiquement en majuscules à l'écran

Exemples de formats :
javascript// ✅ BON (prononcé correctement)
const CHILDREN_NAMES = ['Nina', 'Léa', 'Maël'];

// ❌ MAUVAIS (épelé lettre par lettre)
const CHILDREN_NAMES = ['NINA', 'LÉA', 'MAËL'];

🎤 2. RÉGLER LA SENSIBILITÉ DU MICRO
Fichier : game.js (lignes 7-10)
CHERCHEZ :
javascriptconst VOICE_THRESHOLD_CRI = 70;        // % pour valider le cri
const VOICE_THRESHOLD_SILENCE = 40;    // % max pour le silence
const SILENCE_DURATION = 30;           // secondes
📊 Tableau de réglages recommandés :
ContexteVOICE_THRESHOLD_CRIVOICE_THRESHOLD_SILENCESILENCE_DURATIONEnfants très calmes605030Normal (défaut)704030Enfants très bruyants852530Test seul (dev)506020
Explications :

VOICE_THRESHOLD_CRI : Plus bas = plus facile à valider (50-90)
VOICE_THRESHOLD_SILENCE : Plus haut = tolère plus de bruit (20-60)
SILENCE_DURATION : Durée de l'épreuve en secondes (15-45)


🎯 Sensibilité pour l'appel des livres
Fichier : game.js (ligne ~625)
CHERCHEZ :
javascript    const VOICE_THRESHOLD = 35;           // Seuil pour détecter "Présent !"
    const SILENCE_FRAMES_NEEDED = 20;     // Frames de silence avant validation
REMPLACEZ selon vos besoins :
RéglageVOICE_THRESHOLDSILENCE_FRAMES_NEEDEDEffetTrès sensible2010Valide au moindre sonNormal (défaut)3520ÉquilibréPeu sensible5030Il faut crier fort
Explications :

VOICE_THRESHOLD : Volume minimum pour détecter la voix (20-60%)
SILENCE_FRAMES_NEEDED : Nombre de frames (~0.5s) avant validation (10-40)


🎙️ 3. RÉGLER LA VOIX DE SYNTHÈSE
✅ Solution rapide : Utiliser Google Chrome
Les voix de synthèse de Google Chrome sont les meilleures en français.
Si vous utilisez Edge ou Firefox et que la voix a un accent, passez sur Chrome.

🔧 Forcer une voix spécifique
Fichier : game.js (ligne ~68)
CHERCHEZ :
javascript    const preferredMaleVoices = [
        'Thomas',
        'Google français',
        'Microsoft Claude - French (France)',
REMPLACEZ l'ordre selon votre navigateur :
Pour Chrome :
javascript    const preferredMaleVoices = [
        'Google français',              // Priorité 1
        'Thomas',                       // Priorité 2
        'Microsoft Paul',               // Priorité 3
Pour Edge :
javascript    const preferredMaleVoices = [
        'Microsoft Paul - French (France)',
        'Microsoft Claude - French (France)',
        'Thomas',
Pour voir les voix disponibles : Ouvrez la console (F12) au démarrage du jeu.

🎵 Ajuster vitesse et tonalité
Fichier : game.js (ligne ~138)
CHERCHEZ :
javascript        utterance.rate = options.rate || 0.85;      // Vitesse
        utterance.pitch = options.pitch || 0.95;    // Tonalité
REMPLACEZ selon vos préférences :
StyleratepitchRésultatVoix grave/lente0.70.8Magicien mystérieuxNormal (défaut)0.850.95NaturelVoix dynamique1.01.1ÉnergiqueVoix rapide1.21.0Speedrun
Paramètres :

rate : Vitesse de parole (0.1 = très lent, 2.0 = très rapide)
pitch : Hauteur de la voix (0 = très grave, 2 = très aigu)


🎨 4. CHANGER LES EMOJIS DES LIVRES
Fichier : game.js (ligne ~13)
CHERCHEZ :
javascriptconst BOOK_EMOJIS = ['📕', '📗', '📘', '📙', '📔', '📓', '📒', '📕', '📗', '📘', '📙', '📔', '📓', '📒'];
REMPLACEZ par vos emojis :
Thème animaux :
javascriptconst BOOK_EMOJIS = ['🦁', '🐯', '🐻', '🦊', '🐼', '🐨', '🐸', '🦄', '🐉', '🦋', '🐝', '🐢', '🦉', '🐙'];
Thème espace :
javascriptconst BOOK_EMOJIS = ['⭐', '🌟', '✨', '💫', '🌠', '🪐', '🌙', '☀️', '🌍', '🚀', '🛸', '👽', '🌌', '☄️'];
Thème magie :
javascriptconst BOOK_EMOJIS = ['🔮', '💎', '✨', '🌟', '⚡', '🔥', '💧', '🍃', '❄️', '🌈', '🦄', '🧙', '🪄', '🎩'];
⚠️ Important : Toujours exactement 14 emojis (un par enfant).

⏱️ 5. AJUSTER LES DURÉES
Durée de l'épreuve silence
Fichier : game.js (ligne ~10)
CHERCHEZ :
javascriptconst SILENCE_DURATION = 30; // secondes
REMPLACEZ :
javascriptconst SILENCE_DURATION = 20; // 20 secondes (plus rapide)
// OU
const SILENCE_DURATION = 45; // 45 secondes (plus difficile)

Timeouts des vidéos
Si une vidéo ne charge pas (affichage d'un écran noir), le jeu passe automatiquement après 2 secondes.
Pour augmenter ce délai :
Vidéo intro (ligne ~255) :
javascriptsetTimeout(() => {
    if (!videoLoaded) {
        console.warn('❌ Vidéo intro non trouvée après 2s...');
        startEpreuveCri();
    }
}, 5000); // 5 secondes au lieu de 2
Vidéo silence (ligne ~384) :
javascript}, 5000); // 5 secondes au lieu de 2
Vidéo finale (ligne ~803) :
javascript}, 5000); // 5 secondes au lieu de 2

🔇 6. DÉSACTIVER LE MICRO (MODE MANUEL UNIQUEMENT)
Fichier : game.js (ligne ~8)
CHERCHEZ :
javascriptlet USE_MICROPHONE = true; // Mettre false pour désactiver le micro
REMPLACEZ :
javascriptlet USE_MICROPHONE = false; // Mode 100% manuel (boutons uniquement)
```

En mode manuel, utilisez les boutons **"VALIDER MANUELLEMENT"** pour faire avancer le jeu.

---

## 📁 STRUCTURE DES FICHIERS
```
project/
├── index.html          # Structure HTML du jeu
├── styles.css          # Styles et animations
├── game.js             # Logique du jeu
├── README.md           # Ce fichier
└── assets/
    ├── videos/
    │   ├── intro.mp4      # Vidéo d'introduction (optionnel)
    │   ├── silence.mp4    # Vidéo "chut" (optionnel)
    │   └── finale.mp4     # Vidéo finale (optionnel)
    ├── sounds/            # Sons (optionnels, non implémentés)
    │   ├── ambiance.mp3
    │   ├── thunder.mp3
    │   └── success.mp3
    └── images/            # Images (optionnels, non utilisés)
        ├── background.jpg
        └── portal.png

🎬 AJOUTER DES VIDÉOS (OPTIONNEL)
Où placer les vidéos ?
Créez le dossier assets/videos/ et placez-y :

intro.mp4 - Le magicien présente la quête (30-60s)
silence.mp4 - Le magicien fait "chut" avec son doigt (10-20s)
finale.mp4 - Message final du magicien (20-40s)

Format recommandé :

Résolution : 1920x1080 (Full HD) ou 1280x720 (HD)
Format : MP4 (codec H.264)
Durée : 15-60 secondes par vidéo
Poids : < 50 Mo par vidéo

Si vous n'avez pas de vidéos :
Le jeu fonctionne sans vidéos ! Après 2 secondes, il passe automatiquement à l'écran suivant.

🌐 DÉPLOIEMENT EN LIGNE (VERCEL)
Installation Vercel CLI :
bashnpm install -g vercel
Déploiement :
bashcd /chemin/vers/votre/projet
vercel deploy --prod
Ou via l'interface web :

Aller sur vercel.com
Créer un compte gratuit
Cliquer sur "New Project"
Importer votre dossier (via Git ou upload direct)
Déployer !

Vous obtiendrez une URL type : https://votre-jeu.vercel.app

🐛 RÉSOLUTION DE PROBLÈMES
❌ Problème : La voix a un accent anglais
Solutions :

Utiliser Google Chrome (meilleures voix françaises)
Vérifier que les prénoms sont en format 'Prénom' (pas 'PRÉNOM')
Forcer une voix française (voir section 3)

Vérifier les voix disponibles :

Ouvrir la console (F12)
Chercher 🇫🇷 Voix françaises détectées:
Noter les noms des voix françaises
Les ajouter dans preferredMaleVoices (ligne ~68)


❌ Problème : Un prénom est épelé (ex: "Y-A-K-I-N-E")
Cause : Le prénom est en majuscules ('YAKINE')
Solution : Mettre en format 'Yakine' (voir section 1)

❌ Problème : Le micro ne détecte rien
Vérifications :

Autoriser l'accès au micro dans le navigateur (popup au démarrage)
Vérifier que le micro fonctionne (paramètres Windows/Mac)
Utiliser HTTPS ou localhost (requis pour l'API micro)
Réduire la sensibilité (voir section 2)

Test rapide :

Ouvrir la console (F12)
Chercher 🎤 [CRI] Volume: pendant l'épreuve 1
Si Volume: 0% en permanence → problème de micro


❌ Problème : Le micro est trop sensible / pas assez sensible
Solution : Ajuster les seuils (voir section 2)
Valeurs de test rapides :
Trop sensible ?
javascriptconst VOICE_THRESHOLD_CRI = 85;        // Plus difficile
const VOICE_THRESHOLD_SILENCE = 25;    // Plus strict
const VOICE_THRESHOLD = 50;            // Livres : besoin de crier
Pas assez sensible ?
javascriptconst VOICE_THRESHOLD_CRI = 55;        // Plus facile
const VOICE_THRESHOLD_SILENCE = 55;    // Plus tolérant
const VOICE_THRESHOLD = 20;            // Livres : très sensible

❌ Problème : Les vidéos ne s'affichent pas
Causes possibles :

Fichiers vidéo manquants → Le jeu skip automatiquement après 2s
Format vidéo incompatible → Convertir en MP4 (H.264)
Chemin incorrect → Vérifier assets/videos/intro.mp4

Solution rapide : Le jeu fonctionne sans vidéos !

❌ Problème : Le jeu reste bloqué sur un écran
Solutions :

Utiliser le bouton "VALIDER MANUELLEMENT" (en bas de chaque épreuve)
Désactiver le micro : USE_MICROPHONE = false (ligne ~8)
Recharger la page (F5)


🎮 RACCOURCIS CLAVIER (MODE DEBUG)
Ces raccourcis ne sont pas implémentés par défaut, mais vous pouvez les ajouter dans game.js :
javascript// À ajouter à la fin de game.js
document.addEventListener('keydown', (e) => {
    if (e.key === 'n') skipIntro();              // N = Skip intro
    if (e.key === 'c') forceValidateCri();       // C = Valider cri
    if (e.key === 's') forceValidateSilence();   // S = Valider silence
    if (e.key === 'b') forceValidateBook();      // B = Valider livre
    if (e.key === 'r') location.reload();        // R = Restart
});

📊 STATISTIQUES DU JEU
ÉlémentNombreÉcrans totaux11Épreuves interactives3 (cri + silence + appel)Vidéos (optionnelles)3Prénoms d'enfants14 (personnalisable)Durée totale~5min30Lignes de code JS~850Lignes de code CSS~700

🎯 CHECKLIST AVANT L'ANNIVERSAIRE

 Modifier les 14 prénoms dans game.js
 Tester le jeu sur Google Chrome
 Vérifier que les voix sont en français (console F12)
 Ajuster la sensibilité du micro si nécessaire
 Tester les épreuves (cri + silence + appel)
 Brancher l'ordinateur sur la TV (HDMI)
 Vérifier le volume des enceintes
 Mettre le jeu en plein écran (F11)
 Préparer l'aire de jeux pour la suite de la quête !


💡 CONSEILS D'ANIMATION
Avant de lancer le jeu :

Regrouper les enfants devant l'écran
Expliquer qu'ils vont devenir des "détectives magiques"
Leur dire d'écouter le magicien et de suivre ses instructions

Pendant le jeu :

Rester près de l'ordinateur pour valider manuellement si besoin
Encourager les enfants à crier fort (épreuve 1)
Les faire respecter le silence (épreuve 2)
Valider manuellement les enfants timides (bouton admin)

Après le jeu :

Féliciter tous les enfants
Les diriger vers l'aire de jeux pour la vraie chasse au trésor
Laisser l'écran final affiché pour les retardataires


📞 SUPPORT
Si vous rencontrez un problème non listé ici :

Ouvrir la console (F12 dans le navigateur)
Copier les messages d'erreur (en rouge)
Vérifier les logs (messages avec emojis 🎤 📚 ✅)
Adapter les réglages selon les messages affichés


📝 LICENCE
Ce jeu est libre d'utilisation pour des anniversaires privés.
Créé avec ❤️ pour une expérience d'anniversaire inoubliable !

Version : 1.0
Dernière mise à jour : Novembre 2025
Compatibilité : Chrome 90+, Edge 90+, Firefox 88+
