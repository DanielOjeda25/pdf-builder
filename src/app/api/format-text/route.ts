import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { text, action, range, color, fontSize, fontFamily, align, bold, italic, underline } = await req.json();

  if (typeof text !== 'string' || !action || !range || !Array.isArray(range) || range.length !== 2) {
    return NextResponse.json({ error: 'Parámetros inválidos' }, { status: 400 });
  }

  let html = text;
  let [start, end] = range;
  if (start === 0 && end === 0) {
    start = 0;
    end = text.length;
  }

  switch (action) {
    case 'bold':
      // Para bold, preservar color y alineación existentes
      if (align && align !== 'left') {
        // Si hay alineación, usar div para preservarla
        let style = `text-align:${align};font-weight:bold;`;
        if (color) style += `color:${color};`;
        if (fontSize) style += `font-size:${fontSize}px;`;
        if (fontFamily) style += `font-family:${fontFamily};`;
        if (italic) style += 'font-style:italic;';
        if (underline) style += 'text-decoration:underline;';
        html = text.slice(0, start) + `<div style="${style}">` + text.slice(start, end) + '</div>' + text.slice(end);
      } else {
        // Si no hay alineación especial, usar span
        let style = 'font-weight:bold;';
        if (color) style += `color:${color};`;
        if (fontSize) style += `font-size:${fontSize}px;`;
        if (fontFamily) style += `font-family:${fontFamily};`;
        if (italic) style += 'font-style:italic;';
        if (underline) style += 'text-decoration:underline;';
        html = text.slice(0, start) + `<span style="${style}">` + text.slice(start, end) + '</span>' + text.slice(end);
      }
      break;
    case 'italic':
      // Para italic, preservar color y alineación existentes
      if (align && align !== 'left') {
        // Si hay alineación, usar div para preservarla
        let style = `text-align:${align};font-style:italic;`;
        if (color) style += `color:${color};`;
        if (fontSize) style += `font-size:${fontSize}px;`;
        if (fontFamily) style += `font-family:${fontFamily};`;
        if (bold) style += 'font-weight:bold;';
        if (underline) style += 'text-decoration:underline;';
        html = text.slice(0, start) + `<div style="${style}">` + text.slice(start, end) + '</div>' + text.slice(end);
      } else {
        // Si no hay alineación especial, usar span
        let style = 'font-style:italic;';
        if (color) style += `color:${color};`;
        if (fontSize) style += `font-size:${fontSize}px;`;
        if (fontFamily) style += `font-family:${fontFamily};`;
        if (bold) style += 'font-weight:bold;';
        if (underline) style += 'text-decoration:underline;';
        html = text.slice(0, start) + `<span style="${style}">` + text.slice(start, end) + '</span>' + text.slice(end);
      }
      break;
    case 'underline':
      // Para underline, preservar color y alineación existentes
      if (align && align !== 'left') {
        // Si hay alineación, usar div para preservarla
        let style = `text-align:${align};text-decoration:underline;`;
        if (color) style += `color:${color};`;
        if (fontSize) style += `font-size:${fontSize}px;`;
        if (fontFamily) style += `font-family:${fontFamily};`;
        if (bold) style += 'font-weight:bold;';
        if (italic) style += 'font-style:italic;';
        html = text.slice(0, start) + `<div style="${style}">` + text.slice(start, end) + '</div>' + text.slice(end);
      } else {
        // Si no hay alineación especial, usar span
        let style = 'text-decoration:underline;';
        if (color) style += `color:${color};`;
        if (fontSize) style += `font-size:${fontSize}px;`;
        if (fontFamily) style += `font-family:${fontFamily};`;
        if (bold) style += 'font-weight:bold;';
        if (italic) style += 'font-style:italic;';
        html = text.slice(0, start) + `<span style="${style}">` + text.slice(start, end) + '</span>' + text.slice(end);
      }
      break;
    case 'color':
      // Para color, preservar la alineación existente si está presente
      if (color) {
        if (align && align !== 'left') {
          // Si hay alineación, usar div para preservarla
          let style = `text-align:${align};color:${color};`;
          if (fontSize) style += `font-size:${fontSize}px;`;
          if (fontFamily) style += `font-family:${fontFamily};`;
          if (bold) style += 'font-weight:bold;';
          if (italic) style += 'font-style:italic;';
          if (underline) style += 'text-decoration:underline;';
          html = text.slice(0, start) + `<div style="${style}">` + text.slice(start, end) + '</div>' + text.slice(end);
        } else {
          // Si no hay alineación especial, usar span
          let style = `color:${color};`;
          if (fontSize) style += `font-size:${fontSize}px;`;
          if (fontFamily) style += `font-family:${fontFamily};`;
          if (bold) style += 'font-weight:bold;';
          if (italic) style += 'font-style:italic;';
          if (underline) style += 'text-decoration:underline;';
          html = text.slice(0, start) + `<span style="${style}">` + text.slice(start, end) + '</span>' + text.slice(end);
        }
      }
      break;
    case 'fontSize':
      // Para tamaño de fuente, preservar la alineación existente si está presente
      if (fontSize) {
        if (align && align !== 'left') {
          // Si hay alineación, usar div para preservarla
          let style = `text-align:${align};font-size:${fontSize}px;`;
          if (color) style += `color:${color};`;
          if (fontFamily) style += `font-family:${fontFamily};`;
          if (bold) style += 'font-weight:bold;';
          if (italic) style += 'font-style:italic;';
          if (underline) style += 'text-decoration:underline;';
          html = text.slice(0, start) + `<div style="${style}">` + text.slice(start, end) + '</div>' + text.slice(end);
        } else {
          // Si no hay alineación especial, usar span
          let style = `font-size:${fontSize}px;`;
          if (color) style += `color:${color};`;
          if (fontFamily) style += `font-family:${fontFamily};`;
          if (bold) style += 'font-weight:bold;';
          if (italic) style += 'font-style:italic;';
          if (underline) style += 'text-decoration:underline;';
          html = text.slice(0, start) + `<span style="${style}">` + text.slice(start, end) + '</span>' + text.slice(end);
        }
      }
      break;
    case 'fontFamily':
      // Para familia de fuente, preservar la alineación existente si está presente
      if (fontFamily) {
        if (align && align !== 'left') {
          // Si hay alineación, usar div para preservarla
          let style = `text-align:${align};font-family:${fontFamily};`;
          if (color) style += `color:${color};`;
          if (fontSize) style += `font-size:${fontSize}px;`;
          if (bold) style += 'font-weight:bold;';
          if (italic) style += 'font-style:italic;';
          if (underline) style += 'text-decoration:underline;';
          html = text.slice(0, start) + `<div style="${style}">` + text.slice(start, end) + '</div>' + text.slice(end);
        } else {
          // Si no hay alineación especial, usar span
          let style = `font-family:${fontFamily};`;
          if (color) style += `color:${color};`;
          if (fontSize) style += `font-size:${fontSize}px;`;
          if (bold) style += 'font-weight:bold;';
          if (italic) style += 'font-style:italic;';
          if (underline) style += 'text-decoration:underline;';
          html = text.slice(0, start) + `<span style="${style}">` + text.slice(start, end) + '</span>' + text.slice(end);
        }
      }
      break;
    case 'align':
      // Para alineación, usar div que puede contener todo el contenido
      if (align) {
        // Construir estilos completos para el div de alineación
        let style = `text-align:${align};`;
        if (fontSize) style += `font-size:${fontSize}px;`;
        if (fontFamily) style += `font-family:${fontFamily};`;
        if (color) style += `color:${color};`;
        if (bold) style += 'font-weight:bold;';
        if (italic) style += 'font-style:italic;';
        if (underline) style += 'text-decoration:underline;';
        
        html = text.slice(0, start) + `<div style="${style}">` + text.slice(start, end) + '</div>' + text.slice(end);
      }
      break;
    default:
      break;
  }

  return NextResponse.json({ html });
} 