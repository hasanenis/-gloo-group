import type { MouseEvent } from 'react';
import { useRef } from 'react';
import { Mail, MapPin, Phone, ArrowUpRight } from 'lucide-react';
import { companyProfile } from '../data/projects';
import { homepageContent, localize } from '../data/homepageContent';
import { useLocale } from '../i18n';
import { useSiteNavigate } from '../hooks/useSiteNavigate';
import { useHomeTextReveal } from '../hooks/useHomeTextReveal';
import iglooLogo from '../assets/branding/igloo-intro-logo.png';

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const { locale, t } = useLocale();
  const goTo = useSiteNavigate();
  const content = homepageContent.footer;

  useHomeTextReveal(footerRef, [locale]);

  const navigateTo = (path: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    goTo(path);
  };

  return (
    <footer ref={footerRef} className="app-footer">
      <div className="app-footer__inner">
        <div className="app-footer__top">
          <div>
            <img src={iglooLogo} alt="Igloo Construction" className="app-footer__logo" />
            <h2
              className="app-footer__headline"
              data-home-text-reveal
              data-home-text-reveal-start="top 84%"
            >
              {localize(content.title, locale)}
            </h2>
            <p
              className="app-footer__lead"
              data-home-text-reveal
              data-home-text-reveal-start="top 88%"
            >
              {localize(content.lead, locale)}
            </p>
          </div>

          <div className="app-footer__cta">
            <div
              className="app-footer__eyebrow"
              data-home-text-reveal
              data-home-text-reveal-mode="block"
            >
              {localize(content.eyebrow, locale)}
            </div>
            <a href={`mailto:${companyProfile.email}`} className="app-footer__cta-link">
              <span
                data-home-text-reveal
                data-home-text-reveal-mode="block"
              >
                {localize(content.emailLabel, locale)}
              </span>
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <a href={`tel:${companyProfile.phones[0].replace(/\s/g, '')}`} className="app-footer__cta-link">
              <span
                data-home-text-reveal
                data-home-text-reveal-mode="block"
              >
                {localize(content.phoneLabel, locale)}
              </span>
              <Phone className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="app-footer__middle">
          <div>
            <h3
              className="app-footer__heading"
              data-home-text-reveal
              data-home-text-reveal-mode="block"
            >
              {t('office')}
            </h3>
            <address className="app-footer__address">
              <MapPin className="mb-3 h-4 w-4 text-[#e82a2e]" />
              <div
                className="not-italic"
                data-home-text-reveal
                data-home-text-reveal-start="top 88%"
              >
                {companyProfile.address}
              </div>
            </address>
          </div>

          <div>
            <h3
              className="app-footer__heading"
              data-home-text-reveal
              data-home-text-reveal-mode="block"
            >
              {t('contact')}
            </h3>
            <div className="app-footer__links">
              {companyProfile.phones.map((phone) => (
                <a key={phone} href={`tel:${phone.replace(/\s/g, '')}`}>
                  <Phone className="mr-2 inline h-4 w-4 text-[#e82a2e]" />
                  <span
                    data-home-text-reveal
                    data-home-text-reveal-mode="block"
                  >
                    {phone}
                  </span>
                </a>
              ))}
              <a href={`mailto:${companyProfile.email}`}>
                <Mail className="mr-2 inline h-4 w-4 text-[#e82a2e]" />
                <span
                  data-home-text-reveal
                  data-home-text-reveal-mode="block"
                >
                  {companyProfile.email}
                </span>
              </a>
            </div>
          </div>

          <div>
            <h3
              className="app-footer__heading"
              data-home-text-reveal
              data-home-text-reveal-mode="block"
            >
              {t('navigation')}
            </h3>
            <div className="app-footer__navlinks">
              <a href="/" onClick={navigateTo('/')} data-home-text-reveal data-home-text-reveal-mode="block">{t('home')}</a>
              <a href="/about" onClick={navigateTo('/about')} data-home-text-reveal data-home-text-reveal-mode="block">{t('company')}</a>
              <a href="/projects" onClick={navigateTo('/projects')} data-home-text-reveal data-home-text-reveal-mode="block">{t('projects')}</a>
              <a href="/#proof" onClick={navigateTo('/#proof')} data-home-text-reveal data-home-text-reveal-mode="block">{localize({ en: 'Proof', fr: 'Preuves', dz: 'الدليل', tr: 'Kanıt' }, locale)}</a>
              <a href="/#services" onClick={navigateTo('/#services')} data-home-text-reveal data-home-text-reveal-mode="block">{localize({ en: 'Process', fr: 'Processus', dz: 'المراحل', tr: 'Süreç' }, locale)}</a>
              <a href="/contact" onClick={navigateTo('/contact')} data-home-text-reveal data-home-text-reveal-mode="block">{t('contact')}</a>
            </div>
          </div>
        </div>

        <div className="app-footer__bottom">
          <p data-home-text-reveal data-home-text-reveal-mode="block">© 2026 Igloo Construction. {localize({ en: 'All rights reserved.', fr: 'Tous droits réservés.', dz: 'كل الحقوق محفوظة.', tr: 'Tüm hakları saklıdır.' }, locale)}</p>
          <p data-home-text-reveal data-home-text-reveal-start="top 88%">{localize(content.proofLine, locale)}</p>
        </div>
      </div>
    </footer>
  );
}
