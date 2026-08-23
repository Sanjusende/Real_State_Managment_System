import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import Button from './Button';

export default function ErrorState({
  title = 'Something went wrong',
  message = 'We encountered an error while loading this content. Please try again.',
  onRetry,
}) {
  return (
    <div className="rounded-3xl border border-red-200 bg-red-50/50 p-8 md:p-12 text-center max-w-lg mx-auto flex flex-col items-center">
      <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
        <AlertTriangle className="w-7 h-7" />
      </div>

      <h3 className="text-lg font-bold text-slate-900 mb-1.5">{title}</h3>
      <p className="text-xs md:text-sm text-slate-600 mb-6 max-w-sm">{message}</p>

      {onRetry && (
        <Button onClick={onRetry} variant="secondary" size="sm" icon={RefreshCcw}>
          Try Again
        </Button>
      )}
    </div>
  );
}
