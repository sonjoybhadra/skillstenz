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
  style,
  ...props
}: CardProps) {
  const paddingStyles: Record<string, string> = {
    none: '0',
    sm: '12px',
    md: '20px',
    lg: '32px',
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    default: {
      background: 'var(--bg-primary)',
      border: '1px solid var(--border-primary)',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
    },
    elevated: {
      background: 'var(--bg-primary)',
      border: 'none',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
    },
    outlined: {
      background: 'transparent',
      border: '2px solid var(--border-primary)',
      boxShadow: 'none',
    },
    filled: {
      background: 'var(--bg-secondary)',
      border: 'none',
      boxShadow: 'none',
    },
  };

  const baseStyles: React.CSSProperties = {
    borderRadius: 'var(--radius-lg)',
    padding: paddingStyles[padding],
    transition: 'all 0.3s ease',
    cursor: clickable ? 'pointer' : 'default',
    ...variantStyles[variant],
    ...style,
  };

  return (
    <div
      style={baseStyles}
      className={`ui-card ui-card-${variant} ${hoverable ? 'ui-card-hoverable' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className = '',
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      style={{
        padding: '16px 20px',
        borderBottom: '1px solid var(--border-primary)',
        ...style,
      }}
      className={`ui-card-header ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardBody({
  children,
  className = '',
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      style={{
        padding: '20px',
        ...style,
      }}
      className={`ui-card-body ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardFooter({
  children,
  className = '',
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      style={{
        padding: '16px 20px',
        borderTop: '1px solid var(--border-primary)',
        ...style,
      }}
      className={`ui-card-footer ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
