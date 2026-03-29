import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TransparentVideoPlayer from './TransparentVideoPlayer';
import TransparentImage from './TransparentImage';
import { MascotWrapper } from './MascotWrapper';
import { SpeechBubble } from './SpeechBubble';

// Game states
type BrushState = 'dirty' | 'brushing' | 'transition' | 'clean';

interface BrushingGameProps {
  onComplete: () => void;
  onBack: () => void;
}

export default function BrushingGame({ onComplete, onBack }: Readonly<BrushingGameProps>) {
  const [state, setState] = useState<BrushState>('dirty');

  const startBrushing = () => {
    setState('brushing');
  };

  const handleBrushVideoEnd = () => {
    // brushing.mp4 done → show mouth_dirty_to_clean.mp4 transition
    setState('transition');
  };

  const handleTransitionEnd = () => {
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
      {/* Overlay for readability */}
      <div className="scene-overlay" />

      {/* Top-left back button */}
      <motion.button
        className="btn-glass"
        onClick={onBack}
        style={{ position: 'absolute', top: 'var(--sp-4)', left: 'var(--sp-4)', zIndex: 10 }}
        whileTap={{ scale: 0.93 }}
      >
        ← Back
      </motion.button>

      {/* Level badge top-right */}
      <div
        className="star-badge"
        style={{
          position: 'absolute', top: 'var(--sp-4)', right: 'var(--sp-4)',
          zIndex: 10, background: 'var(--color-sky)',
        }}
      >
        🦷 Level 1
      </div>


      {/* Scene content */}
      <div className="scene-content">

        {/* Speech bubble */}
        <AnimatePresence mode="wait">
          {state === 'dirty' && (
            <motion.div key="b-dirty" className="speech-bubble"
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              😬 Oh no! Robo's teeth are dirty!
            </motion.div>
          )}
          {state === 'brushing' && (
            <motion.div key="b-brushing" className="speech-bubble"
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              🪥 Brushing away! Keep going…
            </motion.div>
          )}
          {state === 'transition' && (
            <motion.div key="b-transition" className="speech-bubble"
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              ✨ Almost there!
            </motion.div>
          )}
          {state === 'clean' && (
            <motion.div key="b-clean" className="speech-bubble"
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              🌟 Sparkling clean teeth!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mascot area */}
        <AnimatePresence mode="wait">

          {/* DIRTY state — JPG still, multiply removes white bg */}
          {state === 'dirty' && (
            <MascotWrapper key="mascot-dirty"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            >
              <TransparentImage
                src="/assets/images/dirty_teeth.jpg"
                alt="Robo with dirty teeth"
                className="mascot-img"
                style={{ width: '100%', height: '100%' }}
              />
              {/* Dirt particles */}
              {[{ id: 'poop', char: '💩' }, { id: 'germ', char: '🦠' }, { id: 'stink', char: '💨' }].map((e, i) => (
                <motion.span key={e.id} style={{
                  position: 'absolute', fontSize: '1.2rem',
                  top: `${20 + i * 25}%`, right: `${-12 + i * 3}%`,
                }}
                  animate={{ rotate: [0, 15, -10, 0], scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                >{e.char}</motion.span>
              ))}
            </MascotWrapper>
          )}

          {/* BRUSHING — green screen MP4 via canvas chroma-key */}
          {state === 'brushing' && (
            <MascotWrapper key="mascot-brushing"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
              <TransparentVideoPlayer
                src="/assets/video/brushing.mp4"
                width={260}
                height={260}
                loop={false}
                autoPlay
                onEnded={handleBrushVideoEnd}
              />
            </MascotWrapper>
          )}

          {/* TRANSITION — mouth_dirty_to_clean.mp4 */}
          {state === 'transition' && (
            <MascotWrapper key="mascot-transition"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
              <TransparentVideoPlayer
                src="/assets/video/mouth_dirty_to_clean.mp4"
                width={260}
                height={260}
                loop={false}
                autoPlay
                onEnded={handleTransitionEnd}
              />
            </MascotWrapper>
          )}

          {/* CLEAN — clean_teeth.jpg still */}
          {state === 'clean' && (
            <MascotWrapper key="mascot-clean"
              initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            >
              <TransparentImage
                src="/assets/images/clean_teeth.jpg"
                alt="Robo with clean teeth"
                className="mascot-img"
                style={{ width: '100%', height: '100%' }}
              />
              {/* Sparkle ring */}
              {[{ id: 's1', char: '✨' }, { id: 's2', char: '⭐' }, { id: 's3', char: '💫' }, { id: 's4', char: '✨' }, { id: 's5', char: '⭐' }].map((e, i) => (
                <motion.span key={e.id} style={{
                  position: 'absolute', fontSize: '1.3rem',
                  top: `${50 + 44 * Math.sin((i / 5) * Math.PI * 2)}%`,
                  left: `${50 + 44 * Math.cos((i / 5) * Math.PI * 2)}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                  animate={{ scale: [0.8, 1.4, 0.8], rotate: [0, 30, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.25 }}
                >{e.char}</motion.span>
              ))}
            </MascotWrapper>
          )}
        </AnimatePresence>

        {/* Action button */}
        <AnimatePresence mode="wait">
          {state === 'dirty' && (
            <motion.button key="btn-start" className="btn-primary"
              style={{ minWidth: 220, fontSize: 'var(--fs-lg)' }}
              whileTap={{ scale: 0.94 }} onClick={startBrushing}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            >
              🪥 Start Brushing!
            </motion.button>
          )}

          {(state === 'brushing' || state === 'transition') && (
            <SpeechBubble key="wait-msg">
              🎵 Brush brush brush…
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
