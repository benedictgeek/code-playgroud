import MonacoEditor from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import type { Language } from '../types';

interface EditorProps {
  code: string;
  language: Language;
  onChange: (value: string | undefined) => void;
  onValidate?: (hasErrors: boolean) => void;
}

export default function Editor({ code, language, onChange, onValidate }: EditorProps) {
  const handleValidate = (markers: editor.IMarker[]) => {
    const hasErrors = markers.some(marker => marker.severity === 8); // 8 = Error
    onValidate?.(hasErrors);
  };

  return (
    <div className="h-full w-full">
      <MonacoEditor
        height="100%"
        language={language}
        value={code}
        theme="vs-dark"
        onChange={onChange}
        onValidate={handleValidate}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          padding: { top: 16 },
        }}
      />
    </div>
  );
}
