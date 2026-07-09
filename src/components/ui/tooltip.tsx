import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import { cn } from '../../lib/utils';

const tooltipContentVariants = cva(
  'z-50 overflow-hidden rounded-sm px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] shadow-lg outline-none',
  {
    variants: {
      tone: {
        default: 'bg-black text-white',
        inverse: 'bg-[color:var(--igloo-surface)] text-[color:var(--igloo-black)]',
      },
    },
    defaultVariants: {
      tone: 'default',
    },
  },
);

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = forwardRef<
  ElementRef<typeof TooltipPrimitive.Content>,
  ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> & VariantProps<typeof tooltipContentVariants>
>(({ className, sideOffset = 8, tone, children, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(tooltipContentVariants({ tone }), className)}
      {...props}
    >
      {children}
      <TooltipPrimitive.Arrow className={tone === 'inverse' ? 'fill-[color:var(--igloo-surface)]' : 'fill-black'} />
    </TooltipPrimitive.Content>
  </TooltipPrimitive.Portal>
));

TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent };
