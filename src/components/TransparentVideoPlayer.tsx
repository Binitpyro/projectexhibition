import { useEffect, useRef, useCallback } from 'react';

interface TransparentVideoPlayerProps {
    src: string;
    width?: number | string;
    height?: number | string;
    loop?: boolean;
    autoPlay?: boolean;
    onEnded?: () => void;
    className?: string;
    style?: React.CSSProperties;
}

/**
 * TransparentVideoPlayer
 *
 * Plays an MP4 with a solid neon-green (#00FF00) background and removes it
 * in real-time using HTML5 Canvas chroma-key.
 *
 * How it works:
 *   1. A hidden <video> element plays the source.
 *   2. requestAnimationFrame draws each frame to a <canvas>.
 *   3. Per-pixel chroma-key: high-G, low-R/B pixels → alpha = 0.
 *   4. The modified frame is written back. Only the canvas is displayed.
 *
 * IMPORTANT — CORS requirement:
 *   The Vite dev server must send COEP/CORP headers for getImageData()
 *   to work on video frames (no "tainted canvas" SecurityError).
 *   See vite.config.ts: server.headers.
 */
export default function TransparentVideoPlayer({
    src,
    width = 300,
    height = 300,
    loop = true,
    autoPlay = true,
    onEnded,
    className,
    style,
}: Readonly<TransparentVideoPlayerProps>) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rafRef = useRef<number>(0);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    const taintedRef = useRef(false); // flag if getImageData is blocked

    // ── Chroma-key: remove neon-green pixels ──────────────────────
    // Targets #00FF00 and near-variants. Widens detection slightly for
    // encoder artifacts (e.g., #00F020, #10FF10) using ratio thresholding.
    const applyChromaKey = useCallback((imageData: ImageData): ImageData => {
        const d = imageData.data;
        for (let i = 0; i < d.length; i += 4) {
            const r = d[i];
            const g = d[i + 1];
            const b = d[i + 2];

            // Core neon-green detection:
            // G channel dominant, R+B both low, G significantly > max(R,B)
            const maxRB = Math.max(r, b);
            const isGreen =
                g > 100 &&                        // G must be bright
                g > maxRB * 1.3 &&               // G significantly > R and B
                r < 130 &&                        // R not too high
                b < 130;                          // B not too high

            if (isGreen) {
                d[i + 3] = 0; // fully transparent
                continue;
            }

            // Edge softening: semi-transparent for near-green encoder artifacts
            const isEdgeGreen =
                g > 80 &&
                g > maxRB * 1.1 &&
                r < 160 &&
                b < 160;

            if (isEdgeGreen) {
                const strength = Math.min(1, (g - maxRB * 1.1) / 40);
                d[i + 3] = Math.max(0, d[i + 3] - Math.round(strength * 200));
            }
        }
        return imageData;
    }, []);

    // ── Draw loop ─────────────────────────────────────────────────
    const drawFrame = useCallback(function tick() {
        const video = videoRef.current;
        const ctx = ctxRef.current;
        const canvas = canvasRef.current;
        if (!video || !ctx || !canvas || video.paused || video.ended) return;

        if (video.videoWidth && video.videoHeight) {
            if (canvas.width !== video.videoWidth) canvas.width = video.videoWidth;
            if (canvas.height !== video.videoHeight) canvas.height = video.videoHeight;
        }

        const w = canvas.width;
        const h = canvas.height;
        if (w === 0 || h === 0) {
            rafRef.current = requestAnimationFrame(tick);
            return;
        }

        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(video, 0, 0, w, h);

        if (!taintedRef.current) {
            try {
                const frame = ctx.getImageData(0, 0, w, h);
                applyChromaKey(frame);
                ctx.putImageData(frame, 0, 0);
            } catch (e) {
                // SecurityError: canvas tainted. Log once, skip keying.
                if (!taintedRef.current) {
                    console.warn(
                        '[TransparentVideoPlayer] canvas.getImageData() blocked (tainted canvas).\n' +
                        'Ensure the Vite server is sending COEP/CORP headers (see vite.config.ts).\n' +
                        'Falling back to raw video frame without chroma-key.',
                        e
                    );
                    taintedRef.current = true;
                }
            }
        }

        rafRef.current = requestAnimationFrame(tick);
    }, [applyChromaKey]);

    // Initialise canvas context
    useEffect(() => {
        const ctx = canvasRef.current?.getContext('2d', { willReadFrequently: true }) ?? null;
        ctxRef.current = ctx;
    }, []);

    // Video event wiring
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        taintedRef.current = false; // reset on new src

        const onPlay = () => {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(drawFrame);
        };
        const onPause = () => cancelAnimationFrame(rafRef.current);
        const onEnd = () => {
            cancelAnimationFrame(rafRef.current);
            onEnded?.();
        };

        video.addEventListener('play', onPlay);
        video.addEventListener('pause', onPause);
        video.addEventListener('ended', onEnd);

        if (autoPlay) {
            video.muted = true;
            video.play().catch(() => {/* blocked before user gesture */ });
        }

        return () => {
            cancelAnimationFrame(rafRef.current);
            video.removeEventListener('play', onPlay);
            video.removeEventListener('pause', onPause);
            video.removeEventListener('ended', onEnd);
        };
    }, [src, autoPlay, drawFrame, onEnded]);

    return (
        <div
            className={className}
            style={{
                position: 'relative',
                width,
                height,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent',
                ...style,
            }}
        >
            {/* Hidden source video — NOT rendered directly */}
            <video
                ref={videoRef}
                src={src}
                loop={loop}
                muted
                playsInline
                // NOTE: do NOT set crossOrigin="anonymous" for same-origin videos —
                // it actually prevents the browser from using the cached response
                // and can trigger CORS errors even on same-origin assets.
                style={{ display: 'none' }}
            />

            {/* Visible canvas — receives chroma-keyed frames */}
            <canvas
                ref={canvasRef}
                style={{
                    display: 'block',
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    background: 'transparent',
                }}
            />
        </div>
    );
}
