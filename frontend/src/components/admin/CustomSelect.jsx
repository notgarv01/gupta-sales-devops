import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const CustomSelect = ({ label, options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="space-y-2 relative" ref={dropdownRef}>
      <label className="block text-[10px] uppercase text-zinc-500 font-bold tracking-tighter">
        {label}
      </label>
      
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between bg-zinc-950 border ${
          isOpen ? 'border-amber-500 ring-1 ring-amber-500/20' : 'border-zinc-800'
        } p-3 rounded text-sm text-left transition-all outline-none`}
      >
        <span className={selectedOption ? 'text-zinc-200' : 'text-zinc-500'}>
          {selectedOption ? selectedOption.label : 'Select option...'}
        </span>
        <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Options Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-[#121214] border border-zinc-800 rounded-lg shadow-2xl overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
          <div className="max-h-60 overflow-y-auto">
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className="group flex items-center justify-between px-4 py-3 hover:bg-amber-500/10 cursor-pointer transition-colors"
              >
                <span className={`text-sm ${value === option.value ? 'text-amber-500' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
                  {option.label}
                </span>
                {value === option.value && <Check className="w-4 h-4 text-amber-500" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
