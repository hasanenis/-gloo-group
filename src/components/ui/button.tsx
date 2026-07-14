import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex min-h-10 items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-medium transition-[background-color,border-color,box-shadow,color,opacity,transform] duration-200 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c22026]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--igloo-surface)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-[#c22026] text-white shadow-sm hover:bg-[#a61b20]',
        secondary: 'bg-[color:var(--igloo-black)] text-[color:var(--igloo-surface)] hover:opacity-90',
        outline: 'border border-[color:var(--igloo-border)] bg-[color:var(--igloo-surface)] text-[color:var(--igloo-black)] hover:bg-[color:var(--igloo-surface-soft)]',
        ghost: 'bg-transparent text-[color:var(--igloo-black)] hover:bg-[color:var(--igloo-surface-soft)]',
        link: 'bg-transparent text-[#c22026] underline-offset-4 hover:underline',
        subtle: 'bg-[color:var(--igloo-surface-soft)] text-[color:var(--igloo-black)] hover:bg-[color:var(--igloo-surface-muted)]',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3 text-[13px]',
        lg: 'h-11 px-6',
        icon: 'h-10 w-10',
        'icon-sm': 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);

Button.displayName = 'Button';

export { Button, buttonVariants };
export type { ButtonProps };
