'use client';
import { useEditorStore } from '@/store/useEditorStore';

export default function PropertiesPanel() {
    const selectedId = useEditorStore((s) => s.selectedElementId);
    const element = useEditorStore((s) =>
        s.elements.find((el) => el.id === selectedId)
    );
    const update = useEditorStore((s) => s.updateElement);

    if (!element) return <p className="text-sm text-gray-400">Seleccione un bloque</p>;

    return (
        <div className="space-y-4">
            {element.type === 'text' || element.type === 'header' ? (
                <>
                    <label className="block text-xs text-gray-600 mb-1">Contenido</label>
                    <textarea
                        value={element.content ?? ''}
                        onChange={(e) => update(element.id, { content: e.target.value })}
                        className="w-full h-24 border rounded p-1 text-sm"
                    />
                </>
            ) : null}

            {element.type === 'image' ? (
                <>
                    <label className="block text-xs text-gray-600 mb-1">URL de imagen</label>
                    <input
                        type="text"
                        value={element.src ?? ''}
                        onChange={(e) => update(element.id, { src: e.target.value })}
                        className="w-full border rounded p-1 text-sm"
                        placeholder="https://…"
                    />
                </>
            ) : null}
        </div>
    );
}
