import { useState } from "react";
import { AppPhase, Voter, VoteTarget } from "./types";
import { PhaseVoting } from "./components/PhaseVoting";
import { PhaseCountdown } from "./components/PhaseCountdown";
import { PhaseSpin } from "./components/PhaseSpin";
import { PhaseReveal } from "./components/PhaseReveal";
import { AnimatePresence } from "motion/react";
import audio from "./lib/audio";

export default function App() {
  const [phase, setPhase] = useState<AppPhase>("voting");
  const [voters, setVoters] = useState<Voter[]>([]);

  const handleVote = (name: string, vote: VoteTarget) => {
    setVoters(prev => [...prev, { name, vote, timestamp: Date.now() }]);
  };

  const handleAdminStart = () => {
    if (phase === "voting") {
      audio.init();
      audio.playCountdownTick();
      setPhase("countdown");
    }
  };

  const handleCountdownComplete = () => {
    setPhase("spinning");
  };

  const handleSpinComplete = () => {
    setPhase("reveal");
  };

  const handleReset = () => {
    setPhase("voting");
    setVoters([]);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-6 sm:p-10 font-serif relative overflow-hidden bg-brand-bg text-brand-text">
      {/* Background blobs */}
      <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-brand-blob-green rounded-full opacity-30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-80px] left-[-80px] w-80 h-80 bg-brand-blob-yellow rounded-full opacity-40 blur-3xl pointer-events-none" />
      
      <header className="w-full flex flex-col items-center gap-2 z-10 mt-2 sm:mt-0 mb-6 sm:mb-8">
        <div className="flex items-center gap-4 text-xs sm:text-sm tracking-[0.2em] uppercase text-brand-accent font-sans font-bold text-center">
          <span className="w-8 sm:w-12 h-[1px] bg-brand-accent"></span>
          Our Little Sprout
          <span className="w-8 sm:w-12 h-[1px] bg-brand-accent"></span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-bold text-brand-text-dark mb-2 text-center text-balance inline">The Big Reveal</h1>
        <p className="text-lg text-brand-accent italic text-center text-balance inline">Spin the wheel to find out if it's a boy or a girl!</p>
      </header>

      <main className="flex-1 w-full max-w-5xl z-10 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {phase === "voting" && (
            <PhaseVoting 
              key="voting"
              voters={voters}
              onVote={handleVote}
              onAdminStart={handleAdminStart}
            />
          )}

          {phase === "countdown" && (
            <PhaseCountdown
              key="countdown"
              onCountdownComplete={handleCountdownComplete}
            />
          )}
          
          {phase === "spinning" && (
            <PhaseSpin 
              key="spinning"
              onSpinComplete={handleSpinComplete} 
            />
          )}
          
          {phase === "reveal" && (
            <PhaseReveal 
              key="reveal"
              voters={voters}
              onReset={handleReset}
            />
          )}
        </AnimatePresence>
      </main>

      <footer className="w-full max-w-5xl flex justify-center sm:justify-between items-center text-brand-accent text-xs pt-6 pb-2 border-t border-brand-border/30 z-10 mt-6 sm:mt-8">
      </footer>
    </div>
  );
}
