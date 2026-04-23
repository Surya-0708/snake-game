import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RotateCcw, Play } from 'lucide-react';
import { Point, Direction } from '../types';
import { GAME_GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION, INITIAL_SPEED } from '../constants';

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
  onGameOver: (score: number) => void;
  accentColor: string;
}

export const SnakeGame: React.FC<SnakeGameProps> = ({ onScoreChange, onGameOver, accentColor }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Check collisions
      if (
        newHead.x < 0 || newHead.x >= GAME_GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GAME_GRID_SIZE ||
        prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setIsGameOver(true);
        onGameOver(score);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        onScoreChange(score + 10);
        setFood({
          x: Math.floor(Math.random() * GAME_GRID_SIZE),
          y: Math.floor(Math.random() * GAME_GRID_SIZE)
        });
        setSpeed(prev => Math.max(prev * 0.98, 50));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, score, onGameOver, onScoreChange]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [moveSnake, speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GAME_GRID_SIZE;

    // Clear background
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GAME_GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, index) => {
      const alpha = 1 - (index / snake.length) * 0.5;
      ctx.fillStyle = index === 0 ? '#00f3ff' : `rgba(0, 243, 255, ${alpha})`;
      if (index === 0) {
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#00f3ff';
      } else {
        ctx.shadowBlur = 0;
      }
      
      const r = cellSize * 0.2;
      ctx.beginPath();
      ctx.roundRect(segment.x * cellSize + 2, segment.y * cellSize + 2, cellSize - 4, cellSize - 4, r);
      ctx.fill();
    });

    // Draw food
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#ff00e5';
    ctx.fillStyle = '#ff00e5';
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;

  }, [snake, food]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setIsGameOver(false);
    setIsPaused(false);
    onScoreChange(0);
  };

  return (
    <div className="relative group overflow-hidden rounded-xl border-2 border-glass-border bg-black aspect-square w-full max-w-[460px] shadow-[0_0_40px_rgba(0,243,255,0.1)]">
      <canvas
        ref={canvasRef}
        width={460}
        height={460}
        className="w-full h-full block"
      />

      <AnimatePresence>
        {(isPaused || isGameOver) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md"
          >
            {isGameOver ? (
              <div className="text-center space-y-6">
                <motion.div
                  initial={{ scale: 0.8, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  className="space-y-2"
                >
                  <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                  <h2 className="text-4xl font-bold text-white tracking-tighter uppercase italic neon-text">Game Over</h2>
                  <p className="text-zinc-400 font-mono">Final Score: <span className="text-neon-cyan">{score}</span></p>
                </motion.div>
                <button
                  onClick={resetGame}
                  className="flex items-center gap-2 px-8 py-3 bg-neon-cyan text-black rounded-full font-bold uppercase tracking-widest hover:scale-105 transition-transform active:scale-95 shadow-[0_0_15px_#00f3ff]"
                >
                  <RotateCcw className="w-5 h-5" />
                  Try Again
                </button>
              </div>
            ) : (
              <div className="text-center space-y-6">
                <motion.h2 
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-5xl font-black text-white tracking-tighter uppercase italic neon-text"
                >
                  Ready?
                </motion.h2>
                <button
                  onClick={() => setIsPaused(false)}
                  className="flex items-center gap-2 px-10 py-4 bg-neon-cyan text-black rounded-full font-bold uppercase tracking-widest hover:scale-105 transition-transform active:scale-95 shadow-[0_0_15px_#00f3ff]"
                >
                  <Play className="w-6 h-6 fill-black" />
                  Start Game
                </button>
                <p className="text-zinc-500 text-sm font-mono uppercase tracking-widest">Use arrow keys to move</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute top-6 left-6 z-10">
        <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-lg border border-glass-border">
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Score</p>
          <p className="text-2xl font-mono text-neon-cyan leading-none font-bold uppercase">{score.toString().padStart(4, '0')}</p>
        </div>
      </div>
    </div>
  );
};
