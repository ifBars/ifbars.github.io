import { ReactNode, useEffect, useRef } from 'react';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    // Initialize canvas
    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);
    
    // Particle effects
    const particles: Particle[] = [];
    const colors = ['#ffffff', '#770000'];
    const splitChance = 0.015;
    
    interface Particle {
      x: number;
      y: number;
      color: string;
      size: number;
      speed: number;
      direction: number;
    }
    
    // Create particle function
    const createParticle = (event: MouseEvent) => {
      const x = event.clientX;
      const y = event.clientY;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 5 + 1;
      const speed = Math.random() * 2 + 1;
      const direction = Math.random() * 2 * Math.PI;
      
      particles.push({ x, y, color, size, speed, direction });
    };
    
    // Update particles
    const updateParticles = () => {
      const newParticles: Particle[] = [];
      
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        
        p.x += p.speed * Math.cos(p.direction);
        p.y += p.speed * Math.sin(p.direction);
        p.size *= 0.97;
        p.speed *= 0.99;
        
        if (Math.random() < splitChance && particles.length < 300) {
          const newSize = p.size * 0.5;
          const newSpeed = p.speed * 0.8;
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
        
        if (p.size < 0.05 || p.speed < 0.05) {
          particles.splice(i, 1);
        }
      }
      
      particles.push(...newParticles);
    };
    
    // Draw particles
    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, 2 * Math.PI);
        ctx.fillStyle = p.color;
        ctx.fill();
      });
    };
    
    // Animation loop
    const animate = () => {
      updateParticles();
      drawParticles();
      animationFrameId = requestAnimationFrame(animate);
    };
    
    // Event listeners
    canvas.addEventListener('mousemove', createParticle);
    
    // Start animation
    let animationFrameId = requestAnimationFrame(animate);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      canvas.removeEventListener('mousemove', createParticle);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return (
    <div className="flex flex-col min-h-screen bg-black overflow-hidden">
      {/* Background with red tint */}
      <div className="fixed inset-0 bg-gradient-to-br from-red-900/30 to-black z-0"></div>
      
      <canvas 
        ref={canvasRef} 
        className="fixed top-0 left-0 w-full h-full z-10 pointer-events-none"
      />
      
      <div className="relative z-20 flex flex-col min-h-screen">
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
} 