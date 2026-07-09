import { lazy, Suspense, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HeroBanner from '../components/HeroBanner';
import HomeMechanicalBackdrop from '../components/HomeMechanicalBackdrop';
import { useLenis } from '../components/SmoothScrollProvider';

const FeaturedProjects = lazy(() => import('../components/FeaturedProjects'));
const DeliveryProcessSection = lazy(() => import('../components/DeliveryProcessSection'));
const AboutUs = lazy(() => import('../components/AboutUs'));
const ProjectFootprintSection = lazy(() => import('../components/ProjectFootprintSection'));
const Footer = lazy(() => import('../components/Footer'));

function SectionFallback({ className = '', minHeight = '20rem' }: { className?: string; minHeight?: string }) {
  return <div aria-hidden="true" className={className} style={{ minHeight }} />;
}

export default function Home() {
  const location = useLocation();
  const lenis = useLenis();

  useEffect(() => {
    if (!location.hash) return;

    const target = document.querySelector(location.hash);
    if (!target) return;

    const timer = window.setTimeout(() => {
      const headerOffset = window.innerWidth < 1024 ? -110 : -140;
      if (lenis) {
        lenis.scrollTo(target as HTMLElement, { offset: headerOffset });
      } else {
        const top = target.getBoundingClientRect().top + window.scrollY + headerOffset;
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      }
    }, 250);

    return () => window.clearTimeout(timer);
  }, [lenis, location.hash]);

  return (
    <main className="relative isolate overflow-x-hidden">
      <HomeMechanicalBackdrop />
      <section data-guide-section="hero">
        <HeroBanner />
      </section>
      <section id="about" data-guide-section="about" className="bg-white">
        <Suspense fallback={<SectionFallback className="bg-white" minHeight="42rem" />}>
          <AboutUs />
        </Suspense>
      </section>
      <section id="featured-projects" data-guide-section="projects" className="overflow-x-hidden">
        <Suspense fallback={<SectionFallback className="bg-white" minHeight="34rem" />}>
          <FeaturedProjects />
        </Suspense>
      </section>
      <section data-guide-section="process">
        <Suspense fallback={<SectionFallback className="bg-[#f7f6f1]" minHeight="28rem" />}>
          <DeliveryProcessSection />
        </Suspense>
      </section>
      <section data-guide-section="footprint">
        <Suspense fallback={<SectionFallback className="bg-white" minHeight="36rem" />}>
          <ProjectFootprintSection />
        </Suspense>
      </section>
      <section id="contact" data-guide-section="footer">
        <Suspense fallback={<SectionFallback className="bg-white" minHeight="24rem" />}>
          <Footer />
        </Suspense>
      </section>
    </main>
  );
}
