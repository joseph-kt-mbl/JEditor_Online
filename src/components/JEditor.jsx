import { useCodeEditorStore } from "../store/useCodeEditorStore";
import { useEffect, useState } from "react";
import { defineMonacoThemes, LANGUAGE_CONFIG } from "../constants";
import { Editor } from "@monaco-editor/react";
import { motion } from "framer-motion";
import { RotateCcwIcon, ShareIcon } from "lucide-react";
import EditorPanel from "./EditorPanel";
import ThemeSelector from "./ThemeSelector";

function JEditor() {
  const { language, theme, runCode, executionResult, error } = useCodeEditorStore();
  const [editor, setEditor] = useState(null);

  // Load saved code when language changes
  useEffect(() => {
    const savedCode = localStorage.getItem(`editor-code-${language}`);
    if (editor) {
      editor.setValue(savedCode || LANGUAGE_CONFIG[language].defaultCode);
    }
  }, [language, editor]);

  // Apply new theme when it changes
  useEffect(() => {
    if (editor) {
      editor.updateOptions({ theme });
    }
  }, [theme, editor]);

  const handleRefresh = () => {
    localStorage.removeItem(`editor-code-${language}`);
    if (editor) {
      editor.setValue(LANGUAGE_CONFIG[language].defaultCode);
    }
  };

  const handleEditorChange = (value) => {
    if (value) localStorage.setItem(`editor-code-${language}`, value);
  };

  const handleRunCode = () => {
    if (!editor) return;
    runCode(editor.getValue());
  };

  return (
    <div className="relative">
      <div className="relative bg-[#12121a]/90 backdrop-blur rounded-xl border border-white/[0.05] p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#1e1e2e] ring-1 ring-white/5">
              <img src={`/${language}_ico.png`} alt="Logo" width={24} height={24} />
            </div>
            <div>
              <h2 className="text-sm font-medium text-white">Code Editor</h2>
              <p className="text-xs text-gray-500">Write and execute your code</p>
            </div>
          </div>
          <EditorPanel options={Object.values(LANGUAGE_CONFIG)} />
          <ThemeSelector />

          <div className="flex items-center gap-3">
            {/* Refresh Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="p-2 bg-[#1e1e2e] hover:bg-[#2a2a3a] rounded-lg ring-1 ring-white/5 transition-colors"
              aria-label="Reset to default code"
            >
              <RotateCcwIcon className="size-4 text-gray-400" />
            </motion.button>

            {/* Share Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg overflow-hidden bg-gradient-to-r
               from-blue-500 to-blue-600 opacity-90 hover:opacity-100 transition-opacity"
            >
              <ShareIcon className="size-4 text-white" />
              <span className="text-sm font-medium text-white ">Share</span>
            </motion.button>
          </div>
        </div>

        {/* Editor */}
        <div className="relative group rounded-xl overflow-hidden ring-1 ring-white/[0.05]">
          <Editor
            height="400px"
            language={LANGUAGE_CONFIG[language].monacoLanguage}
            theme={theme} // <-- Now listens to the theme
            onChange={handleEditorChange}
            beforeMount={defineMonacoThemes}
            onMount={(editorInstance) => setEditor(editorInstance)}
            options={{
              minimap: { enabled: false },
              automaticLayout: true,
              scrollBeyondLastLine: false,
              padding: { top: 16, bottom: 16 },
              renderWhitespace: "selection",
              fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
              fontLigatures: true,
              cursorBlinking: "smooth",
              smoothScrolling: true,
              contextmenu: true,
              renderLineHighlight: "all",
              lineHeight: 1.6,
              letterSpacing: 0.5,
              roundedSelection: true,
              scrollbar: {
                verticalScrollbarSize: 8,
                horizontalScrollbarSize: 8,
              },
            }}
          />
        </div>

        {/* Run Code Button */}
        <div className="mt-4 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRunCode}
            className="px-4 py-2 rounded-lg bg-green-500 text-white font-medium transition-all hover:bg-green-600"
          >
            Run Code
          </motion.button>
        </div>

        {/* Execution Result */}
        {executionResult && (
          <div className="mt-4 p-3 bg-gray-900 rounded-lg text-white">
            <p>Output:</p>
            <pre className="text-sm">{executionResult}</pre>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-500 rounded-lg text-white">
            <p>Error:</p>
            <pre className="text-sm">{error}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default JEditor;
