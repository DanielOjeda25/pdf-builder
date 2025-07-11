/* /src/components/Element.tsx */
'use client';

import { Rnd } from 'react-rnd';
import { ElementType, useEditorStore } from '@/store/useEditorStore';

interface Props {
    element: ElementType;
    grid: [number, number];                 // [GRID_X, GRID_Y]
}

export default function Element({ element, grid }: Props) {
    const update = useEditorStore((s) => s.updateElement);
    const select = useEditorStore((s) => s.selectElement);
    const selectedId = useEditorStore((s) => s.selectedElementId);

    /* ───── mover ───── */
    const onDrag = (_e: any, d: any) => {
        const x = Math.round(d.x / grid[0]) * grid[0];
        const y = Math.round(d.y / grid[1]) * grid[1];
        update(element.id, { x, y });
    };

    /* ───── redimensionar ───── */
    const onResize = (_e: any, _dir: any, ref: HTMLElement, _delta: any, pos: any) => {
        const w = Math.max(grid[0] * 2, Math.round(ref.offsetWidth / grid[0]) * grid[0]);
        const h = Math.max(grid[1] * 2, Math.round(ref.offsetHeight / grid[1]) * grid[1]);
        const x = Math.round(pos.x / grid[0]) * grid[0];
        const y = Math.round(pos.y / grid[1]) * grid[1];
        update(element.id, { w, h, x, y });
    };

    return (
        <Rnd
            size={{ width: element.w, height: element.h }}
            position={{ x: element.x, y: element.y }}
            bounds="parent"
            dragGrid={grid}
            resizeGrid={grid}
            minWidth={grid[0] * 2}
            minHeight={grid[1] * 2}
            onDrag={onDrag}
            onResize={onResize}
            className={
                'flex items-center justify-center bg-pdf-500 text-white ' +
                'font-semibold shadow cursor-move select-none ' +
                (selectedId === element.id ? 'ring-4 ring-pdf-300' : '')
            }
            onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                e.stopPropagation();
                select(element.id);
            }}
        >
            {(element.type ?? '').toUpperCase()}
        </Rnd>
    );
}
