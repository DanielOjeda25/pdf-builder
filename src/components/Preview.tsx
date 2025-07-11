// /components/Preview.tsx
'use client';
import { useEditorStore } from '@/store/useEditorStore';
import Image from 'next/image';
export default function Preview() {
    const elements = useEditorStore((s) => s.elements);

    // Loader para blobs/data URLs
    const customLoader = ({ src }: { src: string }) => src;

    return (
        <div className="bg-gray-200 p-4 flex justify-center">
            <div
                className="bg-white shadow-md px-10 py-8"
                style={{ width: '210mm', minHeight: '297mm' }}
            >
                {elements.map((el) => {
                    if (el.type === 'header')
                        return <h1 key={el.id}>{el.content}</h1>;
                    if (el.type === 'text')
                        return <p key={el.id}>{el.content}</p>;
                    if (el.type === 'image') {
                        // Si es una URL pública/remota
                        if (typeof el.content === 'string' && (el.content.startsWith('http://') || el.content.startsWith('https://')))
                            return (
                                <Image key={el.id} src={el.content} alt={el.content} width={400} height={300} style={{ maxWidth: '100%', height: 'auto' }} />
                            );
                        // Si es un blob/data URL
                        return (
                            <Image
                                key={el.id}
                                src={el.content as string}
                                alt="Imagen subida por el usuario"
                                width={400}
                                height={300}
                                style={{ maxWidth: '100%' }}
                                loader={customLoader}
                                unoptimized
                            />
                        );
                    }
                })}
            </div>
        </div>
    );
}
