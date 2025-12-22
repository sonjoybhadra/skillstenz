'use client';

import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  clickable?: boolean;
}

export default function Card({
  children,
  variant = 'default',
  padding = 'md',
  hoverable = false,
  clickable = false,
  className = '',
  ...props
}: CardProps) {
  const paddingClasses: Record<string, string> = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-8',
  };

  const variantClasses: Record<string, string> = {
    default: 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm',
    elevated: 'bg-white dark:bg-slate-800 shadow-lg',
    outlined: 'bg-transparent border-2 border-gray-200 dark:border-slate-700',
    filled: 'bg-gray-50 dark:bg-slate-900',
  };

  const hoverClasses = hoverable ? 'hover:shadow-lg hover:-translate-y-1 transition-all duration-300' : '';
  const clickableClasses = clickable ? 'cursor-pointer' : '';

  const classes = `rounded-xl ${paddingClasses[padding]} ${variantClasses[variant]} ${hoverClasses} ${clickableClasses} ${className}`;

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`px-5 py-4 border-b border-gray-200 dark:border-slate-700 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-5 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`px-5 py-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 rounded-b-xl ${className}`} {...props}>
      {children}
    </div>
  );
}
