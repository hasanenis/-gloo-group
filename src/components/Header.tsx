import React, { useLayoutEffect, useRef, useState } from 'react';
import { Languages } from 'lucide-react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { Link, useLocation } from 'react-router-dom';
import { motionDuration, motionEase, motionStagger, usePrefersReducedMotion } from '../lib/motion';
import { useSiteNavigate } from '../hooks/useSiteNavigate';
import { useLocale } from '../i18n';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

/** Routes that open on a full-bleed dark hero — header starts transparent
 *  over it and turns solid once the user scrolls past it. Every other route
 *  (e.g. the projects listing, which opens on a white filter bar) forces the
 *  solid state immediately since there's no dark backdrop to sit on. */
function hasHeroBackdrop(pathname: string) {
  return pathname === '/' || pathname === '/projects1' || pathname.startsWith('/projects/');
}

function NavUnderlineItem({
  to,
  href,
  onNavigate,
  children,
}: {
  to?: string;
  href?: string;
  onNavigate?: () => void;
  children: React.ReactNode;
}) {
  const underlineRef = useRef<HTMLSpanElement>(null);

  const handleEnter = () => {
    const underline = underlineRef.current;
    if (!underline) return;
    gsap.killTweensOf(underline);
    gsap.fromTo(
      underline,
      { scaleX: 0, transformOrigin: 'left center' },
      { scaleX: 1, duration: 0.34, ease: motionEase.smooth },
    );
  };

  const handleLeave = () => {
    const underline = underlineRef.current;
    if (!underline) return;
    gsap.killTweensOf(underline);
    gsap.to(underline, {
      scaleX: 0,
      transformOrigin: 'right center',
      duration: 0.3,
      ease: motionEase.smooth,
    });
  };

  const handleClick = (event: React.MouseEvent) => {
    if (!onNavigate) return;
    event.preventDefault();
    onNavigate();
  };

  const content = (
    <>
      {children}
      <span
        ref={underlineRef}
        aria-hidden="true"
        className="nav-underline pointer-events-none absolute inset-x-0 -bottom-1 h-[1.5px] origin-left scale-x-0 bg-current"
      />
    </>
  );

  const className = 'relative inline-flex items-center gap-[4px] pb-1';

  if (to) {
    return (
      <Link
        to={to}
        className={className}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onClick={handleClick}
      >
        {content}
      </Link>
    );
  }

  return (
    <a
      href={href ?? '#'}
      className={className}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={handleClick}
    >
      {content}
    </a>
  );
}

