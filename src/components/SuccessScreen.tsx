import { motion } from 'framer-motion';
import { useState } from 'react';
import TransparentVideoPlayer from './TransparentVideoPlayer';
import { MascotWrapper } from './MascotWrapper';

interface SuccessScreenProps {
    streak: number;
    onReplay: () => void;
    onHome: () => void;
}

interface ConfettiParticle {
    id: string;
    idx: number;
    left: number;
    width: number;
    height: number;
    isCircle: boolean;
    duration: number;
    delay: number;
}

const CONFETTI_COLORS = ['#60CBEE', '#B3E8C8', '#FFB179', '#E8B4F4', '#FFE066'];

export default function SuccessScreen({ streak, onReplay, onHome }: Readonly<SuccessScreenProps>) {
    const [confetti] = useState<ConfettiParticle[]>(() =>
        Array.from({ length: 30 }, (_, i) => ({
            id: `confetti-${i}`,
            idx: i,
            left: Math.random() * 100,
            width: 8 + Math.random() * 8,
            height: 8 + Math.random() * 8,
            isCircle: Math.random() > 0.5,
            duration: 2 + Math.random() * 2,
            delay: Math.random() * 2,
        }))
    );

    return (
        <div
            className="scene-wrapper"
            style={{
                background: 'linear-gradient(135deg, #B8F0D8 0%, #C8EFF8 50%, #E8D4F4 100%)',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
            }}
        >
            {/* CSS confetti rain */}
            <div className="confetti-container" aria-hidden>
                {confetti.map((item) => (
                    <motion.div
                        key={item.id}
                        className="confetti-dot"
                        style={{
                            left: `${item.left}%`,
                            background: CONFETTI_COLORS[item.idx % CONFETTI_COLORS.length],
                            width: item.width,
                            height: item.height,
                            borderRadius: item.isCircle ? '50%' : '2px',
                            animationDuration: `${item.duration}s`,
                            animationDelay: `${item.delay}s`,
                        }}
                    />
                ))}
            </div>

            <div className="scene-content" style={{ alignItems: 'center', gap: 'var(--sp-6)', zIndex: 2 }}>

                {/* Celebration video — chroma-keyed green screen */}
                <MascotWrapper key="success-mascot" width={260} height={260}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                >
                    <TransparentVideoPlayer
                        src="/assets/video/celebrate.mp4"
                        width={260}
                        height={260}
                        loop
                        autoPlay
                    />
                </MascotWrapper>

                {/* Title */}
                <motion.h1
                    className="scene-title"
                    style={{ fontSize: 'clamp(2rem, 6vw, 3rem)' }}
                    animate={{ scale: [1, 1.04, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    🎉 Amazing Job!
                </motion.h1>

                <p className="scene-subtitle">Robo is so proud of you!</p>

                {/* Streak */}
                <motion.div
                    className="star-badge"
                    style={{ fontSize: 'var(--fs-lg)', padding: 'var(--sp-3) var(--sp-6)' }}
                    animate={{ rotate: [-2, 2, -2], scale: [1, 1.05, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    ⭐ {streak} Star{streak === 1 ? '' : 's'} Earned!
                </motion.div>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <motion.button
                        className="btn-primary"
                        style={{ minWidth: 200, fontSize: 'var(--fs-lg)' }}
                        onClick={onReplay}
                        whileTap={{ scale: 0.94 }}
                    >
                        🔄 Play Again!
                    </motion.button>

                    <motion.button
                        className="btn-glass"
                        style={{ minWidth: 200, fontSize: 'var(--fs-lg)' }}
                        onClick={onHome}
                        whileTap={{ scale: 0.94 }}
                    >
                        🏠 Back Home
                    </motion.button>
                </div>
            </div>
        </div>
    );
}
