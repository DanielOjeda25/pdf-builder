'use client';

import { useDraggable } from '@dnd-kit/core';
import { PALETTE_ITEM } from '@/lib/dndTypes';

type Props = { type: 'header' | 'text' | 'image' | 'table' | 'chart' };

export default function PaletteItem({ type }: Props) {
    const { attributes, listeners, setNodeRef } = useDraggable({
        id: `palette-${type}`,
        data: { kind: PALETTE_ITEM, type },
    });

    return (
        <button
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            className="w-full rounded-md bg-blue-600 px-3 py-2 mb-2
                 text-sm text-white font-medium cursor-grab
                 active:cursor-grabbing select-none"
        >
            {type.toUpperCase()}
        </button>
    );
}
