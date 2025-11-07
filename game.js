// ═══════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════

const CHILDREN_NAMES = [
    'Nina', 'Cornichon ', 'Tiago', 'Léa', 'Nour', 'Rose', 'Luna', 'Hugo', 'Louna',
    'Esteban', 'Malo',  'Lilia', 'Lilio',  'Yakine'
];

const BOOK_EMOJIS = ['📕', '📗', '📘', '📙', '📔', '📓', '📒', '📕', '📗', '📘', '📙', '📔', '📓', '📒'];

let USE_MICROPHONE = true;
const VOICE_THRESHOLD_CRI = 90;
const VOICE_THRESHOLD_SILENCE = 40;
const SILENCE_DURATION = 30;

// ═══════════════════════════════════════════════════════
// VARIABLES GLOBALES
// ═══════════════════════════════════════════════════════

let currentScreen = 'screen-welcome';
let audioContext = null;
let analyser = null;
let microphone = null;
let animationFrameId = null;
let microphoneGranted = false;

let currentChildIndex = 0;
let validatedChildren = 0;
let silenceTimer = null;
let silenceTimeLeft = SILENCE_DURATION;
let silenceCheckInterval = null;

let speechSynthesis = window.speechSynthesis;
let selectedVoice = null;

// ═══════════════════════════════════════════════════════
// INITIALISATION
// ═══════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initVoice();
    console.log('🎮 Jeu initialisé avec', CHILDREN_NAMES.length, 'enfants');
});

// ═══════════════════════════════════════════════════════
// SYNTHÈSE VOCALE
// ═══════════════════════════════════════════════════════

function initVoice() {
    if (speechSynthesis.getVoices().length === 0) {
        speechSynthesis.addEventListener('voiceschanged', selectBestVoice);
    } else {
        selectBestVoice();
    }
}

function selectBestVoice() {
    const voices = speechSynthesis.getVoices();
    console.log('🎙️ Voix disponibles:', voices.length);
    
    const frenchVoices = voices.filter(v => v.lang.startsWith('fr'));
    console.log('🇫🇷 Voix françaises détectées:');
    frenchVoices.forEach((v, i) => {
        console.log(`  ${i+1}. ${v.name} (${v.lang}) ${v.localService ? '[Local]' : '[Online]'}`);
    });
    
    const preferredMaleVoices = [
        'Google français',
        'Microsoft Paul',
        'Thomas',
        'Microsoft Claude - French (France)',
        'Microsoft Paul - French (France)',
        'French Male',
        'fr-FR-Male'
    ];
    
    for (let preferred of preferredMaleVoices) {
        selectedVoice = voices.find(voice => voice.name.includes(preferred));
        if (selectedVoice) {
            console.log('✅ Voix masculine sélectionnée:', selectedVoice.name);
            break;
        }
    }
    
    if (!selectedVoice) {
        selectedVoice = voices.find(voice => 
            voice.lang.startsWith('fr') && 
            (voice.name.toLowerCase().includes('male') && !voice.name.toLowerCase().includes('female'))
        );
        if (selectedVoice) {
            console.log('✅ Voix masculine trouvée (fallback 1):', selectedVoice.name);
        }
    }
    
    if (!selectedVoice) {
        selectedVoice = voices.find(voice => voice.lang.startsWith('fr'));
        if (selectedVoice) {
            console.log('⚠️ Voix française générique:', selectedVoice.name);
        }
    }
    
    if (!selectedVoice && voices.length > 0) {
        selectedVoice = voices[0];
        console.warn('⚠️ Aucune voix française trouvée, utilisation de:', selectedVoice.name);
    }
}

function speak(text, options = {}) {
    return new Promise((resolve, reject) => {
        speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }
        
        utterance.rate = options.rate || 0.85;
        utterance.pitch = options.pitch || 0.95;
        utterance.volume = options.volume || 1;
        utterance.lang = 'fr-FR';
        
        const speakingIndicator = document.getElementById('speaking-indicator');
        if (speakingIndicator) {
            speakingIndicator.classList.add('active');
        }
        
        utterance.onend = () => {
            console.log('✅ Parole terminée:', text);
            if (speakingIndicator) {
                speakingIndicator.classList.remove('active');
            }
            resolve();
        };
        
        utterance.onerror = (error) => {
            console.error('❌ Erreur de synthèse vocale:', error);
            if (speakingIndicator) {
                speakingIndicator.classList.remove('active');
            }
            reject(error);
        };
        
        console.log('🎙️ Parole:', text);
        speechSynthesis.speak(utterance);
    });
}

// ═══════════════════════════════════════════════════════
// PARTICULES DE FOND
// ═══════════════════════════════════════════════════════

function initParticles() {
    const particlesContainer = document.getElementById('particles');
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.animationDuration = (Math.random() * 5 + 8) + 's';
        particlesContainer.appendChild(particle);
    }
}

// ═══════════════════════════════════════════════════════
// NAVIGATION ENTRE ÉCRANS
// ═══════════════════════════════════════════════════════

function switchScreen(targetScreenId, delay = 0) {
    setTimeout(() => {
        document.getElementById(currentScreen).classList.remove('active');
        currentScreen = targetScreenId;
        document.getElementById(currentScreen).classList.add('active');
        console.log('📺 Écran:', currentScreen);
    }, delay);
}

// ═══════════════════════════════════════════════════════
// DEMANDE DE PERMISSION MICRO
// ═══════════════════════════════════════════════════════

async function requestMicrophoneAccess() {
    if (!USE_MICROPHONE) {
        console.log('🔇 Micro désactivé, passage en mode manuel');
        return;
    }

    try {
        console.log('🎤 Demande de permission micro...');
        const stream = await navigator.mediaDevices.getUserMedia({ 
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true
            } 
        });
        
        console.log('✅ Permission micro ACCORDÉE !');
        microphoneGranted = true;
        stream.getTracks().forEach(track => track.stop());
        
    } catch (error) {
        console.error('❌ Permission micro REFUSÉE:', error.name, error.message);
        microphoneGranted = false;
        USE_MICROPHONE = false;
        console.warn('⚠️ Le jeu continuera en mode manuel (boutons uniquement)');
    }
}

// ═══════════════════════════════════════════════════════
// ÉCRAN 0 : ACCUEIL
// ═══════════════════════════════════════════════════════

async function startGame() {
    await requestMicrophoneAccess();
    switchScreen('screen-pre-intro');
    playPreIntroVideo();
}

// ═══════════════════════════════════════════════════════
// ÉCRAN 0.5 : VIDÉO PRÉ-INTRO
// ═══════════════════════════════════════════════════════

function playPreIntroVideo() {
    const video = document.getElementById('video-pre-intro');
    let videoStarted = false;
    let timeoutId = null;
    
    console.log('🎬 Lecture vidéo PRÉ-INTRO...');
    
    video.addEventListener('playing', () => {
        videoStarted = true;
        if (timeoutId) {
            clearTimeout(timeoutId);
            console.log('✅ Vidéo pré-intro en lecture, timeout annulé');
        }
    }, { once: true });
    
    timeoutId = setTimeout(() => {
        if (!videoStarted) {
            console.warn('❌ Vidéo pré-intro non trouvée après 3s, passage direct à la vidéo intro');
            switchScreen('screen-intro');
            playIntroVideo();
        }
    }, 3000);
    
    video.play().catch(err => {
        console.warn('❌ Vidéo pré-intro impossible à lire:', err.message);
        clearTimeout(timeoutId);
        setTimeout(() => {
            switchScreen('screen-intro');
            playIntroVideo();
        }, 1000);
    });
    
    video.onended = () => {
        console.log('✅ Vidéo pré-intro terminée');
        switchScreen('screen-intro');
        playIntroVideo();
    };
}

function skipPreIntro() {
    console.log('⏭️ Passage vidéo pré-intro...');
    const video = document.getElementById('video-pre-intro');
    video.pause();
    switchScreen('screen-intro');
    playIntroVideo();
}

// ═══════════════════════════════════════════════════════
// ÉCRAN 1 : VIDÉO INTRO
// ═══════════════════════════════════════════════════════

