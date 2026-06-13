import { useEffect } from "react";
import { motion } from "motion/react";
import confetti from "canvas-confetti";
import { Voter } from "../types";
import { Heart, Sparkles, Star } from "lucide-react";
import audio from "../lib/audio";

interface Props {
  key?: string;
  voters: Voter[];
  onReset: () => void;
}

export function PhaseReveal({ voters, onReset }: Props) {
  const winners = voters.filter(v => v.vote === "girl");

  useEffect(() => {
    // Play synthesis cheer sound immediately
    audio.playCheer();

    // Burst confetti from both sides towards the center
    const duration = 5000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 6,
        angle: 60, // Aim up/right
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: ['#ffb7b2', '#ff6f61', '#ffc0cb', '#ffffff', '#fff5f5']
      });
      confetti({
        particleCount: 6,
        angle: 120, // Aim up/left
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: ['#ffb7b2', '#ff6f61', '#ffc0cb', '#ffffff', '#fff5f5']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", bounce: 0.4 }}
      className="max-w-2xl w-full mx-auto text-center"
    >
      <div className="bg-white/60 backdrop-blur-sm p-8 sm:p-12 rounded-[40px] shadow-sm relative overflow-hidden border border-brand-border">
        {/* Soft radial glow indicating warmth */}
        <div className="absolute inset-0 bg-brand-girl/10 pointer-events-none" />

        <div className="relative z-10">
          <motion.div 
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", bounce: 0.6, delay: 0.2 }}
            className="w-24 h-24 sm:w-32 sm:h-32 mx-auto bg-white rounded-full flex items-center justify-center p-6 shadow-sm border border-brand-border mb-6 relative"
          >
            <Sparkles className="w-6 h-6 text-brand-girl-dark absolute -top-2 -right-2 animate-bounce" />
            <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-brand-girl-text fill-brand-girl" />
          </motion.div>

          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="font-serif text-5xl sm:text-6xl font-bold text-brand-girl-text mb-4"
          >
            It's a Girl!
          </motion.h1>

          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg sm:text-xl text-brand-text/80 mb-10 max-w-sm mx-auto italic"
          >
            A sweet new baby girl is joining our cozy adventure.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="bg-white/40 p-6 rounded-3xl border border-brand-border/50"
          >
            <h3 className="font-sans font-bold text-sm uppercase tracking-widest text-[#a89078] mb-4 flex items-center justify-center gap-2">
              <Star className="w-4 h-4 text-brand-accent fill-brand-accent/20" />
              You Guessed Correctly
            </h3>
            
            {winners.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-2">
                {winners.map((w, idx) => (
                  <span 
                    key={idx} 
                    className="bg-brand-girl/30 border border-brand-girl/50 text-brand-girl-text px-4 py-2 rounded-full font-bold shadow-sm text-xs font-sans tracking-wider uppercase"
                  >
                    {w.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-brand-text/60 italic text-sm">Wow! It looks like everyone guessed Boy! What a big surprise!</p>
            )}
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
            onClick={onReset}
            className="mt-8 text-xs font-sans font-bold uppercase tracking-widest text-brand-accent hover:text-brand-text transition-colors p-2 underline decoration-brand-border underline-offset-4"
          >
            Reset Ceremony
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
