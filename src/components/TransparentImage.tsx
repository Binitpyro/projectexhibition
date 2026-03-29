import { useEffect, useRef, useState, memo } from 'react';

/**
 * TransparentImage
 *
 * Renders an image, removes a solid neon-green background via chroma-key using HTML5 canvas,
 * and maintains layout behaviors similar to a normal <img> tag.
 */
interface TransparentImageProps {
    src: string;
    alt?: string;
    className?: string;
    style?: React.CSSProperties;
}

const TransparentImage = memo(function TransparentImage({ src, alt, className, style }: TransparentImageProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [aspectRatio, setAspectRatio] = useState(1);

    // Retaining prop for backwards compatibility

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            const w = img.naturalWidth || img.width;
            const h = img.naturalHeight || img.height;
            if (w > 0 && h > 0) setAspectRatio(w / h);

            canvas.width = w;
            canvas.height = h;

            ctx.clearRect(0, 0, w, h);
            ctx.drawImage(img, 0, 0, w, h);

            try {
                const frame = ctx.getImageData(0, 0, w, h);
                const d = frame.data;

                for (let i = 0; i < d.length; i += 4) {
                    const r = d[i];
                    const g = d[i + 1];
                    const b = d[i + 2];

                    const maxRB = Math.max(r, b);

                    // Enhanced green screen detection for varying shades and artifacts
                    const isGreen = g > 60 && g > maxRB * 1.15 && r < 180 && b < 180;

                    if (isGreen) {
                        d[i + 3] = 0; // Fully transparent
                    } else {
                        // Edge softening for anti-aliased green pixels
                        const isEdgeGreen = g > 50 && g > maxRB * 1.05 && r < 200 && b < 200;
                        if (isEdgeGreen) {
                            const strength = Math.min(1, (g - maxRB * 1.05) / 30);
                            d[i + 3] = Math.max(0, d[i + 3] - Math.round(strength * 220));
                        }
                    }
                }
                ctx.putImageData(frame, 0, 0);
            } catch (e) {
                console.warn("[TransparentImage] Chroma key failed due to CORS", e);
            }
        };
        img.src = src;

        // Cleanup not needed for image loading
    }, [src]);

    return (
        <canvas
            ref={canvasRef}
            className={className}
            style={{
                display: 'block',
                width: '100%',
                height: '100%',
                aspectRatio: aspectRatio,
                objectFit: 'contain',
                background: 'transparent',
                ...style
            }}
            data-alt={alt}
        />
    );
});

export default TransparentImage;
