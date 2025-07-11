'use client';
import { useRef, useState } from 'react';
import { useEditorStore } from '@/store/useEditorStore';

export default function ImageBlock({ id, src }: { id: string; src?: string }) {
    const update = useEditorStore((s) => s.updateElement);
    const fileRef = useRef<HTMLInputElement>(null);
    const [disabled, setDisabled] = useState(true);   // ← desactivado por defecto

    const openDialog = () => {
        /* habilitamos eventos SOLO para este click */
        setDisabled(false);
        // brief timeout: el click pasa → después volvemos a desactivar
        setTimeout(() => fileRef.current?.click(), 0);
    };

    const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setDisabled(true);                               // ← volver a bloquear
        if (!file) return;
        if (file.size > 1024 * 1024) {
            alert('La imagen no puede superar 1 MB');
            e.target.value = '';
            return;
        }
        update(id, { src: URL.createObjectURL(file) });
    };

    return (
        <div
            className="w-full h-full flex items-center justify-center relative overflow-hidden cursor-pointer"
            onDoubleClick={openDialog}                     /* doble clic para subir   */
        >
            {src ? (
                <img src={src} alt="" className="max-w-full max-h-full object-contain" />
            ) : (
                <span className="text-xs select-none">Doble-clic para subir</span>
            )}

            <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleSelect}
                className="no-drag absolute inset-0 opacity-0"
                style={{ pointerEvents: disabled ? 'none' : 'auto' }}
            />
        </div>
    );
}
