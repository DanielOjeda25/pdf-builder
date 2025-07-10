import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export async function POST(req: NextRequest) {
    const { elements } = await req.json();

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    let y = height - 40;          // margen superior

    elements.forEach((el: any) => {
        switch (el.type) {
            case 'header':
                page.drawText(el.content || '', {
                    x: 40,
                    y,
                    size: 20,
                    font,
                    color: rgb(0, 0, 0),
                });
                y -= 30;
                break;

            case 'text':
                page.drawText(el.content || '', {
                    x: 40,
                    y,
                    size: 12,
                    font,
                    color: rgb(0, 0, 0),
                });
                y -= 20;
                break;

            // imágenes, tablas y gráficos llegarán en la siguiente fase
        }
    });

    const pdfBytes = await pdfDoc.save();
    return new NextResponse(pdfBytes, {
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=custom.pdf',
        },
    });
}
