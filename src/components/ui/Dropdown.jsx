import { useState, useRef, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DropdownContext = createContext(null);

export function Dropdown({ trigger, children, align = 'right' }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <DropdownContext.Provider value={{ close: () => setIsOpen(false) }}>
      <div className="relative inline-block text-left" ref={dropdownRef}>
        <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
          {trigger}
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -5 }}
              transition={{ duration: 0.15 }}
              className={`absolute z-50 mt-2 w-48 rounded-xl bg-(--bg-elevated) border border-(--border-strong) shadow-(--shadow-lg) overflow-hidden ${
                align === 'right' ? 'origin-top-right right-0' : 'origin-top-left left-0'
              }`}
            >
              <div className="py-1">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DropdownContext.Provider>
  );
}

export function DropdownItem({ children, onClick, icon: Icon, className = '' }) {
  const dropdown = useContext(DropdownContext);

  const handleClick = () => {
    onClick?.();
    dropdown?.close();
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-(--text-primary) hover:bg-(--bg-glass) transition-colors ${className}`}
    >
      {Icon && <Icon size={16} className="text-(--text-muted)" />}
      {children}
    </button>
  );
}

export function DropdownDivider() {
  return <div className="h-px bg-(--border-default) my-1" />;
}

