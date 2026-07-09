import { useRef } from 'react';
import { CalendarCheck, ClipboardCheck, DraftingCompass, HardHat, KeyRound } from 'lucide-react';
import { homepageContent, localize, type HomepageProcessStep } from '../data/homepageContent';
import { useLocale } from '../i18n';
import { useHomeTextReveal } from '../hooks/useHomeTextReveal';

const DRAW_IMAGE = '/projects/rouiba-4-promotional-villas/Draw.png';

const STEP_ICONS: Record<HomepageProcessStep['id'], typeof ClipboardCheck> = {
  coordination: ClipboardCheck,
  engineering: DraftingCompass,
  site: HardHat,
  monitoring: CalendarCheck,
  handover: KeyRound,
};

export default function DeliveryProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { locale } = useLocale();
  const content = homepageContent.process;

  useHomeTextReveal(sectionRef, [locale]);

  return (
    <section
      id="services"
      ref={sectionRef}
      aria-labelledby="delivery-process-title"
      className="relative z-30 w-full overflow-hidden bg-white px-6 py-20 font-sans text-[color:var(--igloo-black)] md:px-14 md:py-28"
    >
      <div className="relative z-10 mx-auto max-w-[1440px]">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(440px,0.92fr)] lg:gap-12">
          <div className="process-header relative z-10 max-w-[42rem] pt-2">
            <span
              className="inline-flex text-[11px] font-semibold uppercase tracking-[0.34em] text-[#c22026]"
              data-home-text-reveal
              data-home-text-reveal-mode="block"
            >
              {localize(content.eyebrow, locale)}
            </span>
            <div className="mt-4 h-px w-12 bg-[#c22026]" />

            <h2
              id="delivery-process-title"
              className="mt-8 max-w-[14ch] font-serif text-[clamp(2.2rem,4.8vw,5.9rem)] font-normal leading-[0.92] tracking-[-0.035em] text-black md:max-w-[10.5ch] md:text-[clamp(3rem,4.8vw,5.9rem)] md:leading-[0.96]"
              data-home-text-reveal
              data-home-text-reveal-start="top 84%"
            >
              {localize(content.title, locale)}
            </h2>

            <p
              className="mt-7 max-w-[34rem] text-[15px] leading-[1.72] text-black/58 md:text-[16px]"
              data-home-text-reveal
              data-home-text-reveal-start="top 88%"
            >
              {localize(content.lead, locale)}
            </p>
          </div>

          <figure className="process-visual relative z-10 mx-auto w-full max-w-[220px] justify-self-center md:max-w-[380px] lg:-mt-4 lg:mx-0 lg:max-w-[820px] lg:justify-self-end">
            <div
              aria-hidden="true"
              className="absolute inset-0 hidden bg-[linear-gradient(130deg,rgba(0,0,0,0.018),transparent_26%)] xl:block"
            />
            <img
              src={DRAW_IMAGE}
              alt=""
              aria-hidden="true"
              className="relative z-10 w-full select-none object-contain drop-shadow-[0_30px_42px_rgba(0,0,0,0.045)]"
              loading="eager"
              decoding="async"
            />
          </figure>
        </div>

        <div className="process-rail relative mt-0 md:mt-16 xl:mt-20">
          <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-5 xl:gap-0">
            {content.steps.map((step, index) => {
              const Icon = STEP_ICONS[step.id];
              const stepNumber = String(index + 1).padStart(2, '0');

              return (
                <article
                  key={step.id}
                  className="process-step relative min-h-[156px] overflow-hidden border border-black/[0.06] bg-white px-4 py-5 md:min-h-[214px] md:px-6 md:py-6 xl:min-h-[390px] xl:px-6 xl:py-16"
                >
                  <span className="absolute left-4 top-4 text-[20px] font-light leading-none tracking-[-0.04em] text-black/26 md:left-5 md:top-5 md:text-[22px] xl:left-6 xl:top-8 xl:text-[26px]">
                    <span data-home-text-reveal data-home-text-reveal-mode="block">
                      {stepNumber}
                    </span>
                  </span>

                  <div className="mt-6 flex justify-center md:mt-8 xl:mt-0">
                    <div className="flex h-10 w-10 items-center justify-center text-[#c22026] md:h-[48px] md:w-[48px] xl:h-14 xl:w-14">
                      <Icon className="h-10 w-10 md:h-11 md:w-11" strokeWidth={1.7} />
                    </div>
                  </div>

                  <h3
                    className="mx-auto mt-4 max-w-[13ch] text-center font-serif text-[clamp(1.05rem,1.8vw,1.95rem)] font-normal leading-[1.04] tracking-[-0.02em] text-black md:mt-6 md:text-[clamp(1.2rem,1.8vw,1.95rem)]"
                    data-home-text-reveal
                    data-home-text-reveal-start="top 88%"
                  >
                    {localize(step.title, locale)}
                  </h3>

                  <div className="mx-auto mt-2.5 h-px w-8 bg-[#c22026]" />

                  <p
                    className="mx-auto mt-2.5 max-w-[18rem] text-center text-[12px] leading-[1.5] text-black/62 md:max-w-[17rem] md:text-[14px] md:leading-[1.65] xl:text-[15px] xl:leading-[1.72]"
                    data-home-text-reveal
                    data-home-text-reveal-start="top 88%"
                  >
                    {localize(step.body, locale)}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
