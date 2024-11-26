// paralax video & music code
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

const audioPlayer = document.getElementById('audio-player');
let currentTrackIndex = 0;
let isAudioPlaying = false;

function shufflePlaylist() {
  for (let i = playlist.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [playlist[i], playlist[j]] = [playlist[j], playlist[i]];
  }
}

function playNextTrack() {
  currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
  audioPlayer.src = playlist[currentTrackIndex].src;
  audioPlayer.play();
}

function playPrevTrack() {
  currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
  audioPlayer.src = playlist[currentTrackIndex].src;
  audioPlayer.play();
}

function startAudio() {
  if (isAudioPlaying) return;

  shufflePlaylist();
  audioPlayer.src = playlist[currentTrackIndex].src;
  audioPlayer.volume = 0.5;
  audioPlayer.play();
  isAudioPlaying = true;

  document.removeEventListener('click', startAudio);
}

document.addEventListener('click', startAudio);
audioPlayer.addEventListener('ended', playNextTrack);

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
const splitChance = 0.015;

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
    const newParticles = [];

    particles.forEach(p => {
        p.x += p.speed * Math.cos(p.direction);
        p.y += p.speed * Math.sin(p.direction);
        p.size *= 0.97;
        p.speed *= 0.99;

        if (Math.random() < splitChance) {
            const newSize = p.size * 0.5;
            const newSpeed = p.speed * 0.8;
            const direction1 = p.direction + (Math.random() * 0.5 - 0.25);
            const direction2 = p.direction + (Math.random() * 0.5 - 0.25);

            newParticles.push({ x: p.x, y: p.y, color: p.color, size: newSize, speed: newSpeed, direction: direction1 });
            newParticles.push({ x: p.x, y: p.y, color: p.color, size: newSize, speed: newSpeed, direction: direction2 });
        }

        if (p.size < 0.05 || p.speed < 0.05) {
            particles.splice(particles.indexOf(p), 1);
        }
    });

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

const clickToEnter = document.getElementById('click-to-enter');
const mainContent = document.getElementById('main-content');

clickToEnter.addEventListener('click', () => {
  clickToEnter.style.transform = 'translateY(100%)';

  setTimeout(() => {
    clickToEnter.style.display = 'none';
    mainContent.classList.add('visible');
  }, 1000);
});