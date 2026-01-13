import * as monaco from 'monaco-editor';

export interface CompilationResult {
  success: boolean;
  code?: string;
  errors?: string[];
}

export async function compileTypeScript(code: string): Promise<CompilationResult> {
  try {
    // Get the TypeScript worker from Monaco
    const worker = await monaco.languages.typescript.getTypeScriptWorker();

    // Create a temporary model to compile
    const uri = monaco.Uri.parse('file:///main.ts');
    let model = monaco.editor.getModel(uri);

    if (!model) {
      model = monaco.editor.createModel(code, 'typescript', uri);
    } else {
      model.setValue(code);
    }

    const client = await worker(uri);

    // Get semantic diagnostics (type errors)
    const semanticDiagnostics = await client.getSemanticDiagnostics(uri.toString());
    const syntacticDiagnostics = await client.getSyntacticDiagnostics(uri.toString());

    const allDiagnostics = [...syntacticDiagnostics, ...semanticDiagnostics];

    if (allDiagnostics.length > 0) {
      const errors = allDiagnostics.map(d => {
        const message = typeof d.messageText === 'string'
          ? d.messageText
          : d.messageText.messageText;
        return `Error: ${message}`;
      });
      return { success: false, errors };
    }

    // Get the compiled JavaScript
    const output = await client.getEmitOutput(uri.toString());
    const jsCode = output.outputFiles[0]?.text || '';

    return { success: true, code: jsCode };
  } catch (error) {
    // Fallback: simple strip of type annotations for basic TS
    return stripTypeAnnotations(code);
  }
}

// Fallback function that strips basic TypeScript syntax
function stripTypeAnnotations(code: string): CompilationResult {
  try {
    let jsCode = code
      // Remove type annotations from variables
      .replace(/:\s*\w+(\[\])?(\s*[=;,\)])/g, '$2')
      // Remove type annotations from function parameters
      .replace(/(\w+)\s*:\s*\w+(\[\])?/g, '$1')
      // Remove interface declarations
      .replace(/interface\s+\w+\s*\{[^}]*\}/g, '')
      // Remove type declarations
      .replace(/type\s+\w+\s*=\s*[^;]+;/g, '')
      // Remove generic type parameters
      .replace(/<\w+>/g, '')
      // Remove 'as' type assertions
      .replace(/\s+as\s+\w+/g, '')
      // Clean up extra whitespace
      .replace(/\n\s*\n/g, '\n');

    return { success: true, code: jsCode };
  } catch (error) {
    return {
      success: false,
      errors: ['Failed to compile TypeScript: ' + String(error)]
    };
  }
}
