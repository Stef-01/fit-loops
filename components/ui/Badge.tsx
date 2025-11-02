import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline';
}

const Badge: React.FC<BadgeProps> = ({ className, variant = 'default', ...props }) => {
  const baseClasses = 'inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-neutral-950 backdrop-blur-sm';

  const variantClasses = {
    default: 'border-emerald-500/30 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 text-emerald-300 shadow-lg shadow-emerald-500/20',
    outline: 'border-white/20 bg-white/5 text-white/80 shadow-md',
  };

  const combinedClasses = [
    baseClasses,
    variantClasses[variant],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={combinedClasses} {...props} />
  );
};

export { Badge };
