export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  coverUrl: string;
  color: string;
}

export interface ScoreEntry {
  name: string;
  score: number;
  date: string;
}

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Point {
  x: number;
  y: number;
}
