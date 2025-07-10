'use client';

import {
    useDroppable,
    useDndMonitor,
} from '@dnd-kit/core';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { v4 as uuid } from 'uuid';
import { PALETTE_ITEM } from '@/lib/dndTypes';
import { useEditorStore } from '@/store/useEditorStore';
import Element from './Element';

export default function Canvas() {
    const elements = useEditorStore((s) => s.elements);
    const addElement = useEditorStore((s) => s.addElement);
    const updateElem = useEditorStore((s) => s.updateElement);

    /* zona droppable */
    const { setNodeRef } = useDroppable({ id: 'paper' });

    /* monitor de drag */
    useDndMonitor({
        onDragEnd: ({ active, delta, over }) => {
            if (!over) return;

            /* nuevo — desde paleta */
            if (
                active.data.current?.kind === PALETTE_ITEM &&
                over.id === 'paper'
            ) {
                const paperRect = over.rect;
                const act = active.rect.current as any; // acceso a .translated
                const left = act.translated?.left ?? act.left;
                const top = act.translated?.top ?? act.top;

                const gridX = 24;
                const gridY = 16;

                const newX = Math.round((left - paperRect.left) / gridX) * gridX;
                const newY = Math.round((top - paperRect.top) / gridY) * gridY;

                addElement({
                    id: uuid(),
                    type: active.data.current.type,
                    content: active.data.current.type,
                    style: {},
                    data: null,
                    x: newX,
                    y: newY,
                });
                return;
            }

            /* mover existente */
            if (active.data.current?.kind === 'ELEMENT') {
                const gridX = 24;
                const gridY = 16;

                const rawX = active.data.current.x + delta.x;
                const rawY = active.data.current.y + delta.y;

                updateElem(active.id as string, {
                    x: Math.round(rawX / gridX) * gridX,
                    y: Math.round(rawY / gridY) * gridY,
                });
            }
        },
    });

    return (
        <LayoutGroup>
            <motion.div
                ref={setNodeRef}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="relative w-[210mm] min-h-[297mm] bg-white shadow-lg paper-grid"
            >
                <AnimatePresence>
                    {elements.map((el) => (
                        <Element key={el.id} element={el} />
                    ))}
                </AnimatePresence>
            </motion.div>
        </LayoutGroup>
    );
}
