import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

const iconButtonVariants = cva(
  'inline-flex min-h-10 min-w-10 items-center justify-center rounded-sm border transition-[background-color,border-color,box-shadow,color,opacity,transform] duration-200 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c22026]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--igloo-surface)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-[#c22026] text-white shadow-sm hover:bg-[#a61b20]',
        outline: 'border-[color:var(--igloo-border)] bg-[color:var(--igloo-surface)] text-[color:var(--igloo-black)] hover:bg-[color:var(--igloo-surface-soft)]',
        ghost: 'border-transparent bg-transparent text-[color:var(--igloo-black)] hover:bg-[color:var(--igloo-surface-soft)]',
        inverse: 'border-white/10 bg-white/10 text-white hover:bg-white/15',
      },
      size: {
        default: 'h-10 w-10',
        sm: 'h-9 w-9',
        lg: 'h-11 w-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof iconButtonVariants> & {
    asChild?: boolean;
  };

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        ref={ref}
        className={cn(iconButtonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);

IconButton.displayName = 'IconButton';

export { IconButton, iconButtonVariants };
export type { IconButtonProps };
