'use client';

import PaletteItem from './PaletteItem';

export default function Palette() {
    // Tipos disponibles en la barra
    const items = ['header', 'text', 'image', 'table', 'chart'] as const;

    return (
        <nav>
            {items.map((t) => (
                <PaletteItem key={t} type={t} />
            ))}
        </nav>
    );
}
