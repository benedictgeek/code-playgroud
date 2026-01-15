import type { EditorSettings } from '../../types';

interface SettingsPanelProps {
  settings: EditorSettings;
  onChange: (settings: EditorSettings) => void;
}

export default function SettingsPanel({ settings, onChange }: SettingsPanelProps) {
  const updateSetting = <K extends keyof EditorSettings>(
    key: K,
    value: EditorSettings[K]
  ) => {
    onChange({ ...settings, [key]: value });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b border-[#3c3c3c]">
        <h2 className="text-sm font-medium text-white">Settings</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Font Size */}
        <div>
          <label className="block text-sm text-gray-300 mb-2">
            Font Size: {settings.fontSize}px
          </label>
          <input
            type="range"
            min="12"
            max="24"
            value={settings.fontSize}
            onChange={(e) => updateSetting('fontSize', Number(e.target.value))}
            className="w-full accent-[#0e639c]"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>12px</span>
            <span>24px</span>
          </div>
        </div>

        {/* Word Wrap */}
        <div>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-gray-300">Word Wrap</span>
            <div
              className={`w-10 h-5 rounded-full transition-colors ${
                settings.wordWrap ? 'bg-[#0e639c]' : 'bg-[#3c3c3c]'
              }`}
              onClick={() => updateSetting('wordWrap', !settings.wordWrap)}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white shadow transition-transform mt-0.5 ${
                  settings.wordWrap ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </div>
          </label>
        </div>

        {/* Tab Size */}
        <div>
          <label className="block text-sm text-gray-300 mb-2">Tab Size</label>
          <div className="flex gap-2">
            {[2, 4].map((size) => (
              <button
                key={size}
                onClick={() => updateSetting('tabSize', size)}
                className={`flex-1 py-2 text-sm rounded transition-colors ${
                  settings.tabSize === size
                    ? 'bg-[#0e639c] text-white'
                    : 'bg-[#3c3c3c] text-gray-300 hover:bg-[#4c4c4c]'
                }`}
              >
                {size} spaces
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
