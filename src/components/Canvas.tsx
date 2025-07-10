/* ────────────────────────────────────────────────────────────────
   /src/components/Canvas.tsx
   Hoja A4 droppable + movimiento libre alineado a rejilla
   (versión que compila en TypeScript)
   ──────────────────────────────────────────────────────────────── */
'use client';

import {
    useDndMonitor,
    useDroppable,
} from '@dnd-kit/core';
import { PALETTE_ITEM } from '@/lib/dndTypes';
import { v4 as uuid } from 'uuid';
import { useEditorStore } from '@/store/useEditorStore';
import Element from './Element';

export default function Canvas() {
    /* ---------------- estado global ---------------- */
    const elements = useEditorStore((s) => s.elements);
    const addElement = useEditorStore((s) => s.addElement);
    const updateElem = useEditorStore((s) => s.updateElement);

    /* -------------- zona droppable (la “hoja”) -------------- */
    const { setNodeRef } = useDroppable({ id: 'paper' });

    /* -------------- monitor de drag -------------- */
    useDndMonitor({
        onDragEnd: ({ active, delta, over }) => {
            if (!over) return;

            /* Caso 1 ▸ soltamos algo de la paleta dentro del papel */
            if (
                active.data.current?.kind === PALETTE_ITEM &&
                over.id === 'paper'
            ) {
                /* Rect del papel */
                const paperRect = over.rect;

                /* Rect del ítem mientras se arrastraba
                   ⚠️ typamos como any para acceder a .translated */
                const activeRect = active.rect.current as any;

                const translatedLeft = activeRect.translated
                    ? activeRect.translated.left
                    : activeRect.left;
                const translatedTop = activeRect.translated
                    ? activeRect.translated.top
                    : activeRect.top;

                const newX = Math.round((translatedLeft - paperRect.left) / 24) * 24;
                const newY = Math.round((translatedTop - paperRect.top) / 16) * 16;


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

            /* Caso 2 ▸ movemos un bloque EXISTENTE dentro del papel */
            if (active.data.current?.kind === 'ELEMENT') {
                updateElem(active.id as string, {
                    x: active.data.current.x + delta.x,
                    y: active.data.current.y + delta.y,
                });
            }
        },
    });

    /* ---------------- Render ---------------- */
    return (
        <div
            ref={setNodeRef}
            className="relative w-[210mm] min-h-[297mm] bg-white shadow-lg paper-grid"
        >
            {elements.map((el) => (
                <Element key={el.id} element={el} />
            ))}
        </div>
    );
}
