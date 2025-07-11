import { create } from 'zustand';

/* tipos básicos — ajusta si ya usas otros */
export type BlockKind = 'header' | 'text' | 'image' | 'table' | 'chart';

export interface ElementType {
    id: string;
    type: BlockKind;
    x: number;
    y: number;
    w: number;
    h: number;
    content?: string;
    src?: string | null;
}

interface EditorState {
    elements: ElementType[];
    selectedElementId: string | null;

    addElement: (el: ElementType) => void;
    updateElement: (id: string, upd: Partial<ElementType>) => void;
    removeElement: (id: string) => void;
    duplicateElement: (id: string) => void;
    selectElement: (id: string | null) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
    elements: [],
    selectedElementId: null,

    addElement: (el) =>
        set((s) => ({
            elements: [...s.elements, el],
            selectedElementId: el.id,
        })),

    updateElement: (id, upd) =>
        set((s) => ({
            elements: s.elements.map((e) => (e.id === id ? { ...e, ...upd } : e)),
        })),

    removeElement: (id) =>
        set((s) => ({
            elements: s.elements.filter((e) => e.id !== id),
            selectedElementId:
                s.selectedElementId === id ? null : s.selectedElementId,
        })),

    duplicateElement: (id) =>
        set((s) => {
            const src = s.elements.find((e) => e.id === id);
            if (!src) return {};
            const copy = { ...src, id: crypto.randomUUID(), x: src.x + 24, y: src.y + 16 };
            return { elements: [...s.elements, copy], selectedElementId: copy.id };
        }),

    selectElement: (id) => set({ selectedElementId: id }),
}));
