import { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface MascotWrapperProps extends HTMLMotionProps<'div'> {
    children: ReactNode;
    width?: number;
    height?: number;
}

export function MascotWrapper({ children, width = 240, height = 240, className = '', ...motionProps }: Readonly<MascotWrapperProps>) {
    return (
        <motion.div
            className={`mascot-wrap ${className}`}
            style={{ width, height }}
            {...motionProps}
        >
            {children}
        </motion.div>
    );
}
