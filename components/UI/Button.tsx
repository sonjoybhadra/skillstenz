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
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap';

  const sizeClasses: Record<string, string> = {
    xs: 'px-3 py-1.5 text-xs rounded',
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
    xl: 'px-9 py-4 text-lg rounded-xl',
  };

  const variantClasses: Record<string, string> = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/25 focus:ring-blue-500',
    secondary: 'bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-900 dark:text-white focus:ring-gray-500',
    outline: 'bg-transparent border-2 border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-900 dark:text-white focus:ring-gray-500',
    ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-400 focus:ring-gray-500',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25 focus:ring-red-500',
    success: 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/25 focus:ring-green-500',
    dark: 'bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 focus:ring-gray-900',
  };

  const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${fullWidth ? 'w-full' : ''} ${className}`;

  return (
    <button className={classes} disabled={disabled || loading} {...props}>
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {!loading && leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
}
