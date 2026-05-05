import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
  const { theme } = useTheme();

  return (
    <button
      className="relative w-14 h-7 flex items-center bg-zinc-900 border border-zinc-800 rounded-full p-1 cursor-default"
    >
      <motion.div
        animate={{ x: theme === 'dark' ? 0 : 28 }}
        className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center shadow-lg"
      >
        {theme === 'dark' ? (
          <Moon className="w-3 h-3 text-black" />
        ) : (
          <Sun className="w-3 h-3 text-black" />
        )}
      </motion.div>
    </button>
  );
};

export default ThemeToggle;
