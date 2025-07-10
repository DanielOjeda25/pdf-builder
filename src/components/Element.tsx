'use client';

import { motion } from 'framer-motion';
import { useDraggable } from '@dnd-kit/core';
import { ElementType, useEditorStore } from '@/store/useEditorStore';

export default function Element({ element }: { element: ElementType }) {
    const select = useEditorStore((s) => s.selectElement);
    const selectedId = useEditorStore((s) => s.selectedElementId);

    const { setNodeRef, attributes, listeners, transform, isDragging } =
        useDraggable({
            id: element.id,
            data: { kind: 'ELEMENT', type: element.type, x: element.x, y: element.y },
        });

    return (
        <motion.div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            onClick={(e) => { e.stopPropagation(); select(element.id); }}
            /* posición */
            style={{
                top: element.y,
                left: element.x,
                position: 'absolute',
                transform: transform
                    ? `translate(${transform.x}px, ${transform.y}px)`
                    : undefined,
                opacity: isDragging ? 0.55 : 1,
                userSelect: 'none',
            }}
            /* animaciones */
            layout
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            /* clases Tailwind — SIN rounded, SIN border */
            className={
                'px-5 py-2 min-w-[96px] text-center font-semibold text-white ' +
                'bg-blue-600 shadow-md cursor-move select-none ' +
                (selectedId === element.id ? 'ring-4 ring-blue-300' : '')
            }
            exit={{ opacity: 0, scale: 0.7 }}
        >
            {(element.type ?? '').toUpperCase()}
        </motion.div>
    );
}
