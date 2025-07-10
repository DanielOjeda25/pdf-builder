import type { Modifier } from '@dnd-kit/core';

/* Modifier para dnd-kit: alinea el desplazamiento
   a una rejilla (grid) del tamaño dado. */
export const snapToGrid =
    (sizeX = 24, sizeY = 16): Modifier =>
        ({ transform }) => ({
            ...transform,
            x: Math.round(transform.x / sizeX) * sizeX,
            y: Math.round(transform.y / sizeY) * sizeY,
        });
