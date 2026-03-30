import { useDraggable } from '@dnd-kit/core';
import TransparentImage from './TransparentImage';

export interface TrashItem {
    id: string;
    label: string;
    image: string;
    bin: 'trash' | 'recycle';
}

export function DragItem({ item }: Readonly<{ item: TrashItem }>) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: item.id });

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className="drag-item"
            style={{
                transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
                opacity: isDragging ? 0.5 : 1,
                touchAction: 'none',
            }}
        >
            <TransparentImage
                src={item.image}
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
