import { useDraggable } from '@dnd-kit/core';
import TransparentImage from './TransparentImage';
import { getAssetUrl } from '../utils/asset';

export interface TrashItem {
    id: string;
    label: string;
    image: string;
    bin: 'trash' | 'recycle';
}

export function TrashItemCard({ item, isOverlay = false }: Readonly<{ item: TrashItem, isOverlay?: boolean }>) {
    return (
        <div
            className="drag-item"
            style={{
                touchAction: 'none',
                boxShadow: isOverlay ? 'var(--shadow-float)' : undefined,
                cursor: isOverlay ? 'grabbing' : 'grab',
                opacity: isOverlay ? 0.9 : 1,
            }}
        >
            <TransparentImage
                src={getAssetUrl(item.image)}
                alt={item.label}
                className="prop-img"
                style={{ width: 140, height: 140 }}
            />
            <p style={{ fontSize: 'var(--fs-sm)', textAlign: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, marginTop: 4 }}>
                {item.label}
            </p>
        </div>
    );
}

export function DragItem({ item }: Readonly<{ item: TrashItem }>) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: item.id });

    if (isDragging) {
        return (
            <div ref={setNodeRef} style={{ width: 140, height: 165, opacity: 0.2 }} />
        );
    }

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            style={{
                transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
            }}
        >
            <TrashItemCard item={item} />
        </div>
    );
}
