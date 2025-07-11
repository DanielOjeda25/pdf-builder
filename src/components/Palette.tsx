'use client';

import PaletteItem from './PaletteItem';
import type { BlockKind } from '@/types/editor';

const items: BlockKind[] = ['header', 'text', 'image', 'table', 'chart'];

export default function Palette() {
    return (
        <div
            className="
        grid grid-cols-2 gap-3        /* ← 2 columnas, se adaptan */
        justify-items-center
      "
        >
            {items.map((type) => (
                <PaletteItem key={type} type={type} />
            ))}
        </div>
    );
}
