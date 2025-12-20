'use client';

import React from 'react';

export interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  thickness?: number;
}

export default function Spinner({
  size = 'md',
  color = 'var(--text-accent)',
  thickness = 2,
}: SpinnerProps) {
  const sizeStyles: Record<string, number> = {
    xs: 14,
    sm: 18,
    md: 24,
    lg: 32,
    xl: 48,
  };

  const dimension = sizeStyles[size];

  return (
    <span
      style={{
        display: 'inline-block',
        width: `${dimension}px`,
        height: `${dimension}px`,
        border: `${thickness}px solid var(--border-primary)`,
        borderTopColor: color,
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }}
    />
  );
}
