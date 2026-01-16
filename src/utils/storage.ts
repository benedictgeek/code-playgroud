import type { DayHistory, HistoryEntry, EditorSettings, Language } from '../types';

const STORAGE_KEYS = {
  HISTORY: 'code-playground-history',
  SETTINGS: 'code-playground-settings',
} as const;

const MAX_DAYS = 5;

// Get today's date in YYYY-MM-DD format
function getDateString(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

// History functions
export function getHistory(): DayHistory[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
    const history: DayHistory[] = data ? JSON.parse(data) : [];

    // Filter out entries older than MAX_DAYS
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - MAX_DAYS);
    const cutoffString = getDateString(cutoffDate);

    return history.filter(day => day.date >= cutoffString);
  } catch {
    return [];
  }
}

export function saveToHistory(code: string, language: Language): DayHistory[] {
  const history = getHistory();
  const today = getDateString();

  // Find or create today's entry
  let todayHistory = history.find(day => day.date === today);

  if (!todayHistory) {
    todayHistory = { date: today, entries: [] };
    history.unshift(todayHistory);
  }

  // Find existing entry for this language or create new one
  const existingEntryIndex = todayHistory.entries.findIndex(e => e.language === language);
  const newEntry: HistoryEntry = {
    code,
    language,
    timestamp: Date.now(),
  };

  if (existingEntryIndex >= 0) {
    todayHistory.entries[existingEntryIndex] = newEntry;
  } else {
    todayHistory.entries.push(newEntry);
  }

  // Sort history by date (newest first)
  history.sort((a, b) => b.date.localeCompare(a.date));

  // Keep only last MAX_DAYS
  const trimmedHistory = history.slice(0, MAX_DAYS);

  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(trimmedHistory));

  return trimmedHistory;
}

export function deleteHistoryDay(date: string): DayHistory[] {
  const history = getHistory();
  const updatedHistory = history.filter(day => day.date !== date);
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updatedHistory));
  return updatedHistory;
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