function playIntroVideo() {
    const video = document.getElementById('video-intro');
    let videoStarted = false;
    let timeoutId = null;

    video.addEventListener('playing', () => {
        videoStarted = true;
        if (timeoutId) {
            clearTimeout(timeoutId);
            console.log('✅ Vidéo intro en lecture, timeout annulé');
        }
    }, { once: true });

    timeoutId = setTimeout(() => {
        if (!videoStarted) {
            console.warn('❌ Vidéo intro non trouvée après 3s, passage direct à l\'épreuve 1');
            startEpreuveCri();
        }
    }, 3000);

    video.play().catch(err => {
        console.warn('❌ Vidéo intro impossible à lire:', err.message);
        clearTimeout(timeoutId);
        setTimeout(() => startEpreuveCri(), 1000);
    });

    video.onended = () => {
        console.log('✅ Vidéo intro terminée');
        startEpreuveCri();
    };
}

function skipIntro() {
    console.log('⏭️ Passage vidéo intro...');
    const video = document.getElementById('video-intro');
    video.pause();
    startEpreuveCri();
}

// ═══════════════════════════════════════════════════════
// ÉCRAN 2 : ÉPREUVE 1 - CRI MAGIQUE
// ═══════════════════════════════════════════════════════

async function startEpreuveCri() {
    switchScreen('screen-cri');
    
    // La vidéo du portail est maintenant dans l'écran 5, donc pas besoin de la gérer ici.

    await speak('Première épreuve : le cri magique !', { pitch: 0.95, rate: 0.9 });
    await new Promise(resolve => setTimeout(resolve, 500));
    await speak('Pour réveiller le portail, vous devez TOUS crier la formule magique ensemble.', { 
        pitch: 0.9, 
        rate: 0.85 
    });
    await new Promise(resolve => setTimeout(resolve, 500));
    await speak('Abracadabra, révélez-vous !', { pitch: 1.0, rate: 0.8 });
    await new Promise(resolve => setTimeout(resolve, 800));
    await speak('Criez maintenant !', { pitch: 1.05, rate: 1.0 });
    
    if (USE_MICROPHONE && microphoneGranted) {
        initMicrophone('cri');
    } else {
        console.log('🔇 Mode manuel - Utilisez le bouton pour valider');
    }
}

async function initMicrophone(mode) {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true
            } 
        });
        
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.8;
        microphone.connect(analyser);
        
        if (mode === 'cri') {
            monitorVoiceLevel();
        } else if (mode === 'silence') {
            monitorSilence();
        } else if (mode === 'book') {
            monitorBookResponse();
        }
        
        console.log('🎤 Micro activé en mode:', mode);
    } catch (error) {
        console.warn('⚠️ Impossible d\'accéder au micro:', error);
        USE_MICROPHONE = false;
        microphoneGranted = false;
    }
}

function monitorVoiceLevel() {
    const voiceLevel = document.getElementById('voice-level');
    const voicePercentage = document.getElementById('voice-percentage');
    let frameCount = 0;
    
    console.log('🎤 [CRI] Monitoring démarré');
    
    function update() {
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);
        
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        const percentage = Math.min(100, Math.round((average / 255) * 100));
        
        if (frameCount % 30 === 0) {
            console.log(`🎤 [CRI] Percentage: ${percentage}%`);
        }
        frameCount++;
        
        voiceLevel.style.width = percentage + '%';
        voicePercentage.textContent = percentage + '%';
        
        if (percentage >= VOICE_THRESHOLD_CRI) {
            console.log('✅ [CRI] SEUIL ATTEINT !');
            cancelAnimationFrame(animationFrameId);
            validateCri();
            return;
        }
        
        animationFrameId = requestAnimationFrame(update);
    }
    
    update();
}

function forceValidateCri() {
    validateCri();
}

async function validateCri() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    if (microphone) {
        microphone.disconnect();
        audioContext.close();
        audioContext = null;
        microphone = null;
    }
    
    // La vidéo du portail est maintenant dans l'écran final, pas besoin de la gérer ici.
    playPrePortailVideo();
    
    // Attendre un peu que la vidéo démarre, puis parler par-dessus
    await new Promise(resolve => setTimeout(resolve, 800));
    
    await speak('Incroyable ! Le portail s\'éveille !', { pitch: 1.0, rate: 0.9 });
    await new Promise(resolve => setTimeout(resolve, 500));
    await speak('Mais il n\'est pas encore ouvert... Une dernière épreuve vous attend.', { 
        pitch: 0.9, 
        rate: 0.85 
    });
}

