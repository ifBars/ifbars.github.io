const canvas = document.getElementById('backgroundCanvas');
const ctx = canvas.getContext('2d');

// Set initial canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Update canvas size on window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

const particles = [];
const colors = ['#ff007f', '#ff7700', '#00ffaa', '#0077ff'];

function createParticle(e) {
    const x = e.clientX; // Use clientX and clientY to get mouse position relative to the viewport
    const y = e.clientY;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const speed = Math.random() * 2 + 1;
    const direction = Math.random() * 2 * Math.PI;
    particles.push({ x, y, color, speed, direction });
}

function updateParticles() {
    particles.forEach(p => {
        p.x += p.speed * Math.cos(p.direction);
        p.y += p.speed * Math.sin(p.direction);
        p.speed *= 0.98; // Slow down over time

        // Remove particles that move outside the canvas
        if (p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height || p.speed < 0.1) {
            particles.splice(particles.indexOf(p), 1);
        }
    });
}

function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = p.color;
        ctx.fill();
    });
}

function animate() {
    updateParticles();
    drawParticles();
    requestAnimationFrame(animate);
}

// Create particles on mouse movement
canvas.addEventListener('mousemove', createParticle);

// Start animation
animate();
