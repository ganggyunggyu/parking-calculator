import React from 'react';
import { cn } from '@/shared';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, fullWidth = false, icon, ...props }, ref) => {
    return (
      <div className={cn('flex flex-col space-y-2', fullWidth && 'w-full')}>
        {label && (
          <label className={cn(
            'text-sm font-medium text-gray-900',
            'flex items-center gap-2'
          )}>
            {icon && <span className="text-base">{icon}</span>}
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            className={cn(
              'flex h-11 w-full rounded-lg border px-3 py-2 text-sm',
              'bg-white border-gray-300 text-gray-900',
              'placeholder:text-gray-400',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
              'disabled:cursor-not-allowed disabled:opacity-50',
              // Date/DateTime input 스타일링
              '[&::-webkit-calendar-picker-indicator]:cursor-pointer',
              error && 'border-red-300 focus:ring-red-500 focus:border-red-500',
              className
            )}
            {...props}
          />
          {error && (
            <div className={cn(
              'absolute -bottom-1 left-0 right-0 h-0.5',
              'bg-red-400 rounded-full'
            )}></div>
          )}
        </div>
        {error && (
          <div className={cn('flex items-center gap-2 mt-1')}>
            <span className="text-sm">⚠️</span>
            <span className="text-sm text-red-600 font-medium">{error}</span>
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';