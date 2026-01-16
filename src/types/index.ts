export type Language = 'javascript' | 'typescript';

export interface OutputItem {
  type: 'log' | 'error' | 'result';
  content: string;
  timestamp?: number;
}

export interface HistoryEntry {
  code: string;
  language: Language;
  timestamp: number;
}

export interface DayHistory {
  date: string; // YYYY-MM-DD format
  entries: HistoryEntry[];
}

export interface EditorSettings {
  fontSize: number;
  wordWrap: boolean;
  tabSize: number;
}
