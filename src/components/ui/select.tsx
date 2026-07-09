import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import { cn } from '../../lib/utils';

const selectTriggerVariants = cva(
  'flex h-11 w-full items-center justify-between rounded-sm border border-[color:var(--igloo-border)] bg-[color:var(--igloo-surface)] px-3.5 py-2.5 text-sm text-[color:var(--igloo-black)] ring-offset-[color:var(--igloo-surface)] transition-colors placeholder:text-[color:var(--igloo-muted)] focus:outline-none focus:ring-2 focus:ring-[#c22026]/35 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      tone: {
        default: '',
        inverse: 'border-white/14 bg-white/6 text-white ring-offset-black placeholder:text-white/38 focus:ring-white/35',
      },
    },
    defaultVariants: {
      tone: 'default',
    },
  },
);

const selectContentVariants = cva(
  'z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-sm border border-[color:var(--igloo-border)] bg-[color:var(--igloo-surface)] text-[color:var(--igloo-black)] shadow-[0_18px_60px_rgba(0,0,0,0.18)] data-[state=open]:opacity-100 data-[state=closed]:opacity-0',
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

function Select({ ...props }: ComponentPropsWithoutRef<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root {...props} />;
}

const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;
const SelectLabel = SelectPrimitive.Label;
const SelectSeparator = SelectPrimitive.Separator;

const SelectTrigger = forwardRef<
  ElementRef<typeof SelectPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & VariantProps<typeof selectTriggerVariants>
>(({ className, children, tone, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(selectTriggerVariants({ tone }), className)}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-60" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));

SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectContent = forwardRef<
  ElementRef<typeof SelectPrimitive.Content>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Content> & VariantProps<typeof selectContentVariants>
>(({ className, children, position = 'popper', tone, ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      position={position}
      className={cn(selectContentVariants({ tone }), className)}
      {...props}
    >
      <SelectPrimitive.ScrollUpButton className="flex cursor-default items-center justify-center py-1.5 text-[color:var(--igloo-muted)]">
        <ChevronUp className="h-4 w-4" />
      </SelectPrimitive.ScrollUpButton>
      <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
      <SelectPrimitive.ScrollDownButton className="flex cursor-default items-center justify-center py-1.5 text-[color:var(--igloo-muted)]">
        <ChevronDown className="h-4 w-4" />
      </SelectPrimitive.ScrollDownButton>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));

SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectItem = forwardRef<
  ElementRef<typeof SelectPrimitive.Item>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
    <SelectPrimitive.Item
      ref={ref}
      className={cn(
      'relative flex w-full cursor-default select-none items-center rounded-[0.2rem] py-2.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-[color:var(--igloo-surface-soft)] focus:text-[color:var(--igloo-black)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className,
      )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));

SelectItem.displayName = SelectPrimitive.Item.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectContent,
  SelectItem,
};
