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
    bold?: boolean;
    italic?: boolean;
    fontSize?: number;
    align?: 'left' | 'center' | 'right' | 'justify';
}