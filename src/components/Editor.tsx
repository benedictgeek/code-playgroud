import MonacoEditor from '@monaco-editor/react';
import type { Language } from '../types';

interface EditorProps {
  code: string;
  language: Language;
  onChange: (value: string | undefined) => void;
}

export default function Editor({ code, language, onChange }: EditorProps) {
  return (
    <div className="h-full w-full">
      <MonacoEditor
        height="100%"
        language={language}
        value={code}
        theme="vs-dark"
        onChange={onChange}
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
