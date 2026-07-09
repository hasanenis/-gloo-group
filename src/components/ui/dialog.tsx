import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import { cn } from '../../lib/utils';

const dialogOverlayVariants = cva(
  'fixed inset-0 z-50 bg-black/28 backdrop-blur-[2px] transition-opacity duration-200 data-[state=open]:opacity-100 data-[state=closed]:opacity-0',
  {
  variants: {
      tone: {
        default: '',
        subtle: 'bg-black/18 backdrop-blur-[1px]',
        dock: 'bg-black/18 backdrop-blur-[1px]',
        sheet: 'bg-black/18 backdrop-blur-[1px]',
    },
  },
    defaultVariants: {
      tone: 'default',
    },
  },
);

const dialogContentVariants = cva(
  'fixed left-1/2 top-1/2 z-50 grid w-[min(100vw-1.5rem,41rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-[1.2rem] border border-[color:var(--igloo-border)] bg-[color:var(--igloo-surface)] p-6 text-[color:var(--igloo-black)] shadow-[0_24px_90px_rgba(0,0,0,0.24)] transition duration-200 data-[state=open]:opacity-100 data-[state=open]:scale-100 data-[state=closed]:opacity-0 data-[state=closed]:scale-95',
  {
    variants: {
      tone: {
        default: '',
        dock: 'left-auto right-[clamp(18px,2vw,32px)] top-auto bottom-[clamp(86px,7vw,108px)] translate-x-0 translate-y-0 w-[min(390px,calc(100vw-32px))] max-h-[min(680px,calc(100svh-128px))] overflow-hidden rounded-[30px] p-0',
        sheet: 'left-1/2 top-[calc(50%+4px)] -translate-y-1/2',
      },
    },
    defaultVariants: {
      tone: 'default',
    },
  },
);

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = forwardRef<
  ElementRef<typeof DialogPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> & VariantProps<typeof dialogOverlayVariants>
>(({ className, tone, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(dialogOverlayVariants({ tone }), className)}
    {...props}
  />
));

DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = forwardRef<
  ElementRef<typeof DialogPrimitive.Content>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & VariantProps<typeof dialogContentVariants>
>(({ className, children, tone, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay tone={tone} />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(dialogContentVariants({ tone }), className)}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--igloo-border)] bg-[color:var(--igloo-surface-soft)] text-[color:var(--igloo-black)] transition-colors hover:bg-[color:var(--igloo-surface-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c22026]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--igloo-surface)]">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));

DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }: ComponentPropsWithoutRef<'div'>) => (
  <div className={cn('flex flex-col gap-1.5', className)} {...props} />
);

const DialogFooter = ({ className, ...props }: ComponentPropsWithoutRef<'div'>) => (
  <div className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)} {...props} />
);

const DialogTitle = forwardRef<
  ElementRef<typeof DialogPrimitive.Title>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title ref={ref} className={cn('text-lg font-semibold tracking-tight', className)} {...props} />
));

DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = forwardRef<
  ElementRef<typeof DialogPrimitive.Description>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn('text-sm text-[color:var(--igloo-muted)]', className)} {...props} />
));

DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
