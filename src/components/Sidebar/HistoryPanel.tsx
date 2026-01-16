import type { DayHistory, HistoryEntry } from '../../types';

interface HistoryPanelProps {
  history: DayHistory[];
  onSelect: (entry: HistoryEntry) => void;
  onDeleteDay: (date: string) => void;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00');
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (dateString === today.toISOString().split('T')[0]) {
    return 'Today';
  }
  if (dateString === yesterday.toISOString().split('T')[0]) {
    return 'Yesterday';
  }

  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getCodePreview(code: string): string {
  const firstLine = code.trim().split('\n')[0] || '';
  return firstLine.length > 25 ? firstLine.slice(0, 25) + '...' : firstLine;
}

export default function HistoryPanel({ history, onSelect, onDeleteDay }: HistoryPanelProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col pl-4 pr-4 pt-3 pb-3 border-b border-[#3c3c3c]">
        <h2 className="text-sm font-medium text-white">History</h2>
        <p className="text-xs text-gray-500 mb-1!">Auto-saves as you type</p>
      </div>
      <div className="flex-1 overflow-y-auto">
        {history.length === 0 ? (
          <div className="pt-8 pb-8 text-center text-gray-500 text-sm">
            No history yet. Start coding!
          </div>
        ) : (
          <div className="flex flex-col gap-2 p-2">
            {history.map(day => (
              <div key={day.date} className="overflow-hidden">
                <div className="flex items-center justify-between pl-3 pr-3 pt-2 pb-2 bg-[#2a2d2e]">
                  <span className="text-xs font-medium text-gray-400">
                    {formatDate(day.date)}
                  </span>
                  <button
                    onClick={() => onDeleteDay(day.date)}
                    className="text-gray-500 hover:text-red-400 transition-colors p-1"
                    title="Delete day"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <div className="divide-y divide-[#3c3c3c]">
                  {day.entries.map((entry, index) => (
                    <div
                      key={`${day.date}-${entry.language}-${index}`}
                      className="pl-3 pr-3 pt-2.5 pb-2.5 cursor-pointer"
                      onClick={() => onSelect(entry)}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-xs pl-1.5 pr-1.5 pt-0.5 pb-0.5 ${
                          entry.language === 'typescript'
                            ? 'bg-blue-900/50 text-blue-300'
                            : 'bg-yellow-900/50 text-yellow-300'
                        }`}>
                          {entry.language === 'typescript' ? 'TS' : 'JS'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTime(entry.timestamp)}
                        </span>
                      </div>
                      <code className="block text-xs text-gray-400 font-mono truncate">
                        {getCodePreview(entry.code)}
                      </code>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
