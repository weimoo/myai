import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { FireworkConfig, Particle, Rocket } from '../types';

interface FireworkCanvasProps {
  onCanvasReady?: () => void;
  onClick?: (x: number, y: number) => void;
}

export interface FireworkCanvasRef {
  launch: (config: FireworkConfig, target?: { x: number; y: number }) => void;
  clean: () => void;
}

// Extend Particle for local state (previous positions for trails)
interface TrailParticle extends Particle {
  prevX: number;
  prevY: number;
}

// Helper to convert hex to rgb for alpha manipulation
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 255, g: 255, b: 255 };
};

const FireworkCanvas = forwardRef<FireworkCanvasRef, FireworkCanvasProps>((props, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rocketsRef = useRef<Rocket[]>([]);
  const particlesRef = useRef<TrailParticle[]>([]);
  const animationFrameRef = useRef<number>(0);

  const createParticles = (x: number, y: number, config: FireworkConfig) => {
    const { colors, particleCount, physics, shape } = config;
    const newParticles: TrailParticle[] = [];

    // Willow effect: lower initial velocity, higher drag
    const isWillow = shape === 'willow';
    const baseVelocity = isWillow ? physics.initialVelocity * 0.6 : physics.initialVelocity;

    for (let i = 0; i < particleCount; i++) {
      let angle = Math.random() * Math.PI * 2;
      let velocity = Math.random() * baseVelocity;
      let vx = Math.cos(angle) * velocity;
      let vy = Math.sin(angle) * velocity;

      // Shape Logic
      if (shape === 'heart') {
        const t = (i / particleCount) * Math.PI * 2;
        const scale = velocity * 0.15;
        vx = (16 * Math.pow(Math.sin(t), 3)) * scale;
        vy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * scale;
      } else if (shape === 'ring') {
        velocity = physics.initialVelocity * (0.9 + Math.random() * 0.1); 
        vx = Math.cos(angle) * velocity;
        vy = Math.sin(angle) * velocity;
      } else if (shape === 'star') {
          const spikes = 5;
          const starAngle = (Math.floor(i / (particleCount/5)) * (Math.PI * 2 / 5)) - (Math.PI/2);
          const spread = (Math.random() - 0.5) * 0.5;
          const finalAngle = starAngle + spread;
          velocity = physics.initialVelocity * (0.5 + Math.random() * 0.8);
          vx = Math.cos(finalAngle) * velocity;
          vy = Math.sin(finalAngle) * velocity;
      }

      const color = colors[Math.floor(Math.random() * colors.length)];
      
      newParticles.push({
        x,
        y,
        prevX: x,
        prevY: y,
        vx,
        vy,
        color: color,
        alpha: 1,
        decay: isWillow ? physics.decay * 0.5 : physics.decay * (0.8 + Math.random() * 0.4),
        size: Math.random() * 2 + 1,
        flicker: Math.random() > 0.5
      });
    }
    return newParticles;
  };

  const launchFirework = (config: FireworkConfig, target?: { x: number; y: number }) => {
    if (!canvasRef.current) return;
    const { width, height } = canvasRef.current;
    
    let startX: number, targetY: number, vx: number, vy: number;
    const gravity = 0.15; // Must match the loop gravity

    if (target) {
      // Launch from a somewhat random position at the bottom towards the target
      // This creates a nice arc effect
      const randomOffset = (Math.random() - 0.5) * (width * 0.5);
      startX = Math.max(width * 0.1, Math.min(width * 0.9, target.x + randomOffset));
      
      // Ensure startX is at bottom
      const startY = height;
      targetY = target.y;

      // Physics: projectile motion to reach targetY at apex
      // v_y0 = -sqrt(2 * g * dy)
      const dy = startY - targetY;
      vy = -Math.sqrt(2 * gravity * dy);

      // Time to apex: t = -v_y0 / g
      const t = -vy / gravity;

      // v_x = dx / t
      vx = (target.x - startX) / t;

    } else {
      // Auto fire logic
      startX = Math.random() * width * 0.8 + width * 0.1;
      targetY = height * 0.15 + Math.random() * height * 0.2;
      vy = -(Math.random() * 3 + 12);
      vx = (Math.random() - 0.5) * 2;
    }
    
    rocketsRef.current.push({
      x: startX,
      y: height,
      vx,
      vy,
      color: config.colors[0],
      targetY,
      config
    });
  };

  useImperativeHandle(ref, () => ({
    launch: launchFirework,
    clean: () => {
      rocketsRef.current = [];
      particlesRef.current = [];
    }
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const loop = () => {
      // 1. Trails Effect:
      // Using 'destination-out' with low opacity creates the trail effect
      // Lower opacity = longer trails
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Reset for drawing
      ctx.globalCompositeOperation = 'lighter';

      // 2. Update Rockets
      for (let i = rocketsRef.current.length - 1; i >= 0; i--) {
        const r = rocketsRef.current[i];
        
        // Store previous position for drawing rocket trail line
        const prevX = r.x;
        const prevY = r.y;

        r.x += r.vx;
        r.y += r.vy;
        r.vy += 0.15; // Gravity

        // Draw Rocket Body (Line for speed)
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(r.x, r.y);
        ctx.lineWidth = 3;
        ctx.strokeStyle = r.color;
        ctx.stroke();

        // Extra Sparkles for Rocket Trail
        if (Math.random() > 0.3) { // Increased frequency for "More trails"
             particlesRef.current.push({
                x: r.x,
                y: r.y,
                prevX: r.x,
                prevY: r.y,
                vx: (Math.random() - 0.5) * 1, // wider spread
                vy: 0.5 + Math.random() * 1,
                color: r.color,
                alpha: 0.8,
                decay: 0.03 + Math.random() * 0.03,
                size: Math.random() * 2,
                flicker: true
             });
        }

        // Explosion Logic
        // If it starts falling (vy >= 0) OR hits target height
        // We add a small buffer for targetY to ensure it doesn't overshoot too much visually
        const reachedTarget = r.y <= r.targetY && r.vy > -2; 
        const apexReached = r.vy >= 0;

        if (reachedTarget || apexReached) {
          particlesRef.current.push(...createParticles(r.x, r.y, r.config));
          rocketsRef.current.splice(i, 1);
        }
      }

      // 3. Update Particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        
        p.prevX = p.x;
        p.prevY = p.y;

        // Physics
        p.vx *= p.flicker ? 0.95 : 0.96; 
        p.vy *= p.flicker ? 0.95 : 0.96;
        p.vy += 0.04; // Gravity
        
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particlesRef.current.splice(i, 1);
        } else {
          // Draw using lines for smooth motion blur
          ctx.beginPath();
          ctx.moveTo(p.prevX, p.prevY);
          ctx.lineTo(p.x, p.y);
          
          const rgb = hexToRgb(p.color);
          ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${p.alpha})`;
          ctx.lineWidth = p.size;
          ctx.stroke();
          
          // Optional: Draw head
          // ctx.beginPath();
          // ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
          // ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${p.alpha})`;
          // ctx.fill();
        }
      }

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={(e) => {
        if (props.onClick) props.onClick(e.clientX, e.clientY);
      }}
      className="fixed top-0 left-0 w-full h-full z-0 cursor-crosshair active:cursor-grabbing"
    />
  );
});

export default FireworkCanvas;