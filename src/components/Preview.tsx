// /components/Preview.tsx
'use client';
import { useEditorStore } from '@/store/useEditorStore';
export default function Preview() {
    const elements = useEditorStore((s) => s.elements);

    return (
        <div className="bg-gray-200 p-4 flex justify-center">
            <div
                className="bg-white shadow-md px-10 py-8"
                style={{ width: '210mm', minHeight: '297mm' }}
            >
                {elements.map((el) => {
                    if (el.type === 'header')
                        return <h1 style={el.style}>{el.content}</h1>;
                    if (el.type === 'text')
                        return <p style={el.style}>{el.content}</p>;
                    if (el.type === 'image')
                        return (
                            <img src={el.content} style={{ maxWidth: '100%' }} />
                        );
                    // tablas y gráficos llegarán luego
                })}
            </div>
        </div>
    );
}
