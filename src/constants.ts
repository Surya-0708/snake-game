import { Track } from './types';

export const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Cyber Pulse',
    artist: 'AI Synth',
    duration: 184,
    coverUrl: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=400',
    color: '#ff00ff', // Magenta
  },
  {
    id: '2',
    title: 'Neon Drift',
    artist: 'Digital Dreamer',
    duration: 215,
    coverUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=400',
    color: '#00ffff', // Cyan
  },
  {
    id: '3',
    title: 'Glitch Hop',
    artist: 'Circuit Breaker',
    duration: 156,
    coverUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=400',
    color: '#39ff14', // Lime
  },
];

export const GAME_GRID_SIZE = 20;
export const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
export const INITIAL_DIRECTION = 'UP';
export const INITIAL_SPEED = 150;
