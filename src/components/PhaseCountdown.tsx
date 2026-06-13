import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Clock, Sparkles } from "lucide-react";
import audio from "../lib/audio";

interface Props {
  key?: string;
  onCountdownComplete: () => void;
}

export function PhaseCountdown({ onCountdownComplete }: Props) {
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    // audio initialized already in App.tsx handleAdminStart
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onCountdownComplete();
          return 0;
        }
        audio.playCountdownTick();
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onCountdownComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      className="max-w-md w-full mx-auto relative"
    >
      <div className="bg-white/60 backdrop-blur-sm border border-brand-border p-8 sm:p-12 rounded-[40px] shadow-sm relative overflow-hidden text-center">
        {/* Soft magical glow */}
        <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-brand-blob-yellow/30 to-transparent pointer-events-none" />

        <div className="relative z-10">
          <motion.div 
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", bounce: 0.6, delay: 0.2 }}
            className="w-24 h-24 sm:w-32 sm:h-32 mx-auto bg-white rounded-full flex items-center justify-center p-6 shadow-sm mb-6 relative border border-brand-border"
          >
            <Sparkles className="w-6 h-6 text-brand-blob-yellow absolute -top-2 -right-2 animate-bounce" />
            <Clock className="w-12 h-12 sm:w-16 sm:h-16 text-brand-accent" />
          </motion.div>

          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-serif text-3xl sm:text-4xl font-bold text-brand-text-dark mb-4 text-balance"
          >
            Almost there...
          </motion.h2>

          <div className="flex justify-center items-center h-28 my-4">
            <motion.span 
              key={timeLeft}
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.5, y: -20 }}
              transition={{ duration: 0.3 }}
              className="font-serif text-8xl font-bold text-brand-accent drop-shadow-sm"
            >
              {timeLeft}
            </motion.span>
          </div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm font-sans font-bold uppercase tracking-widest text-[#a89078] mt-2"
          >
            Seconds until spin
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}
