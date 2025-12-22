'use client';

import React, { useState, useRef, useEffect } from 'react';

export interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  danger?: boolean;
  divider?: boolean;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  onSelect?: (itemId: string) => void;
  align?: 'left' | 'right';
  className?: string;
}

export default function Dropdown({
  trigger,
  items,
  onSelect,
  align = 'left',
  className = '',
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item: DropdownItem) => {
    if (!item.disabled && !item.divider) {
      onSelect?.(item.id);
      setIsOpen(false);
    }
  };

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>
      {isOpen && (
        <div className={`absolute z-50 mt-2 min-w-48 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden ${align === 'right' ? 'right-0' : 'left-0'}`}>
          <div className="py-1">
            {items.map((item) =>
              item.divider ? (
                <div key={item.id} className="h-px bg-gray-200 dark:bg-slate-700 my-1" />
              ) : (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  disabled={item.disabled}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors ${
                    item.disabled
                      ? 'opacity-50 cursor-not-allowed text-gray-400'
                      : item.danger
                      ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
