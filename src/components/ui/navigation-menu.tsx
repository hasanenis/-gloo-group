import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import { cn } from '../../lib/utils';

const navigationMenuTriggerVariants = cva(
  'inline-flex items-center justify-center rounded-sm px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c22026]/40 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      tone: {
        default: 'text-[color:var(--igloo-muted)] hover:text-[color:var(--igloo-black)] data-[state=open]:text-[#c22026]',
        inverse: 'text-white/78 hover:text-white data-[state=open]:text-white',
      },
    },
    defaultVariants: {
      tone: 'default',
    },
  },
);

const navigationMenuLinkVariants = cva(
  'block rounded-sm px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c22026]/40 focus-visible:ring-offset-2',
  {
    variants: {
      tone: {
        default: 'text-[color:var(--igloo-muted)] hover:bg-[color:var(--igloo-surface-soft)] hover:text-[color:var(--igloo-black)]',
        inverse: 'text-white/78 hover:bg-white/10 hover:text-white',
      },
    },
    defaultVariants: {
      tone: 'default',
    },
  },
);

const NavigationMenu = NavigationMenuPrimitive.Root;
const NavigationMenuList = NavigationMenuPrimitive.List;
const NavigationMenuItem = NavigationMenuPrimitive.Item;
const NavigationMenuLink = NavigationMenuPrimitive.Link;
const NavigationMenuTrigger = forwardRef<
  ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger> & VariantProps<typeof navigationMenuTriggerVariants>
>(({ className, tone, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={cn(navigationMenuTriggerVariants({ tone }), className)}
    {...props}
  />
));

NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName;

const NavigationMenuContent = forwardRef<
  ElementRef<typeof NavigationMenuPrimitive.Content>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
    <NavigationMenuPrimitive.Content
      ref={ref}
      className={cn(
      'absolute left-0 top-0 w-full rounded-sm border border-[color:var(--igloo-border)] bg-[color:var(--igloo-surface)] p-2 shadow-[0_16px_45px_rgba(0,0,0,0.14)]',
        className,
      )}
    {...props}
  />
));

NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName;

const NavigationMenuViewport = forwardRef<
  ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <div className={cn('absolute left-0 top-full flex justify-center')}>
    <NavigationMenuPrimitive.Viewport
      ref={ref}
      className={cn(
        'relative mt-2 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-sm border border-[color:var(--igloo-border)] bg-[color:var(--igloo-surface)] shadow-[0_16px_45px_rgba(0,0,0,0.14)] transition-[width,height] duration-300 md:w-[var(--radix-navigation-menu-viewport-width)]',
        className,
      )}
      {...props}
    />
  </div>
));

NavigationMenuViewport.displayName = NavigationMenuPrimitive.Viewport.displayName;

const NavigationMenuIndicator = forwardRef<
  ElementRef<typeof NavigationMenuPrimitive.Indicator>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    ref={ref}
    className={cn('top-full z-10 flex items-end justify-center overflow-hidden', className)}
    {...props}
  >
    <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-[1px] bg-[color:var(--igloo-surface)] shadow-[0_2px_8px_rgba(0,0,0,0.12)]" />
  </NavigationMenuPrimitive.Indicator>
));

NavigationMenuIndicator.displayName = NavigationMenuPrimitive.Indicator.displayName;

const NavigationMenuLinkItem = forwardRef<
  ElementRef<'a'>,
  ComponentPropsWithoutRef<'a'> & VariantProps<typeof navigationMenuLinkVariants>
>(({ className, tone, ...props }, ref) => (
  <a
    ref={ref}
    className={cn(navigationMenuLinkVariants({ tone }), className)}
    {...props}
  />
));

NavigationMenuLinkItem.displayName = 'NavigationMenuLinkItem';

const NavigationMenuListItem = ({ className, ...props }: ComponentPropsWithoutRef<'li'>) => (
  <li className={className} {...props} />
);

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuLinkItem,
  NavigationMenuViewport,
  NavigationMenuIndicator,
  NavigationMenuListItem,
  navigationMenuTriggerVariants,
  navigationMenuLinkVariants,
};