// ═══════════════════════════════════════════════════════
// ÉCRAN 2.7 : VIDÉO PRÉ-PORTAIL
// ═══════════════════════════════════════════════════════

function playPrePortailVideo() {
    switchScreen('screen-pre-portail');
    const video = document.getElementById('video-pre-portail');
    
    let videoStarted = false;
    let timeoutId = null;
    
    console.log('🎬 Lecture vidéo PRÉ-PORTAIL...');
    
    video.addEventListener('playing', () => {
        videoStarted = true;
        if (timeoutId) {
            clearTimeout(timeoutId);
            console.log('✅ Vidéo pré-portail en lecture, timeout annulé');
        }
    }, { once: true });
    
    timeoutId = setTimeout(() => {
        if (!videoStarted) {
            console.warn('❌ Vidéo pré-portail non trouvée après 3s, passage direct à la vidéo silence');
            playVideoSilence();
        }
    }, 3000);
    
    video.play().catch(err => {
        console.warn('❌ Vidéo pré-portail impossible à lire:', err.message);
        clearTimeout(timeoutId);
        setTimeout(() => playVideoSilence(), 1000);
    });
    
    video.onended = () => {
        console.log('✅ Vidéo pré-portail terminée');
        playVideoSilence();
    };
}

function skipPrePortail() {
    console.log('⏭️ Passage vidéo pré-portail...');
    const video = document.getElementById('video-pre-portail');
    video.pause();
    playVideoSilence();
}

// ═══════════════════════════════════════════════════════
// ÉCRAN 3 : VIDÉO SILENCE
// ═══════════════════════════════════════════════════════

async function playVideoSilence() {
    switchScreen('screen-silence-video');
    const video = document.getElementById('video-silence');
    
    let videoStarted = false;
    let timeoutId = null;
    
    video.addEventListener('playing', async () => {
        videoStarted = true;
        if (timeoutId) {
            clearTimeout(timeoutId);
            console.log('✅ Vidéo silence en lecture');
        }
        
        // NARRATION PENDANT LA VIDÉO
        await new Promise(resolve => setTimeout(resolve, 800)); // Pause pour laisser l'image s'installer
        await speak('Quand mon doigt est sur ma bouche...', { pitch: 0.8, rate: 0.7 });
        await new Promise(resolve => setTimeout(resolve, 500)); // Pause dramatique
        await speak('Il ne faudra PLUS UN SEUL BRUIT pendant trente secondes !', { pitch: 0.75, rate: 0.65 });
    }, { once: true });
    
    timeoutId = setTimeout(() => {
        if (!videoStarted) {
            console.warn('❌ Vidéo silence non trouvée, passage à l\'épreuve');
            startEpreuveSilence();
        }
    }, 3000);
    
    video.play().catch(err => {
        console.warn('❌ Vidéo silence impossible à lire:', err.message);
        clearTimeout(timeoutId);
        setTimeout(() => startEpreuveSilence(), 1000);
    });
    
    video.onended = () => {
        console.log('✅ Vidéo silence terminée');
        startEpreuveSilence();
    };
}

function skipSilence() {
    console.log('⏭️ Passage vidéo silence...');
    const video = document.getElementById('video-silence');
    video.pause();
    startEpreuveSilence();
}

// ═══════════════════════════════════════════════════════
// ÉCRAN 4 : ÉPREUVE 2 - SILENCE ABSOLU
// ═══════════════════════════════════════════════════════

let silenceAnimationInterval = null;

