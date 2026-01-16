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
      <div className="pl-4 pr-4 pt-3 pb-3 border-b border-[#3c3c3c]">
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
        </div>
      </div>
    </div>
  );
}
