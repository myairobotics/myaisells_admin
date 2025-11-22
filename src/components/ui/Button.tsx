'use client';

import React from 'react';
import { LuLoader } from 'react-icons/lu';
import { cn } from '@/libs';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button = (
  { ref, children, variant = 'primary', loading = false, fullWidth = true, className, disabled, ...props }: ButtonProps & { ref?: React.RefObject<HTMLButtonElement | null> },
) => {
  const baseStyles
    = 'inline-flex items-center justify-center rounded-lg px-4 py-2 font-semibold focus:outline-none transition-colors';

  const variants: Record<string, string> = {
    primary: 'bg-primary text-white hover:bg-primary/90',
    secondary: 'bg-secondary text-white hover:bg-secondary/90',
    outline: 'border border-border text-dark hover:bg-muted',
    ghost: 'text-dark hover:bg-muted',
    danger: 'bg-error text-white hover:bg-error/90',
  };

  const widthClass = fullWidth ? 'w-full' : 'w-auto';

  return (
    <button
      type="button"
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        baseStyles,
        variants[variant] ?? variants.primary,
        widthClass,
        (disabled || loading) && 'cursor-not-allowed opacity-70',
        className,
      )}
      {...props}
    >
      {loading && (
        <LuLoader className="mr-2 h-4 w-4 animate-spin text-white" />
      )}
      {children}
    </button>
  );
};

Button.displayName = 'Button';
