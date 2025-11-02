import React from 'react';

interface SwitchProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, checked, onCheckedChange, ...props }, ref) => {
    return (
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onCheckedChange(!checked)}
        className={`peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-lg transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 ${checked ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-emerald-500/50' : 'bg-neutral-700 shadow-neutral-900/50'} ${className}`}
        ref={ref}
        style={{
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        {...props}
      >
        <span
          aria-hidden="true"
          className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-300 ${checked ? 'translate-x-5' : 'translate-x-0'}`}
          style={{
            transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        />
      </button>
    );
  }
);
Switch.displayName = 'Switch';

export { Switch };
