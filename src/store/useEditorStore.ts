/* Zustand global store */

import { create } from 'zustand';

export type ElementType = {
    id: string;
    type: 'header' | 'text' | 'image' | 'table' | 'chart';
    content?: string;
    style?: Record<string, string>;
    data?: any;
    x: number;
    y: number;
};

type EditorState = {
    elements: ElementType[];
    selectedElementId: string | null;
    addElement: (el: ElementType) => void;
    updateElement: (id: string, updates: Partial<ElementType>) => void;
    selectElement: (id: string | null) => void;
};

export const useEditorStore = create<EditorState>((set) => ({
    elements: [],
    selectedElementId: null,

    addElement: (el) =>
        set((s) => ({
            elements: [...s.elements, el],
            selectedElementId: el.id,
        })),

    updateElement: (id, updates) =>
        set((s) => ({
            elements: s.elements.map((e) =>
                e.id === id ? { ...e, ...updates } : e
            ),
        })),

    selectElement: (id) => set(() => ({ selectedElementId: id })),
}));