async function startEpreuveSilence() {
    switchScreen('screen-silence');
    silenceTimeLeft = SILENCE_DURATION;
    updateSilenceTimer();
    
    await speak('Deuxième épreuve : le silence absolu.', { pitch: 0.9, rate: 0.85 });
    await new Promise(resolve => setTimeout(resolve, 500));
    await speak('Quand mon doigt est sur ma bouche, il ne faudra PLUS UN SEUL BRUIT pendant trente secondes.', { 
        pitch: 0.85, 
        rate: 0.8 
    });
    await new Promise(resolve => setTimeout(resolve, 800));
    await speak('Chuuuut... C\'est parti !', { pitch: 0.8, rate: 0.7 });
    
    // Démarrer l'animation des images
    startSilenceAnimation();
    
    if (USE_MICROPHONE && microphoneGranted) {
        initMicrophone('silence');
    }
    
    silenceTimer = setInterval(() => {
        silenceTimeLeft--;
        updateSilenceTimer();
        
        if (silenceTimeLeft <= 0) {
            validateSilence();
        }
    }, 1000);
}

function startSilenceAnimation() {
    const silenceImg = document.getElementById('silence-animation');
    let currentFrame = 100;
    
    silenceAnimationInterval = setInterval(() => {
        currentFrame++;
        if (currentFrame > 110) {
            currentFrame = 100;
        }
        silenceImg.src = `assets/images/boucle/transparent_frame_00_${currentFrame}.png`;
    }, 500);
    
    console.log('🎬 Animation silence démarrée');
}

function stopSilenceAnimation() {
    if (silenceAnimationInterval) {
        clearInterval(silenceAnimationInterval);
        silenceAnimationInterval = null;
        console.log('⏹️ Animation silence arrêtée');
    }
}

function updateSilenceTimer() {
    const timerDisplay = document.getElementById('silence-timer');
    const minutes = Math.floor(silenceTimeLeft / 60);
    const seconds = silenceTimeLeft % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function monitorSilence() {
    const soundLevel = document.getElementById('sound-level');
    const soundWarning = document.getElementById('sound-warning');
    let tooLoudCount = 0;
    
    function update() {
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);
        
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        const percentage = Math.min(100, Math.round((average / 255) * 100));
        
        soundLevel.style.width = percentage + '%';
        
        if (percentage > VOICE_THRESHOLD_SILENCE) {
            soundLevel.classList.add('danger');
            soundWarning.classList.add('visible');
            tooLoudCount++;
            
            if (tooLoudCount > 20) {
                resetSilenceChallenge();
                return;
            }
        } else {
            soundLevel.classList.remove('danger');
            soundWarning.classList.remove('visible');
            tooLoudCount = 0;
        }
        
        if (currentScreen === 'screen-silence') {
            animationFrameId = requestAnimationFrame(update);
        }
    }
    
    update();
}

function resetSilenceChallenge() {
    clearInterval(silenceTimer);
    stopSilenceAnimation();
    cancelAnimationFrame(animationFrameId);
    alert('⚠️ Trop de bruit ! On recommence...');
    silenceTimeLeft = SILENCE_DURATION;
    startEpreuveSilence();
}

function forceValidateSilence() {
    validateSilence();
}

async function validateSilence() {
    clearInterval(silenceTimer);
    stopSilenceAnimation();
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    if (microphone) {
        microphone.disconnect();
        audioContext.close();
        audioContext = null;
        microphone = null;
    }
    
    // On passe à l'écran d'ouverture, puis on lance la vidéo
    switchScreen('screen-portail-ouvert');
    
    // Lancer la vidéo du portail ici
    const portalVideo = document.getElementById('portal-video');
    if (portalVideo) {
        portalVideo.play().catch(e => console.warn('Erreur lecture portail:', e)); 
    }

    await speak('Vous avez réussi ! Incroyable !', { pitch: 1.0, rate: 0.9 });
    await new Promise(resolve => setTimeout(resolve, 500));
    await speak('Vous avez prouvé votre courage ET votre maîtrise ! Le Portail s\'ouvre pour vous !', { 
        pitch: 0.95, 
        rate: 0.85 
    });
    
    setTimeout(async () => {
        switchScreen('screen-tunnel');
        await speak('Traversons le portail...', { pitch: 0.9, rate: 0.8 });
        
        setTimeout(async () => {
            // Appelle la nouvelle fonction qui contient la vidéo et la parole
            startBookCallingWithIntro();
        }, 6000);
    }, 3000);
}

// ═══════════════════════════════════════════════════════
// ÉCRAN 7 : BIBLIOTHÈQUE INTRO
// ═══════════════════════════════════════════════════════

