'use client';

import { useDraggable } from '@dnd-kit/core';
import { ElementType, useEditorStore } from '@/store/useEditorStore';

export default function Element({ element }: { element: ElementType }) {
    const select = useEditorStore((s) => s.selectElement);

    /* draggable: enviamos también el type para mostrarlo en el overlay */
    const { attributes, listeners, setNodeRef, transform, isDragging } =
        useDraggable({
            id: element.id,
            data: {
                kind: 'ELEMENT',
                type: element.type,
                x: element.x,
                y: element.y,
            },
        });

    const style: React.CSSProperties = {
        top: element.y,
        left: element.x,
        position: 'absolute',
        transform: transform
            ? `translate(${transform.x}px, ${transform.y}px)`
            : undefined,
        opacity: isDragging ? 0.5 : 1,
        userSelect: 'none',
    };

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            onClick={(e) => {
                e.stopPropagation();
                select(element.id);
            }}
            style={style}
            className="border rounded-md bg-blue-600 text-white px-4 py-2 shadow-sm
                 cursor-move hover:shadow-md select-none"
        >
            {element.type.toUpperCase()}
        </div>
    );
}
