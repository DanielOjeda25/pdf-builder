'use client';
import { useEditorStore } from '@/store/useEditorStore';
import { useRef } from 'react';
import { FaBold, FaItalic, FaUnderline, FaAlignLeft, FaAlignCenter, FaAlignRight, FaAlignJustify } from 'react-icons/fa';

const FONT_FAMILIES = [
    { label: 'Arial', value: 'Arial, sans-serif' },
    { label: 'Times', value: 'Times New Roman, serif' },
    { label: 'Courier', value: 'Courier New, monospace' },
    { label: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
    { label: 'Georgia', value: 'Georgia, serif' },
    { label: 'Monospace', value: 'monospace' },
];

export default function PropertiesPanel() {
    const id = useEditorStore((s) => s.selectedElementId);
    const element = useEditorStore((s) => s.elements.find((el) => el.id === id));
    const update = useEditorStore((s) => s.updateElement);
    const editorRef = useRef<HTMLDivElement>(null);

    const handleBlur = () => {
        if (editorRef.current && element && editorRef.current.innerHTML !== element.content) {
            update(element.id, { content: editorRef.current.innerHTML });
        }
    };

    // Función mejorada para aplicar formato usando el backend
    async function applyFormat(action: string, extra?: string) {
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

        // Obtener estilos actuales del contenido HTML
        const currentStyles = getCurrentStylesFromHTML();

        const body: Record<string, unknown> = {
            text,
            action,
            range,
            // Incluir todos los estilos actuales para preservarlos
            fontSize: currentStyles.fontSize,
            fontFamily: currentStyles.fontFamily,
            color: currentStyles.color,
            align: currentStyles.align,
            bold: currentStyles.bold,
            italic: currentStyles.italic,
            underline: currentStyles.underline
        };

        // Actualizar solo el estilo específico que se está cambiando
        if (action === 'color' && extra) body.color = extra;
        if (action === 'fontSize' && extra) body.fontSize = extra;
        if (action === 'fontFamily' && extra) body.fontFamily = extra;
        if (action === 'align' && extra) body.align = extra;
        if (action === 'bold') body.bold = !currentStyles.bold;
        if (action === 'italic') body.italic = !currentStyles.italic;
        if (action === 'underline') body.underline = !currentStyles.underline;

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

    // Función mejorada para obtener los estilos actuales del contenido HTML
    function getCurrentStylesFromHTML() {
        const styles = {
            fontSize: '16',
            fontFamily: FONT_FAMILIES[0].value,
            color: '#000000',
            align: 'left',
            bold: false,
            italic: false,
            underline: false
        };

        if (!editorRef.current) return styles;

        const contentDiv = editorRef.current;

        // Buscar elementos con estilos aplicados
        const styledElements = contentDiv.querySelectorAll('[style]');

        if (styledElements.length > 0) {
            // Tomar el último elemento con estilos
            const lastStyledElement = styledElements[styledElements.length - 1] as HTMLElement;
            const elementStyle = window.getComputedStyle(lastStyledElement);

            // Leer color
            const color = elementStyle.color;
            if (color && color !== 'rgb(0, 0, 0)' && color !== 'rgba(0, 0, 0, 1)') {
                styles.color = color;
            }

            // Leer tamaño de fuente
            const fontSize = elementStyle.fontSize;
            if (fontSize && fontSize !== '16px') {
                styles.fontSize = fontSize.replace('px', '');
            }

            // Leer familia de fuente
            const fontFamily = elementStyle.fontFamily;
            if (fontFamily && fontFamily !== 'inherit') {
                styles.fontFamily = fontFamily;
            }

            // Leer alineación
            const textAlign = elementStyle.textAlign;
            if (textAlign && textAlign !== 'start' && textAlign !== 'left') {
                styles.align = textAlign;
            }

            // Leer formatos
            const fontWeight = elementStyle.fontWeight;
            if (fontWeight && (fontWeight === 'bold' || parseInt(fontWeight) >= 700)) {
                styles.bold = true;
            }

            const fontStyle = elementStyle.fontStyle;
            if (fontStyle && fontStyle === 'italic') {
                styles.italic = true;
            }

            const textDecoration = elementStyle.textDecoration;
            if (textDecoration && textDecoration.includes('underline')) {
                styles.underline = true;
            }
        }

        // También buscar elementos específicos con formatos
        const boldElements = contentDiv.querySelectorAll('b, strong, [style*="font-weight: bold"]');
        if (boldElements.length > 0) {
            styles.bold = true;
        }

        const italicElements = contentDiv.querySelectorAll('i, em, [style*="font-style: italic"]');
        if (italicElements.length > 0) {
            styles.italic = true;
        }

        const underlineElements = contentDiv.querySelectorAll('u, [style*="text-decoration: underline"]');
        if (underlineElements.length > 0) {
            styles.underline = true;
        }

        // Buscar elementos con alineación específica
        const centerElements = contentDiv.querySelectorAll('[style*="text-align: center"]');
        const rightElements = contentDiv.querySelectorAll('[style*="text-align: right"]');
        const justifyElements = contentDiv.querySelectorAll('[style*="text-align: justify"]');

        if (centerElements.length > 0) {
            styles.align = 'center';
        } else if (rightElements.length > 0) {
            styles.align = 'right';
        } else if (justifyElements.length > 0) {
            styles.align = 'justify';
        }

        // Si no se encontraron estilos en el HTML, usar los valores de los controles como respaldo
        if (styles.color === '#000000') {
            const colorInput = document.querySelector('input[type="color"][title="Color de texto"]') as HTMLInputElement;
            if (colorInput && colorInput.value) styles.color = colorInput.value;
        }

        if (styles.fontSize === '16') {
            const sizeInput = document.querySelector('input[type="number"][title="Tamaño de fuente"]') as HTMLInputElement;
            if (sizeInput && sizeInput.value) styles.fontSize = sizeInput.value;
        }

        if (styles.fontFamily === FONT_FAMILIES[0].value) {
            const fontSelect = document.querySelector('select[title="Tipo de letra"]') as HTMLSelectElement;
            if (fontSelect && fontSelect.value) styles.fontFamily = fontSelect.value;
        }

        return styles;
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
                        {/* Formato */}
                        <button type="button" onMouseDown={e => { e.preventDefault(); applyFormat('bold'); }} className="text-gray-500 hover:text-pdf-500" title="Negrita"><FaBold /></button>
                        <button type="button" onMouseDown={e => { e.preventDefault(); applyFormat('italic'); }} className="text-gray-500 hover:text-pdf-500" title="Cursiva"><FaItalic /></button>
                        <button type="button" onMouseDown={e => { e.preventDefault(); applyFormat('underline'); }} className="text-gray-500 hover:text-pdf-500" title="Subrayado"><FaUnderline /></button>
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
                        {/* Alineación */}
                        <div className="flex gap-1 ml-2">
                            <button type="button" onMouseDown={e => { e.preventDefault(); applyFormat('align', 'left'); }} title="Alinear a la izquierda"><FaAlignLeft /></button>
                            <button type="button" onMouseDown={e => { e.preventDefault(); applyFormat('align', 'center'); }} title="Centrar"><FaAlignCenter /></button>
                            <button type="button" onMouseDown={e => { e.preventDefault(); applyFormat('align', 'right'); }} title="Alinear a la derecha"><FaAlignRight /></button>
                            <button type="button" onMouseDown={e => { e.preventDefault(); applyFormat('align', 'justify'); }} title="Justificar"><FaAlignJustify /></button>
                        </div>
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
