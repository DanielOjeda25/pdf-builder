/* ──────────────────────────────────────────────────────────
   /src/components/Canvas.tsx  –  con borde exterior
   ────────────────────────────────────────────────────────── */
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

const GRID_X = 24;
const GRID_Y = 16;
const MARGIN_PX = 75;          // margen de 20 mm aprox. en 96 dpi

export default function Canvas() {
    const elements = useEditorStore((s) => s.elements);
    const addElem = useEditorStore((s) => s.addElement);
    const updateElem = useEditorStore((s) => s.updateElement);

    const { setNodeRef } = useDroppable({ id: 'paper' });

    /* manejo de drag */
    useDndMonitor({
        onDragEnd: ({ active, delta, over }) => {
            if (!over) return;

            const bodyLeft = over.rect.left + MARGIN_PX;
            const bodyTop = over.rect.top + MARGIN_PX;

            /* nuevo desde paleta */
            if (
                active.data.current?.kind === PALETTE_ITEM &&
                over.id === 'paper'
            ) {
                const act = active.rect.current as any;
                const left = (act.translated?.left ?? act.left) - bodyLeft;
                const top = (act.translated?.top ?? act.top) - bodyTop;

                addElem({
                    id: uuid(),
                    type: active.data.current.type,
                    content: active.data.current.type,
                    style: {},
                    data: null,
                    x: Math.round(left / GRID_X) * GRID_X,
                    y: Math.round(top / GRID_Y) * GRID_Y,
                });
                return;
            }

            /* mover existente */
            if (active.data.current?.kind === 'ELEMENT') {
                const rawX = active.data.current.x + delta.x;
                const rawY = active.data.current.y + delta.y;

                updateElem(active.id as string, {
                    x: Math.round(rawX / GRID_X) * GRID_X,
                    y: Math.round(rawY / GRID_Y) * GRID_Y,
                });
            }
        },
    });

    return (
        <LayoutGroup>
            {/* hoja completa con padding = márgenes */}
            <motion.div
                ref={setNodeRef}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="relative w-[210mm] min-h-[297mm] bg-white shadow-lg"
                style={{ padding: `${MARGIN_PX}px` }}
            >
                {/* cuerpo del documento: cuadrícula + borde */}
                <div
                    className="relative w-full h-full paper-grid border border-gray-200"
                    style={{ backgroundSize: `${GRID_X}px ${GRID_Y}px` }}
                >
                    <AnimatePresence>
                        {elements.map((el) => (
                            <Element key={el.id} element={el} />
                        ))}
                    </AnimatePresence>
                </div>
            </motion.div>
        </LayoutGroup>
    );
}
