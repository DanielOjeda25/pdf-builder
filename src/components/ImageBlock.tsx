'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useEditorStore } from '@/store/useEditorStore';
import Image from 'next/image';

const MAX_SIZE = 1_048_576; // 1 MB

interface Props {
    id: string;
    src: string | null | undefined;
}

// Loader para blobs/data URLs
const customLoader = ({ src }: { src: string }) => src;

export default function ImageBlock({ id, src }: Props) {
    const update = useEditorStore((s) => s.updateElement);

    /* ——— callback de carga ——— */
    const onDrop = useCallback(
        (accepted: File[]) => {
            if (accepted[0]) {
                const url = URL.createObjectURL(accepted[0]);
                update(id, { src: url });
            }
        },
        [id, update],
    );

    /* ——— configuración de dropzone ——— */
    const {
        getRootProps,
        getInputProps,
        isDragActive,
        fileRejections,
    } = useDropzone({
        accept: { 'image/*': [] },
        maxSize: MAX_SIZE,
        multiple: false,
        onDrop,
    });

    const tooLarge =
        fileRejections.length > 0 &&
        fileRejections[0].errors.some((e) => e.code === 'file-too-large');

    /* ——— UI ——— */
    return (
        <div
            {...getRootProps()}
            className={`w-full h-full flex items-center justify-center rounded-md
                  transition-colors text-center px-2
                  ${isDragActive ? 'bg-blue-500/20' : ''}
                  ${tooLarge ? 'bg-red-500/20' : ''}`}
        >
            {/* aquí pasamos los atributos extra al input */}
            <input
                {...getInputProps({
                    capture: 'environment',          // cámara trasera en móviles
                    name: `upload-${id}`,
                    id: `upload-${id}`,
                })}
            />

            {src ? (
                typeof src === 'string' && (src.startsWith('http://') || src.startsWith('https://')) ? (
                    <Image
                        src={src}
                        alt="preview"
                        width={400}
                        height={300}
                        className="max-w-full max-h-full object-contain pointer-events-none"
                        draggable={false}
                    />
                ) : (
                    <Image
                        src={src as string}
                        alt="preview"
                        width={400}
                        height={300}
                        className="max-w-full max-h-full object-contain pointer-events-none"
                        draggable={false}
                        loader={customLoader}
                        unoptimized
                    />
                )
            ) : (
                <span className="text-xs text-white whitespace-pre-line select-none">
                    {tooLarge
                        ? 'Imagen > 1 MB'
                        : isDragActive
                            ? 'Suelta para subir'
                            : 'Toca o arrastra\naquí para subir'}
                </span>
            )}
        </div>
    );
}
