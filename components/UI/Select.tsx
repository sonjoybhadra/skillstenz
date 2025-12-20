'use client';

import React, { forwardRef } from 'react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  selectSize?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      hint,
      options,
      selectSize = 'md',
      fullWidth = true,
      placeholder,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const sizeStyles: Record<string, React.CSSProperties> = {
      sm: { padding: '8px 36px 8px 12px', fontSize: '13px' },
      md: { padding: '12px 40px 12px 16px', fontSize: '14px' },
      lg: { padding: '16px 44px 16px 20px', fontSize: '16px' },
    };

    const selectStyles: React.CSSProperties = {
      width: fullWidth ? '100%' : 'auto',
      background: 'var(--bg-secondary)',
      border: error ? '2px solid #ef4444' : '2px solid var(--border-primary)',
      borderRadius: 'var(--radius-md)',
      color: 'var(--text-primary)',
      outline: 'none',
      transition: 'all 0.2s ease',
      appearance: 'none',
      cursor: 'pointer',
      ...sizeStyles[selectSize],
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
          <select
            ref={ref}
            style={selectStyles}
            className={`ui-select ui-select-${selectSize} ${error ? 'ui-select-error' : ''} ${className}`}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
          <span
            style={{
              position: 'absolute',
              right: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              color: 'var(--text-muted)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
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

Select.displayName = 'Select';

export default Select;
