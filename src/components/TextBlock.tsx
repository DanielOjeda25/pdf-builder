// src/components/TextBlock.tsx
'use client';
import { useEditorStore } from '@/store/useEditorStore';

export default function TextBlock({ id, content }: { id: string; content: string }) {
    const update = useEditorStore((s) => s.updateElement);
    return (
        <textarea
            value={content}
            onChange={(e) => update(id, { content: e.target.value })}
            className="w-full h-full resize-none bg-transparent outline-none
                 text-sm text-white placeholder-white"
            placeholder="Escribe aquí…"
        />
    );
}
