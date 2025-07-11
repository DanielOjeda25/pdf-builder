'use client';
export default function TextBlock({
    content = '',
    asHeader = false,
    bold = false,
    italic = false,
    fontSize = 16,
    align = 'left',
}: {
    content?: string;
    asHeader?: boolean;
    bold?: boolean;
    italic?: boolean;
    fontSize?: number;
    align?: 'left' | 'center' | 'right' | 'justify';
}) {
    return (
        <div
            className={
                'w-full h-full flex flex-col justify-center overflow-hidden font-sans ' +
                (asHeader ? 'text-lg font-semibold' : 'text-sm')
            }
            style={{
                fontWeight: bold ? 'bold' : 'normal',
                fontStyle: italic ? 'italic' : 'normal',
                fontSize: fontSize,
                textAlign: align,
            }}
        >
            {content || (asHeader ? 'Encabezado' : 'Texto')}
        </div>
    );
}
