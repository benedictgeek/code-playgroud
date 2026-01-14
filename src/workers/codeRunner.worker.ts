interface WorkerMessage {
  code: string;
  id: string;
}

interface WorkerResponse {
  id: string;
  type: 'log' | 'error' | 'result' | 'done';
  content?: string;
}

const sendMessage = (response: WorkerResponse) => {
  self.postMessage(response);
};

self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const { code, id } = event.data;

  // Create a custom console that captures logs
  const customConsole = {
    log: (...args: unknown[]) => {
      const content = args.map(arg => formatValue(arg)).join(' ');
      sendMessage({ id, type: 'log', content });
    },
    error: (...args: unknown[]) => {
      const content = args.map(arg => formatValue(arg)).join(' ');
      sendMessage({ id, type: 'error', content });
    },
    warn: (...args: unknown[]) => {
      const content = args.map(arg => formatValue(arg)).join(' ');
      sendMessage({ id, type: 'log', content: `[warn] ${content}` });
    },
    info: (...args: unknown[]) => {
      const content = args.map(arg => formatValue(arg)).join(' ');
      sendMessage({ id, type: 'log', content });
    },
  };

  try {
    // Create a function that runs the code with custom console
    const wrappedCode = `
      (function(console) {
        ${code}
      })
    `;

    const fn = eval(wrappedCode);
    const result = fn(customConsole);

    if (result !== undefined) {
      sendMessage({ id, type: 'result', content: formatValue(result) });
    }
  } catch (error) {
    const errorMessage = error instanceof Error
      ? `${error.name}: ${error.message}`
      : String(error);
    sendMessage({ id, type: 'error', content: errorMessage });
  }

  sendMessage({ id, type: 'done' });
};

function formatValue(value: unknown): string {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (typeof value === 'function') return `[Function: ${value.name || 'anonymous'}]`;
  if (Array.isArray(value)) {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return '[Array]';
    }
  }
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return '[Object]';
    }
  }
  return String(value);
}
