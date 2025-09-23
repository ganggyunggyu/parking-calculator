import React from 'react';
import { cn } from '@/shared';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', fullWidth = false, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium',
          'transition-colors duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          // Variants
          variant === 'default' && [
            'bg-white border border-gray-300 text-gray-900',
            'hover:bg-gray-50 focus-visible:ring-gray-500'
          ],
          variant === 'primary' && [
            'bg-blue-600 text-white border-0',
            'hover:bg-blue-700 focus-visible:ring-blue-500'
          ],
          variant === 'secondary' && [
            'bg-gray-600 text-white border-0',
            'hover:bg-gray-700 focus-visible:ring-gray-500'
          ],
          variant === 'danger' && [
            'bg-red-600 text-white border-0',
            'hover:bg-red-700 focus-visible:ring-red-500'
          ],
          variant === 'ghost' && [
            'bg-transparent border-0 text-gray-700',
            'hover:bg-gray-100 focus-visible:ring-gray-500'
          ],
          variant === 'outline' && [
            'bg-transparent border border-gray-300 text-gray-700',
            'hover:bg-gray-50 focus-visible:ring-gray-500'
          ],
          // Sizes
          size === 'sm' && 'h-9 px-3 text-sm',
          size === 'md' && 'h-10 px-4 py-2',
          size === 'lg' && 'h-11 px-6 text-base',
          size === 'xl' && 'h-12 px-8 text-lg',
          // Full width
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';