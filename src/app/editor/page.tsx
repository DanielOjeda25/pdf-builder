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

// Importa los iconos
import {
    FaHeading,
    FaRegFileAlt,
    FaImage,
    FaTable,
    FaChartBar,
} from 'react-icons/fa';

const iconMap = {
    header: FaHeading,
    text: FaRegFileAlt,
    image: FaImage,
    table: FaTable,
    chart: FaChartBar,
} as const;

type Kind = keyof typeof iconMap;

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
            id="palette"
            sensors={sensors}
            modifiers={[restrictIfElement, snapToGrid(24, 16)]}
            onDragStart={(evt) => setActiveData(evt.active.data.current)}
            onDragEnd={() => setActiveData(null)}
        >
            <div className="flex h-screen overflow-hidden">
                <motion.aside
                    initial={{ x: -80, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.45 }}
                    className="flex w-80 shrink-0 flex-col border-r bg-white"
                >
                    <div className="overflow-y-auto p-4">
                        <Palette />
                    </div>
                    <div className="overflow-y-auto border-t bg-gray-50 p-4">
                        <h3 className="mb-3 text-sm font-semibold text-gray-600">
                            Propiedades
                        </h3>
                        <PropertiesPanel />
                    </div>
                </motion.aside>

                <main className="flex-1 overflow-auto bg-gray-100 p-8">
                    <div className="flex justify-center">
                        <Canvas />
                    </div>
                </main>
            </div>

            {/* ─────────── DragOverlay ─────────── */}
            <DragOverlay dropAnimation={null}>
                {/* ①  Arrastrando desde la PALETA  */}
                {activeData?.kind === PALETTE_ITEM && (() => {
                    const Icon = iconMap[activeData.type as Kind];

                    /* tamaño por defecto = 4 × 2 celdas */
                    const defaultW = 24 * 4;
                    const defaultH = 16 * 2;

                    return (
                        <div
                            style={{ width: defaultW, height: defaultH }}
                            className="flex select-none items-center justify-center rounded bg-pdf-500 font-semibold text-white shadow"
                        >
                            <Icon size={24} />
                        </div>
                    );
                })()}

                {/* ②  Arrastrando un BLOQUE ya existente  */}
                {activeData?.kind === 'ELEMENT' && (() => {
                    const Icon = iconMap[activeData.type as Kind];

                    /* usamos el tamaño real que vive en el store                                */
                    /* (lo recibimos vía data.current en onDragStart)                            */
                    const { w, h } = activeData as { w: number; h: number };

                    return (
                        <div
                            style={{ width: w, height: h }}
                            className="flex select-none items-center justify-center rounded bg-pdf-500 font-semibold text-white shadow"
                        >
                            <Icon size={24} />
                        </div>
                    );
                })()}
            </DragOverlay>

        </DndContext>
    );
}
