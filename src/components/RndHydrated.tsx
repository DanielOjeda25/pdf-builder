'use client';

import { useEffect, useState } from 'react';
import { Rnd } from 'react-rnd';
import {
    FaHeading,
    FaRegFileAlt,
    FaImage,
    FaTable,
    FaChartBar,
} from 'react-icons/fa';
import { useEditorStore, ElementType } from '@/store/useEditorStore';

const iconMap = {
    header: FaHeading,
    text: FaRegFileAlt,
    image: FaImage,
    table: FaTable,
    chart: FaChartBar,
} as const;

type Props = { el: ElementType; grid: [number, number] };

export default function RndHydrated({ el, grid }: Props) {
    /* store */
    const update = useEditorStore((s) => s.updateElement);
    const select = useEditorStore((s) => s.selectElement);
    const selectedId = useEditorStore((s) => s.selectedElementId);

    /* hidratación */
    const [ready, setReady] = useState(false);
    useEffect(() => setReady(true), []);

    const Icon = iconMap[el.type];

    /* ---------- bloque de HTML que se entrega en SSR ---------- */
    const staticDiv = (
        <div
            style={{
                width: el.w,
                height: el.h,
                transform: `translate(${el.x}px, ${el.y}px)`,
            }}
            className={
                'bg-blue-600 text-white shadow select-none ' +
                (selectedId === el.id ? 'ring-4 ring-blue-300' : '')
            }
        >
            {/* El contenedor ocupa todo el bloque */}
            <div className="w-full h-full flex items-center justify-center">
                <Icon size={22} />
            </div>
        </div>
    );

    /* ---------- mientras aún estamos en SSR ---------- */
    if (!ready) return staticDiv;

    /* ---------- versión interactiva en el cliente ---------- */
    return (
        <Rnd
            size={{ width: el.w, height: el.h }}
            position={{ x: el.x, y: el.y }}
            bounds="parent"
            dragGrid={grid}
            resizeGrid={grid}
            minWidth={grid[0] * 2}
            minHeight={grid[1] * 2}
            onDragStop={(_, d) =>
                update(el.id, {
                    x: Math.round(d.x / grid[0]) * grid[0],
                    y: Math.round(d.y / grid[1]) * grid[1],
                })}
            onResizeStop={(_, __, ref, ___, pos) =>
                update(el.id, {
                    w: Math.max(grid[0] * 2,
                        Math.round(ref.offsetWidth / grid[0]) * grid[0]),
                    h: Math.max(grid[1] * 2,
                        Math.round(ref.offsetHeight / grid[1]) * grid[1]),
                    x: Math.round(pos.x / grid[0]) * grid[0],
                    y: Math.round(pos.y / grid[1]) * grid[1],
                })}
            /* mismas clases que el bloque estático */
            className={staticDiv.props.className}
            onClick={(e: React.MouseEvent<HTMLDivElement>) => { e.stopPropagation(); select(el.id); }}
        >
            {/* contenedor 100 % para fondo azul completo */}
            <div className="w-full h-full flex items-center justify-center">
                <Icon size={22} />
            </div>
        </Rnd>
    );
}
