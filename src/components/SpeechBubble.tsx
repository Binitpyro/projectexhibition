import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SpeechBubbleProps {
    children: ReactNode;
    className?: string;
}

export function SpeechBubble({ children, className = '' }: Readonly<SpeechBubbleProps>) {
    return (
        <motion.div
            className={`speech-bubble ${className}`}
            style={{ background: 'rgba(255,255,255,0.5)', fontSize: 'var(--fs-base)', padding: 'var(--sp-2) var(--sp-4)' }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            initial={{ opacity: 0 }}
            exit={{ opacity: 0 }}
        >
            {children}
        </motion.div>
    );
}
