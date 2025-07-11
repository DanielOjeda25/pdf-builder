'use client';

import { useDraggable } from '@dnd-kit/core';
import { PALETTE_ITEM } from '@/lib/dndTypes';
import {
    FaHeading,
    FaRegFileAlt,
    FaImage,
    FaTable,
    FaChartBar,
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const ICONS = {
    header: FaHeading,
    text: FaRegFileAlt,
    image: FaImage,
    table: FaTable,
    chart: FaChartBar,
} as const;

type Kind = keyof typeof ICONS;
type Props = { type: Kind };

export default function PaletteItem({ type }: Props) {
    const { setNodeRef, attributes, listeners } = useDraggable({
        id: `palette-${type}`,
        data: { kind: PALETTE_ITEM, type },
    });

    const Icon = ICONS[type];

    return (
        <motion.button
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            type="button"
            title={type.toUpperCase()}
            whileHover={{
                scale: 1,
                backgroundColor: '#fff',
                color: 'var(--color-pdf-500, #E82F2F)',
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.05 }}
            className="w-full h-20 bg-pdf-500 text-white rounded-lg flex items-center justify-center shadow-sm hover:bg-white hover:text-pdf-500 focus:outline-none focus:ring-2 focus:ring-pdf-300 transition duration-200 cursor-grab active:cursor-grabbing"
            style={{ aspectRatio: '1 / 1', minHeight: '3.5rem', minWidth: '3.5rem' }}
        >
            <Icon className="w-8 h-8" />
        </motion.button>
    );
}
