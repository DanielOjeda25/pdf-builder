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
import { motion } from 'framer-motion';
import { snapToGrid } from '@/lib/snapToGrid';
import { PALETTE_ITEM } from '@/lib/dndTypes';

import Palette from '@/components/Palette';
import Canvas from '@/components/Canvas';
import PropertiesPanel from '@/components/PropertiesPanel';

/* restricción solo para bloques dentro del papel */
const restrictIfElement: Modifier = (args) => {
    const { active } = args;
    if (!active) return args.transform;
    return (active.data.current as any)?.kind === 'ELEMENT'
        ? restrictToParentElement(args)
        : args.transform;
};

export default function EditorPage() {
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );
    const [activeData, setActiveData] = useState<any>(null);

    return (
        <DndContext
            sensors={sensors}
            modifiers={[restrictIfElement, snapToGrid(24, 16)]}
            onDragStart={(e) => setActiveData(e.active.data.current)}
            onDragEnd={() => setActiveData(null)}
        >
            <div className="flex h-screen overflow-hidden">
                {/* ───── Sidebar ───── */}
                <motion.aside
                    initial={{ x: -80, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.45 }}
                    className="w-80 shrink-0 border-r bg-white flex flex-col"
                >
                    {/* Paleta */}
                    <div className="p-4 overflow-y-auto">
                        <Palette />
                    </div>

                    {/* Propiedades justo debajo */}
                    <div className="bg-gray-50 border-t p-4 overflow-y-auto">
                        <h3 className="text-sm font-semibold text-gray-600 mb-3">
                            Propiedades
                        </h3>
                        <PropertiesPanel />
                    </div>
                </motion.aside>

                {/* ───── Hoja ───── */}
                <main className="flex-1 overflow-auto bg-gray-100 p-8">
                    <div className="flex justify-center">
                        <Canvas />
                    </div>
                </main>
            </div>

            {/* Overlay */}
            <DragOverlay dropAnimation={null}>
                {activeData?.kind === PALETTE_ITEM && (
                    <div className="bg-blue-600 text-white text-sm px-4 py-2 shadow select-none">
                        {(activeData.type ?? '').toUpperCase()}
                    </div>
                )}
                {activeData?.kind === 'ELEMENT' && (
                    <div className="bg-blue-600 text-white px-5 py-2 shadow select-none">
                        {(activeData.type ?? '').toUpperCase()}
                    </div>
                )}
            </DragOverlay>
        </DndContext>
    );
}
