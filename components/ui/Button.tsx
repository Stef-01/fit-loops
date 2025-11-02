import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
  size?: 'default' | 'sm';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]';

    const variantClasses = {
      default: 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30',
      outline: 'border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 text-white shadow-md',
    };

    const sizeClasses = {
      default: 'h-10 px-6 py-2.5',
      sm: 'h-9 rounded-lg px-4 py-2 text-xs',
    };

    const combinedClasses = [
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      className
    ].filter(Boolean).join(' ');

    return (
      <button
        className={combinedClasses}
        ref={ref}
        style={{
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