function LocaleMenu({ isScrolled }: { isScrolled: boolean }) {
  const { locale, setLocale, t } = useLocale();
  const buttonClass = isScrolled
    ? 'border-[color:var(--igloo-control-border)] bg-[color:var(--igloo-control-bg)] text-[color:var(--igloo-control-text)] hover:bg-[color:var(--igloo-surface-soft)]'
    : 'border-white/20 bg-transparent text-white hover:bg-white/10';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={`locale-menu inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] transition-colors ${buttonClass}`}
        >
          <Languages className="h-3.5 w-3.5" />
          {locale.toUpperCase()}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[9rem] shadow-none">
        {(['en', 'fr'] as const).map((option) => (
          <DropdownMenuItem
            key={option}
            onSelect={(event) => {
              event.preventDefault();
              setLocale(option);
            }}
            className={locale === option ? 'bg-[color:var(--igloo-surface-soft)] font-semibold' : ''}
          >
            {option.toUpperCase()}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function Header() {
  const location = useLocation();
  const goTo = useSiteNavigate();
  const { t } = useLocale();
  const heroBackdrop = hasHeroBackdrop(location.pathname);
  const [isScrolled, setIsScrolled] = useState(!heroBackdrop);
  const prefersReducedMotion = usePrefersReducedMotion();
  const headerRef = useRef<HTMLElement>(null);
  const isScrolledRef = useRef(isScrolled);

  useLayoutEffect(() => {
    if (!heroBackdrop) {
      isScrolledRef.current = true;
      setIsScrolled(true);
      return;
    }

    const handleScroll = () => {
      const nextIsScrolled = window.scrollY > window.innerHeight - 80;
      if (isScrolledRef.current === nextIsScrolled) return;
      isScrolledRef.current = nextIsScrolled;
      setIsScrolled(nextIsScrolled);
    };

    handleScroll();
    const raf = window.requestAnimationFrame(handleScroll);
    const settleTimer = window.setTimeout(handleScroll, 220);

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(settleTimer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [heroBackdrop, location.pathname]);

  useGSAP(() => {
    if (prefersReducedMotion) {
      gsap.set(['.brand-logo', '.nav-menu a', '.nav-menu button', '.locale-menu'], {
        clearProps: 'all',
        opacity: 1,
        x: 0,
        y: 0,
      });
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: motionEase.smooth } });

    gsap.set(['.brand-logo', '.nav-menu a', '.nav-menu button', '.locale-menu'], { opacity: 0 });
    tl.fromTo(
      '.brand-logo',
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: motionDuration.section },
      0.2,
    );
    tl.fromTo(
      '.nav-menu a, .nav-menu button',
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: motionDuration.hover, stagger: motionStagger.standard },
      0.6,
    );
    tl.fromTo(
      '.locale-menu',
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: motionDuration.hover },
      0.7,
    );
  }, { scope: headerRef, dependencies: [prefersReducedMotion] });

  const solidHeaderClass = 'bg-[color:var(--igloo-header-bg)] py-2 text-[color:var(--igloo-header-text)] shadow-none';
  const overlayHeaderClass = 'bg-transparent py-2.5 text-white shadow-none backdrop-blur-0';
  const navToneClass = isScrolled ? 'text-[color:var(--igloo-header-text)]' : 'text-white';
  const logoSrc = isScrolled
    ? 'https://i.ibb.co/84bV50SH/Chat-GPT-mage-5-May-2026-21-16-47-removebg-preview.png'
    : 'https://i.ibb.co/fY50LKcW/Chat-GPT-mage-5-May-2026-21-15-03-removebg-preview.png';

  return (
    <header
      ref={headerRef}
      data-header-state={isScrolled ? 'solid' : 'overlay'}
      className={`app-main-header fixed left-0 top-0 z-50 flex w-full items-center justify-between px-6 font-sans transition-all duration-300 xl:px-10 ${
        isScrolled ? solidHeaderClass : overlayHeaderClass
      }`}
      style={!isScrolled ? { textShadow: '0 1px 18px rgba(0,0,0,0.4)' } : undefined}
    >
      <div className="brand-logo flex cursor-pointer select-none items-center lg:ml-[-6px]">
        <Link
          to="/"
          onClick={(event) => {
            event.preventDefault();
            goTo('/');
          }}
        >
          <img
            src={logoSrc}
            alt="Igloo Construction"
            className="origin-left h-[54px] w-auto object-contain transition-all duration-300 drop-shadow-sm md:h-[62px] lg:h-[74px] xl:h-[82px]"
          />
        </Link>
      </div>

      <div className="ml-auto flex items-center gap-2 lg:hidden">
        <LocaleMenu isScrolled={isScrolled} />
      </div>

      <div className="ml-auto hidden items-center gap-4 lg:flex">
        <nav className={`nav-menu flex items-center gap-5 text-[15px] font-medium tracking-[0.01em] xl:gap-6 xl:text-[16px] ${navToneClass}`}>
          <NavUnderlineItem to="/" onNavigate={() => goTo('/')}>
            {t('home')}
          </NavUnderlineItem>
          <NavUnderlineItem to="/about" onNavigate={() => goTo('/about')}>
            {t('company')}
          </NavUnderlineItem>
          <NavUnderlineItem to="/projects" onNavigate={() => goTo('/projects')}>
            {t('projects')}
          </NavUnderlineItem>
          <NavUnderlineItem to="/contact" onNavigate={() => goTo('/contact')}>
            {t('contact')}
          </NavUnderlineItem>
        </nav>
        <LocaleMenu isScrolled={isScrolled} />
      </div>
    </header>
  );
}
