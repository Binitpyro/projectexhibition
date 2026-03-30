import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
  DragOverlay
} from '@dnd-kit/core';
import TransparentVideoPlayer from './TransparentVideoPlayer';
import { DragItem, TrashItem, TrashItemCard } from './DragItem';
import { BinZone } from './BinZone';
import { getAssetUrl } from '../utils/asset';

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
  const [activeId, setActiveId] = useState<string | null>(null);
  const [won, setWon] = useState(false);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setOverBin(null);
    setActiveId(null);
    if (!over) return;

    const item = remaining.find(t => t.id === active.id);
    if (!item) return;

    if (over.id === item.bin) {
      // Correct bin!
      const next = remaining.filter(t => t.id !== item.id);
      setFeedback(fb => ({ ...fb, [over.id as string]: 'correct' }));
      setRemaining(next);
      if (next.length === 0) {
        const t = setTimeout(() => setWon(true), 500);
        timeoutsRef.current.push(t);
      } else {
        const t = setTimeout(() => setFeedback(fb => {
          const n = { ...fb };
          delete n[over.id as string];
          return n;
        }), 800);
        timeoutsRef.current.push(t);
      }
    } else {
      // Wrong bin — shake feedback
      setFeedback(fb => ({ ...fb, [over.id as string]: 'wrong' }));
      const t = setTimeout(() => setFeedback(fb => {
        const n = { ...fb };
        delete n[over.id as string];
        return n;
      }), 800);
      timeoutsRef.current.push(t);
    }
  };

  const [clickedNext, setClickedNext] = useState(false);
  const handleNext = () => {
    if (clickedNext) return;
    setClickedNext(true);
    onComplete();
  };

  return (
    <div
      className="scene-wrapper"
      style={{
        backgroundImage: `url(${getAssetUrl('/assets/images/park_bg.jpg')})`,
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




      <div className="scene-content" style={{ maxWidth: 600, paddingBottom: '120px' }}>

        {/* Win state */}
        <AnimatePresence>
          {won && (
            <motion.div key="win" style={{ position: 'absolute', inset: 0, zIndex: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 24 }}
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            >
              <TransparentVideoPlayer
                src={getAssetUrl('/assets/video/pickup_trash.mp4')}
                width="100%" height="100%" style={{ maxWidth: 500, aspectRatio: '1/1' }}
                loop={false} autoPlay
              />
              <motion.button className="btn-mint"
                style={{ fontSize: 'var(--fs-lg)', minWidth: 220 }}
                whileTap={{ scale: 0.94 }} onClick={handleNext}
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

        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragOver={e => setOverBin(e.over?.id as string ?? null)}>
          {/* Draggable items */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center', padding: '8px 0' }}>
            {remaining.map(item => (
              <motion.div key={item.id} layout transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}>
                <DragItem item={item} />
              </motion.div>
            ))}
          </div>

          {/* Drop zones */}
          <div style={{ display: 'flex', gap: 32, justifyContent: 'center' }}>
            <BinZone
              id="trash"
              label="Trash Bin"
              image={getAssetUrl('/assets/images/trash_bin.jpg')}
              isOver={overBin === 'trash'}
              feedback={feedback['trash']}
            />
            <BinZone
              id="recycle"
              label="Recycle Bin"
              image={getAssetUrl('/assets/images/recycle_bin.jpg')}
              isOver={overBin === 'recycle'}
              feedback={feedback['recycle']}
            />
          </div>

          <DragOverlay dropAnimation={{ duration: 250, easing: 'ease' }}>
            {activeId ? <TrashItemCard item={TRASH_ITEMS.find(i => i.id === activeId)!} isOverlay /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
