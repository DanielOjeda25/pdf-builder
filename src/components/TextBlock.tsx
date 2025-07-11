'use client';
export default function TextBlock({
    content = '',
    asHeader = false,
}: {
    content?: string;
    asHeader?: boolean;
}) {
    return (
        <div
            className={
                'w-full h-full flex items-center justify-center overflow-hidden font-sans ' +
                (asHeader ? 'text-lg font-bold' : 'text-sm')
            }
        >
            {content || (asHeader ? 'Encabezado' : 'Texto')}
        </div>
    );
}
