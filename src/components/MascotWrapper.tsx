import { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface MascotWrapperProps extends HTMLMotionProps<'div'> {
    children: ReactNode;
    width?: number | string;
    height?: number | string;
}

export function MascotWrapper({ children, width = 240, height = 240, className = '', style, ...motionProps }: Readonly<MascotWrapperProps>) {
    return (
        <motion.div
            className={`mascot-wrap ${className}`}
            style={{ width, height, maxWidth: '100%', maxHeight: '500px', margin: '0 auto', ...style }}
            {...motionProps}
        >
            {children}
        </motion.div>
    );
}
