'use client';
import { useEditorStore } from '@/store/useEditorStore';

export default function PropertiesPanel() {
    const selectedId = useEditorStore((s) => s.selectedElementId);
    const element = useEditorStore((s) =>
        s.elements.find((e) => e.id === selectedId)
    );
    const update = useEditorStore((s) => s.updateElement);

    if (!element) return null;

    return (
        <aside className="w-80 border-l bg-white px-5 py-6 overflow-y-auto">
            <h3 className="font-semibold mb-2">Propiedades</h3>

            {/* Texto / Header */}
            {(element.type === 'text' || element.type === 'header') && (
                <>
                    <label className="block text-sm">Contenido</label>
                    <textarea
                        className="w-full border p-1 mb-3"
                        value={element.content}
                        onChange={(e) =>
                            update(element.id, { content: e.target.value })
                        }
                    />
                    <label className="block text-sm">Color</label>
                    <input
                        type="color"
                        className="mb-3"
                        value={element.style?.color || '#000000'}
                        onChange={(e) =>
                            update(element.id, { style: { ...element.style, color: e.target.value } })
                        }
                    />
                </>
            )}

            {/* Imagen */}
            {element.type === 'image' && (
                <>
                    <label className="block text-sm">URL de imagen</label>
                    <input
                        className="w-full border p-1 mb-3"
                        value={element.content}
                        onChange={(e) =>
                            update(element.id, { content: e.target.value })
                        }
                    />
                </>
            )}
            {/* …añadir aquí tabla / gráfico más adelante … */}
        </aside>
    );
}
