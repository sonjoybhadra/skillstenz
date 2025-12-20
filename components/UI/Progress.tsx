'use client';

import React from 'react';

export interface ProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'warning' | 'danger';
  showLabel?: boolean;
  animated?: boolean;
}

export default function Progress({
  value,
  max = 100,
  size = 'md',
  color = 'primary',
  showLabel = false,
  animated = false,
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeStyles: Record<string, string> = {
    sm: '4px',
    md: '8px',
    lg: '12px',
  };

  const colorStyles: Record<string, string> = {
    primary: 'var(--bg-accent)',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        width: '100%',
      }}
    >
      <div
        style={{
          flex: 1,
          height: sizeStyles[size],
          background: 'var(--bg-tertiary)',
          borderRadius: '9999px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            background: colorStyles[color],
            borderRadius: '9999px',
            transition: 'width 0.3s ease',
            ...(animated && {
              backgroundImage: `linear-gradient(
                45deg,
                rgba(255, 255, 255, 0.15) 25%,
                transparent 25%,
                transparent 50%,
                rgba(255, 255, 255, 0.15) 50%,
                rgba(255, 255, 255, 0.15) 75%,
                transparent 75%,
                transparent
              )`,
              backgroundSize: '1rem 1rem',
              animation: 'progress-stripes 1s linear infinite',
            }),
          }}
        />
      </div>
      {showLabel && (
        <span
          style={{
            fontSize: size === 'sm' ? '12px' : '14px',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            minWidth: '40px',
            textAlign: 'right',
          }}
        >
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
}
