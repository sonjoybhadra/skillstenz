'use client';

import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  dot?: boolean;
}

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  rounded = false,
  dot = false,
  className = '',
  style,
  ...props
}: BadgeProps) {
  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: '2px 8px', fontSize: '11px' },
    md: { padding: '4px 12px', fontSize: '12px' },
    lg: { padding: '6px 16px', fontSize: '14px' },
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    default: {
      background: 'var(--bg-tertiary)',
      color: 'var(--text-secondary)',
    },
    primary: {
      background: 'rgba(16, 185, 129, 0.15)',
      color: '#059669',
    },
    success: {
      background: 'rgba(34, 197, 94, 0.15)',
      color: '#16a34a',
    },
    warning: {
      background: 'rgba(245, 158, 11, 0.15)',
      color: '#d97706',
    },
    danger: {
      background: 'rgba(239, 68, 68, 0.15)',
      color: '#dc2626',
    },
    info: {
      background: 'rgba(59, 130, 246, 0.15)',
      color: '#2563eb',
    },
  };

  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontWeight: 600,
    borderRadius: rounded ? '9999px' : 'var(--radius-sm)',
    whiteSpace: 'nowrap',
    ...sizeStyles[size],
    ...variantStyles[variant],
    ...style,
  };

  return (
    <span
      style={baseStyles}
      className={`ui-badge ui-badge-${variant} ui-badge-${size} ${className}`}
      {...props}
    >
      {dot && (
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: 'currentColor',
          }}
        />
      )}
      {children}
    </span>
  );
}
