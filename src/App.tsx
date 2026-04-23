import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MusicPlayer } from './components/MusicPlayer';
import { SnakeGame } from './components/SnakeGame';
import { Leaderboard } from './components/Leaderboard';
import { TRACKS } from './constants';
import { Track, ScoreEntry } from './types';
import { Music, Layout, Ghost, Zap } from 'lucide-react';

export default function App() {
  const [currentTrack, setCurrentTrack] = useState<Track>(TRACKS[0]);
  const [scores, setScores] = useState<ScoreEntry[]>(() => {
    const saved = localStorage.getItem('snake-scores');
    return saved ? JSON.parse(saved) : [
      { name: 'GLITCH_M', score: 4290, date: '2026.04.10' },
      { name: 'HEX_RUNNER', score: 3810, date: '2026.04.15' },
      { name: 'NULL_VOID', score: 3550, date: '2026.04.20' }
    ];
  });
  const [currentScore, setCurrentScore] = useState(0);

  const highScore = scores.length > 0 ? scores[0].score : 0;

  useEffect(() => {
    localStorage.setItem('snake-scores', JSON.stringify(scores));
  }, [scores]);

  const handleGameOver = (finalScore: number) => {
    if (finalScore <= 0) return;
    
    const newEntry: ScoreEntry = {
      name: `USER_${Math.floor(Math.random() * 1000)}`,
      score: finalScore,
      date: new Date().toISOString().split('T')[0].replace(/-/g, '.')
    };

    const newScores = [...scores, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    
    setScores(newScores);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#050505] text-[#e0e0e0] font-sans selection:bg-neon-cyan selection:text-black">
      <div className="grid grid-cols-[280px_1fr_280px] grid-rows-[1fr_100px] h-full w-full">
        
        {/* Sidebar: Playlist */}
        <aside className="sidebar bg-black/40 border-r border-glass-border p-5 flex flex-col gap-5 overflow-y-auto">
          <div className="text-[10px] uppercase tracking-[2px] text-white/40 font-bold">Playlist</div>
          <div className="space-y-3">
            {TRACKS.map(track => (
              <div 
                key={track.id}
                onClick={() => setCurrentTrack(track)}
                className={`p-3 rounded-xl border border-transparent cursor-pointer transition-all duration-300 ${
                  currentTrack.id === track.id 
                  ? 'border-neon-cyan bg-neon-cyan/5' 
                  : 'bg-glass border-glass-border hover:bg-white/10'
                }`}
              >
                <div className="text-[14px] font-semibold text-white">{track.title}</div>
                <div className="text-[11px] opacity-60 font-mono uppercase mt-1">{track.artist} - {Math.floor(track.duration / 60)}:{Math.floor(track.duration % 60).toString().padStart(2, '0')}</div>
              </div>
            ))}
          </div>

          <div className="mt-auto">
            <div className="bg-glass rounded-lg p-4 text-center border border-glass-border">
              <div className="text-[10px] uppercase tracking-[2px] text-white/40 font-bold mb-2">Total Session Time</div>
              <div className="font-mono text-lg text-neon-cyan font-bold tracking-tight">00:42:15</div>
            </div>
          </div>
        </aside>

        {/* Main View: Game */}
        <main className="main-view bg-[radial-gradient(circle_at_center,#1a1a2e_0%,#050505_100%)] flex flex-col items-center justify-center p-5 relative overflow-hidden">
          {/* Header/Brand */}
          <div className="absolute top-8 left-10">
            <h1 className="m-0 text-2xl tracking-[4px] font-bold text-white neon-text uppercase italic">Synth_Snake</h1>
            <p className="text-[10px] opacity-40 mt-1 uppercase font-mono tracking-widest">System Version 2.0.4</p>
          </div>

          {/* Stats Bar */}
          <div className="flex gap-10 mb-8 mt-20">
            <div className="bg-glass rounded-lg p-4 w-[140px] text-center border border-glass-border">
              <div className="text-[10px] uppercase tracking-[2px] text-white/40 mb-1 font-bold">Score</div>
              <div className="font-mono text-3xl text-neon-cyan font-black leading-none">{currentScore.toString().padStart(4, '0')}</div>
            </div>
            <div className="bg-glass rounded-lg p-4 w-[140px] text-center border border-glass-border">
              <div className="text-[10px] uppercase tracking-[2px] text-white/40 mb-1 font-bold">High Score</div>
              <div className="font-mono text-3xl text-neon-cyan font-black leading-none">{highScore.toString().padStart(4, '0')}</div>
            </div>
          </div>

          {/* Game Window */}
          <div className="relative z-10 flex flex-col items-center">
            <SnakeGame 
              onScoreChange={setCurrentScore} 
              onGameOver={handleGameOver}
              accentColor={currentTrack.color}
            />
          </div>

          {/* Ambient Decor */}
          <Ghost className="absolute -bottom-10 -right-10 w-64 h-64 text-white/[0.02] -rotate-12 pointer-events-none" />
        </main>

        {/* Right Panel: Leaderboard & Extra */}
        <section className="right-panel bg-black/40 border-l border-glass-border p-5 flex flex-col gap-8 overflow-y-auto">
          <div className="space-y-4">
            <div className="text-[10px] uppercase tracking-[2px] text-white/40 font-bold">Leaderboard</div>
            <Leaderboard scores={scores} />
          </div>

          <div className="bg-glass rounded-lg p-4 text-center border border-glass-border mt-4">
            <div className="text-[10px] uppercase tracking-[2px] text-white/40 mb-2 font-bold">Difficulty</div>
            <div className="text-neon-magenta font-black tracking-widest text-sm italic uppercase">Hyper-Drive</div>
          </div>

          <div className="mt-auto p-4 rounded-xl glass-card space-y-3 group cursor-pointer hover:border-neon-cyan/50 transition-colors">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-neon-cyan" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white">Pro Protocol</span>
            </div>
            <p className="text-[10px] text-white/40 leading-relaxed uppercase font-mono">Unlock encrypted tracks and visual glitch overrides.</p>
          </div>
        </section>

        {/* Footer: Music Player */}
        <MusicPlayer 
          currentTrack={currentTrack} 
          onTrackChange={setCurrentTrack} 
        />
      </div>
    </div>
  );
}
