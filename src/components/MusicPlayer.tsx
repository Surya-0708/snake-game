import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react';
import { Track } from '../types';
import { TRACKS } from '../constants';

interface MusicPlayerProps {
  onTrackChange: (track: Track) => void;
  currentTrack: Track;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ onTrackChange, currentTrack }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            handleSkip(true);
            return 0;
          }
          return prev + 0.1;
        });
      }, 100);
    } else {
      if (progressInterval.current) clearInterval(progressInterval.current);
    }
    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, [isPlaying]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleSkip = (forward: boolean) => {
    const currentIndex = TRACKS.findIndex(t => t.id === currentTrack.id);
    let nextIndex = forward ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex >= TRACKS.length) nextIndex = 0;
    if (nextIndex < 0) nextIndex = TRACKS.length - 1;
    onTrackChange(TRACKS[nextIndex]);
    setProgress(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <footer className="footer fixed bottom-0 left-0 right-0 h-[100px] bg-[rgba(10,10,10,0.9)] border-t border-glass-border flex items-center justify-between px-10 backdrop-blur-md z-50">
      {/* Left: Info */}
      <div className="flex items-center gap-4 w-[280px]">
        <div className="w-[50px] h-[50px] bg-[#222] rounded-sm overflow-hidden border border-glass-border">
          <motion.img 
            key={currentTrack.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            src={currentTrack.coverUrl} 
            alt={currentTrack.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <div className="text-[14px] font-semibold text-white truncate w-40">{currentTrack.title}</div>
          <div className="text-[12px] opacity-50 text-white truncate w-40">{currentTrack.artist}</div>
        </div>
      </div>

      {/* Center: Controls */}
      <div className="flex items-center gap-5">
        <button 
          onClick={() => handleSkip(false)}
          className="w-10 h-10 rounded-full border border-glass-border flex items-center justify-center cursor-pointer hover:bg-white/5 transition-colors"
        >
          <SkipBack className="w-4 h-4 text-white fill-white" />
        </button>
        <button 
          onClick={togglePlay}
          className="w-[50px] h-[50px] bg-neon-cyan text-black rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform shadow-[0_0_15px_#00f3ff]"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 fill-black" />
          ) : (
            <Play className="w-6 h-6 fill-black ml-1" />
          )}
        </button>
        <button 
          onClick={() => handleSkip(true)}
          className="w-10 h-10 rounded-full border border-glass-border flex items-center justify-center cursor-pointer hover:bg-white/5 transition-colors"
        >
          <SkipForward className="w-4 h-4 text-white fill-white" />
        </button>
      </div>

      {/* Right: Progress */}
      <div className="w-[280px] space-y-2">
        <div className="flex justify-between text-[10px] opacity-50 font-mono">
          <span>{formatTime((progress / 100) * currentTrack.duration)}</span>
          <span>{formatTime(currentTrack.duration)}</span>
        </div>
        <div className="h-[4px] bg-[#333] rounded-full w-full relative overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-neon-cyan rounded-full shadow-[0_0_10px_#00f3ff]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </footer>
  );
};
