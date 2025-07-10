'use client';

import PaletteItem from './PaletteItem';

export default function Palette() {
    const items = ['header', 'text', 'image', 'table', 'chart'] as const;

    return (
        <nav className="p-4">
            {items.map((t) => (
                <PaletteItem key={t} type={t} />
            ))}
        </nav>
    );
}
