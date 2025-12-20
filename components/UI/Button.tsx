'use client';

import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'dark';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: 600,
    borderRadius: 'var(--radius-md)',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    border: 'none',
    outline: 'none',
    opacity: disabled ? 0.6 : 1,
    width: fullWidth ? '100%' : 'auto',
    whiteSpace: 'nowrap',
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    xs: { padding: '6px 12px', fontSize: '12px', borderRadius: 'var(--radius-sm)' },
    sm: { padding: '8px 16px', fontSize: '13px' },
    md: { padding: '10px 20px', fontSize: '14px' },
    lg: { padding: '14px 28px', fontSize: '16px' },
    xl: { padding: '18px 36px', fontSize: '18px', borderRadius: 'var(--radius-lg)' },
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      background: 'var(--bg-accent)',
      color: 'white',
      boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.4)',
    },
    secondary: {
      background: 'var(--bg-tertiary)',
      color: 'var(--text-primary)',
      boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.1)',
    },
    outline: {
      background: 'transparent',
      color: 'var(--text-primary)',
      border: '2px solid var(--border-primary)',
      boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.06)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)',
      boxShadow: 'none',
    },
    danger: {
      background: '#ef4444',
      color: 'white',
      boxShadow: '0 4px 14px 0 rgba(239, 68, 68, 0.4)',
    },
    success: {
      background: '#22c55e',
      color: 'white',
      boxShadow: '0 4px 14px 0 rgba(34, 197, 94, 0.4)',
    },
    dark: {
      background: 'var(--text-primary)',
      color: 'var(--bg-primary)',
      boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.25)',
    },
  };

  const combinedStyles = {
    ...baseStyles,
    ...sizeStyles[size],
    ...variantStyles[variant],
  };

  return (
    <button
      style={combinedStyles}
      className={`ui-button ui-button-${variant} ui-button-${size} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span
          style={{
            width: size === 'xs' ? '12px' : size === 'sm' ? '14px' : '16px',
            height: size === 'xs' ? '12px' : size === 'sm' ? '14px' : '16px',
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
      )}
      {!loading && leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
}
