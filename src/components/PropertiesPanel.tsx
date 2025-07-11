'use client';
import { useEditorStore } from '@/store/useEditorStore';
import type { ElementType } from '@/types/editor';

/* ---------- helpers ---------- */
function FileInput({
    id,
    onFile,
}: {
    id: string;
    onFile: (file: File) => void;
}) {
    return (
        <input
            type="file"
            accept="image/*"
            onChange={(e) => {
                const f = e.target.files?.[0];
                if (f && f.size <= 1_048_576) onFile(f);
            }}
            className="file:px-3 file:py-1 file:rounded-md file:border-0
                 file:bg-pdf-500 file:text-white
                 hover:file:bg-pdf-700 cursor-pointer text-xs"
            id={`file-${id}`}
            name={`file-${id}`}
        />
    );
}

/* ---------- panel principal ---------- */
export default function PropertiesPanel() {
    const id = useEditorStore((s) => s.selectedElementId);
    const element = useEditorStore((s) =>
        s.elements.find((el) => el.id === id)
    );
    const update = useEditorStore((s) => s.updateElement);

    /* contenedor exterior YA EXISTE en tu sidebar, así que
       devolvemos solo el contenido interno  */
    if (!element)
        return <p className="text-xs text-gray-400">Seleccione un bloque.</p>;

    return (
        <div className="bg-white shadow rounded-lg p-4 space-y-4">
            {/* header & text */}
            {(element.type === 'header' || element.type === 'text') && (
                <div className="space-y-2">
                    <label className="text-xs text-gray-600 font-medium" htmlFor="txt">
                        Contenido
                    </label>
                    <textarea
                        id="txt"
                        rows={4}
                        value={element.content ?? ''}
                        onChange={(e) =>
                            update(element.id, { content: e.target.value })
                        }
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-pdf-300"
                    />
                </div>
            )}

            {/* image */}
            {element.type === 'image' && (
                <div className="space-y-3">
                    {/* archivo */}
                    <div className="space-y-1">
                        <label className="text-xs text-gray-600 font-medium" htmlFor={`file-${element.id}`}>
                            Subir imagen
                        </label>
                        <FileInput
                            id={element.id}
                            onFile={(file) =>
                                update(element.id, { src: URL.createObjectURL(file) })
                            }
                        />
                        {element.src && (
                            <p className="text-[11px] text-gray-500 truncate">
                                {element.src.startsWith('blob:')
                                    ? 'archivo local'
                                    : element.src}
                            </p>
                        )}
                    </div>

                    {/* url */}
                    <div className="space-y-1">
                        <label className="text-xs text-gray-600 font-medium" htmlFor="url">
                            URL de imagen
                        </label>
                        <input
                            id="url"
                            type="url"
                            placeholder="https://…"
                            value={
                                element.src?.startsWith('blob:') ? '' : element.src ?? ''
                            }
                            onChange={(e) =>
                                update(element.id, { src: e.target.value })
                            }
                            className="w-full rounded-md border border-gray-300
                         px-3 py-2 text-sm bg-gray-50 focus:bg-white
                         focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