async function startBookCallingWithIntro() {
    switchScreen('screen-bibliotheque-intro');
    
    // Lancer la vidéo en arrière-plan (si l'autoplay n'a pas suffi)
    const videoLivre = document.getElementById('video-livre-intro');
    if (videoLivre) {
        videoLivre.play().catch(e => console.warn('Erreur lecture video livre:', e));
    }
    
    // Le texte vocal ajusté car le texte à l'écran est retiré
    await speak('Bienvenue dans mon sanctuaire secret...', { pitch: 0.85, rate: 0.75 });
    await new Promise(resolve => setTimeout(resolve, 1500)); // Pause plus longue après le titre
    await speak('Félicitations, détectives ! Vous avez traversé le Portail Magique !', { pitch: 0.9, rate: 0.85 });
    await new Promise(resolve => setTimeout(resolve, 1000));
    await speak('Préparez-vous à l\'appel des livres !', { pitch: 0.95, rate: 0.9 });
    await new Promise(resolve => setTimeout(resolve, 1000));
    await speak('Quand votre livre s\'illumine, criez : "PRÉSENT !"', { pitch: 1.0, rate: 0.95 });
    
    // Note: L'épreuve commence maintenant en cliquant sur le bouton "COMMENCER L'APPEL"
}

async function startBookCalling() {
    console.log('✅ BOUTON CLIC : Démarrage de l\'appel des livres');

    // Naviguer de l'écran d'introduction (7) à l'écran de l'épreuve (8)
    switchScreen('screen-livres'); 
    
    // Arrêter la vidéo d'intro et lancer la vidéo de fond des livres
    const videoLivreIntro = document.getElementById('video-livre-intro');
    if (videoLivreIntro) {
        videoLivreIntro.pause();
        videoLivreIntro.currentTime = 0; // Rembobiner
    }

    const backgroundLivresVideo = document.getElementById('background-livres-video');
    if (backgroundLivresVideo) {
        backgroundLivresVideo.play().catch(e => console.warn('Erreur lecture vidéo background livres:', e));
    }
    
    generateBooks();
    currentChildIndex = 0;
    validatedChildren = 0;
    
    await new Promise(resolve => setTimeout(resolve, 500));
    await speak('Je vais maintenant appeler chacun d\'entre vous.', { 
        pitch: 0.9, 
        rate: 0.85 
    });
    
    setTimeout(() => {
        callNextChild();
    }, 1000);
}

// ═══════════════════════════════════════════════════════
// ÉCRAN 8 : APPEL DES 14 ENFANTS
// ═══════════════════════════════════════════════════════

function generateBooks() {
    const booksCircle = document.getElementById('books-circle');
    booksCircle.innerHTML = '';
    
    const radius = 250;
    const centerX = 300;
    const centerY = 300;
    
    CHILDREN_NAMES.forEach((name, index) => {
        const angle = (index / CHILDREN_NAMES.length) * 2 * Math.PI - Math.PI / 2;
        const x = centerX + radius * Math.cos(angle) - 40;
        const y = centerY + radius * Math.sin(angle) - 50;
        
        const book = document.createElement('div');
        book.className = 'book';
        book.id = `book-${index}`;
        book.style.left = x + 'px';
        book.style.top = y + 'px';
        book.innerHTML = `
            ${BOOK_EMOJIS[index]}
            <div class="book-name">${name}</div>
        `;
        
        booksCircle.appendChild(book);
    });
}

async function callNextChild() {
    if (currentChildIndex >= CHILDREN_NAMES.length) {
        await speak('Bravo ! Tous les détectives sont présents !', { pitch: 1.2, rate: 0.95 });
        setTimeout(() => {
            showMapFormation();
        }, 2000);
        return;
    }
    
    const childName = CHILDREN_NAMES[currentChildIndex];
    
    document.getElementById('call-name').textContent = childName;
    document.getElementById('current-book-name').textContent = childName;
    document.getElementById('voice-status').textContent = '🎙️ Écoute en cours...';
    
    document.querySelectorAll('.book').forEach(book => book.classList.remove('active'));
    document.getElementById(`book-${currentChildIndex}`).classList.add('active');
    
    await speak(`${childName}, es-tu là ?`, { pitch: 1.15, rate: 0.9 });
    
    if (USE_MICROPHONE && microphoneGranted) {
        initMicrophone('book');
    }
}

