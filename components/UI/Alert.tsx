'use client';

import React from 'react';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  icon?: React.ReactNode;
}

export default function Alert({
  children,
  variant = 'info',
  title,
  dismissible = false,
  onDismiss,
  icon,
  className = '',
  style,
  ...props
}: AlertProps) {
  const variantStyles: Record<string, { bg: string; border: string; color: string; iconColor: string }> = {
    info: {
      bg: 'rgba(59, 130, 246, 0.1)',
      border: 'rgba(59, 130, 246, 0.3)',
      color: '#1d4ed8',
      iconColor: '#3b82f6',
    },
    success: {
      bg: 'rgba(34, 197, 94, 0.1)',
      border: 'rgba(34, 197, 94, 0.3)',
      color: '#15803d',
      iconColor: '#22c55e',
    },
    warning: {
      bg: 'rgba(245, 158, 11, 0.1)',
      border: 'rgba(245, 158, 11, 0.3)',
      color: '#b45309',
      iconColor: '#f59e0b',
    },
    error: {
      bg: 'rgba(239, 68, 68, 0.1)',
      border: 'rgba(239, 68, 68, 0.3)',
      color: '#b91c1c',
      iconColor: '#ef4444',
    },
  };

  const defaultIcons: Record<string, React.ReactNode> = {
    info: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
      </svg>
    ),
    success: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    warning: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <path d="M12 9v4M12 17h.01" />
      </svg>
    ),
    error: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="m15 9-6 6M9 9l6 6" />
      </svg>
    ),
  };

  const { bg, border, color, iconColor } = variantStyles[variant];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '16px',
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 'var(--radius-lg)',
        color: color,
        ...style,
      }}
      className={`ui-alert ui-alert-${variant} ${className}`}
      {...props}
    >
      <span style={{ color: iconColor, flexShrink: 0 }}>
        {icon || defaultIcons[variant]}
      </span>
      <div style={{ flex: 1 }}>
        {title && (
          <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>
            {title}
          </h4>
        )}
        <div style={{ fontSize: '14px' }}>{children}</div>
      </div>
      {dismissible && (
        <button
          onClick={onDismiss}
          style={{
            padding: '4px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'inherit',
            opacity: 0.7,
          }}
          aria-label="Dismiss"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
