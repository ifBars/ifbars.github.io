const canvas = document.getElementById('backgroundCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

const particles = [];
const colors = ['#ff007f', '#ff7700', '#00ffaa', '#0077ff'];

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
    particles.forEach(p => {
        p.x += p.speed * Math.cos(p.direction);
        p.y += p.speed * Math.sin(p.direction);
        p.size *= 0.95; // Shrink over time
        p.speed *= 0.98;

        if (p.size < 0.1 || p.speed < 0.1) {
            particles.splice(particles.indexOf(p), 1);
        }
    });
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
        projectsSection.classList.add('fade-in');
    }
}

typeName();
