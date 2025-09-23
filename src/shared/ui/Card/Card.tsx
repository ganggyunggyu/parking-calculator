import React from 'react';
import { cn } from '@/shared';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'glass' | 'gradient';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, variant = 'glass', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl shadow-2xl transition-all duration-300',
          'hover:shadow-3xl hover:scale-[1.02]',
          // Variants
          variant === 'default' && [
            'border border-gray-200 bg-white'
          ],
          variant === 'glass' && [
            'backdrop-blur-xl bg-white/10 border border-white/20',
            'shadow-xl hover:shadow-2xl'
          ],
          variant === 'gradient' && [
            'bg-gradient-to-br from-white/20 to-white/5',
            'border border-white/30 backdrop-blur-lg'
          ],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col space-y-2 p-8 pb-6',
          'border-b border-white/10',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  gradient?: boolean;
}

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, children, gradient = false, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn(
          'text-2xl font-bold leading-none tracking-tight',
          gradient ? [
            'bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent'
          ] : 'text-white',
          className
        )}
        {...props}
      >
        {children}
      </h3>
    );
  }
);

CardTitle.displayName = 'CardTitle';

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('p-8 pt-6', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardContent.displayName = 'CardContent';