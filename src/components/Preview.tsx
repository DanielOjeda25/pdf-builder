// /components/Preview.tsx
'use client';
import { useEditorStore } from '@/store/useEditorStore';
import Image from 'next/image';
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
                        return <h1>{el.content}</h1>;
                    if (el.type === 'text')
                        return <p>{el.content}</p>;
                    if (el.type === 'image') {
                        // Si es una URL pública/remota
                        if (typeof el.content === 'string' && (el.content.startsWith('http://') || el.content.startsWith('https://')))
                            return (
                                <Image src={el.content} alt={el.content} width={400} height={300} style={{ maxWidth: '100%', height: 'auto' }} />
                            );
                        // Si es un blob/data URL
                        return (
                            <img
                                src={el.content}
                                alt="Imagen subida por el usuario"
                                style={{ maxWidth: '100%' }}
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    const errorMsg = document.createElement('div');
                                    errorMsg.textContent = 'No se pudo cargar la imagen.';
                                    errorMsg.className = 'text-red-500 text-sm mt-2';
                                    target.parentNode?.appendChild(errorMsg);
                                }}
                            />
                        );
                    }
                })}
            </div>
        </div>
    );
}
