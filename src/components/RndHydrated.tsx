'use client';

import { ElementType, useEffect, useState } from 'react';
import { Rnd } from 'react-rnd';
import {
    FaHeading,
    FaRegFileAlt,
    FaImage,
    FaTable,
    FaChartBar,
} from 'react-icons/fa';
import { useEditorStore } from '@/store/useEditorStore';
import TextBlock from './TextBlock';
import ImageBlock from './ImageBlock';
import { BlockKind } from '@/types/editor';

const Icons: Record<BlockKind, React.ElementType> = {
    header: FaHeading,
    text: FaRegFileAlt,
    image: FaImage,
    table: FaTable,
    chart: FaChartBar,
};

interface Props {
    el: ElementType;
    grid: [number, number];
}

export default function RndHydrated({ el, grid }: Props) {
    /* ───────── estado global ───────── */
    const update = useEditorStore((s) => s.updateElement);
    const select = useEditorStore((s) => s.selectElement);
    const selectedId = useEditorStore((s) => s.selectedElementId);

    /* hidratación SSR */
    const [hydrated, setHydrated] = useState(false);
    useEffect(() => setHydrated(true), []);

    /* --------- contenido según tipo --------- */
    const Inner = () => {
        switch (el.type) {
            case 'header':
                return <TextBlock content={el.content} asHeader />;
            case 'text':
                return <TextBlock content={el.content} />;
            case 'image':
                return <ImageBlock id={el.id} src={el.src} />;
            default: {
                const Ico = Icons[el.type];
                return <Ico className="w-6 h-6" />;
            }
        }
    };

    /* --------- clases base --------- */
    const baseCls = `
    bg-blue-600 text-white rounded-md shadow-sm hover:shadow-lg transition
    cursor-move select-none
    ${selectedId === el.id ? 'ring-4 ring-blue-300' : ''}
  `;

    /* wrapper para contenido:
       - image necesita pointer-events para el doble-clic,
       - los demás pueden vivir con none (no afecta al drag)           */
    const contentCls =
        el.type === 'image'
            ? 'w-full h-full flex items-center justify-center'
            : 'w-full h-full flex items-center justify-center pointer-events-none';

    /* --------- versión SSR estática --------- */
    const staticDiv = (
        <div
            style={{
                width: el.w,
                height: el.h,
                transform: `translate(${el.x}px, ${el.y}px)`,
            }}
            className={baseCls}
        >
            <div className={contentCls}>
                <Inner />
            </div>
        </div>
    );
    if (!hydrated) return staticDiv;

    /* --------- versión interactiva --------- */
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
                    w: Math.max(grid[0] * 2, Math.round(ref.offsetWidth / grid[0]) * grid[0]),
                    h: Math.max(grid[1] * 2, Math.round(ref.offsetHeight / grid[1]) * grid[1]),
                    x: Math.round(pos.x / grid[0]) * grid[0],
                    y: Math.round(pos.y / grid[1]) * grid[1],
                })}
            className={baseCls}
            onClick={(
                e: React.MouseEvent<HTMLDivElement>   // 👈 añade el tipo concreto
            ) => {
                e.stopPropagation();
                select(el.id);
            }}
        >
            <div className={contentCls}>
                <Inner />
            </div>
        </Rnd>
    );
}
