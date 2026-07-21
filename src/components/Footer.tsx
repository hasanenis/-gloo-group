import { useRef, type MouseEvent } from 'react';
import { Mail, MapPin, Phone, ArrowUpRight } from 'lucide-react';
import { companyProfile } from '../data/projects';
import { homepageContent, localize } from '../data/homepageContent';
import { useLocale } from '../i18n';
import { useEditorialReveal } from '../hooks/useEditorialReveal';
import { useSiteNavigate } from '../hooks/useSiteNavigate';
import iglooLogo from '../assets/branding/igloo-intro-logo.png';
import SiteLink from './SiteLink';

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const { locale, t } = useLocale();
  const goTo = useSiteNavigate();
  const content = homepageContent.footer;

  useEditorialReveal(footerRef, [locale]);

  const navigateTo = (path: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    goTo(path);
  };

  return (
    <footer ref={footerRef} className="app-footer">
      <div className="app-footer__inner">
        <div className="app-footer__top">
          <div>
            <img src={iglooLogo} alt="Igloo Construction" width={420} height={110} className="app-footer__logo" />
            <h2
              className="app-footer__headline"
              data-editorial-reveal="display"
            >
              {localize(content.title, locale)}
            </h2>
            <p
              className="app-footer__lead"
              data-editorial-reveal="copy"
            >
              {localize(content.lead, locale)}
            </p>
          </div>

          <div className="app-footer__cta" data-editorial-reveal="panel">
            <div
              className="app-footer__eyebrow"
            >
              {localize(content.eyebrow, locale)}
            </div>
            <a href={`mailto:${companyProfile.email}`} className="app-footer__cta-link">
              <span>
                {localize(content.emailLabel, locale)}
              </span>
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <a href={`tel:${companyProfile.phones[0].replace(/\s/g, '')}`} className="app-footer__cta-link">
              <span>
                {localize(content.phoneLabel, locale)}
              </span>
              <Phone className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="app-footer__middle" data-editorial-reveal-group="columns">
          <div data-editorial-reveal-item>
            <h3 className="app-footer__heading">
              {t('office')}
            </h3>
            <address className="app-footer__address">
              <MapPin className="mb-3 h-4 w-4 text-[#e82a2e]" />
              <div className="not-italic">
                {companyProfile.address}
              </div>
            </address>
          </div>

          <div data-editorial-reveal-item>
            <h3 className="app-footer__heading">
              {t('contact')}
            </h3>
            <div className="app-footer__links">
              {companyProfile.phones.map((phone) => (
                <a key={phone} href={`tel:${phone.replace(/\s/g, '')}`}>
                  <Phone className="mr-2 inline h-4 w-4 text-[#e82a2e]" />
                  <span>
                    {phone}
                  </span>
                </a>
              ))}
              <a href={`mailto:${companyProfile.email}`}>
                <Mail className="mr-2 inline h-4 w-4 text-[#e82a2e]" />
                <span>
                  {companyProfile.email}
                </span>
              </a>
            </div>
          </div>

          <div data-editorial-reveal-item>
            <h3 className="app-footer__heading">
              {t('navigation')}
            </h3>
            <div className="app-footer__navlinks">
              <SiteLink to="/">{t('home')}</SiteLink>
              <SiteLink to="/about">{t('company')}</SiteLink>
              <SiteLink to="/projects">{t('projects')}</SiteLink>
              <SiteLink to="/services">{t('services')}</SiteLink>
              <a href="/#proof" onClick={navigateTo('/#proof')}>{localize({ en: 'Proof', fr: 'Preuves', dz: 'الدليل', tr: 'Kanıt' }, locale)}</a>
              <a href="/#services" onClick={navigateTo('/#services')}>{localize({ en: 'Process', fr: 'Processus', dz: 'المراحل', tr: 'Süreç' }, locale)}</a>
              <SiteLink to="/contact">{t('contact')}</SiteLink>
            </div>
          </div>
        </div>

        <div className="app-footer__bottom">
          <p>© 2026 Igloo Construction. {localize({ en: 'All rights reserved.', fr: 'Tous droits réservés.', dz: 'كل الحقوق محفوظة.', tr: 'Tüm hakları saklıdır.' }, locale)}</p>
          <p>{localize(content.proofLine, locale)}</p>
        </div>
      </div>
    </footer>
  );
}
