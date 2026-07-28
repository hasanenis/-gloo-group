import { useRef } from 'react';
import { Building2, ShieldCheck, UsersRound } from 'lucide-react';
import ImageSlider from './ImageSlider';
import { homepageContent, localize } from '../data/homepageContent';
import { useLocale } from '../i18n';
import { useEditorialReveal } from '../hooks/useEditorialReveal';

const PROOF_ICONS = [ShieldCheck, UsersRound, Building2];

export default function AboutUs() {
  const containerRef = useRef<HTMLElement>(null);
  const { locale } = useLocale();
  const content = homepageContent.about;

  useEditorialReveal(containerRef, [locale]);

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden bg-white px-5 pt-6 pb-14 font-sans text-black md:px-10 md:pt-8 md:pb-20 xl:px-16 xl:pt-10 xl:pb-20"
      aria-label="Company profile"
    >
      <div className="relative z-30 mx-auto max-w-[1600px]">
        <div className="grid gap-10 border-y border-black/[0.09] py-6 lg:grid-cols-[minmax(0,1.14fr)_minmax(0,0.86fr)] lg:gap-0 lg:py-0">
          <div className="flex min-h-[380px] flex-col justify-start lg:border-r lg:border-black/[0.09] lg:py-12 lg:pr-12 xl:pr-[4.5rem]">
            <div
              className="text-[12px] font-bold uppercase tracking-[0.22em] text-[#c22026] md:text-[13px]"
              data-editorial-reveal="label"
            >
              {localize(content.eyebrow, locale)}
            </div>

            <h2
              className="mt-6 max-w-[40rem] font-serif text-[clamp(2.8rem,4.2vw,4.1rem)] font-semibold leading-[0.96] tracking-normal text-balance text-black md:mt-8"
              data-editorial-reveal="display"
            >
              {localize(content.title, locale)}
            </h2>

            <div className="mt-6 h-px w-16 bg-[#c22026]" aria-hidden="true" />

            <div
              className="mt-6 max-w-[62ch] space-y-7 text-[17px] leading-[1.75] text-black/64 md:text-[19px]"
              data-editorial-reveal-group="copy"
            >
              {content.paragraphs.map((paragraph) => (
                <p
                  key={paragraph.en}
                  className="text-pretty"
                  data-editorial-reveal-item
                >
                  {localize(paragraph, locale)}
                </p>
              ))}
            </div>
          </div>

          <div className="flex min-h-[380px] flex-col justify-start lg:py-12 lg:pl-12 xl:pl-[4.5rem]">
            <div className="mb-5 flex items-center gap-6 text-[14px] leading-relaxed text-black/66 md:text-[15px]">
              <ShieldCheck className="h-6 w-6 shrink-0 text-[#c22026]" strokeWidth={1.7} />
              <span
                data-editorial-reveal="action"
              >
                {localize(content.credential, locale)}
              </span>
            </div>

            <div className="profile-image">
              <ImageSlider />
            </div>
          </div>
        </div>

        <div className="grid border-b border-black/[0.09] py-10 lg:grid-cols-2 lg:py-12">
          <div
            className="grid gap-y-8 sm:grid-cols-3 lg:border-r lg:border-black/[0.09] lg:pr-10 xl:pr-16"
            data-editorial-reveal-group="stats"
          >
            {content.metrics.map((metric) => (
              <div
                key={metric.value}
                className="sm:px-8 sm:first:pl-0 sm:last:pr-0 sm:[&:not(:last-child)]:border-r sm:[&:not(:last-child)]:border-black/[0.12]"
                data-editorial-reveal-item
              >
                <div
                  className="font-serif text-[42px] font-medium leading-none text-[#c22026] md:text-[48px]"
                >
                  {metric.value}
                </div>
                <div
                  className="mt-5 max-w-[18ch] text-[12px] font-bold uppercase leading-[1.45] tracking-[0.18em] text-black/62"
                >
                  {localize(metric.label, locale)}
                </div>
              </div>
            ))}
          </div>

          <div
            className="mt-10 grid gap-y-8 sm:grid-cols-3 lg:mt-0 lg:pl-10 xl:pl-16"
            data-editorial-reveal-group="cards"
          >
            {content.proofs.map((proof, index) => {
              const Icon = PROOF_ICONS[index] ?? ShieldCheck;

              return (
                <div
                  key={proof.title.en}
                  className="flex flex-col items-start sm:px-8 sm:first:pl-0 sm:last:pr-0 sm:[&:not(:last-child)]:border-r sm:[&:not(:last-child)]:border-black/[0.12] lg:items-center lg:text-center"
                  data-editorial-reveal-item
                >
                  <Icon className="h-9 w-9 text-[#c22026]" strokeWidth={1.45} />
                  <h3
                    className="mt-6 max-w-[18ch] text-[15px] font-medium leading-snug text-black md:text-[16px]"
                  >
                    {localize(proof.title, locale)}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
