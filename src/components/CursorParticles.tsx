import { useEffect, useRef } from 'react';

// Declare global window property for the debug toggle
declare global {
  interface Window {
    toggleParticlesDebug: () => void;
    showParticlesDebug: boolean;
  }
}

interface Particle {
  x: number;
  y: number;
  color: string;
  size: number;
  speed: number;
  direction: number;
}

export default function CursorParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const colors = ['#ffffff', '#ff4040', '#4080ff', '#40ff40'];
  const splitChance = 0.015;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize debug toggle flag (off by default)
    if (window.showParticlesDebug === undefined) {
      window.showParticlesDebug = false;
    }

    // Add console command to toggle debug
    window.toggleParticlesDebug = () => {
      window.showParticlesDebug = !window.showParticlesDebug;
      console.log(`Particles debug ${window.showParticlesDebug ? 'enabled' : 'disabled'}`);
      return `Particles debug is now ${window.showParticlesDebug ? 'ON' : 'OFF'}. Current count: ${particlesRef.current.length}`;
    };

    // Set canvas to full screen
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Draw debug text if enabled
    const debugText = () => {
      if (!ctx || !window.showParticlesDebug) return;
      
      ctx.fillStyle = 'white';
      ctx.font = '14px Arial';
      ctx.fillText(`Particles: ${particlesRef.current.length}`, 10, 20);
    };

    // Create more particles with each mouse move
    const createParticle = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      
      // Create multiple particles at once
      for (let i = 0; i < 3; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        // Bigger particles
        const size = Math.random() * 8 + 3;
        const speed = Math.random() * 2 + 1;
        const direction = Math.random() * 2 * Math.PI;
        particlesRef.current.push({ x, y, color, size, speed, direction });
      }
      
      // Force immediate redraw
      drawParticles();
    };

    const updateParticles = () => {
      const newParticles: Particle[] = [];
      const remainingParticles: Particle[] = [];

      // First update all particles
      particlesRef.current.forEach(p => {
        p.x += p.speed * Math.cos(p.direction);
        p.y += p.speed * Math.sin(p.direction);
        // Slower shrinking rate
        p.size *= 0.985;
        p.speed *= 0.99;

        // Check if particle should split
        if (Math.random() < splitChance && p.size > 2) {
          const newSize = p.size * 0.7;
          const newSpeed = p.speed * 0.9;
          const direction1 = p.direction + (Math.random() * 0.5 - 0.25);
          const direction2 = p.direction + (Math.random() * 0.5 - 0.25);

          newParticles.push({ 
            x: p.x, 
            y: p.y, 
            color: p.color, 
            size: newSize, 
            speed: newSpeed, 
            direction: direction1 
          });
          
          newParticles.push({ 
            x: p.x, 
            y: p.y, 
            color: p.color, 
            size: newSize, 
            speed: newSpeed, 
            direction: direction2 
          });
        }

        // Keep particles longer by using a smaller threshold
        if (p.size >= 0.5) {
          remainingParticles.push(p);
        }
      });

      // Replace the particles array with remaining particles plus new ones
      particlesRef.current = [...remainingParticles, ...newParticles];
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw each particle with a glow effect
      particlesRef.current.forEach(p => {
        ctx.beginPath();
        
        // Add glow effect
        ctx.shadowBlur = p.size * 2;
        ctx.shadowColor = p.color;
        
        ctx.arc(p.x, p.y, p.size, 0, 2 * Math.PI);
        ctx.fillStyle = p.color;
        ctx.fill();
      });
      
      // Reset shadow for debug text
      ctx.shadowBlur = 0;
      debugText();
    };

    const animate = () => {
      updateParticles();
      drawParticles();
      animationFrameId = requestAnimationFrame(animate);
    };

    // Add click handler to create particles on click too
    const handleClick = (e: MouseEvent) => {
      // Create more particles on click
      for (let i = 0; i < 10; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 10 + 5;
        const speed = Math.random() * 3 + 2;
        const direction = Math.random() * 2 * Math.PI;
        particlesRef.current.push({ 
          x: e.clientX, 
          y: e.clientY, 
          color, 
          size, 
          speed, 
          direction 
        });
      }
    };

    // Start animation
    canvas.addEventListener('mousemove', createParticle);
    window.addEventListener('click', handleClick);
    let animationFrameId = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      window.removeEventListener('resize', setCanvasSize);
      canvas.removeEventListener('mousemove', createParticle);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-40"
      style={{ 
        pointerEvents: 'none'
      }}
    />
  );
} 