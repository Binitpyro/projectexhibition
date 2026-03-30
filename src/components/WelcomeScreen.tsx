import { motion } from 'framer-motion';
import TransparentVideoPlayer from './TransparentVideoPlayer';
import { MascotWrapper } from './MascotWrapper';
import ActivityCalendar from './ActivityCalendar';

interface WelcomeScreenProps {
    onStart: () => void;
    streak: number;
}

const LEVELS = [
    { icon: '🦷', label: 'Brush Teeth', color: 'var(--color-sky)' },
    { icon: '🧴', label: 'Wash Hands', color: 'var(--color-lilac)' },
    { icon: '♻️', label: 'Clean Park', color: 'var(--color-mint)' },
];

export default function WelcomeScreen({ onStart, streak }: Readonly<WelcomeScreenProps>) {
    return (
        <div
            className="scene-wrapper"
            style={{
                background: 'linear-gradient(135deg, #C8EFF8 0%, #E8D4F4 50%, #FFD7B8 100%)',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            {/* Ambient floating bubbles */}
            {Array.from({ length: 8 }, (_, i) => ({ id: `bubble-${i}`, idx: i })).map((item) => (
                <motion.div key={item.id} style={{
                    position: 'absolute',
                    width: 48 + item.idx * 20,
                    height: 48 + item.idx * 20,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.25)',
                    top: `${10 + item.idx * 10}%`,
                    left: `${5 + item.idx * 11}%`,
                    pointerEvents: 'none',
                }}
                    animate={{ y: [0, -16, 0], opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 4 + item.idx * 0.8, repeat: Infinity, ease: 'easeInOut', delay: item.idx * 0.5 }}
                />
            ))}

            {/* Streak badge */}
            {streak > 0 && (
                <motion.div className="star-badge"
                    style={{ position: 'absolute', top: 'var(--sp-5)', right: 'var(--sp-5)', zIndex: 5 }}
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    🔥 {streak} Day Streak!
                </motion.div>
            )}

            <div className="scene-content" style={{
                alignItems: 'center',
                gap: 'var(--sp-6)',
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
                width: '100%',
                maxWidth: '1200px'
            }}>

                {/* Left Side: Mascot and Start */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--sp-5)', flex: '1 1 300px', minWidth: '300px' }}>
                    {/* Title */}
                    <div style={{ textAlign: 'center', zIndex: 2 }}>
                        <h1 className="scene-title" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)' }}>
                            Hi, I'm Robo! 🤖
                        </h1>
                        <p className="scene-subtitle">Let's learn healthy habits together!</p>
                    </div>

                    {/* Robo mascot */}
                    <MascotWrapper key="welcome-mascot" width="100%" height="auto" style={{ maxWidth: 450, aspectRatio: '1/1' }}
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <TransparentVideoPlayer
                            src="/assets/video/robo_idle.mp4"
                            width="100%"
                            height="100%"
                            loop
                            autoPlay
                        />
                    </MascotWrapper>

                    {/* Start button */}
                    <motion.button
                        className="btn-primary"
                        style={{ minWidth: '80%', maxWidth: 300, fontSize: 'var(--fs-xl)', padding: 'var(--sp-4) var(--sp-8)' }}
                        onClick={onStart}
                        whileTap={{ scale: 0.94 }}
                        animate={{ scale: [1, 1.03, 1] }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                    >
                        🎮 Let's Play!
                    </motion.button>
                </div>

                {/* Right Side: Calendar & Previews */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--sp-6)', flex: '1 1 300px' }}>
                    <ActivityCalendar />

                    {/* Level previews */}
                    <div style={{ display: 'flex', gap: 'var(--sp-4)', flexWrap: 'wrap', justifyContent: 'center', zIndex: 2 }}>
                        {LEVELS.map((l) => (
                            <div key={l.label} className="level-card" style={{ minWidth: 88, background: `${l.color}33` }}>
                                <span style={{ fontSize: '2rem' }}>{l.icon}</span>
                                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--fs-sm)' }}>
                                    {l.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
