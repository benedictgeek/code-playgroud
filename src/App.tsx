import { useState, useCallback, useRef, useEffect } from 'react';
import Editor from './components/Editor';
import Output from './components/Output';
import Header from './components/Header';
import { compileTypeScript } from './utils/typescript';
import type { Language, OutputItem } from './types';

const DEFAULT_JS_CODE = `// Welcome to Code Playground!
// Write your JavaScript code here

console.log("Hello, World!");

// Try some calculations
const sum = (a, b) => a + b;
console.log("2 + 3 =", sum(2, 3));
`;

const DEFAULT_TS_CODE = `// Welcome to Code Playground!
// Write your TypeScript code here

console.log("Hello, TypeScript!");

// Try typed functions
const greet = (name: string): string => {
  return \`Hello, \${name}!\`;
};

console.log(greet("Developer"));
`;

function App() {
  const [language, setLanguage] = useState<Language>('javascript');
  const [code, setCode] = useState(DEFAULT_JS_CODE);
  const [output, setOutput] = useState<OutputItem[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  // Store code for each language separately
  const codeStorageRef = useRef<Record<Language, string>>({
    javascript: DEFAULT_JS_CODE,
    typescript: DEFAULT_TS_CODE,
  });

  useEffect(() => {
    // Initialize worker
    workerRef.current = new Worker(
      new URL('./workers/codeRunner.worker.ts', import.meta.url),
      { type: 'module' }
    );

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const handleCodeChange = useCallback((value: string | undefined) => {
    const newCode = value || '';
    setCode(newCode);
    codeStorageRef.current[language] = newCode;
  }, [language]);

  const handleLanguageChange = useCallback((newLang: Language) => {
    // Save current code
    codeStorageRef.current[language] = code;
    // Switch language and restore saved code
    setLanguage(newLang);
    setCode(codeStorageRef.current[newLang]);
  }, [language, code]);

  const handleRun = useCallback(async () => {
    if (!workerRef.current) return;

    setIsRunning(true);
    setOutput([]);

    let codeToRun = code;

    // Compile TypeScript if needed
    if (language === 'typescript') {
      const result = await compileTypeScript(code);
      if (!result.success) {
        setOutput(result.errors?.map(e => ({ type: 'error' as const, content: e })) || []);
        setIsRunning(false);
        return;
      }
      codeToRun = result.code || '';
    }

    const id = Date.now().toString();

    const handleMessage = (event: MessageEvent) => {
      const { id: responseId, type, content } = event.data;
      if (responseId !== id) return;

      if (type === 'done') {
        setIsRunning(false);
        workerRef.current?.removeEventListener('message', handleMessage);
        return;
      }

      if (content !== undefined) {
        setOutput(prev => [...prev, { type, content }]);
      }
    };

    workerRef.current.addEventListener('message', handleMessage);

    // Set a timeout to prevent infinite loops
    const timeout = setTimeout(() => {
      workerRef.current?.terminate();
      workerRef.current = new Worker(
        new URL('./workers/codeRunner.worker.ts', import.meta.url),
        { type: 'module' }
      );
      setOutput(prev => [...prev, { type: 'error', content: 'Execution timed out (5s limit)' }]);
      setIsRunning(false);
    }, 5000);

    workerRef.current.postMessage({ code: codeToRun, id });

    // Clear timeout when done
    const cleanup = (event: MessageEvent) => {
      if (event.data.id === id && event.data.type === 'done') {
        clearTimeout(timeout);
        workerRef.current?.removeEventListener('message', cleanup);
      }
    };
    workerRef.current.addEventListener('message', cleanup);
  }, [code, language]);

  const handleClear = useCallback(() => {
    setOutput([]);
  }, []);

  // Keyboard shortcut: Cmd+Enter (Mac) or Ctrl+Enter (Windows)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (!isRunning && !hasErrors) {
          handleRun();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleRun, isRunning, hasErrors]);

  return (
    <div className="h-screen flex flex-col">
      <Header
        language={language}
        onLanguageChange={handleLanguageChange}
        onRun={handleRun}
        onClear={handleClear}
        isRunning={isRunning}
        hasErrors={hasErrors}
      />
      <div className="flex-1 flex overflow-hidden">
        <div className="w-1/2 border-r border-[#3c3c3c]">
          <Editor
            code={code}
            language={language}
            onChange={handleCodeChange}
            onValidate={setHasErrors}
            onRun={() => {
              if (!isRunning && !hasErrors) {
                handleRun();
              }
            }}
          />
        </div>
        <div className="w-1/2">
          <Output items={output} isRunning={isRunning} />
        </div>
      </div>
    </div>
  );
}

export default App;
