import MonacoEditor, { type Monaco } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { useRef, useEffect } from 'react';
import type { Language } from '../types';

interface EditorProps {
  code: string;
  language: Language;
  onChange: (value: string | undefined) => void;
  onValidate?: (hasErrors: boolean) => void;
  onRun?: () => void;
}

export default function Editor({ code, language, onChange, onValidate, onRun }: EditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const onRunRef = useRef(onRun);

  // Keep onRun ref updated
  useEffect(() => {
    onRunRef.current = onRun;
  }, [onRun]);

  const handleValidate = (markers: editor.IMarker[]) => {
    const hasErrors = markers.some(marker => marker.severity === 8); // 8 = Error
    onValidate?.(hasErrors);
  };

  const handleEditorMount = (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
    editorRef.current = editor;

    // Add Cmd+Enter / Ctrl+Enter keybinding
    editor.addAction({
      id: 'run-code',
      label: 'Run Code',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
      run: () => {
        onRunRef.current?.();
      },
    });
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
        onMount={handleEditorMount}
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
