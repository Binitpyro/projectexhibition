import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  DragEndEvent,
} from '@dnd-kit/core';
import TransparentVideoPlayer from './TransparentVideoPlayer';
import { DragItem, TrashItem } from './DragItem';
import { BinZone } from './BinZone';

interface TrashSortGameProps {
  onComplete: () => void;
  onBack: () => void;
}



const TRASH_ITEMS: TrashItem[] = [
  { id: 'bottle', label: 'Plastic Bottle', image: '/assets/images/plastic_bottle_prop.jpg', bin: 'recycle' },
  { id: 'apple', label: 'Apple Core', image: '/assets/images/Apple_core_prop.jpg', bin: 'trash' },
  { id: 'paper', label: 'Paper Cup', image: '/assets/images/paper_cup_bg.jpg', bin: 'recycle' },
  { id: 'crumple', label: 'Crumpled Paper', image: '/assets/images/Crumpled_paper_prop.jpg', bin: 'recycle' },
];

// ── Draggable prop ──────────────────────────────────────────────
// ── Main component ──────────────────────────────────────────────
export default function TrashSortGame({ onComplete, onBack }: Readonly<TrashSortGameProps>) {
  const [remaining, setRemaining] = useState<TrashItem[]>(TRASH_ITEMS);
  const [feedback, setFeedback] = useState<Record<string, 'correct' | 'wrong'>>({});
  const [overBin, setOverBin] = useState<string | null>(null);
  const [won, setWon] = useState(false);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setOverBin(null);
    if (!over) return;

    const item = remaining.find(t => t.id === active.id);
    if (!item) return;

    if (over.id === item.bin) {
      // Correct bin!
      const next = remaining.filter(t => t.id !== item.id);
      setFeedback(fb => ({ ...fb, [over.id as string]: 'correct' }));
      setRemaining(next);
      if (next.length === 0) {
        setTimeout(() => setWon(true), 500);
      } else {
        setTimeout(() => setFeedback(fb => {
          const n = { ...fb };
          delete n[over.id as string];
          return n;
        }), 800);
      }
    } else {
      // Wrong bin — shake feedback
      setFeedback(fb => ({ ...fb, [over.id as string]: 'wrong' }));
      setTimeout(() => setFeedback(fb => {
        const n = { ...fb };
        delete n[over.id as string];
        return n;
      }), 800);
    }
  };

  return (
    <div
      className="scene-wrapper"
      style={{
        backgroundImage: 'url(/assets/images/park_bg.jpg)',
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
          zIndex: 10, background: 'var(--color-mint)',
        }}
      >
        ♻️ Level 3
      </div>


      <div className="scene-content" style={{ maxWidth: 600 }}>

        {/* Win state */}
        <AnimatePresence>
          {won && (
            <motion.div key="win" style={{ position: 'absolute', inset: 0, zIndex: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 24 }}
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            >
              <TransparentVideoPlayer
                src="/assets/video/pickup_trash.mp4"
                width={280} height={280}
                loop={false} autoPlay
              />
              <motion.button className="btn-mint"
                style={{ fontSize: 'var(--fs-lg)', minWidth: 220 }}
                whileTap={{ scale: 0.94 }} onClick={onComplete}
              >
                🎉 Amazing! Next!
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="speech-bubble">
          {remaining.length > 0
            ? `♻️ Sort the trash! ${remaining.length} left`
            : '🎊 All sorted!'}
        </div>

        <DndContext onDragEnd={handleDragEnd} onDragOver={e => setOverBin(e.over?.id as string ?? null)}>
          {/* Draggable items */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center', padding: '8px 0' }}>
            {remaining.map(item => <DragItem key={item.id} item={item} />)}
          </div>

          {/* Drop zones */}
          <div style={{ display: 'flex', gap: 32, justifyContent: 'center' }}>
            <BinZone
              id="trash"
              label="Trash Bin"
              image="/assets/images/trash_bin.jpg"
              isOver={overBin === 'trash'}
              feedback={feedback['trash']}
            />
            <BinZone
              id="recycle"
              label="Recycle Bin"
              image="/assets/images/recycle_bin.jpg"
              isOver={overBin === 'recycle'}
              feedback={feedback['recycle']}
            />
          </div>
        </DndContext>
      </div>
    </div>
  );
}
