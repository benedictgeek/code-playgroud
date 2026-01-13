export type Language = 'javascript' | 'typescript';

export interface OutputItem {
  type: 'log' | 'error' | 'result';
  content: string;
  timestamp?: number;
}
