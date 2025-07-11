'use client';
import { useEditorStore } from '@/store/useEditorStore';
import { useState } from 'react';

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
    const element = useEditorStore((s) => s.elements.find((el) => el.id === id)) as import("@/types/editor").ElementType | undefined;
    const update = useEditorStore((s) => s.updateElement);

    // Opciones de formato (hooks siempre al inicio)
    const isText = element && (element.type === 'header' || element.type === 'text');
    const [localContent, setLocalContent] = useState(element?.content ?? '');
    const [bold, setBold] = useState(element?.bold ?? false);
    const [italic, setItalic] = useState(element?.italic ?? false);
    const [fontSize, setFontSize] = useState(element?.fontSize ?? 16);
    const [align, setAlign] = useState(element?.align ?? 'left');

    const handleFormatChange = <K extends keyof import("@/types/editor").ElementType>(prop: K, value: import("@/types/editor").ElementType[K]) => {
        if (!element) return;
        update(element.id, { [prop]: value });
    };

    /* contenedor exterior YA EXISTE en tu sidebar, así que
       devolvemos solo el contenido interno  */
    if (!element)
        return <p className="text-xs text-gray-400">Seleccione un bloque.</p>;

    return (
        <div className="bg-white shadow rounded-lg p-4 space-y-4">
            {/* header & text */}
            {isText && (
                <div className="space-y-2">
                    <label className="text-xs text-gray-600 font-medium" htmlFor="txt">
                        Contenido
                    </label>
                    <textarea
                        id="txt"
                        rows={4}
                        value={localContent}
                        onChange={(e) => {
                            setLocalContent(e.target.value);
                            update(element.id, { content: e.target.value });
                        }}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-pdf-300"
                    />
                    {/* Controles de formato */}
                    <div className="flex items-center gap-2 mt-2">
                        <button
                            type="button"
                            className={`px-2 py-1 rounded ${bold ? 'bg-pdf-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                            onClick={() => { setBold(!bold); handleFormatChange('bold', !bold); }}
                        >
                            <b>B</b>
                        </button>
                        <button
                            type="button"
                            className={`px-2 py-1 rounded ${italic ? 'bg-pdf-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                            onClick={() => { setItalic(!italic); handleFormatChange('italic', !italic); }}
                        >
                            <i>I</i>
                        </button>
                        <select
                            className="px-2 py-1 rounded border border-gray-300 bg-gray-50 text-sm"
                            value={fontSize}
                            onChange={e => { setFontSize(Number(e.target.value)); handleFormatChange('fontSize', Number(e.target.value)); }}
                        >
                            {[12, 14, 16, 18, 20, 24, 28, 32, 36].map(size => (
                                <option key={size} value={size}>{size}px</option>
                            ))}
                        </select>
                        <select
                            className="px-2 py-1 rounded border border-gray-300 bg-gray-50 text-sm"
                            value={align}
                            onChange={e => {
                                const value = e.target.value as 'left' | 'center' | 'right' | 'justify';
                                setAlign(value);
                                handleFormatChange('align', value);
                            }}
                        >
                            <option value="left">Izquierda</option>
                            <option value="center">Centro</option>
                            <option value="right">Derecha</option>
                            <option value="justify">Justificado</option>
                        </select>
                    </div>
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
