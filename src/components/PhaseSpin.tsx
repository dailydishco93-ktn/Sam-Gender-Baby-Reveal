import { useEffect, useRef } from "react";
import { motion, useAnimation, useMotionValue } from "motion/react";
import audio from "../lib/audio";

interface Props {
  key?: string;
  onSpinComplete: () => void;
}

export function PhaseSpin({ onSpinComplete }: Props) {
  const controls = useAnimation();
  const rotationValue = useMotionValue(0);

  // Wheel constants
  const SPINS = 8;
  const TARGET_DEGREE = 157.5; 
  // Rationale: 
  // We have 8 segments alternating Pink/Blue 45deg each.
  // 0-45deg is Top-Right quadrant of the wheel starting point.
  // Rotating the wheel forwards by 157.5 makes the segment originally at 202.5 come top. 
  // 202.5 lands squarely in the center of Pink Segment 4 (180-225).
  // Thus we always land on Pink (Girl).
  const FINAL_ROTATION = SPINS * 360 + TARGET_DEGREE;
  
  const lastTickAngle = useRef(0);

  useEffect(() => {
    // Watch the rotation to synthesize 'ticks' as it crosses boundaries
    const unsubscribe = rotationValue.on("change", (latest) => {
      const currentTick = Math.floor(latest / 45);
      const lastTick = Math.floor(lastTickAngle.current / 45);
      
      if (currentTick > lastTick) {
        lastTickAngle.current = latest;
        audio.playTick();
      }
    });

    controls.start({
      rotate: FINAL_ROTATION,
      transition: { 
        duration: 9, 
        ease: [0.15, 0.85, 0.25, 1] // Dramatic easing to build suspense
      }
    }).then(() => {
      setTimeout(() => onSpinComplete(), 800);
    });

    return () => unsubscribe();
  }, [controls, FINAL_ROTATION, onSpinComplete, rotationValue]);

  const wheelBackground = `
    conic-gradient(from 0deg,
      #fbcfe8 0deg 45deg,
      #bfdbfe 45deg 90deg,
      #fbcfe8 90deg 135deg,
      #bfdbfe 135deg 180deg,
      #fbcfe8 180deg 225deg,
      #bfdbfe 225deg 270deg,
      #fbcfe8 270deg 315deg,
      #bfdbfe 315deg 360deg
    )
  `;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      className="flex flex-col items-center justify-center w-full relative"
    >
      <div className="w-[300px] h-[300px] sm:w-[420px] sm:h-[420px] bg-white rounded-full p-3 sm:p-4 shadow-2xl relative border-8 border-brand-bg">
        <div className="w-full h-full rounded-full border-4 border-brand-border relative overflow-hidden bg-white">
          <motion.div
            animate={controls}
            style={{ 
              rotate: rotationValue,
              background: wheelBackground,
            }}
            className="w-full h-full relative"
          >
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <div 
                key={deg}
                className="absolute left-1/2 top-0 w-[2px] h-full bg-white/50 -translate-x-1/2"
                style={{ transform: `translateX(-50%) rotate(${deg}deg)` }}
              />
            ))}
          </motion.div>
        </div>
        
        {/* The pointer at the top */}
        <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-6 h-8 sm:w-8 sm:h-10 bg-brand-accent rounded-b-full shadow-lg z-20 flex items-center justify-center">
          <div className="w-1 h-3 sm:h-4 bg-white/30 rounded-full"></div>
        </div>

        {/* Center hub */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full border-4 border-brand-border shadow-lg flex items-center justify-center z-30">
          <span className="font-bold text-xs sm:text-lg uppercase tracking-tighter text-brand-text">SPIN</span>
        </div>
      </div>
      
      <div className="mt-8 flex gap-6">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-brand-boy border-2 border-white shadow-sm mb-2"></div>
          <span className="text-[10px] uppercase font-bold font-sans tracking-widest text-[#a89078]">Boy</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-brand-girl border-2 border-white shadow-sm mb-2"></div>
          <span className="text-[10px] uppercase font-bold font-sans tracking-widest text-[#a89078]">Girl</span>
        </div>
      </div>
    </motion.div>
  );
}
