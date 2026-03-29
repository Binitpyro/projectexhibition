import { useDroppable } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import TransparentImage from './TransparentImage';

interface BinZoneProps {
    id: string;
    label: string;
    image: string;
    isOver: boolean;
    feedback?: 'correct' | 'wrong';
}

export function BinZone({ id, label, image, isOver, feedback }: Readonly<BinZoneProps>) {
    const { setNodeRef } = useDroppable({ id });

    return (
        <div
            ref={setNodeRef}
            className="drop-zone"
            data-over={isOver ? 'true' : undefined}
            style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                outline: feedback === 'wrong' ? '3px solid #ff4444' : undefined,
                borderRadius: 'var(--radius-md)',
                padding: '8px',
                transition: 'outline 0.2s',
            }}
        >
            <TransparentImage
                src={image}
                alt={label}
                className="mascot-img"
                style={{ width: 90, height: 90 }}
            />
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--fs-sm)', color: 'var(--color-text)' }}>
                {label}
            </p>
            {feedback === 'wrong' && (
                <motion.p animate={{ x: [-4, 4, -4, 4, 0] }} transition={{ duration: 0.3 }}
                    style={{ fontSize: '1.2rem' }}>❌</motion.p>
            )}
            {feedback === 'correct' && (
                <p style={{ fontSize: '1.2rem' }}>✅</p>
            )}
        </div>
    );
}
