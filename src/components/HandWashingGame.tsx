import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TransparentVideoPlayer from './TransparentVideoPlayer';
import TransparentImage from './TransparentImage';
import { MascotWrapper } from './MascotWrapper';
import { SpeechBubble } from './SpeechBubble';

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

      <div
        className="star-badge"
        style={{
          position: 'absolute', top: 'var(--sp-4)', right: 'var(--sp-4)',
          zIndex: 10, background: 'var(--color-lilac)',
        }}
      >
        🧴 Level 2
      </div>


      <div className="scene-content">

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
            <MascotWrapper key="hw-mascot-dirty"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
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
            <MascotWrapper key="hw-mascot-washing"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
              <TransparentVideoPlayer
                src="/assets/video/cleaning_hand.mp4"
                width={260}
                height={260}
                loop={false}
                autoPlay
                onEnded={handleWashVideoEnd}
              />
            </MascotWrapper>
          )}

          {/* CLEAN state */}
          {state === 'clean' && (
            <MascotWrapper key="hw-mascot-clean"
              initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
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

        {/* Progress bar (only while dirty) */}
        <AnimatePresence>
          {state === 'dirty' && (
            <motion.div className="progress-track" style={{ width: 260 }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action button */}
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
            <SpeechBubble key="wait-wash">
              🫧 Washing…
            </SpeechBubble>
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