function monitorBookResponse() {
    let silenceFrames = 0;
    let voiceDetected = false;
    let peakVolume = 0;
    let frameCount = 0;
    const VOICE_THRESHOLD = 35;
    const SILENCE_FRAMES_NEEDED = 25;
    
    function update() {
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);
        
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        const percentage = Math.round((average / 255) * 150);
        
        if (frameCount % 20 === 0) {
            console.log(`📚 [LIVRE] Volume: ${percentage}%`);
        }
        frameCount++;
        
        const voiceLevelBar = document.getElementById('book-voice-level');
        const voicePercentageText = document.getElementById('book-voice-percentage');
        if (voiceLevelBar) {
            voiceLevelBar.style.width = percentage + '%';
        }
        if (voicePercentageText) {
            voicePercentageText.textContent = percentage + '%';
        }
        
        if (percentage > VOICE_THRESHOLD) {
            voiceDetected = true;
            silenceFrames = 0;
            peakVolume = Math.max(peakVolume, percentage);
            document.getElementById('voice-status').textContent = `🎤 Volume: ${percentage}% - On t'entend !`;
            document.getElementById('voice-status').style.color = '#4ade80';
        } else {
            silenceFrames++;
            if (voiceDetected) {
                document.getElementById('voice-status').textContent = `⏳ Silence détecté (${silenceFrames}/${SILENCE_FRAMES_NEEDED})...`;
                document.getElementById('voice-status').style.color = '#fbbf24';
            }
        }
        
        if (voiceDetected && silenceFrames >= SILENCE_FRAMES_NEEDED) {
            console.log(`✅ [LIVRE] VALIDATION !`);
            cancelAnimationFrame(animationFrameId);
            validateBook();
            return;
        }
        
        if (currentScreen === 'screen-livres') {
            animationFrameId = requestAnimationFrame(update);
        }
    }
    
    update();
}

function forceValidateBook() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    if (microphone) {
        microphone.disconnect();
        audioContext.close();
        audioContext = null;
        microphone = null;
    }
    validateBook();
}

async function validateBook() {
    const currentBook = document.getElementById(`book-${currentChildIndex}`);
    const childName = CHILDREN_NAMES[currentChildIndex];
    
    currentBook.classList.remove('active');
    currentBook.classList.add('validated');
    
    validatedChildren++;
    document.getElementById('progress-counter').textContent = `${validatedChildren} / ${CHILDREN_NAMES.length}`;
    document.getElementById('voice-status').textContent = '✅ Validé !';
    
    createRuneAnimation(currentChildIndex);
    
    const confirmations = [
        `Parfait ${childName} ! Bienvenue !`,
        `Excellent ${childName} ! Hello !`,
        `Merveilleux ${childName} ! Super !`,
        `Formidable ${childName} ! OK Genial !`
    ];
    const confirmation = confirmations[Math.floor(Math.random() * confirmations.length)];
    
    speak(confirmation, { pitch: 1.2, rate: 1.0 });
    
    setTimeout(() => {
        currentChildIndex++;
        callNextChild();
    }, 2000);
}

function createRuneAnimation(index) {
    const book = document.getElementById(`book-${index}`);
    const rect = book.getBoundingClientRect();
    
    const rune = document.createElement('div');
    rune.textContent = '✨';
    rune.style.position = 'fixed';
    rune.style.left = rect.left + rect.width / 2 + 'px';
    rune.style.top = rect.top + rect.height / 2 + 'px';
    rune.style.fontSize = '3rem';
    rune.style.zIndex = '1000';
    rune.style.transition = 'all 1s ease';
    rune.style.pointerEvents = 'none';
    
    document.body.appendChild(rune);
    
    setTimeout(() => {
        rune.style.left = window.innerWidth / 2 + 'px';
        rune.style.top = window.innerHeight / 2 + 'px';
        rune.style.opacity = '0';
        rune.style.transform = 'scale(0.1)';
    }, 50);
    
    setTimeout(() => {
        rune.remove();
    }, 1100);
}

