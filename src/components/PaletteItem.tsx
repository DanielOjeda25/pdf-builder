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
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="
        w-10 h-10
        bg-blue-600 text-white
        rounded-full
        flex items-center justify-center
        shadow-sm
        hover:shadow-lg
        focus:outline-none focus:ring-2 focus:ring-blue-400
        transition
        duration-200
        cursor-grab active:cursor-grabbing
      "
        >
            <Icon className="w-5 h-5" />
        </motion.button>
    );
}
