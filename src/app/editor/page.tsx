'use client';

import { useState } from 'react';
import {
    DndContext,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
    Modifier,
} from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { snapToGrid } from '@/lib/snapToGrid';
import { PALETTE_ITEM } from '@/lib/dndTypes';

import Palette from '@/components/Palette';
import Canvas from '@/components/Canvas';
import PropertiesPanel from '@/components/PropertiesPanel';

/* Restricción condicional: solo para bloques ya dentro del papel */
const restrictIfElement: Modifier = (args) => {
    const { active } = args;
    if (!active) return args.transform;

    const kind = (active.data.current as any)?.kind;
    if (kind === 'ELEMENT') {
        return restrictToParentElement(args);
    }
    return args.transform;
};

export default function EditorPage() {
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );

    const [activeData, setActiveData] = useState<any>(null);

    return (
        <DndContext
            sensors={sensors}
            modifiers={[
                restrictIfElement,
                snapToGrid(24, 16),
            ]}
            onDragStart={(evt) => setActiveData(evt.active.data.current)}
            onDragEnd={() => setActiveData(null)}
        >
            {/* ───────────── LAYOUT ───────────── */}
            <div className="flex h-screen overflow-hidden">
                <aside className="w-80 shrink-0 border-r bg-white flex flex-col">
                    <Palette />
                    <div className="border-t my-2" />
                    <PropertiesPanel />
                </aside>

                <main className="flex-1 overflow-auto bg-gray-100 p-8">
                    <div className="flex justify-center">
                        <Canvas />
                    </div>
                </main>
            </div>

            {/* ───────────── DragOverlay ───────────── */}
            <DragOverlay dropAnimation={null}>
                {activeData?.kind === PALETTE_ITEM && (
                    <div className="px-4 py-2 rounded bg-blue-600 text-white text-sm shadow select-none">
                        {activeData.type.toUpperCase()}
                    </div>
                )}

                {/* Bloque existente → mismo aspecto que Element */}
                {activeData?.kind === 'ELEMENT' && (
                    <div className="border rounded-md bg-blue-600 text-white px-4 py-2 shadow-sm select-none">
                        {activeData.type.toUpperCase()}
                    </div>
                )}
            </DragOverlay>
        </DndContext>
    );
}
