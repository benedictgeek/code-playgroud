import type { Language } from '../types';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onRun: () => void;
  onClear: () => void;
  isRunning: boolean;
}

export default function Header({
  language,
  onLanguageChange,
  onRun,
  onClear,
  isRunning,
}: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-[#252526] border-b border-[#3c3c3c]">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-white">Code Playground</h1>
        <div className="flex bg-[#3c3c3c] rounded-md overflow-hidden">
          <button
            onClick={() => onLanguageChange('javascript')}
            className={`px-3 py-1.5 text-sm font-medium transition-colors ${
              language === 'javascript'
                ? 'bg-[#0e639c] text-white'
                : 'text-gray-400 hover:text-white hover:bg-[#4c4c4c]'
            }`}
          >
            JavaScript
          </button>
          <button
            onClick={() => onLanguageChange('typescript')}
            className={`px-3 py-1.5 text-sm font-medium transition-colors ${
              language === 'typescript'
                ? 'bg-[#0e639c] text-white'
                : 'text-gray-400 hover:text-white hover:bg-[#4c4c4c]'
            }`}
          >
            TypeScript
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onClear}
          className="px-4 py-1.5 text-sm font-medium text-gray-400 hover:text-white transition-colors"
        >
          Clear
        </button>
        <button
          onClick={onRun}
          disabled={isRunning}
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
            isRunning
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-[#0e639c] text-white hover:bg-[#1177bb]'
          }`}
        >
          {isRunning ? 'Running...' : 'Run'}
        </button>
      </div>
    </header>
  );
}
