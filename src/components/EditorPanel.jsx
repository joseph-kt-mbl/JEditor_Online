import { useState } from "react";
import { useCodeEditorStore } from "../store/useCodeEditorStore";
import { LANGUAGE_CONFIG } from "../constants";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const EditorPanel = ({ options }) => {
  const { changeLang, language } = useCodeEditorStore();
  const [open, setOpen] = useState(false);

  const handleSelect = (id) => {
    changeLang(id);
    setOpen(false); // Close dropdown after selection
  };

  return (
    <div className="relative w-[150px]">
      {/* Dropdown Button */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-4 py-2 bg-[#1e1e2e] text-gray-300 border border-gray-800/50 
        rounded-lg transition-all hover:border-gray-700 hover:bg-[#262637]"
      >
        <div className="flex items-center gap-2">
          <img src={`/${language}_ico.png`} alt={language} className="w-5 h-5" />
          <span className="text-sm">{LANGUAGE_CONFIG[language]?.label}</span>
        </div>
        <ChevronDown className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </motion.button>

      {/* Dropdown Options */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 w-full bg-[#1e1e2e]/95 backdrop-blur-xl border border-[#313244] 
            shadow-2xl rounded-lg mt-2 py-2 z-50"
          >
            {options.map((option) => (
              <motion.button
                key={option.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-2 w-full px-4 py-2 text-left transition-all rounded-lg
                  ${language === option.id ? "bg-blue-500/10 text-blue-400" : "text-gray-300 hover:bg-[#262637]"}`}
                onClick={() => handleSelect(option.id)}
              >
                <img src={`/${option.id}_ico.png`} alt={option.label} className="w-5 h-5" />
                <span className="text-sm flex-1">{option.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EditorPanel;
