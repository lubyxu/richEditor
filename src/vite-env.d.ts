/// <reference types="vite/client" />

import type { BaseEditor, CustomTypes, NodeEntry, Descendant } from 'slate';
import { ReactEditor } from 'slate-react';

type BlockFormattedAttribute = { indent?: number; };
type IndentFormattedAttribute = { bold?: number; }

// 段落 | 标题 | 图片 | 无、序列表 | 
interface ParagraphElement extends BlockFormattedAttribute {
  type: 'paragraph';
  children: (CustomText | LinkElement)[];
}

interface HeadingElement extends BlockFormattedAttribute {
  type: 'heading';
  level: number;
  children: (CustomText | LinkElement)[];
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
  unorder: boolean;
  no?: number;
  children: Descendant[];
}

interface CodeBlockElement {
  type: 'code-block';
  children: ParagraphElement[];
} 


export type ListItemElement = { type: 'list-item'; children: Descendant[] }


export type BulletedListElement = {
  type: 'bulleted-list'
  align?: string
  children: Descendant[]
}

interface ColumnElement extends BlockFormattedAttribute {
  type: 'column';
  children: CustomElement[];
}

interface SliceElement extends BlockFormattedAttribute {
  type: 'slice';
  children: CustomElement[];
}

interface LinkElement {
  type: 'link',
  href: string;
  children: CustomText[];
}

type CustomElement = ParagraphElement
  | SliceElement
  | HeadingElement
  | ImageElement
  | ColumnElement
  | LinkElement
  | ListElement
  | BulletedListElement
  | CodeBlockElement
  | ListItemElement;

type CustomText = { text: string; } & IndentFormattedAttribute;


interface ModuleInterface {
  editor: CustomTypes['Editor'];
  onKeyDown(e: React.KeyboardEvent, ctx: IKeyDownContext): void;
}
interface Module {
  new(editor: CustomTypes['Editor'], options: any): ModuleInterface;
}
interface CustomEditor {
  getModule(name: string): ModuleInterface
}

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }

}


declare interface IKeyDownContext {
  line: NodeEntry;
  offset: number;
  empty: boolean;
  prefix: string;
  suffix: string;
}
declare interface BindingObject {
  key: number | string | string[];
  shortKey?: boolean | null;
  shiftKey?: boolean | null;
  altKey?: boolean | null;
  metaKey?: boolean | null;
  ctrlKey?: boolean | null;
  prefix?: RegExp;
  suffix?: RegExp;
  handler(this: Editor, context: IContext): boolean | void;
}