import { create } from "zustand";
import { LANGUAGE_CONFIG } from "../constants";

export const useCodeEditorStore = create((set, get) => ({
  language: "javascript",
  theme: localStorage.getItem("editor-theme") || "vs-dark", // Get theme from localStorage
  code: LANGUAGE_CONFIG["javascript"].defaultCode,
  error: null,
  executionResult: null,
  isRunning: false,

  changeLang: (lang) => {
    const code = LANGUAGE_CONFIG[lang].defaultCode;
    set({ language: lang, code });
  },

  setTheme: (theme) => {
    localStorage.setItem("editor-theme", theme);
    set({ theme });
  },

  runCode: async (code) => {
    set({ isRunning: true });

    let languageDefine = {
      language: get().language,
      code: code || get().code, // Use passed code or fallback to stored one
    };

    try {
      const runtime = LANGUAGE_CONFIG[languageDefine.language].pistonRuntime;

      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: runtime.language,
          version: runtime.version,
          files: [{ content: languageDefine.code }],
        }),
      });

      const data = await response.json();
      console.log("data back from piston:", data);

      if (data.message) {
        set({ error: data.message, executionResult: null, isRunning: false });
        return;
      }

      if (data.run?.code !== 0) {
        set({ error: data.run.stderr || data.run.output, executionResult: null, isRunning: false });
        return;
      }

      set({ error: null, executionResult: data.run.output.trim(), isRunning: false });

    } catch (error) {
      console.log("Error running code:", error);
      set({ error: "Error running code", executionResult: null, isRunning: false });
    }
  },
}));
