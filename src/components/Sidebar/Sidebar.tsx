import { useState } from 'react';
import HistoryPanel from './HistoryPanel';
import SettingsPanel from './SettingsPanel';
import type { HistoryItem, EditorSettings } from '../../types';

type PanelType = 'history' | 'settings' | null;

interface SidebarProps {
  history: HistoryItem[];
  onHistorySelect: (item: HistoryItem) => void;
  onHistoryDelete: (id: string) => void;
  settings: EditorSettings;
  onSettingsChange: (settings: EditorSettings) => void;
}

export default function Sidebar({
  history,
  onHistorySelect,
  onHistoryDelete,
  settings,
  onSettingsChange,
}: SidebarProps) {
  const [activePanel, setActivePanel] = useState<PanelType>(null);

  const togglePanel = (panel: PanelType) => {
    setActivePanel(prev => (prev === panel ? null : panel));
  };

  const IconButton = ({
    panel,
    icon,
    label,
  }: {
    panel: PanelType;
    icon: React.ReactNode;
    label: string;
  }) => (
    <button
      onClick={() => togglePanel(panel)}
      className={`w-12 h-12 flex items-center justify-center transition-colors ${
        activePanel === panel
          ? 'text-white bg-[#37373d] border-l-2 border-[#0e639c]'
          : 'text-gray-400 hover:text-white'
      }`}
      title={label}
    >
      {icon}
    </button>
  );

  return (
    <div className="flex h-full">
      {/* Icon Bar */}
      <div className="w-12 bg-[#333333] flex flex-col border-r border-[#3c3c3c]">
        <IconButton
          panel="history"
          label="History"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <IconButton
          panel="settings"
          label="Settings"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />
      </div>

      {/* Panel Content */}
      {activePanel && (
        <div className="w-64 bg-[#252526] border-r border-[#3c3c3c] overflow-hidden">
          {activePanel === 'history' && (
            <HistoryPanel
              history={history}
              onSelect={onHistorySelect}
              onDelete={onHistoryDelete}
            />
          )}
          {activePanel === 'settings' && (
            <SettingsPanel
              settings={settings}
              onChange={onSettingsChange}
            />
          )}
        </div>
      )}
    </div>
  );
}
