'use client';

import { useDroppable, useDndMonitor } from '@dnd-kit/core';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { v4 as uuid } from 'uuid';
import { PALETTE_ITEM } from '@/lib/dndTypes';
import { useEditorStore } from '@/store/useEditorStore';
import RndHydrated from '@/components/RndHydrated'; /* ← nuevo */
/* (quitamos Element) */

const GRID_X = 24;
const GRID_Y = 16;
const MARGIN_PX = 75;

export default function Canvas() {
    const elements = useEditorStore((s) => s.elements);
    const addElem = useEditorStore((s) => s.addElement);

    const { setNodeRef } = useDroppable({ id: 'paper' });

    useDndMonitor({
        onDragEnd: ({ active, over }) => {
            if (
                active.data.current?.kind === PALETTE_ITEM &&
                over?.id === 'paper'
            ) {
                const bodyLeft = over.rect.left + MARGIN_PX;
                const bodyTop = over.rect.top + MARGIN_PX;

                const act = active.rect.current as unknown as { translated?: { left: number; top: number }; left: number; top: number };
                const left = (act.translated?.left ?? act.left) - bodyLeft;
                const top = (act.translated?.top ?? act.top) - bodyTop;

                // Dimensiones del canvas en píxeles (A4: 210mm x 297mm)
                const CANVAS_W = 210 * 3.7795275591; // mm a px (aprox 794)
                const CANVAS_H = 297 * 3.7795275591; // mm a px (aprox 1122)
                const blockW = GRID_X * 4;
                const blockH = GRID_Y * 2;
                let x = Math.round(left / GRID_X) * GRID_X;
                let y = Math.round(top / GRID_Y) * GRID_Y;
                // Limitar para que no se salga del canvas
                x = Math.max(0, Math.min(x, CANVAS_W - blockW));
                y = Math.max(0, Math.min(y, CANVAS_H - blockH));
                addElem({
                    id: uuid(),
                    type: active.data.current.type,
                    content: getDefaultContent(active.data.current.type),
                    x,
                    y,
                    w: blockW,
                    h: blockH,
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
                className="relative w-[210mm] min-h-[297mm] bg-white shadow-lg"
                style={{ padding: `${MARGIN_PX}px` }}
            >
                <div
                    className="relative w-full h-full paper-grid border border-gray-200"
                    style={{ backgroundSize: `${GRID_X}px ${GRID_Y}px` }}
                >
                    <AnimatePresence>
                        {elements.map((el) => (
                            <RndHydrated key={el.id} el={el} grid={[GRID_X, GRID_Y]} />
                        ))}
                    </AnimatePresence>
                </div>
            </motion.div>
        </LayoutGroup>
    );
}

// Traducción de los nombres de los bloques
function getDefaultContent(type: string) {
    switch (type) {
        case 'header':
            return 'Encabezado';
        case 'text':
            return 'Párrafo';
        case 'image':
            return 'Imagen';
        case 'table':
            return 'Tabla';
        case 'chart':
            return 'Gráfico';
        default:
            return '';
    }
}
