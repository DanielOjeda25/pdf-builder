'use client';

import { useEffect, useState } from 'react';
import { Rnd } from 'react-rnd';
import * as Ctx from '@radix-ui/react-context-menu';
import {
    FaHeading,
    FaRegFileAlt,
    FaImage,
    FaTable,
    FaChartBar,
    FaTrashAlt,
    FaClone,
} from 'react-icons/fa';
import type { IconType } from 'react-icons';

import {
    useEditorStore,
    type BlockKind,
    type ElementType,
} from '@/store/useEditorStore';

import TextBlock from './TextBlock';
import ImageBlock from './ImageBlock';

/* ---------- iconos ---------- */
const Icons: Record<BlockKind, IconType> = {
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
    const update = useEditorStore((s) => s.updateElement);
    const remove = useEditorStore((s) => s.removeElement);
    const duplicate = useEditorStore((s) => s.duplicateElement);
    const select = useEditorStore((s) => s.selectElement);
    const selectedId = useEditorStore((s) => s.selectedElementId);

    const [hydrated, setHydrated] = useState(false);
    useEffect(() => setHydrated(true), []);

    /* ---------- bloque interno ---------- */
    const Inner = () => {
        switch (el.type) {
            case 'header':
                return <TextBlock content={el.content} asHeader />;
            case 'text':
                return <TextBlock content={el.content} />;
            case 'image':
                return <ImageBlock id={el.id} src={el.src} />;
            default: {
                const Icon = Icons[el.type];
                return <Icon className="w-6 h-6" />;
            }
        }
    };

    /* ---------- clases ---------- */
    const base =
        `bg-pdf-500 text-white rounded-md shadow-sm hover:shadow-lg
     transition cursor-move select-none ${selectedId === el.id ? 'ring-4 ring-pdf-300' : ''
        }`;

    const contentCls =
        el.type === 'image'
            ? 'w-full h-full flex items-center justify-center'
            : 'w-full h-full flex items-center justify-center pointer-events-none';

    /* ---------- SSR estático ---------- */
    if (!hydrated) {
        return (
            <div
                style={{
                    width: el.w,
                    height: el.h,
                    transform: `translate(${el.x}px, ${el.y}px)`,
                }}
                className={base}
            >
                <div className={contentCls}>
                    <Inner />
                </div>
            </div>
        );
    }

    /* ---------- menú contextual ---------- */
    const Menu = () => (
        <Ctx.Content
            className="min-w-[140px] rounded-md bg-white shadow-lg border
                 border-gray-300/70 py-1 text-sm text-gray-700"
        >
            <Ctx.Item
                className="flex items-center gap-2 px-3 py-1.5 cursor-pointer
                   hover:bg-gray-100 focus:bg-gray-100 outline-none"
                onSelect={() => duplicate(el.id)}
            >
                <FaClone className="w-3.5 h-3.5 text-gray-500" /> Duplicar
            </Ctx.Item>

            <Ctx.Item
                className="flex items-center gap-2 px-3 py-1.5 cursor-pointer
                   hover:bg-gray-100 focus:bg-gray-100 outline-none text-red-600"
                onSelect={() => remove(el.id)}
            >
                <FaTrashAlt className="w-3.5 h-3.5" /> Eliminar
            </Ctx.Item>
        </Ctx.Content>
    );

    /* ---------- bloque interactivo ---------- */
    return (
        <Ctx.Root>
            <Ctx.Trigger asChild>
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
                    className={base}
                    onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        select(el.id);
                    }}
                >
                    <div className={contentCls}>
                        <Inner />
                    </div>
                </Rnd>
            </Ctx.Trigger>

            <Menu />
        </Ctx.Root>
    );
}
