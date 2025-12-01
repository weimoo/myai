import { FireworkConfig, Preset } from './types';

export const DEFAULT_PHYSICS = {
  friction: 0.95,
  gravity: 0.04,
  initialVelocity: 6,
  decay: 0.015,
};

export const DEFAULT_CONFIG: FireworkConfig = {
  colors: ['#FF0000', '#FFA500', '#FFFF00'],
  particleCount: 100,
  physics: DEFAULT_PHYSICS,
  shape: 'sphere',
};

export const PRESETS: Preset[] = [
  {
    id: 'classic',
    name: 'Classic Multi',
    icon: '✨',
    config: {
      colors: ['#ef4444', '#3b82f6', '#22c55e', '#ffffff'],
      particleCount: 120,
      physics: { ...DEFAULT_PHYSICS, decay: 0.015 },
      shape: 'sphere',
    },
  },
  {
    id: 'golden_willow',
    name: 'Golden Willow',
    icon: '🌴',
    config: {
      colors: ['#fbbf24', '#d97706'],
      particleCount: 150,
      physics: { ...DEFAULT_PHYSICS, friction: 0.98, gravity: 0.02, decay: 0.008 },
      shape: 'willow',
    },
  },
  {
    id: 'love_heart',
    name: 'Love Heart',
    icon: '❤️',
    config: {
      colors: ['#ec4899', '#f472b6'],
      particleCount: 80,
      physics: { ...DEFAULT_PHYSICS, friction: 0.94 },
      shape: 'heart',
    },
  },
  {
    id: 'neon_ring',
    name: 'Neon Ring',
    icon: '⭕',
    config: {
      colors: ['#06b6d4', '#8b5cf6'],
      particleCount: 100,
      physics: { ...DEFAULT_PHYSICS, initialVelocity: 8 },
      shape: 'ring',
    },
  },
];
