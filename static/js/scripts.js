// paralax video & music code
// Parallax effect for video background
const video = document.getElementById('background-video');
document.addEventListener('mousemove', (e) => {
  const { clientX, clientY } = e;
  const { innerWidth, innerHeight } = window;

  const xPercent = (clientX / innerWidth) * 100;
  const yPercent = (clientY / innerHeight) * 100;

  const translateX = (xPercent - 50) / 10;
  const translateY = (yPercent - 50) / 10;

  video.style.transform = `scale(1.2) translate(${translateX}%, ${translateY}%)`;
});

// Audio playback with playlist shuffle and loop
const audioPlayer = document.getElementById('audio-player');
let currentTrackIndex = 0;
let isAudioPlaying = false; // Flag to check if audio is already playing

// Shuffle the playlist (Fisher-Yates algorithm)
function shufflePlaylist() {
  for (let i = playlist.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [playlist[i], playlist[j]] = [playlist[j], playlist[i]];
  }
}

// Play the next track
function playNextTrack() {
  currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
  audioPlayer.src = playlist[currentTrackIndex].src;
  audioPlayer.play();
}

// Play the previous track
function playPrevTrack() {
  currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
  audioPlayer.src = playlist[currentTrackIndex].src;
  audioPlayer.play();
}

// Handle user interaction to start playing audio
function startAudio() {
  if (isAudioPlaying) return; // Prevent starting the audio again if it's already playing

  shufflePlaylist();
  audioPlayer.src = playlist[currentTrackIndex].src;
  audioPlayer.volume = 0.5;
  audioPlayer.play();

  isAudioPlaying = true; // Set flag to true indicating the audio is playing

  // Remove the event listener after the first interaction to prevent multiple plays
  document.removeEventListener('click', startAudio);
}

// Listen for user interaction to start the audio, only once
document.addEventListener('click', startAudio);

// Listen for the `ended` event to play the next track
audioPlayer.addEventListener('ended', playNextTrack);

// background particles & typewriter code
const canvas = document.getElementById('backgroundCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

const particles = [];
const colors = ['#ffffff', '#000000'];
const splitChance = 0.025;  // 5% chance to split

function createParticle(e) {
    const x = e.clientX;
    const y = e.clientY;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 5 + 1;
    const speed = Math.random() * 2 + 1;
    const direction = Math.random() * 2 * Math.PI;
    particles.push({ x, y, color, size, speed, direction });
}

function updateParticles() {
    const newParticles = [];  // To store newly split particles

    particles.forEach(p => {
        p.x += p.speed * Math.cos(p.direction);
        p.y += p.speed * Math.sin(p.direction);
        p.size *= 0.97; // Shrink over time
        p.speed *= 0.99;

        // Check if the particle should split
        if (Math.random() < splitChance) {
            // Create two smaller particles
            const newSize = p.size * 0.5;
            const newSpeed = p.speed * 0.8;
            const direction1 = p.direction + (Math.random() * 0.5 - 0.25); // Slight angle offset
            const direction2 = p.direction + (Math.random() * 0.5 - 0.25);

            newParticles.push({ x: p.x, y: p.y, color: p.color, size: newSize, speed: newSpeed, direction: direction1 });
            newParticles.push({ x: p.x, y: p.y, color: p.color, size: newSize, speed: newSpeed, direction: direction2 });
        }

        // Remove particles that are too small or slow
        if (p.size < 0.05 || p.speed < 0.05) {
            particles.splice(particles.indexOf(p), 1);
        }
    });

    // Add the new particles to the main particle array
    particles.push(...newParticles);
}

function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, 2 * Math.PI);
        ctx.fillStyle = p.color;
        ctx.fill();
    });
}

function animate() {
    updateParticles();
    drawParticles();
    requestAnimationFrame(animate);
}

canvas.addEventListener('mousemove', createParticle);

animate();

const nameElement = document.getElementById('typewriter-name');
const subtitleElement = document.getElementById('typewriter-subtitle');
const iconsContainer = document.querySelector('.socials-container');
const projectsSection = document.querySelector('.projects');
const nameText = "IfBars";
const subtitleText = "Software Developer";
let nameIndex = 0;
let subtitleIndex = 0;

function typeName() {
    if (nameIndex < nameText.length) {
        nameElement.innerHTML += nameText.charAt(nameIndex);
        nameIndex++;
        setTimeout(typeName, 100);
    } else {
        setTimeout(typeSubtitle, 400);
    }
}

function typeSubtitle() {
    if (subtitleIndex < subtitleText.length) {
        subtitleElement.innerHTML += subtitleText.charAt(subtitleIndex);
        subtitleIndex++;
        setTimeout(typeSubtitle, 100);
    } else {
        setTimeout(() => {
            iconsContainer.classList.remove('hidden');
            iconsContainer.classList.add('visible');
        }, 200);
        projectsSection.classList.add('fade-in');
    }
}

typeName();
