'use client';

import { useEffect, useState } from 'react';
import { Rnd } from 'react-rnd';
import { useEditorStore, ElementType } from '@/store/useEditorStore';   // 👈

type Props = { el: ElementType; grid: [number, number] };

export default function RndHydrated({ el, grid }: Props) {
    /* ─── store ─── */
    const update = useEditorStore((s) => s.updateElement);               // 👈
    const select = useEditorStore((s) => s.selectElement);
    const selectedId = useEditorStore((s) => s.selectedElementId);

    /* controla si ya estamos en el cliente */
    const [ready, setReady] = useState(false);
    useEffect(() => setReady(true), []);

    /* ---- HTML estático (SSR) ---- */
    const staticDiv = (
        <div
            style={{
                width: el.w,
                height: el.h,
                transform: `translate(${el.x}px, ${el.y}px)`,
            }}
            className={
                'flex items-center justify-center bg-blue-600 text-white ' +
                'font-semibold shadow select-none ' +
                (selectedId === el.id ? 'ring-4 ring-blue-300' : '')
            }
        >
            {el.type.toUpperCase()}
        </div>
    );

    if (!ready) return staticDiv;          // enviado por el servidor

    /* ---- versión interactiva (sólo en cliente) ---- */
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
            className={staticDiv.props.className}
            onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                e.stopPropagation();
                select(el.id);
            }}
        >
            {staticDiv.props.children}
        </Rnd>
    );
}
