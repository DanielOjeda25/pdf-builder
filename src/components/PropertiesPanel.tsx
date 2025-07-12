'use client';
import { useEditorStore } from '@/store/useEditorStore';
import { useState, useEffect, useRef } from 'react';
// Elimina todo lo de Slate y deja solo el panel base

const FONT_FAMILIES = [
    { label: 'Arial', value: 'Arial, sans-serif' },
    { label: 'Times', value: 'Times New Roman, serif' },
    { label: 'Courier', value: 'Courier New, monospace' },
    { label: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
    { label: 'Georgia', value: 'Georgia, serif' },
    { label: 'Monospace', value: 'monospace' },
];
const BLOCK_TYPES = [
    { label: 'Párrafo', value: 'p' },
    { label: 'Título 1', value: 'h1' },
    { label: 'Título 2', value: 'h2' },
    { label: 'Cita', value: 'blockquote' },
];

export default function PropertiesPanel() {
    const id = useEditorStore((s) => s.selectedElementId);
    const element = useEditorStore((s) => s.elements.find((el) => el.id === id));
    const update = useEditorStore((s) => s.updateElement);
    const editorRef = useRef<HTMLDivElement>(null);

    // Elimina el estado local y el useEffect relacionados con el contenido

    const handleBlur = () => {
        if (editorRef.current && element && editorRef.current.innerHTML !== element.content) {
            update(element.id, { content: editorRef.current.innerHTML });
        }
    };

    // Nueva función para aplicar formato usando el backend
    async function applyFormat(action: string, extra?: any) {
        if (!editorRef.current || !element) return;
        const selection = window.getSelection();
        const text = editorRef.current.innerText;
        let range: [number, number] = [0, 0];
        if (selection && selection.rangeCount > 0 && selection.toString().length > 0) {
            const selRange = selection.getRangeAt(0);
            const preSelectionRange = selRange.cloneRange();
            preSelectionRange.selectNodeContents(editorRef.current);
            preSelectionRange.setEnd(selRange.startContainer, selRange.startOffset);
            const start = preSelectionRange.toString().length;
            const end = start + selRange.toString().length;
            range = [start, end];
        }
        // Si no hay selección, aplica a todo el texto (rango [0,0])
        const body: any = { text, action, range };
        if (action === 'color' && extra) body.color = extra;
        if (action === 'fontSize' && extra) body.fontSize = extra;
        if (action === 'fontFamily' && extra) body.fontFamily = extra;
        // Si hay fontSize seleccionado, incluirlo al cambiar fontFamily y viceversa
        if ((action === 'fontFamily' || action === 'fontSize')) {
            const sizeInput = document.querySelector('input[type="number"][title="Tamaño de fuente"]') as HTMLInputElement;
            if (sizeInput && sizeInput.value) body.fontSize = sizeInput.value;
            const fontSelect = document.querySelector('select[title="Tipo de letra"]') as HTMLSelectElement;
            if (fontSelect && fontSelect.value) body.fontFamily = fontSelect.value;
        }
        const res = await fetch('/api/format-text', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await res.json();
        if (data.html) {
            editorRef.current.innerHTML = data.html;
            update(element.id, { content: data.html });
        }
    }

    // Comandos de formato mejorados
    const exec = (command: string, value?: string) => {
        const selection = window.getSelection();
        const isCollapsed = selection ? selection.isCollapsed : true;
        if (isCollapsed && editorRef.current) {
            // Si no hay selección, aplica el formato a todo el contenido
            editorRef.current.focus();
            // Selecciona todo el contenido
            const range = document.createRange();
            range.selectNodeContents(editorRef.current);
            selection?.removeAllRanges();
            selection?.addRange(range);
            document.execCommand(command, false, value);
            // Quita la selección
            selection?.removeAllRanges();
        } else {
            document.execCommand(command, false, value);
        }
        // No actualices el store aquí, solo en onBlur
    };

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
                    {/* Barra de herramientas WYSIWYG */}
                    <div className="flex flex-wrap gap-3 mb-2 items-center p-2 bg-gray-50 rounded-lg border border-gray-200">
                        {/* Tipo de bloque */}
                        <select
                            className="border rounded px-2 py-1 text-xs font-medium bg-white focus:ring-2 focus:ring-pdf-300"
                            defaultValue="p"
                            onChange={e => exec('formatBlock', e.target.value)}
                            style={{ minWidth: 90 }}
                            title="Tipo de texto"
                        >
                            {BLOCK_TYPES.map(b => (
                                <option key={b.value} value={b.value}>{b.label}</option>
                            ))}
                        </select>
                        {/* Formato */}
                        <button type="button" onMouseDown={e => { e.preventDefault(); applyFormat('bold'); }} className="font-bold text-gray-500 hover:text-pdf-500" title="Negrita">B</button>
                        <button type="button" onMouseDown={e => { e.preventDefault(); applyFormat('italic'); }} className="italic text-gray-500 hover:text-pdf-500" title="Cursiva">I</button>
                        <button type="button" onMouseDown={e => { e.preventDefault(); applyFormat('underline'); }} className="underline text-gray-500 hover:text-pdf-500" title="Subrayado">U</button>
                        {/* Color */}
                        <input
                            type="color"
                            onChange={e => applyFormat('color', e.target.value)}
                            className="w-7 h-7 p-0 border-0 bg-transparent cursor-pointer"
                            title="Color de texto"
                            aria-label="Color de texto"
                            style={{ minWidth: 28, minHeight: 28 }}
                        />
                        {/* Tamaño de fuente */}
                        <div className="flex items-center gap-1 ml-2">
                            <input
                                type="number"
                                min={8}
                                max={96}
                                defaultValue={16}
                                onChange={e => applyFormat('fontSize', e.target.value)}
                                className="w-14 border border-gray-300 rounded px-2 py-1 text-xs focus:ring-2 focus:ring-pdf-300 focus:border-pdf-500 transition"
                                style={{ height: 28 }}
                                title="Tamaño de fuente"
                                aria-label="Tamaño de fuente"
                            />
                            <span className="text-xs text-gray-500">px</span>
                        </div>
                        {/* Fuente */}
                        <select
                            className="border rounded px-2 py-1 text-xs ml-2 bg-white focus:ring-2 focus:ring-pdf-300"
                            defaultValue={FONT_FAMILIES[0].value}
                            onChange={e => applyFormat('fontFamily', e.target.value)}
                            style={{ minWidth: 90, height: 28 }}
                            title="Tipo de letra"
                        >
                            {FONT_FAMILIES.map(f => (
                                <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>{f.label}</option>
                            ))}
                        </select>
                    </div>
                    {/* Área editable */}
                    <div
                        ref={editorRef}
                        className="w-full min-h-32 p-3 bg-white rounded outline-none resize-none text-base border border-gray-300 focus:ring-2 focus:ring-pdf-300"
                        contentEditable
                        suppressContentEditableWarning
                        spellCheck
                        onBlur={handleBlur}
                        style={{ fontFamily: 'inherit', fontSize: 16 }}
                        dangerouslySetInnerHTML={{ __html: element.content || '' }}
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
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f && f.size <= 1_048_576) update(element.id, { src: URL.createObjectURL(f) });
                            }}
                            className="file:px-3 file:py-1 file:rounded-md file:border-0 file:bg-pdf-500 file:text-white hover:file:bg-pdf-700 cursor-pointer text-xs"
                            id={`file-${element.id}`}
                            name={`file-${element.id}`}
                        />
                        {element.src && (
                            <p className="text-[11px] text-gray-500 truncate">
                                {element.src.startsWith('blob:') ? 'archivo local' : element.src}
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
                            value={element.src?.startsWith('blob:') ? '' : element.src ?? ''}
                            onChange={(e) => update(element.id, { src: e.target.value })}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
