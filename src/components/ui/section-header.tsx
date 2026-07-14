import type { HTMLAttributes, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { Badge } from './badge';

const sectionHeaderVariants = cva('flex w-full flex-col gap-4 md:flex-row md:items-end md:justify-between', {
  variants: {
    align: {
      left: 'text-left',
      center: 'items-center text-center md:justify-center',
    },
    tone: {
      default: 'text-[color:var(--igloo-black)]',
      inverse: 'text-white',
    },
  },
  defaultVariants: {
    align: 'left',
    tone: 'default',
  },
});

type SectionHeaderProps = HTMLAttributes<HTMLElement> &
  VariantProps<typeof sectionHeaderVariants> & {
    eyebrow?: ReactNode;
    title: ReactNode;
    description?: ReactNode;
    action?: ReactNode;
    reveal?: boolean;
    eyebrowLabel?: string;
    eyebrowClassName?: string;
    titleClassName?: string;
    descriptionClassName?: string;
    actionClassName?: string;
  };

function SectionHeader({
  className,
  align,
  tone,
  eyebrow,
  eyebrowLabel,
  title,
  description,
  action,
  reveal = false,
  eyebrowClassName,
  titleClassName,
  descriptionClassName,
  actionClassName,
  ...props
}: SectionHeaderProps) {
  return (
    <header
      className={cn(sectionHeaderVariants({ align, tone }), className)}
      {...props}
    >
      <div className={cn('max-w-3xl space-y-3', align === 'center' && 'mx-auto')}>
        {(eyebrow || eyebrowLabel) && (
          <Badge
            variant={tone === 'inverse' ? 'outline' : 'soft'}
            className={cn('w-fit', tone === 'inverse' && 'border-white/12 bg-white/8 text-white', eyebrowClassName)}
            data-home-text-reveal={reveal ? '' : undefined}
            data-home-text-reveal-mode="block"
          >
            {eyebrow ?? eyebrowLabel}
          </Badge>
        )}
        <div className="space-y-2">
          <h2
            className={cn(
              'text-[clamp(1.9rem,3vw,3.1rem)] font-light uppercase leading-[0.95] tracking-[0.04em]',
              tone === 'inverse' ? 'text-white' : 'text-[#c22026]',
              'text-balance',
              titleClassName,
            )}
            data-home-text-reveal={reveal ? '' : undefined}
          >
            {title}
          </h2>
          {description && (
            <p
              className={cn(
                'max-w-2xl text-sm leading-relaxed md:text-[15px]',
                tone === 'inverse' ? 'text-white/58' : 'text-[color:var(--igloo-muted)]',
                'text-pretty',
                descriptionClassName,
              )}
              data-home-text-reveal={reveal ? '' : undefined}
            >
              {description}
            </p>
          )}
        </div>
      </div>
      {action && <div className={cn('shrink-0', actionClassName)}>{action}</div>}
    </header>
  );
}

SectionHeader.displayName = 'SectionHeader';

export { SectionHeader, sectionHeaderVariants };
export type { SectionHeaderProps };
