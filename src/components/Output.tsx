import type { OutputItem } from '../types';

interface OutputProps {
  items: OutputItem[];
  isRunning: boolean;
}

export default function Output({ items, isRunning }: OutputProps) {
  const getItemStyle = (type: OutputItem['type']) => {
    switch (type) {
      case 'error':
        return 'text-red-400';
      case 'result':
        return 'text-green-400';
      default:
        return 'text-gray-300';
    }
  };

  const getItemPrefix = (type: OutputItem['type']) => {
    switch (type) {
      case 'error':
        return '✗';
      case 'result':
        return '→';
      default:
        return '›';
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e]">
      <div className="px-4 py-2 bg-[#252526] border-b border-[#3c3c3c] text-sm font-medium text-gray-400">
        Output
      </div>
      <div className="flex-1 overflow-auto p-4 font-mono text-sm">
        {isRunning && (
          <div className="text-yellow-400 mb-2">Running...</div>
        )}
        {items.length === 0 && !isRunning && (
          <div className="text-gray-500">
            Click "Run" to execute your code
          </div>
        )}
        {items.map((item, index) => (
          <div
            key={index}
            className={`mb-1 ${getItemStyle(item.type)} whitespace-pre-wrap break-all`}
          >
            <span className="mr-2 opacity-60">{getItemPrefix(item.type)}</span>
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
}
