'use client';

import React, { useState } from 'react';

export interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: Tab[];
  activeTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  className?: string;
}

export default function Tabs({
  tabs,
  activeTab,
  onChange,
  variant = 'default',
  className = '',
}: TabsProps) {
  const [internalActive, setInternalActive] = useState(tabs[0]?.id || '');
  const active = activeTab || internalActive;

  const handleClick = (tabId: string) => {
    if (onChange) {
      onChange(tabId);
    } else {
      setInternalActive(tabId);
    }
  };

  const baseClasses = 'flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all duration-200';
  
  const variantClasses: Record<string, { wrapper: string; active: string; inactive: string }> = {
    default: {
      wrapper: 'flex gap-1 bg-gray-100 dark:bg-slate-800 p-1 rounded-lg',
      active: 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow rounded-md',
      inactive: 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-md',
    },
    pills: {
      wrapper: 'flex gap-2',
      active: 'bg-blue-500 text-white rounded-full',
      inactive: 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full',
    },
    underline: {
      wrapper: 'flex border-b border-gray-200 dark:border-slate-700',
      active: 'text-blue-500 border-b-2 border-blue-500 -mb-px',
      inactive: 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300',
    },
  };

  const styles = variantClasses[variant];

  return (
    <div className={`${styles.wrapper} ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => !tab.disabled && handleClick(tab.id)}
          disabled={tab.disabled}
          className={`${baseClasses} ${active === tab.id ? styles.active : styles.inactive} ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
