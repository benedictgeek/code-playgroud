export type Language = 'javascript' | 'typescript';

export interface OutputItem {
  type: 'log' | 'error' | 'result';
  content: string;
  timestamp?: number;
}

export interface HistoryItem {
  id: string;
  code: string;
  language: Language;
  timestamp: number;
}

export interface EditorSettings {
  fontSize: number;
  wordWrap: boolean;
  tabSize: number;
}
