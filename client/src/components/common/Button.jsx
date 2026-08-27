import React from 'react';
import clsx from 'clsx';

export default function Button({
  children,
  type = 'button',
  variant = 'primary', // primary, secondary, dark, outline, danger, ghost, light, subtle
  size = 'md', // sm, md, lg
  className = '',
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  onClick,
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none cursor-pointer tracking-tight';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5 rounded-lg',
    md: 'px-4 py-2.5 text-xs sm:text-sm gap-2 rounded-xl',
    lg: 'px-6 py-3 text-sm sm:text-base gap-2.5 rounded-2xl font-bold shadow-sm',
  };

  const variantStyles = {
    primary:
      'bg-[#ff5a3c] hover:bg-[#e04b30] text-white shadow-md shadow-[#ff5a3c]/25 focus:ring-[#ff5a3c] active:scale-[0.98]',
    secondary:
      'bg-[#0b1528] hover:bg-[#101c34] text-white shadow-sm focus:ring-[#0b1528] active:scale-[0.98]',
    dark:
      'bg-[#08101e] hover:bg-[#0b1528] text-white border border-white/10 shadow-sm focus:ring-slate-700 active:scale-[0.98]',
    outline:
      'border border-slate-200 hover:border-[#ff5a3c] bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 focus:ring-slate-300 shadow-2xs',
    outlinePrimary:
      'border border-[#ff5a3c]/80 text-[#ff5a3c] hover:bg-[#ff5a3c]/10 focus:ring-[#ff5a3c]',
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white shadow-xs focus:ring-rose-500 active:scale-[0.98]',
    ghost:
      'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 focus:ring-slate-300',
    light:
      'bg-[#ff5a3c]/10 text-[#ff5a3c] hover:bg-[#ff5a3c]/20 border border-[#ff5a3c]/20 focus:ring-[#ff5a3c]',
    subtle:
      'bg-slate-100 hover:bg-slate-200 text-slate-800 focus:ring-slate-300',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={clsx(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant] || variantStyles.primary,
        className
      )}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-0.5 mr-2 h-4 w-4 text-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
      )}
      {!loading && Icon && iconPosition === 'left' && <Icon className="w-4 h-4 flex-shrink-0" />}
      <span>{children}</span>
      {!loading && Icon && iconPosition === 'right' && <Icon className="w-4 h-4 flex-shrink-0" />}
    </button>
  );
}

