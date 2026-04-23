import React from 'react';
import { motion } from 'motion/react';
import { ScoreEntry } from '../types';

interface LeaderboardProps {
  scores: ScoreEntry[];
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ scores }) => {
  return (
    <div className="w-full space-y-0 text-[13px]">
      {scores.length > 0 ? (
        scores.map((entry, index) => (
          <motion.div
            initial={{ opacity: 0, x: 5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            key={`${entry.name}-${entry.date}-${index}`}
            className={`flex justify-between py-3 border-b border-glass-border ${
              index === 0 ? 'text-neon-cyan font-bold' : 'text-white/80'
            }`}
          >
            <span className="font-mono">
              {`${(index + 1).toString().padStart(2, '0')}. ${entry.name}`}
            </span>
            <span className="font-mono tracking-wider">
              {entry.score.toLocaleString()}
            </span>
          </motion.div>
        ))
      ) : (
        <div className="py-10 text-center text-zinc-600 italic text-xs uppercase tracking-widest font-mono">
          Waiting for legends...
        </div>
      )}
    </div>
  );
};
