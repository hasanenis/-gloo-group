import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import { cn } from '../../lib/utils';

const tabsListVariants = cva('inline-flex items-center rounded-sm border p-1 text-[color:var(--igloo-black)]', {
  variants: {
    tone: {
      default: 'border-[color:var(--igloo-border)] bg-[color:var(--igloo-surface)]',
      inverse: 'border-white/14 bg-white/6 text-white',
    },
  },
  defaultVariants: {
    tone: 'default',
  },
});

const tabsTriggerVariants = cva(
  'inline-flex items-center justify-center rounded-[0.2rem] px-3.5 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c22026]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--igloo-surface)] disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm',
  {
    variants: {
      tone: {
        default: 'text-[color:var(--igloo-muted)] hover:text-[color:var(--igloo-black)] data-[state=active]:bg-[#c22026] data-[state=active]:text-white',
        inverse: 'text-white/60 hover:text-white data-[state=active]:bg-white data-[state=active]:text-black',
      },
    },
    defaultVariants: {
      tone: 'default',
    },
  },
);

function Tabs({ ...props }: ComponentPropsWithoutRef<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root {...props} />;
}

function TabsList({
  className,
  tone,
  ...props
}: ComponentPropsWithoutRef<typeof TabsPrimitive.List> &
  VariantProps<typeof tabsListVariants>) {
  return <TabsPrimitive.List className={cn(tabsListVariants({ tone }), className)} {...props} />;
}

const TabsTrigger = forwardRef<
  ElementRef<typeof TabsPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> &
    VariantProps<typeof tabsTriggerVariants>
>(({ className, tone, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(tabsTriggerVariants({ tone }), className)}
    {...props}
  />
));

TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = forwardRef<
  ElementRef<typeof TabsPrimitive.Content>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn('mt-4 outline-none focus-visible:outline-none', className)}
    {...props}
  />
));

TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
