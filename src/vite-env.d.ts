/// <reference types="vite/client" />

import type { BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';

type BlockFormattedAttribute = { indent?: number; };
type IndentFormattedAttribute = { bold?: number; }

// 段落 | 标题 | 图片 | 无、序列表 | 
interface ParagraphElement extends BlockFormattedAttribute {
  type: 'paragraph';
  children: CustomText[];
}

interface HeadingElement extends BlockFormattedAttribute {
  type: 'heading';
  level: number;
  children: CustomText[];
};

interface ImageElement extends BlockFormattedAttribute {
  type: 'image';
  values: {
    url: string;
    size?: [number, number];
  }[];
}

interface ListElement extends BlockFormattedAttribute {
  type: 'list';
  children: CustomText[];
}

type CustomElement = ParagraphElement | HeadingElement | ImageElement;
type CustomText = { text: string; } & IndentFormattedAttribute;

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}