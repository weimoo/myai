export interface Point {
  x: number;
  y: number;
}

export interface Velocity {
  x: number;
  y: number;
}

export type FireworkShape = 'sphere' | 'heart' | 'star' | 'willow' | 'ring';

export interface PhysicsConfig {
  friction: number;
  gravity: number;
  initialVelocity: number;
  decay: number;
}

export interface FireworkConfig {
  name?: string;
  colors: string[];
  particleCount: number;
  physics: PhysicsConfig;
  shape: FireworkShape;
  soundEnabled?: boolean;
}

// Particle class structure for the canvas engine
export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  decay: number;
  size: number;
  flicker: boolean;
}

export interface Rocket {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  targetY: number; // Height at which it explodes
  config: FireworkConfig;
}

export interface Preset {
  id: string;
  name: string;
  config: FireworkConfig;
  icon: string;
}
