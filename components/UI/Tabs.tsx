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
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  fullWidth?: boolean;
}

export default function Tabs({
  tabs,
  defaultTab,
  onChange,
  variant = 'default',
  fullWidth = false,
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const getTabStyles = (isActive: boolean, isDisabled: boolean): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: variant === 'underline' ? '12px 16px' : '10px 20px',
      fontSize: '14px',
      fontWeight: 600,
      border: 'none',
      background: 'transparent',
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      opacity: isDisabled ? 0.5 : 1,
      transition: 'all 0.2s ease',
      flex: fullWidth ? 1 : 'none',
      justifyContent: 'center',
    };

    if (variant === 'pills') {
      return {
        ...baseStyles,
        background: isActive ? 'var(--bg-accent)' : 'transparent',
        color: isActive ? 'white' : 'var(--text-secondary)',
        borderRadius: 'var(--radius-md)',
      };
    }

    if (variant === 'underline') {
      return {
        ...baseStyles,
        color: isActive ? 'var(--text-accent)' : 'var(--text-secondary)',
        borderBottom: isActive ? '2px solid var(--bg-accent)' : '2px solid transparent',
        marginBottom: '-1px',
      };
    }

    return {
      ...baseStyles,
      background: isActive ? 'var(--bg-secondary)' : 'transparent',
      color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
      borderRadius: 'var(--radius-md)',
    };
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: variant === 'pills' ? '8px' : '0',
        borderBottom: variant === 'underline' ? '1px solid var(--border-primary)' : 'none',
        background: variant === 'default' ? 'var(--bg-tertiary)' : 'transparent',
        padding: variant === 'default' ? '4px' : '0',
        borderRadius: variant === 'default' ? 'var(--radius-lg)' : '0',
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          style={getTabStyles(activeTab === tab.id, !!tab.disabled)}
          onClick={() => !tab.disabled && handleTabClick(tab.id)}
          disabled={tab.disabled}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
