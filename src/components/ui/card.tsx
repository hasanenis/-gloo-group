import type { HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const cardVariants = cva('rounded-sm border border-[color:var(--igloo-border)] bg-[color:var(--igloo-surface)] text-[color:var(--igloo-black)] shadow-sm', {
  variants: {
    variant: {
      default: '',
      muted: 'bg-[color:var(--igloo-surface-soft)]',
      inverse: 'border-[color:var(--igloo-border)] bg-[color:var(--igloo-black)] text-[color:var(--igloo-surface)]',
    },
    padding: {
      default: 'p-6 md:p-8',
      compact: 'p-4 md:p-5',
      none: 'p-0',
    },
  },
  defaultVariants: {
    variant: 'default',
    padding: 'default',
  },
});

type CardProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardVariants>;

function Card({ className, variant, padding, ...props }: CardProps) {
  return <div className={cn(cardVariants({ variant, padding }), className)} {...props} />;
}

function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col gap-1.5', className)} {...props} />;
}

function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-base font-semibold leading-none tracking-tight', className)} {...props} />;
}

function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-[color:var(--igloo-muted)]', className)} {...props} />;
}

function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('pt-4', className)} {...props} />;
}

function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex items-center pt-4', className)} {...props} />;
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, cardVariants };
export type { CardProps };
