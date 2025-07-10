import {
    PDFDocument,
    rgb,
    StandardFonts,
} from 'pdf-lib';
import fetch from 'node-fetch';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';

export async function generatePdf(elements: any[]) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    let y = height - 40;

    for (const el of elements) {
        switch (el.type) {
            case 'header':
                page.drawText(el.content || '', {
                    x: 40,
                    y,
                    size: 24,
                    font,
                    color: rgbHex(el.style?.color || '#000'),
                });
                y -= 34;
                break;

            case 'text':
                page.drawText(el.content || '', {
                    x: 40,
                    y,
                    size: 12,
                    font,
                    color: rgbHex(el.style?.color || '#000'),
                });
                y -= 18;
                break;

            case 'image':
                if (!el.content) break;
                const imgBytes = await fetch(el.content).then((r) => r.arrayBuffer());
                const img = await pdfDoc.embedPng(imgBytes);
                const dims = img.scaleToFit(width - 80, 300);
                page.drawImage(img, { x: 40, y: y - dims.height, ...dims });
                y -= dims.height + 20;
                break;

            case 'table':
                y = drawTable(page, font, el.data, y);
                break;

            case 'chart':
                y = await drawChart(page, pdfDoc, el.data, y, width);
                break;
        }
    }

    return pdfDoc.save();
}

// Helpers -------------------------------------------------------------------
const rgbHex = (hex: string) => {
    const n = parseInt(hex.replace('#', ''), 16);
    return rgb(
        ((n >> 16) & 255) / 255,
        ((n >> 8) & 255) / 255,
        (n & 255) / 255
    );
};

function drawTable(page: any, font: any, data: string[][], y: number) {
    if (!data) return y;
    const cellH = 18;
    data.forEach((row) => {
        let x = 40;
        row.forEach((cell) => {
            page.drawText(cell, { x: x + 4, y: y - 14, size: 10, font });
            page.drawRectangle({
                x,
                y: y - cellH,
                width: 120,
                height: cellH,
                borderWidth: 0.5,
                borderColor: rgb(0.8, 0.8, 0.8),
            });
            x += 120;
        });
        y -= cellH;
    });
    return y - 20;
}

async function drawChart(page: any, pdfDoc: any, data: any, y: number, width: number) {
    const chartCanvas = new ChartJSNodeCanvas({ width: 600, height: 300 });
    const cfg = buildChartConfig(data);
    const buffer = await chartCanvas.renderToBuffer(cfg);
    const img = await pdfDoc.embedPng(buffer);
    const dims = img.scaleToFit(width - 80, 300);
    page.drawImage(img, { x: 40, y: y - dims.height, ...dims });
    return y - dims.height - 20;
}

function buildChartConfig({ labels, datasets }: any) {
    return {
        type: 'bar',
        data: { labels, datasets },
        options: { plugins: { legend: { display: false } } },
    };
}
