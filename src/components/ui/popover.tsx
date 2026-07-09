import * as PopoverPrimitive from '@radix-ui/react-popover';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import { cn } from '../../lib/utils';

const popoverContentVariants = cva(
  'z-50 w-[min(20rem,calc(100vw-1rem))] rounded-sm border border-[color:var(--igloo-border)] bg-[color:var(--igloo-surface)] p-4 text-[color:var(--igloo-black)] shadow-[0_18px_60px_rgba(0,0,0,0.18)] outline-none transition duration-200 data-[state=open]:opacity-100 data-[state=closed]:opacity-0 data-[state=open]:scale-100 data-[state=closed]:scale-95',
  {
    variants: {
      tone: {
        default: '',
        inverse: 'border-white/12 bg-[color:var(--igloo-black)] text-[color:var(--igloo-surface)]',
      },
    },
    defaultVariants: {
      tone: 'default',
    },
  },
);

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverAnchor = PopoverPrimitive.Anchor;
const PopoverClose = PopoverPrimitive.Close;

const PopoverContent = forwardRef<
  ElementRef<typeof PopoverPrimitive.Content>,
  ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & VariantProps<typeof popoverContentVariants>
>(({ className, sideOffset = 8, tone, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(popoverContentVariants({ tone }), className)}
      {...props}
    />
  </PopoverPrimitive.Portal>
));

PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverAnchor, PopoverClose, PopoverContent };
