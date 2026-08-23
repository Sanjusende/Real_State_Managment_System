import React from 'react';
import { SearchX, ArrowRight, RefreshCw } from 'lucide-react';
import Button from './Button';

export default function EmptyState({
  title = 'No properties found',
  description = 'Try adjusting your search filters, expanding the price range, or searching in a different city.',
  icon: Icon = SearchX,
  actionLabel = 'Reset Filters',
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
}) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-10 md:p-16 text-center max-w-xl mx-auto flex flex-col items-center">
      <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 border border-emerald-100 shadow-sm">
        <Icon className="w-8 h-8" />
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 max-w-md mb-6 leading-relaxed">
        {description}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {onAction && (
          <Button
            onClick={onAction}
            variant="primary"
            size="md"
            icon={RefreshCw}
          >
            {actionLabel}
          </Button>
        )}

        {onSecondaryAction && secondaryActionLabel && (
          <Button
            onClick={onSecondaryAction}
            variant="outline"
            size="md"
            icon={ArrowRight}
            iconPosition="right"
          >
            {secondaryActionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