// ═══════════════════════════════════════════════════════
// ÉCRAN 9 : FORMATION DE LA CARTE
// ═══════════════════════════════════════════════════════

async function showMapFormation() {
    await speak('Les quatorze détectives sont réunis !', { pitch: 1.0, rate: 0.9 });
    await new Promise(resolve => setTimeout(resolve, 800));
    await speak('La magie peut maintenant opérer...', { pitch: 0.9, rate: 0.8 });
    
    // Passer directement à la vidéo
    setTimeout(() => {
        playVideoPremierIndice();
    }, 1000);
}
// ═══════════════════════════════════════════════════════
// ÉCRAN 9 : VIDÉO PREMIER INDICE
// ═══════════════════════════════════════════════════════

function playVideoPremierIndice() {
    switchScreen('screen-premier-indice');
    
    const video = document.getElementById('video-premier-indice');
    
    let videoStarted = false;
    let timeoutId = null;
    
    console.log('🎬 Lecture vidéo PREMIER INDICE...');
    
    video.addEventListener('playing', () => {
        videoStarted = true;
        if (timeoutId) {
            clearTimeout(timeoutId);
            console.log('✅ Vidéo premier indice en lecture');
        }
    }, { once: true });
    
    timeoutId = setTimeout(() => {
        if (!videoStarted) {
            console.warn('❌ Vidéo premier indice non trouvée, passage à la vidéo finale');
            playVideoFinale();
        }
    }, 3000);
    
    video.play().catch(err => {
        console.warn('❌ Vidéo premier indice impossible à lire:', err.message);
        clearTimeout(timeoutId);
        setTimeout(() => playVideoFinale(), 1000);
    });
    
    video.onended = () => {
        console.log('✅ Vidéo premier indice terminée');
        playVideoFinale();
    };
}

function skipPremierIndice() {
    console.log('⏭️ Passage vidéo premier indice...');
    const video = document.getElementById('video-premier-indice');
    video.pause();
    playVideoFinale();
}
// ═══════════════════════════════════════════════════════
// ÉCRAN 10 : VIDÉO FINALE
// ═══════════════════════════════════════════════════════

function playVideoFinale() {
    switchScreen('screen-finale');
    const video = document.getElementById('video-finale');
    
    let videoStarted = false;
    let timeoutId = null;
    
    video.addEventListener('playing', () => {
        videoStarted = true;
        if (timeoutId) {
            clearTimeout(timeoutId);
            console.log('✅ Vidéo finale en lecture');
        }
    }, { once: true });
    
    timeoutId = setTimeout(() => {
        if (!videoStarted) {
            console.warn('❌ Vidéo finale non trouvée, passage à l\'écran final');
            showFinalScreen();
        }
    }, 3000);
    
    video.play().catch(err => {
        console.warn('❌ Vidéo finale impossible à lire:', err.message);
        clearTimeout(timeoutId);
        setTimeout(() => showFinalScreen(), 1000);
    });
    
    video.onended = () => {
        console.log('✅ Vidéo finale terminée');
        showFinalScreen();
    };
}

function skipFinale() {
    console.log('⏭️ Passage vidéo finale...');
    const video = document.getElementById('video-finale');
    video.pause();
    showFinalScreen();
}

// ═══════════════════════════════════════════════════════
// ÉCRAN 11 : MESSAGE FINAL
// ═══════════════════════════════════════════════════════

async function showFinalScreen() {
    switchScreen('screen-final');
    createConfetti();
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    await speak('Bravo, jeunes détectives !', { pitch: 1.0, rate: 0.9 });
    await new Promise(resolve => setTimeout(resolve, 800));
    await speak('Rendez-vous à l\'aire de jeux !', { pitch: 0.95, rate: 0.9 });
    await new Promise(resolve => setTimeout(resolve, 800));
    await speak('aller on y va  ', { pitch: 0.9, rate: 0.85 });
}

function createConfetti() {
    const confettiContainer = document.getElementById('confetti');
    confettiContainer.innerHTML = '';
    
    const colors = ['#ffd700', '#ff6ec7', '#4ade80', '#00ffff', '#ff6b6b'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        confettiContainer.appendChild(confetti);
    }
}

console.log('✨ Game.js chargé - Prêt à jouer !');