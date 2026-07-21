import { forwardRef, type MouseEvent } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { localizedPath, useLocale } from '../i18n';
import { useSiteNavigate } from '../hooks/useSiteNavigate';

type SiteLinkProps = Omit<LinkProps, 'to'> & {
  to: string;
  transitionImage?: string;
};

function shouldUseNativeNavigation(event: MouseEvent<HTMLAnchorElement>) {
  return event.button !== 0
    || event.metaKey
    || event.ctrlKey
    || event.shiftKey
    || event.altKey
    || event.currentTarget.target === '_blank'
    || event.currentTarget.hasAttribute('download');
}

const SiteLink = forwardRef<HTMLAnchorElement, SiteLinkProps>(function SiteLink(
  { to, transitionImage, onClick, ...props },
  ref,
) {
  const { locale } = useLocale();
  const goTo = useSiteNavigate();
  const target = localizedPath(locale, to);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || shouldUseNativeNavigation(event)) return;

    event.preventDefault();
    goTo(to, transitionImage);
  };

  return <Link ref={ref} to={target} onClick={handleClick} {...props} />;
});

SiteLink.displayName = 'SiteLink';

export default SiteLink;
