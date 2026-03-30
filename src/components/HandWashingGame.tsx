import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TransparentVideoPlayer from './TransparentVideoPlayer';
import TransparentImage from './TransparentImage';
import { MascotWrapper } from './MascotWrapper';

type WashState = 'dirty' | 'washing' | 'clean';

interface HandWashingGameProps {
  onComplete: () => void;
  onBack: () => void;
}

export default function HandWashingGame({ onComplete, onBack }: Readonly<HandWashingGameProps>) {
  const [state, setState] = useState<WashState>('dirty');
  const [progress, setProgress] = useState(0);
  const holdRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef(0);

  const startHolding = useCallback(() => {
    if (state !== 'dirty') return;
    holdRef.current = setInterval(() => {
      progressRef.current = Math.min(100, progressRef.current + 2);
      setProgress(progressRef.current);
      if (progressRef.current >= 100) {
        clearInterval(holdRef.current!);
        setState('washing');
      }
    }, 50);
  }, [state]);

  const stopHolding = useCallback(() => {
    if (holdRef.current) clearInterval(holdRef.current);
  }, []);

  const handleWashVideoEnd = () => {
    setState('clean');
  };

  return (
    <div
      className="scene-wrapper"
      style={{
        backgroundImage: 'url(/assets/images/bathroom_bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="scene-overlay" />

      <motion.button
        className="btn-glass"
        onClick={onBack}
        style={{ position: 'absolute', top: 'var(--sp-4)', left: 'var(--sp-4)', zIndex: 10 }}
        whileTap={{ scale: 0.93 }}
      >
        ← Back
      </motion.button>




      <div className="scene-content" style={{ paddingBottom: '120px' }}>

        {/* Speech bubble */}
        <AnimatePresence mode="wait">
          {state === 'dirty' && (
            <motion.div key="hw-dirty" className="speech-bubble"
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              🙈 Robo's hands are so grubby!
            </motion.div>
          )}
          {state === 'washing' && (
            <motion.div key="hw-washing" className="speech-bubble"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              🫧 Scrub scrub scrub!
            </motion.div>
          )}
          {state === 'clean' && (
            <motion.div key="hw-clean" className="speech-bubble"
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              ✨ Hands are spotless! 🙌
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mascot area */}
        <AnimatePresence mode="wait">

          {/* DIRTY state */}
          {state === 'dirty' && (
            <MascotWrapper key="hw-mascot-dirty" width="100%" height="auto" style={{ maxWidth: 500, aspectRatio: '1/1' }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
              <TransparentImage
                src="/assets/images/dirty_hands.jpg"
                alt="Robo with dirty hands"
                className="mascot-img"
                style={{ width: '100%', height: '100%' }}
              />
              {[{ id: 'g1', char: '🦠' }, { id: 'p1', char: '💩' }, { id: 's1', char: '🤢' }].map((e, i) => (
                <motion.span key={e.id} style={{
                  position: 'absolute', fontSize: '1.25rem',
                  top: `${15 + i * 28}%`, left: `${-10 + i * 5}%`,
                }}
                  animate={{ rotate: [0, 20, -10, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.4 }}
                >{e.char}</motion.span>
              ))}
            </MascotWrapper>
          )}

          {/* WASHING — green screen via canvas */}
          {state === 'washing' && (
            <MascotWrapper key="hw-mascot-washing" width="100%" height="auto" style={{ maxWidth: 500, aspectRatio: '1/1' }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
              <TransparentVideoPlayer
                src="/assets/video/cleaning_hand.mp4"
                width="100%"
                height="100%"
                loop={false}
                autoPlay
                onEnded={handleWashVideoEnd}
              />
            </MascotWrapper>
          )}

          {/* CLEAN state */}
          {state === 'clean' && (
            <MascotWrapper key="hw-mascot-clean" width="100%" height="auto" style={{ maxWidth: 500, aspectRatio: '1/1' }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
              <TransparentImage
                src="/assets/images/clean_hands.jpg"
                alt="Robo with clean hands"
                className="mascot-img"
                style={{ width: '100%', height: '100%' }}
              />
              {[{ id: 's1', char: '✨' }, { id: 'd1', char: '💧' }, { id: 'st1', char: '⭐' }].map((e, i) => (
                <motion.span key={e.id} style={{
                  position: 'absolute', fontSize: '1.5rem',
                  top: `${10 + i * 35}%`, right: `${-10 + i * 3}%`,
                }}
                  animate={{ scale: [0.8, 1.5, 0.8], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
                >{e.char}</motion.span>
              ))}
            </MascotWrapper>
          )}
        </AnimatePresence>
      </div>

      {/* Action buttons - fixed above the bottom HUD */}
      <div style={{ position: 'fixed', bottom: '100px', left: '50%', transform: 'translateX(-50%)', zIndex: 50 }}>
        <AnimatePresence mode="wait">
          {state === 'dirty' && (
            <motion.button
              key="btn-hold"
              className="btn-lilac"
              style={{ minWidth: 220, fontSize: 'var(--fs-lg)', userSelect: 'none' }}
              onPointerDown={startHolding}
              onPointerUp={stopHolding}
              onPointerLeave={stopHolding}
              whileTap={{ scale: 0.94 }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            >
              💧 Hold to Scrub!
            </motion.button>
          )}
          {state === 'washing' && (
            <motion.div key="wait-wash"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{
                background: 'rgba(255,255,255,0.9)', borderRadius: '999px',
                padding: '10px 24px', fontFamily: 'var(--font-display)', fontWeight: 700,
                fontSize: 'var(--fs-base)', boxShadow: 'var(--shadow-float)'
              }}
            >
              🪷 Washing…
            </motion.div>
          )}
          {state === 'clean' && (
            <motion.button key="btn-next" className="btn-mint"
              style={{ minWidth: 220, fontSize: 'var(--fs-lg)' }}
              whileTap={{ scale: 0.94 }} onClick={onComplete}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            >
              👏 Next Level!
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
