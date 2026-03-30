import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import WelcomeScreen from './components/WelcomeScreen';
import BrushingGame from './components/BrushingGame';
import HandWashingGame from './components/HandWashingGame';
import TrashSortGame from './components/TrashSortGame';
import SuccessScreen from './components/SuccessScreen';
import { getStreak, incrementStreak, markGameComplete } from './utils/storage';

// Scene flow: welcome → brushing → handwash → trash → success (then back to welcome)
type Scene = 'welcome' | 'brushing' | 'handwash' | 'trash' | 'success';

const SCENE_ORDER: Scene[] = ['welcome', 'brushing', 'handwash', 'trash', 'success'];

function App() {
  const [scene, setScene] = useState<Scene>('welcome');
  const [streak, setStreak] = useState(() => getStreak());
  const [completedCount, setCompletedCount] = useState(0);

  const goToScene = (nextScene: Scene) => setScene(nextScene);

  const handleLevelComplete = () => {
    markGameComplete(scene); // Track this game's completion today!

    const newCount = completedCount + 1;
    setCompletedCount(newCount);

    // Advance to next level or to success if all 3 done
    if (scene === 'brushing') goToScene('handwash');
    else if (scene === 'handwash') goToScene('trash');
    else if (scene === 'trash') {
      const newStreak = incrementStreak();
      setStreak(newStreak);
      goToScene('success');
    }
  };

  const handleReplay = () => {
    setCompletedCount(0);
    goToScene('brushing');
  };

  const handleHome = () => {
    setCompletedCount(0);
    goToScene('welcome');
  };

  const slideVariants = {
    initial: { opacity: 0, x: 60, scale: 0.97 },
    animate: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as const } },
    exit: { opacity: 0, x: -40, scale: 0.97, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const } },
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      {/* Floating HUD — visible on game levels (not welcome/success) */}
      <AnimatePresence>
        {(scene === 'brushing' || scene === 'handwash' || scene === 'trash') && (
          <motion.div
            key="hud"
            initial={{ y: -60, x: '-50%', opacity: 0 }}
            animate={{ y: 0, x: '-50%', opacity: 1 }}
            exit={{ y: -60, x: '-50%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            style={{
              position: 'fixed',
              bottom: 'var(--sp-5)',
              left: '50%',
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--sp-3)',
              flexWrap: 'wrap',
              width: 'max-content',
              maxWidth: '90vw',
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '2px solid rgba(255,255,255,0.95)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--sp-2) var(--sp-5)',
              boxShadow: 'var(--shadow-float)',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'var(--fs-sm)',
              color: 'var(--color-text)',
            }}
          >
            {/* Level progress dots */}
            {[
              { label: '🦷', scene: 'brushing' as const },
              { label: '🧼', scene: 'handwash' as const },
              { label: '♻️', scene: 'trash' as const },
            ].map((l, i) => {
              const currentIdx = SCENE_ORDER.indexOf(scene);
              const targetIdx = SCENE_ORDER.indexOf(l.scene);
              const isCurrent = scene === l.scene;
              const isPast = i < currentIdx - 1;
              const isCompleted = currentIdx > targetIdx;

              let opacity = 0.3;
              if (isCurrent) opacity = 1;
              else if (isPast) opacity = 0.5;

              let bg = '#FCD34D'; // Yellow for incomplete/current by default
              if (isCompleted) bg = 'var(--color-mint)'; // Green for finished

              return (
                <div
                  key={l.scene}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px',
                    opacity,
                  }}
                >
                  <span style={{ fontSize: '1.4rem' }}>{l.label}</span>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: bg,
                    transition: 'background 0.3s',
                  }} />
                </div>
              )
            })}

            <div style={{
              width: '1.5px',
              height: '32px',
              background: 'rgba(42,63,85,0.12)',
              borderRadius: '1px',
            }} />

            {/* Streak */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '1.1rem' }}>⭐</span>
              <span>{streak}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scene transitions */}
      <AnimatePresence mode="wait">
        {scene === 'welcome' && (
          <motion.div key="welcome" variants={slideVariants} initial="initial" animate="animate" exit="exit">
            <WelcomeScreen streak={streak} onStart={() => goToScene('brushing')} />
          </motion.div>
        )}

        {scene === 'brushing' && (
          <motion.div key="brushing" variants={slideVariants} initial="initial" animate="animate" exit="exit">
            <BrushingGame onComplete={handleLevelComplete} onBack={() => goToScene('welcome')} />
          </motion.div>
        )}

        {scene === 'handwash' && (
          <motion.div key="handwash" variants={slideVariants} initial="initial" animate="animate" exit="exit">
            <HandWashingGame onComplete={handleLevelComplete} onBack={() => goToScene('brushing')} />
          </motion.div>
        )}

        {scene === 'trash' && (
          <motion.div key="trash" variants={slideVariants} initial="initial" animate="animate" exit="exit">
            <TrashSortGame onComplete={handleLevelComplete} onBack={() => goToScene('handwash')} />
          </motion.div>
        )}

        {scene === 'success' && (
          <motion.div key="success" variants={slideVariants} initial="initial" animate="animate" exit="exit">
            <SuccessScreen streak={streak} onReplay={handleReplay} onHome={handleHome} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
