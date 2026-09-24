import { lazy, Suspense, useEffect, useRef, useState, type RefObject } from 'react';
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

function useDeferredSection<T extends HTMLElement>(): [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    if ((window as Window & { __IGLOO_PRERENDER__?: boolean }).__IGLOO_PRERENDER__) {
      setReady(true);
      return;
    }
    if (!('IntersectionObserver' in window)) {
      setReady(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      setReady(true);
      observer.disconnect();
    }, { rootMargin: '700px 0px' });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);
  return [ref, ready];
}

export default function Home() {
  const location = useLocation();
  const lenis = useLenis();
  const [aboutRef, aboutReady] = useDeferredSection<HTMLElement>();
  const [projectsRef, projectsReady] = useDeferredSection<HTMLElement>();
  const [processRef, processReady] = useDeferredSection<HTMLElement>();
  const [footprintRef, footprintReady] = useDeferredSection<HTMLElement>();
  const [footerRef, footerReady] = useDeferredSection<HTMLElement>();

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
      <section ref={aboutRef} id="about" data-guide-section="about" className="bg-white">
        {aboutReady ? <Suspense fallback={<SectionFallback className="bg-white" minHeight="42rem" />}><AboutUs /></Suspense> : <SectionFallback className="bg-white" minHeight="42rem" />}
      </section>
      <section ref={projectsRef} id="featured-projects" data-guide-section="projects" className="overflow-x-hidden">
        {projectsReady ? <Suspense fallback={<SectionFallback className="bg-white" minHeight="34rem" />}><FeaturedProjects /></Suspense> : <SectionFallback className="bg-white" minHeight="34rem" />}
      </section>
      <section ref={processRef} data-guide-section="process">
        {processReady ? <Suspense fallback={<SectionFallback className="bg-[#f7f6f1]" minHeight="28rem" />}><DeliveryProcessSection /></Suspense> : <SectionFallback className="bg-[#f7f6f1]" minHeight="28rem" />}
      </section>
      <section ref={footprintRef} data-guide-section="footprint">
        {footprintReady ? <Suspense fallback={<SectionFallback className="bg-white" minHeight="36rem" />}><ProjectFootprintSection /></Suspense> : <SectionFallback className="bg-white" minHeight="36rem" />}
      </section>
      <section ref={footerRef} id="contact" data-guide-section="footer">
        {footerReady ? <Suspense fallback={<SectionFallback className="bg-white" minHeight="24rem" />}><Footer /></Suspense> : <SectionFallback className="bg-white" minHeight="24rem" />}
      </section>
    </main>
  );
}
