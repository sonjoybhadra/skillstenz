'use client';

import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  inputSize?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      inputSize = 'md',
      fullWidth = true,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const sizeStyles: Record<string, React.CSSProperties> = {
      sm: { padding: '8px 12px', fontSize: '13px' },
      md: { padding: '12px 16px', fontSize: '14px' },
      lg: { padding: '16px 20px', fontSize: '16px' },
    };

    const inputStyles: React.CSSProperties = {
      width: fullWidth ? '100%' : 'auto',
      background: 'var(--bg-secondary)',
      border: error ? '2px solid #ef4444' : '2px solid var(--border-primary)',
      borderRadius: 'var(--radius-md)',
      color: 'var(--text-primary)',
      outline: 'none',
      transition: 'all 0.2s ease',
      paddingLeft: leftIcon ? '44px' : sizeStyles[inputSize].padding,
      paddingRight: rightIcon ? '44px' : sizeStyles[inputSize].padding,
      ...sizeStyles[inputSize],
      ...style,
    };

    return (
      <div style={{ marginBottom: '16px', width: fullWidth ? '100%' : 'auto' }}>
        {label && (
          <label
            style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--text-primary)',
            }}
          >
            {label}
          </label>
        )}
        <div style={{ position: 'relative' }}>
          {leftIcon && (
            <span
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            style={inputStyles}
            className={`ui-input ui-input-${inputSize} ${error ? 'ui-input-error' : ''} ${className}`}
            {...props}
          />
          {rightIcon && (
            <span
              style={{
                position: 'absolute',
                right: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {rightIcon}
            </span>
          )}
        </div>
        {error && (
          <p style={{ marginTop: '6px', fontSize: '13px', color: '#ef4444' }}>
            {error}
          </p>
        )}
        {hint && !error && (
          <p style={{ marginTop: '6px', fontSize: '13px', color: 'var(--text-muted)' }}>
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
