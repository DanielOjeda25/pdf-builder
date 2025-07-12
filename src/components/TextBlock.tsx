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
            <div
                className="w-full h-full prose prose-p:my-1 prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-strong:font-bold prose-em:italic prose-blockquote:border-l-4 prose-blockquote:pl-4 prose-blockquote:text-gray-500 prose-ul:list-disc prose-ol:list-decimal prose-li:ml-6 prose-li:my-1 prose-a:text-blue-600 prose-a:underline prose-img:max-w-full prose-img:h-auto"
                dangerouslySetInnerHTML={{ __html: content || (asHeader ? 'Encabezado' : 'Párrafo') }}
            />
        </div>
    );
}
