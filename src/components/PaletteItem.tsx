/* src/components/PaletteItem.tsx – COMPLETO */
'use client';

import { useDraggable } from '@dnd-kit/core';
import { PALETTE_ITEM } from '@/lib/dndTypes';
import { FaHeading, FaRegFileAlt, FaImage, FaTable, FaChartBar } from 'react-icons/fa';

const icons = {
    header: FaHeading,
    text: FaRegFileAlt,
    image: FaImage,
    table: FaTable,
    chart: FaChartBar,
} as const;

type Kind = keyof typeof icons;
export default function PaletteItem({ type }: { type: Kind }) {
    const { attributes, listeners, setNodeRef } = useDraggable({
        id: `palette-${type}`,
        data: { kind: PALETTE_ITEM, type },
    });
    const Icon = icons[type];
    return (
        <button
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            className="w-full bg-blue-600 text-white flex items-center justify-center
                 p-3 mb-3 shadow cursor-grab active:cursor-grabbing select-none"
            title={type.toUpperCase()}
        >
            <Icon size={22} />
        </button>
    );
}
