import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { text, action, range, color, fontSize, fontFamily } = await req.json();

  if (typeof text !== 'string' || !action || !range || !Array.isArray(range) || range.length !== 2) {
    return NextResponse.json({ error: 'Parámetros inválidos' }, { status: 400 });
  }

  let html = text;
  let [start, end] = range;
  if (start === 0 && end === 0) {
    start = 0;
    end = text.length;
  }

  if (action === 'bold') {
    html = text.slice(0, start) + '<b>' + text.slice(start, end) + '</b>' + text.slice(end);
  } else if (action === 'italic') {
    html = text.slice(0, start) + '<i>' + text.slice(start, end) + '</i>' + text.slice(end);
  } else if (action === 'underline') {
    html = text.slice(0, start) + '<u>' + text.slice(start, end) + '</u>' + text.slice(end);
  } else if (action === 'color' && color) {
    html = text.slice(0, start) + `<span style="color:${color}">` + text.slice(start, end) + '</span>' + text.slice(end);
  } else if (action === 'fontSize' && fontSize) {
    let style = `font-size:${fontSize}px`;
    if (fontFamily) style += `;font-family:${fontFamily}`;
    html = text.slice(0, start) + `<span style="${style}">` + text.slice(start, end) + '</span>' + text.slice(end);
  } else if (action === 'fontFamily' && fontFamily) {
    let style = `font-family:${fontFamily}`;
    if (fontSize) style += `;font-size:${fontSize}px`;
    html = text.slice(0, start) + `<span style="${style}">` + text.slice(start, end) + '</span>' + text.slice(end);
  }

  return NextResponse.json({ html });
} 