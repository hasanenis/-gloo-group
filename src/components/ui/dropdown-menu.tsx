import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { Check, ChevronRight, Circle } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import { cn } from '../../lib/utils';

const dropdownMenuContentVariants = cva(
  'z-50 min-w-[13rem] overflow-hidden rounded-sm border border-[color:var(--igloo-border)] bg-[color:var(--igloo-surface)] p-1 text-[color:var(--igloo-black)] shadow-[0_18px_60px_rgba(0,0,0,0.18)] outline-none transition duration-200 data-[state=open]:opacity-100 data-[state=closed]:opacity-0 data-[state=open]:scale-100 data-[state=closed]:scale-95',
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

const dropdownMenuItemVariants = cva(
  'relative flex cursor-default select-none items-center rounded-[0.2rem] px-3 py-2 text-sm outline-none transition-colors focus:bg-[color:var(--igloo-surface-soft)] focus:text-[color:var(--igloo-black)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
  {
    variants: {
      tone: {
        default: 'text-[color:var(--igloo-black)]',
        inverse: 'text-white focus:bg-white/10 focus:text-white',
      },
    },
    defaultVariants: {
      tone: 'default',
    },
  },
);

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuGroup = DropdownMenuPrimitive.Group;
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
const DropdownMenuSub = DropdownMenuPrimitive.Sub;
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const DropdownMenuContent = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Content>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content> & VariantProps<typeof dropdownMenuContentVariants>
>(({ className, sideOffset = 8, tone, ...props }, ref) => (
  <DropdownMenuPortal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(dropdownMenuContentVariants({ tone }), className)}
      {...props}
    />
  </DropdownMenuPortal>
));

DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

const DropdownMenuItem = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Item>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & VariantProps<typeof dropdownMenuItemVariants>
>(({ className, tone, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(dropdownMenuItemVariants({ tone }), className)}
    {...props}
  />
));

DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const DropdownMenuCheckboxItem = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem> & VariantProps<typeof dropdownMenuItemVariants>
>(({ className, children, checked, tone, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(dropdownMenuItemVariants({ tone }), className)}
    checked={checked}
    {...props}
  >
    <span className="mr-2 flex h-4 w-4 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
));

DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;

const DropdownMenuRadioItem = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem> & VariantProps<typeof dropdownMenuItemVariants>
>(({ className, children, tone, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(dropdownMenuItemVariants({ tone }), className)}
    {...props}
  >
    <span className="mr-2 flex h-4 w-4 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2.5 w-2.5 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
));

DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

const DropdownMenuLabel = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Label>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Label ref={ref} className={cn('px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-[color:var(--igloo-muted)]', className)} {...props} />
));

DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const DropdownMenuSeparator = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Separator>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator ref={ref} className={cn('my-1 h-px bg-[color:var(--igloo-border)]', className)} {...props} />
));

DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

const DropdownMenuShortcut = ({ className, ...props }: ComponentPropsWithoutRef<'span'>) => (
  <span className={cn('ml-auto text-xs tracking-[0.08em] text-[color:var(--igloo-muted)]', className)} {...props} />
);

const DropdownMenuSubTrigger = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> &
    VariantProps<typeof dropdownMenuItemVariants> & {
      inset?: boolean;
    }
>(({ className, inset, tone, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(dropdownMenuItemVariants({ tone }), inset && 'pl-8', className)}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </DropdownMenuPrimitive.SubTrigger>
));

DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;

const DropdownMenuSubContent = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent> & VariantProps<typeof dropdownMenuContentVariants>
>(({ className, tone, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(dropdownMenuContentVariants({ tone }), className)}
    {...props}
  />
));

DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuRadioGroup,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};
