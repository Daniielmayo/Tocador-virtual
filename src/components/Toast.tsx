import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useVanity } from '../context/VanityContext';

export const Toast: React.FC = () => {
  const { toast } = useVanity();

  return (
    <AnimatePresence>
      {toast.visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 py-2.5 px-4 rounded-full bg-[#261819] text-[#ffeced] text-[13px] font-semibold tracking-wide shadow-2xl flex items-center gap-2 max-w-[90vw] pointer-events-none"
        >
          <span className="material-symbols-outlined text-[#d4a574] text-[18px]">
            auto_awesome
          </span>
          <span className="truncate">{toast.message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
