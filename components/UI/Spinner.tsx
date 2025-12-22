'use client';

import React from 'react';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'white' | 'gray';
  className?: string;
}

export default function Spinner({
  size = 'md',
  color = 'primary',
  className = '',
}: SpinnerProps) {
  const sizeClasses: Record<string, string> = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const colorClasses: Record<string, string> = {
    primary: 'border-blue-500 border-t-transparent',
    white: 'border-white border-t-transparent',
    gray: 'border-gray-300 dark:border-slate-600 border-t-gray-500 dark:border-t-slate-400',
  };

  return (
    <div
      className={`rounded-full border-2 animate-spin ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
    />
  );
}
