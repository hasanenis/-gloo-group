import { forwardRef, type InputHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const inputVariants = cva(
  'flex w-full rounded-sm border border-[color:var(--igloo-border)] bg-[color:var(--igloo-surface)] px-4 py-3 text-sm text-[color:var(--igloo-black)] transition-colors placeholder:text-[color:var(--igloo-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c22026]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--igloo-surface)] disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: {
        default: 'h-11',
        sm: 'h-9 px-3 text-[13px]',
        lg: 'h-12 px-4 text-[15px]',
      },
      tone: {
        default: '',
        inverse: 'border-white/14 bg-white/6 text-white placeholder:text-white/38 focus-visible:ring-white/35 focus-visible:ring-offset-black',
      },
    },
    defaultVariants: {
      size: 'default',
      tone: 'default',
    },
  },
);

type InputProps = InputHTMLAttributes<HTMLInputElement> &
  VariantProps<typeof inputVariants>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, size, tone, type = 'text', ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(inputVariants({ size, tone }), className)}
      {...props}
    />
  ),
);

Input.displayName = 'Input';

export { Input, inputVariants };
export type { InputProps };
