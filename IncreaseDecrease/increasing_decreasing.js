// State
let increasingCount = 0;
let decreasingCount = 8;
let soundEnabled = true;
let narrationEnabled = true;
const MAX_COUNT = 8;
const MIN_COUNT = 0;

// Sound effects using Web Audio API
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playSound(frequency, duration, type = 'success') {
    if (!soundEnabled) return;

    const now = audioContext.currentTime;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.connect(gain);
    gain.connect(audioContext.destination);

    osc.frequency.value = frequency;
    osc.type = 'sine';

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    osc.start(now);
    osc.stop(now + duration);
}

function playSuccessSound() {
    playSound(523.25, 0.15); // C5
    setTimeout(() => playSound(659.25, 0.15), 100); // E5
    setTimeout(() => playSound(783.99, 0.2), 200); // G5
}

function playErrorSound() {
    playSound(349.23, 0.1); // F4
    setTimeout(() => playSound(293.66, 0.15), 100); // D4
}

// Narration with cute girl voice
function speak(text) {
    if (!narrationEnabled) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice properties for cute girl sound
    utterance.pitch = 1.8; // Higher pitch for cute voice
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.volume = 1;

    // Try to select a female voice
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice => 
        voice.name.toLowerCase().includes('female') || 
        voice.name.toLowerCase().includes('woman') ||
        voice.name.toLowerCase().includes('girl') ||
        voice.name.toLowerCase().includes('zira') ||
        voice.name.toLowerCase().includes('samantha') ||
        voice.name.toLowerCase().includes('victoria') ||
        voice.name.toLowerCase().includes('karen')
    );

    if (femaleVoice) {
        utterance.voice = femaleVoice;
    }

    window.speechSynthesis.speak(utterance);
}

// Narration toggle
document.getElementById('narrationToggle').addEventListener('click', function() {
    narrationEnabled = !narrationEnabled;
    this.textContent = narrationEnabled ? '🎤' : '🔇';
    this.classList.toggle('muted');
    if (narrationEnabled) {
        speak('Narration is now on!');
    }
});

// Create balloons
function createBalloons(containerId, count, isIncreasing) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    for (let i = 0; i < count; i++) {
        const balloon = document.createElement('div');
        balloon.className = isIncreasing ? 'balloon increasing-balloon' : 'balloon decreasing-balloon';
        balloon.innerHTML = `
            <div class="balloon-bubble">${i + 1}</div>
            <div class="balloon-string"></div>
        `;
        container.appendChild(balloon);

        // Add pop effect
        balloon.addEventListener('click', function() {
            this.style.opacity = '0';
            playSound(800, 0.1);
            createParticle(this, '🎈');
        });
    }
}

// Create particle effect
function createParticle(element, emoji) {
    const rect = element.getBoundingClientRect();
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.textContent = emoji;
    particle.style.left = rect.left + 'px';
    particle.style.top = rect.top + 'px';
    particle.style.setProperty('--tx', (Math.random() - 0.5) * 100 + 'px');
    particle.style.setProperty('--ty', -Math.random() * 200 + 'px');
    document.body.appendChild(particle);

    setTimeout(() => particle.remove(), 1000);
}

// Increase number
function increaseNumber() {
    if (increasingCount < MAX_COUNT) {
        increasingCount++;
        updateDisplay();
        playSuccessSound();
        
        // Add narration
        const narrations = [
            'One!',
            'Two!',
            'Three!',
            'Four!',
            'Five!',
            'Six!',
            'Seven!',
            'Eight! We are at the maximum!'
        ];
        speak(narrations[increasingCount - 1] + ' The number is increasing!');
        
        createBalloons('increasingBalloons', increasingCount, true);

        // Update emoji based on happiness
        const emojis = ['😊', '😄', '😃', '😆', '🤩', '🎉'];
        const emojiElement = document.getElementById('increasingEmoji');
        emojiElement.textContent = emojis[Math.min(increasingCount, emojis.length - 1)];
        emojiElement.style.animation = 'none';
        setTimeout(() => emojiElement.style.animation = 'emojiJump 0.6s ease-in-out', 10);
    } else {
        playErrorSound();
        speak('Oops! That is the maximum. We cannot add more!');
        showMaxMessage('increasingEmoji');
    }
}

// Decrease number
function decreaseNumber() {
    if (decreasingCount > MIN_COUNT) {
        decreasingCount--;
        updateDisplay();
        playSuccessSound();
        
        // Add narration
        const narrations = [
            'Seven!',
            'Six!',
            'Five!',
            'Four!',
            'Three!',
            'Two!',
            'One!',
            'Zero! All gone!'
        ];
        speak(narrations[8 - decreasingCount - 1] + ' The number is decreasing!');
        
        createBalloons('decreasingBalloons', decreasingCount, false);

        // Update emoji based on sadness
        const emojis = ['😊', '😐', '😕', '😢', '😭', '😢'];
        const emojiElement = document.getElementById('decreasingEmoji');
        emojiElement.textContent = emojis[Math.min(8 - decreasingCount, emojis.length - 1)];
        emojiElement.style.animation = 'none';
        setTimeout(() => emojiElement.style.animation = 'emojiJump 0.6s ease-in-out', 10);
    } else {
        playErrorSound();
        speak('Oops! We cannot take away anymore. We are at zero!');
        showMaxMessage('decreasingEmoji');
    }
}

function showMaxMessage(elementId) {
    const element = document.getElementById(elementId);
    const originalText = element.textContent;
    element.textContent = '❌ STOP!';
    setTimeout(() => {
        element.textContent = originalText;
    }, 1000);
}

// Update display
function updateDisplay() {
    const increasingElement = document.getElementById('increasingCounter');
    const decreasingElement = document.getElementById('decreasingCounter');

    // Increase animation
    increasingElement.textContent = increasingCount;
    increasingElement.style.animation = 'none';
    setTimeout(() => increasingElement.style.animation = 'scaleIn 0.3s ease', 10);

    // Decrease animation
    decreasingElement.textContent = decreasingCount;
    decreasingElement.style.animation = 'none';
    setTimeout(() => decreasingElement.style.animation = 'scaleIn 0.3s ease', 10);
}

// Reset all
function resetAll() {
    increasingCount = 0;
    decreasingCount = 8;
    updateDisplay();
    createBalloons('increasingBalloons', increasingCount, true);
    createBalloons('decreasingBalloons', decreasingCount, false);
    document.getElementById('increasingEmoji').textContent = '😊';
    document.getElementById('decreasingEmoji').textContent = '😊';
    speak('Let us start over! Ready to play again?');
    playSuccessSound();
}

// Initialize
function init() {
    createBalloons('increasingBalloons', increasingCount, true);
    createBalloons('decreasingBalloons', decreasingCount, false);
    
    // Welcome narration with slight delay
    setTimeout(() => {
        speak('Hello! Welcome to Increasing versus Decreasing! Let us learn together. Click the buttons to add or take away balloons!');
    }, 500);
}

// Start the app
init();

// Load voices when they're ready
if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => {
        // Voices are loaded
    };
}

// Get voices to ensure they're loaded
window.speechSynthesis.getVoices();

// Allow keyboard control
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowUp' || event.key === '+') {
        increaseNumber();
    } else if (event.key === 'ArrowDown' || event.key === '-') {
        decreaseNumber();
    } else if (event.key === 'r' || event.key === 'R') {
        resetAll();
    }
});
