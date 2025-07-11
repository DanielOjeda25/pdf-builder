'use client';

import { useEffect, useState } from 'react';
import { Rnd } from 'react-rnd';
import {
    FaHeading, FaRegFileAlt, FaImage, FaTable, FaChartBar,
} from 'react-icons/fa';
import { useEditorStore, ElementType } from '@/store/useEditorStore';
import TextBlock from './TextBlock';
import ImageBlock from './ImageBlock';

const icons = {
    header: FaHeading,
    text: FaRegFileAlt,
    image: FaImage,
    table: FaTable,
    chart: FaChartBar,
} as const;

type Props = { el: ElementType; grid: [number, number] };

export default function RndHydrated({ el, grid }: Props) {
    const update = useEditorStore((s) => s.updateElement);
    const select = useEditorStore((s) => s.selectElement);
    const selectedId = useEditorStore((s) => s.selectedElementId);

    const [hydrated, setHydrated] = useState(false);
    useEffect(() => setHydrated(true), []);

    /* -------- contenido interno ---------- */
    const Inner = () => {
        if (el.type === 'text')
            return <TextBlock content={el.content} />;
        if (el.type === 'header')
            return <TextBlock content={el.content} asHeader />;
        if (el.type === 'image')
            return <ImageBlock id={el.id} src={el.src} />;
        const Icon = icons[el.type];
        return <Icon size={22} />;
    };

    const baseCls =
        'cursor-move bg-blue-600 text-white shadow select-none flex items-center ' +
        'justify-center overflow-hidden ' +
        (selectedId === el.id ? 'ring-4 ring-blue-300' : '');

    const staticDiv = (
        <div
            style={{
                width: el.w, height: el.h,
                transform: `translate(${el.x}px, ${el.y}px)`
            }}
            className={baseCls}
        >
            <Inner />
        </div>
    );

    if (!hydrated) return staticDiv;

    return (
        <Rnd
            size={{ width: el.w, height: el.h }}
            position={{ x: el.x, y: el.y }}
            bounds="parent"
            dragGrid={grid}
            resizeGrid={grid}
            minWidth={grid[0] * 2}
            minHeight={grid[1] * 2}
            cancel=".no-drag"
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
            onClick={(e: React.MouseEvent) => { e.stopPropagation(); select(el.id); }}
        >
            <Inner />
        </Rnd>
    );
}
