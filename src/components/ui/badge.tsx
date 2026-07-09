import type { HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-sm border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-[#c22026] text-white',
        secondary: 'border-transparent bg-[color:var(--igloo-black)] text-[color:var(--igloo-surface)]',
        outline: 'border-[color:var(--igloo-border)] bg-transparent text-[color:var(--igloo-black)]',
        soft: 'border-transparent bg-[color:var(--igloo-surface-soft)] text-[color:var(--igloo-black)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

type BadgeProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>;

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

Badge.displayName = 'Badge';

export { Badge, badgeVariants };
export type { BadgeProps };
