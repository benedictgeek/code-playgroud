import type { HistoryItem } from '../../types';

interface HistoryPanelProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function getCodePreview(code: string): string {
  const firstLine = code.trim().split('\n')[0] || '';
  return firstLine.length > 30 ? firstLine.slice(0, 30) + '...' : firstLine;
}

export default function HistoryPanel({ history, onSelect, onDelete }: HistoryPanelProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b border-[#3c3c3c]">
        <h2 className="text-sm font-medium text-white">History</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {history.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-500 text-sm">
            No history yet. Run some code!
          </div>
        ) : (
          <div className="py-2">
            {history.map(item => (
              <div
                key={item.id}
                className="group px-4 py-2 hover:bg-[#2a2d2e] cursor-pointer"
                onClick={() => onSelect(item)}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    item.language === 'typescript'
                      ? 'bg-blue-900 text-blue-300'
                      : 'bg-yellow-900 text-yellow-300'
                  }`}>
                    {item.language === 'typescript' ? 'TS' : 'JS'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatTime(item.timestamp)}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <code className="text-xs text-gray-400 font-mono truncate flex-1">
                    {getCodePreview(item.code)}
                  </code>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(item.id);
                    }}
                    className="ml-2 opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-opacity"
                    title="Delete"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
