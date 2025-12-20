'use client';

import React from 'react';
import Image from 'next/image';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'away' | 'busy';
  rounded?: boolean;
}

export default function Avatar({
  src,
  alt,
  name,
  size = 'md',
  status,
  rounded = true,
  className = '',
  style,
  ...props
}: AvatarProps) {
  const sizeStyles: Record<string, { width: string; height: string; fontSize: string }> = {
    xs: { width: '24px', height: '24px', fontSize: '10px' },
    sm: { width: '32px', height: '32px', fontSize: '12px' },
    md: { width: '40px', height: '40px', fontSize: '14px' },
    lg: { width: '56px', height: '56px', fontSize: '20px' },
    xl: { width: '80px', height: '80px', fontSize: '28px' },
  };

  const statusColors: Record<string, string> = {
    online: '#22c55e',
    offline: '#9ca3af',
    away: '#f59e0b',
    busy: '#ef4444',
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const baseStyles: React.CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg-accent)',
    color: 'white',
    fontWeight: 600,
    borderRadius: rounded ? '50%' : 'var(--radius-md)',
    overflow: 'hidden',
    flexShrink: 0,
    ...sizeStyles[size],
    ...style,
  };

  return (
    <div
      style={baseStyles}
      className={`ui-avatar ui-avatar-${size} ${className}`}
      {...props}
    >
      {src ? (
        <Image
          src={src}
          alt={alt || name || 'Avatar'}
          fill
          style={{
            objectFit: 'cover',
          }}
        />
      ) : name ? (
        getInitials(name)
      ) : (
        <svg width="60%" height="60%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      )}
      {status && (
        <span
          style={{
            position: 'absolute',
            bottom: '0',
            right: '0',
            width: size === 'xs' ? '8px' : size === 'sm' ? '10px' : '12px',
            height: size === 'xs' ? '8px' : size === 'sm' ? '10px' : '12px',
            background: statusColors[status],
            borderRadius: '50%',
            border: '2px solid var(--bg-primary)',
          }}
        />
      )}
    </div>
  );
}
