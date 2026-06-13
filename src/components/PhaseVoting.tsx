import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Voter, VoteTarget } from "../types";
import { Baby, Sparkles } from "lucide-react";
import audio from "../lib/audio";

interface Props {
  key?: string;
  voters: Voter[];
  onVote: (name: string, vote: VoteTarget) => void;
  onAdminStart: () => void;
}

export function PhaseVoting({ voters, onVote, onAdminStart }: Props) {
  const [name, setName] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const handleVote = (vote: VoteTarget) => {
    if (!name.trim()) return;
    onVote(name.trim(), vote);
    audio.init();
    setFeedbackMessage(`Thanks ${name.trim()}! You voted for a ${vote}.`);
    setName("");
    setTimeout(() => setFeedbackMessage(""), 3000);
  };

  useEffect(() => {
    if (voters.length > 0) {
      const timer = setTimeout(() => {
        onAdminStart();
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [voters, onAdminStart]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-md w-full mx-auto relative"
    >
      <div className="bg-white/60 backdrop-blur-sm border border-brand-border p-6 sm:p-8 rounded-[40px] shadow-sm relative">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-girl"></span> Cast Your Vote
        </h3>

        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase font-sans font-bold text-[#a89078] ml-2">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Auntie Sarah"
              className="w-full bg-white border border-brand-border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-girl transition-all shadow-sm font-sans"
              maxLength={30}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleVote("boy")}
              disabled={!name.trim()}
              className="bg-brand-boy text-brand-boy-text py-3 rounded-full font-bold shadow-inner hover:opacity-80 transition-opacity disabled:opacity-50 active:scale-95 font-sans"
            >
              Team Boy
            </button>
            <button
              onClick={() => handleVote("girl")}
              disabled={!name.trim()}
              className="bg-brand-girl text-brand-girl-text py-3 rounded-full font-bold shadow-md border-2 border-white ring-4 ring-brand-girl/20 hover:opacity-80 transition-all disabled:opacity-50 active:scale-95 font-sans"
            >
              Team Girl
            </button>
          </div>

          {feedbackMessage && (
            <motion.p
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center font-bold text-brand-girl-text bg-white border border-brand-girl p-3 rounded-full shadow-sm text-sm"
            >
              {feedbackMessage}
            </motion.p>
          )}
        </div>

        <div className="mt-8 pt-4 border-t border-brand-border/30 text-center">
          <p className="text-xs font-sans font-bold uppercase tracking-wider text-brand-accent/70">Total votes: {voters.length}</p>
        </div>
      </div>

      {/* Hidden Admin Button */}
      <button 
        onClick={onAdminStart}
        className="absolute -bottom-16 right-4 p-2 opacity-10 hover:opacity-100 focus:opacity-100 transition-opacity text-brand-text/50 hover:text-brand-text"
        aria-label="Start Spin"
      >
        <Baby className="w-5 h-5" />
      </button>
    </motion.div>
  );
}
