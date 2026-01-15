import type { HistoryItem, EditorSettings } from '../types';

const STORAGE_KEYS = {
  HISTORY: 'code-playground-history',
  SETTINGS: 'code-playground-settings',
} as const;

const MAX_HISTORY_ITEMS = 50;

// History functions
export function getHistory(): HistoryItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveToHistory(item: Omit<HistoryItem, 'id' | 'timestamp'>): HistoryItem {
  const history = getHistory();
  const newItem: HistoryItem = {
    ...item,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  };

  // Add to beginning and limit to max items
  const updatedHistory = [newItem, ...history].slice(0, MAX_HISTORY_ITEMS);
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updatedHistory));

  return newItem;
}

export function deleteHistoryItem(id: string): void {
  const history = getHistory();
  const updatedHistory = history.filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updatedHistory));
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEYS.HISTORY);
}

// Settings functions
const DEFAULT_SETTINGS: EditorSettings = {
  fontSize: 14,
  wordWrap: true,
  tabSize: 2,
};

export function getSettings(): EditorSettings {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: EditorSettings): void {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}
