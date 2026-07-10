import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Mail,
  MapPin,
  Menu,
  Phone,
  X,
} from "lucide-react";
import { gsap } from "gsap";
import Draggable from "gsap/Draggable";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { LocaleToggle, useLocale, type Locale } from "../i18n";
import { companyProfile, projects } from "../data/projects";
import {
  buildBatProjectPageModel,
} from "../data/batProjectModel";
import { useLenis } from "../components/SmoothScrollProvider";
import { usePrefersReducedMotion } from "../lib/motion";
import {
  consumeBatPageTransitionEntry,
  onBatPageTransitionComplete,
  runBatPageTransition,
} from "../transitions/batPageTransition";
import { getBatHeroParallaxRange } from "../transitions/batHeroGeometry";
import iglooLogo from "../assets/branding/igloo-intro-logo.png";
import "../styles/bat-demo.css";

gsap.registerPlugin(ScrollTrigger, Draggable);

const BAT_DEMO_INTRO_KEY = "igloo:bat-demo-seen";
const JO_HOUSE_DEMO_TITLE = "Beyond Boundaries";
const JO_HOUSE_DEMO_TITLE_LINES = ["Beyond", "Boundaries"];
const JO_HOUSE_DEMO_PARAGRAPHS = [
  'This house is located in "La Bilbaína", one of the neighbourhoods with the highest per capita income in Bizkaia and in the whole of Spain. The initial challenge of this property is its extremely complicated orography and orientation. The location of the road and pedestrian access points and the positioning of the individual rooms required careful planning and calculation right from the initial sketches. However, the priority can be seen in the clear claim that emanates from every room: the view.',
  "The first floor, which can be accessed from the side, becomes a large open space without partitions or boundaries, allowing both a relationship with the garden on one side and a panoramic view of the landscape on the opposite side.",
  "The most private areas are located on the second floor. Four bedrooms with en-suite bathrooms and a large dressing room and office in the master suite complete the program of this house that seeks a panoramic view of the spectacular landscape.",
];
const JO_HOUSE_RELATED_PROJECTS = [
  { slug: "rouiba-4-promotional-villas", title: "L10 House" },
  { slug: "boudouaou-70-10-housing", title: "A4 House" },
  { slug: "dely-brahim-240-housing", title: "IB House" },
  { slug: "said-hamdine-mixed-real-estate", title: "U16 House" },
  { slug: "douaouda-300-500-housing", title: "Altos Reales I" },
] as const;

type CursorVariant = "default" | "rail";
type HeaderTone = "hero-light" | "hero-dark" | "editorial";
type ProjectRecord = (typeof projects)[number];
type NavigateTransitionOptions = {
  sourceImage?: HTMLImageElement | null;
  targetProject?: ProjectRecord | null;
};

function preloadImage(src?: string) {
  if (!src || typeof window === "undefined") return;

  const image = new Image();
  image.decoding = "async";
  image.src = src;
  void image.decode?.().catch(() => undefined);
}

function useFinePointer() {
  const [hasFinePointer, setHasFinePointer] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mediaQuery = window.matchMedia("(pointer: fine)");
    const handleChange = () => setHasFinePointer(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return hasFinePointer;
}

function splitIntoLineReveal(el: HTMLElement): HTMLElement[] {
  const text = (el.dataset.batText ?? el.textContent ?? "")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return [];

  const words = text.split(" ");

  el.textContent = "";
  const measureSpans = words.map((word) => {
    const span = document.createElement("span");
    span.textContent = word;
    span.style.display = "inline-block";
    return span;
  });

  measureSpans.forEach((span, index) => {
    el.appendChild(span);
    if (index < measureSpans.length - 1) {
      el.appendChild(document.createTextNode(" "));
    }
  });

  const groups: string[][] = [];
  let currentTop: number | null = null;
  let currentGroup: string[] = [];

  measureSpans.forEach((span) => {
    const top = span.offsetTop;
    if (currentTop === null || Math.abs(top - currentTop) > 2) {
      if (currentGroup.length) groups.push(currentGroup);
      currentGroup = [span.textContent ?? ""];
      currentTop = top;
    } else {
      currentGroup.push(span.textContent ?? "");
    }
  });

  if (currentGroup.length) groups.push(currentGroup);

  el.textContent = "";
  const lines: HTMLElement[] = [];
  groups.forEach((wordsGroup) => {
    const wrapper = document.createElement("span");
    wrapper.className = "bat-demo-line-wrapper";
    const line = document.createElement("span");
    line.className = "bat-demo-line";
    line.textContent = wordsGroup.join(" ");
    wrapper.appendChild(line);
    el.appendChild(wrapper);
    lines.push(line);
  });

  return lines;
}

function getHeroImageParallaxRange() {
  if (typeof window === "undefined") return { from: -12, to: 10 };
  return getBatHeroParallaxRange();
}

function getJoHouseFacts(locale: Locale) {
  return locale === "fr"
    ? [
        { label: "Typologie", value: "Maison individuelle" },
        { label: "Statut", value: "En cours" },
        { label: "Année", value: "2018" },
        { label: "Client", value: "Privé" },
        { label: "Surface", value: "900 m2" },
        { label: "Localisation", value: "La Bilbaína, Mungia" },
      ]
    : [
        { label: "Typology", value: "Single-Family House" },
        { label: "Status", value: "Ongoing" },
        { label: "Year", value: "2018" },
        { label: "Client", value: "Private" },
        { label: "Area", value: "900 m2" },
        { label: "Location", value: "La Bilbaína, Mungia" },
      ];
}

function BatDemoCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const hasFinePointer = useFinePointer();
  const shouldUseCustomCursor = hasFinePointer && !prefersReducedMotion;

  useEffect(() => {
    document.documentElement.classList.toggle(
      "bat-demo-custom-cursor",
      shouldUseCustomCursor,
    );

    return () => {
      document.documentElement.classList.remove("bat-demo-custom-cursor");
    };
  }, [shouldUseCustomCursor]);

  useEffect(() => {
    if (!shouldUseCustomCursor || !cursorRef.current) return;

    const el = cursorRef.current;
    const label = labelRef.current;
    const arrow = arrowRef.current;
    let activeLabel = "";
    let activeVariant: CursorVariant = "default";
    let isSuspended = false;
    let suspendReleaseTimer = 0;

    gsap.set(el, {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      xPercent: -50,
      yPercent: -50,
      width: 14,
      height: 14,
      opacity: 0,
      scale: 1,
      borderRadius: "999px",
    });

    if (label) gsap.set(label, { autoAlpha: 0, scale: 0.75 });
    if (arrow) gsap.set(arrow, { autoAlpha: 0, scale: 0.85 });

    const moveX = gsap.quickTo(el, "x", { duration: 0.16, ease: "power3.out" });
    const moveY = gsap.quickTo(el, "y", { duration: 0.16, ease: "power3.out" });

    const expand = (text: string, variant: CursorVariant) => {
      const isArrowLabel = text === "PREV" || text === "NEXT";
      const nextSize = variant === "rail" ? 92 : 84;

      if (text === activeLabel && variant === activeVariant) return;

      activeLabel = text;
      activeVariant = variant;

      el.classList.toggle("bat-demo-cursor--rail", variant === "rail");
      el.dataset.cursorArrow = String(isArrowLabel);
      el.dataset.cursorDirection = text === "PREV" ? "prev" : "next";

      if (label) {
        label.textContent = isArrowLabel ? "" : text;
      }

      gsap.to(el, {
        width: nextSize,
        height: nextSize,
        borderRadius: variant === "rail" ? "38%" : "999px",
        opacity: 1,
        duration: 0.24,
        ease: "power3.out",
        overwrite: "auto",
      });

      if (label) {
        gsap.to(label, {
          autoAlpha: isArrowLabel ? 0 : 1,
          scale: 1,
          duration: 0.16,
          ease: "power2.out",
          overwrite: true,
        });
      }

      if (arrow) {
        gsap.to(arrow, {
          autoAlpha: isArrowLabel ? 1 : 0,
          scale: isArrowLabel ? 1 : 0.85,
          duration: 0.16,
          ease: "power2.out",
          overwrite: true,
        });
      }
    };

    const shrink = () => {
      if (!activeLabel && activeVariant === "default") return;

      activeLabel = "";
      activeVariant = "default";

      el.classList.remove("bat-demo-cursor--rail");
      el.dataset.cursorArrow = "false";
      el.dataset.cursorDirection = "next";

      gsap.to(el, {
        width: 14,
        height: 14,
        borderRadius: "999px",
        duration: 0.22,
        ease: "power3.out",
        overwrite: "auto",
      });

      if (label) {
        gsap.to(label, {
          autoAlpha: 0,
          scale: 0.75,
          duration: 0.12,
          ease: "power2.in",
          overwrite: true,
        });
      }

      if (arrow) {
        gsap.to(arrow, {
          autoAlpha: 0,
          scale: 0.85,
          duration: 0.12,
          ease: "power2.in",
          overwrite: true,
        });
      }
    };

    const syncTarget = (event: PointerEvent) => {
      const target = event.target instanceof HTMLElement ? event.target : null;
      const ignored = target?.closest<HTMLElement>("[data-bat-cursor-ignore]");
      if (ignored) {
        shrink();
        return;
      }

      const card = target?.closest<HTMLElement>("[data-bat-cursor-card]");
      if (card) {
        expand(
          card.dataset.batCursorLabel ?? "VIEW",
          card.dataset.batCursorVariant === "rail" ? "rail" : "default",
        );
        return;
      }

      const rail = target?.closest<HTMLElement>("[data-bat-cursor-rail]");
      if (rail) {
        const rect = rail.getBoundingClientRect();
        const labelText =
          event.clientX < rect.left + rect.width / 2 ? "PREV" : "NEXT";
        expand(labelText, "rail");
        return;
      }

      shrink();
    };

    const onPointerMove = (event: PointerEvent) => {
      moveX(event.clientX);
      moveY(event.clientY);

      if (isSuspended) {
        if (document.documentElement.classList.contains("bat-demo-route-transitioning")) {
          gsap.set(el, { opacity: 0 });
          return;
        }

        isSuspended = false;
      }

      gsap.to(el, { opacity: 1, duration: 0.12, overwrite: "auto" });
      syncTarget(event);
    };

    const onLeave = () => {
      shrink();
      gsap.to(el, { opacity: 0, duration: 0.18 });
    };

    const onTransitionReset = () => {
      isSuspended = true;
      if (suspendReleaseTimer) window.clearTimeout(suspendReleaseTimer);
      activeLabel = "";
      activeVariant = "default";
      el.classList.remove("bat-demo-cursor--rail");
      el.dataset.cursorArrow = "false";
      el.dataset.cursorDirection = "next";
      gsap.killTweensOf([el, label, arrow]);
      gsap.set(el, {
        width: 14,
        height: 14,
        borderRadius: "999px",
        opacity: 0,
      });
      if (label) {
        label.textContent = "";
        gsap.set(label, { autoAlpha: 0, scale: 0.75 });
      }
      if (arrow) gsap.set(arrow, { autoAlpha: 0, scale: 0.85 });

      suspendReleaseTimer = window.setTimeout(() => {
        isSuspended = false;
      }, 4200);
    };

    const onTransitionRelease = () => {
      if (suspendReleaseTimer) {
        window.clearTimeout(suspendReleaseTimer);
        suspendReleaseTimer = 0;
      }
      isSuspended = false;
    };

    document.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("blur", onLeave);
    window.addEventListener("bat-demo-cursor-reset", onTransitionReset);
    window.addEventListener("bat-demo-cursor-release", onTransitionRelease);

    return () => {
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("blur", onLeave);
      window.removeEventListener("bat-demo-cursor-reset", onTransitionReset);
      window.removeEventListener("bat-demo-cursor-release", onTransitionRelease);
      if (suspendReleaseTimer) window.clearTimeout(suspendReleaseTimer);
      gsap.killTweensOf([el, label, arrow]);
    };
  }, [shouldUseCustomCursor]);

  if (!shouldUseCustomCursor) return null;

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="bat-demo-cursor rounded-full"
      data-cursor-arrow="false"
      data-cursor-direction="next"
      style={{ willChange: "transform" }}
    >
      <span ref={labelRef} className="bat-demo-cursor__label" />
      <span ref={arrowRef} className="bat-demo-cursor__arrow">
        <ArrowLeft
          className="bat-demo-cursor__arrow-icon bat-demo-cursor__arrow-icon--prev h-5 w-5 text-white"
          strokeWidth={1.8}
        />
        <ArrowRight
          className="bat-demo-cursor__arrow-icon bat-demo-cursor__arrow-icon--next h-5 w-5 text-white"
          strokeWidth={1.8}
        />
      </span>
    </div>
  );
}

function BatDemoPreloader({ onComplete }: { onComplete: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const completeRef = useRef(onComplete);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    completeRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    document.documentElement.classList.add("bat-demo-scroll-locked");
    return () => {
      document.documentElement.classList.remove("bat-demo-scroll-locked");
    };
  }, []);

  useGSAP(
    () => {
      if (prefersReducedMotion) {
        const timer = window.setTimeout(() => completeRef.current(), 700);
        return () => window.clearTimeout(timer);
      }

      gsap.set(".bat-demo-preloader__dot", {
        x: 24,
        opacity: 0,
      });
      gsap.set(".bat-demo-preloader__word", {
        y: 30,
        opacity: 0,
      });
      gsap.set(".bat-demo-preloader__rule", {
        scaleX: 0,
        transformOrigin: "left center",
      });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to(".bat-demo-preloader__dot", {
        x: 0,
        opacity: 1,
        duration: 0.65,
        stagger: 0.12,
      })
        .to(
          ".bat-demo-preloader__rule",
          {
            scaleX: 1,
            duration: 0.5,
          },
          "-=0.22",
        )
        .to(
          ".bat-demo-preloader__word",
          {
            y: 0,
            opacity: 1,
            duration: 0.82,
            stagger: 0.08,
          },
          "-=0.26",
        )
        .to({}, { duration: 0.55 })
        .to(rootRef.current, {
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
          onComplete: () => completeRef.current(),
        });
    },
    { scope: rootRef, dependencies: [prefersReducedMotion] },
  );

  return (
    <div ref={rootRef} className="bat-demo-preloader" data-bat-cursor-ignore>
      <div className="bat-demo-preloader__lockup">
        <div className="bat-demo-preloader__dots" aria-hidden="true">
          <span className="bat-demo-preloader__dot" />
          <span className="bat-demo-preloader__dot" />
          <span className="bat-demo-preloader__dot" />
        </div>
        <span className="bat-demo-preloader__rule" />
        <span className="bat-demo-preloader__word">IGLOO</span>
      </div>
    </div>
  );
}

function DemoHeader({
  isMenuOpen,
  tone,
  onToggleMenu,
}: {
  isMenuOpen: boolean;
  tone: HeaderTone;
  onToggleMenu: () => void;
}) {
  return (
    <header
      className={`bat-demo-header bat-demo-header--${tone} ${isMenuOpen ? "is-menu-open" : ""}`}
    >
      <div className="bat-demo-container bat-demo-header__inner">
        <Link
          to="/"
          aria-label="Igloo Construction"
          className="bat-demo-header__logo"
        >
          <img src={iglooLogo} alt="Igloo Construction" />
        </Link>

        <div className="flex items-center gap-3">
          <LocaleToggle className="border-current/20 text-[10px] tracking-[0.16em]" />
          <button
            type="button"
            onClick={onToggleMenu}
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="bat-demo-header__menu-button"
            data-bat-cursor-card
            data-bat-cursor-label={isMenuOpen ? "CLOSE" : "MENU"}
          >
            {isMenuOpen ? (
              <X className="h-8 w-8" strokeWidth={1.6} />
            ) : (
              <Menu className="h-8 w-8" strokeWidth={1.6} />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

function DemoMenu({
  open,
  locale,
  onClose,
  onNavigate,
  onScrollTo,
}: {
  open: boolean;
  locale: Locale;
  onClose: () => void;
  onNavigate: (to: string) => void;
  onScrollTo: (id: string) => void;
}) {
  const { t } = useLocale();

  const sections = [
    { id: "hero", label: locale === "fr" ? "Vue générale" : "Overview" },
    {
      id: "editorial",
      label: locale === "fr" ? "Texte éditorial" : "Editorial text",
    },
    { id: "media", label: locale === "fr" ? "Média" : "Media" },
    {
      id: "related",
      label: locale === "fr" ? "Projets liés" : "Related projects",
    },
    { id: "technical", label: locale === "fr" ? "Technique" : "Technical" },
    { id: "faq", label: locale === "fr" ? "FAQ" : "FAQ" },
    { id: "details", label: locale === "fr" ? "Détails" : "Details" },
    { id: "programme", label: locale === "fr" ? "Programme" : "Programme" },
    { id: "nearby", label: locale === "fr" ? "À proximité" : "Nearby" },
    { id: "contact", label: locale === "fr" ? "Contact" : "Contact" },
  ];

  return (
    <aside
      className={`bat-demo-menu ${open ? "is-open" : ""}`}
      data-bat-cursor-ignore
    >
      <div
        className="bat-demo-menu__backdrop"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="bat-demo-menu__panel">
        <div className="bat-demo-container pt-5 md:pt-7">
          <div className="flex items-center justify-between gap-4">
            <p className="bat-demo-kicker">
              {locale === "fr" ? "Menu" : "Menu"}
            </p>
            <button
              type="button"
              className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.26em] text-black"
              onClick={onClose}
              data-bat-cursor-card
              data-bat-cursor-label="CLOSE"
            >
              <X className="h-4 w-4" />
              {locale === "fr" ? "Fermer" : "Close"}
            </button>
          </div>
        </div>

        <div className="bat-demo-container grid gap-10 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:py-14">
          <div className="grid gap-6">
            <div className="grid gap-3">
              <p className="bat-demo-kicker">
                {locale === "fr" ? "Navigation rapide" : "Quick nav"}
              </p>
              <button
                type="button"
                className="bat-demo-menu__link text-left"
                onClick={() => onScrollTo("hero")}
                data-bat-cursor-card
                data-bat-cursor-label="OPEN"
              >
                {locale === "fr" ? "Projet" : "Project"}
              </button>
              <button
                type="button"
                className="bat-demo-menu__link text-left"
                onClick={() => onNavigate("/projects")}
                data-bat-cursor-card
                data-bat-cursor-label="OPEN"
              >
                {t("allProjects")}
              </button>
            </div>

            <div className="border-t border-black/10 pt-6">
              <p className="bat-demo-kicker">
                {locale === "fr" ? "Sections" : "Sections"}
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    className="bat-demo-menu__section-link text-left"
                    onClick={() => onScrollTo(section.id)}
                    data-bat-cursor-card
                    data-bat-cursor-label="OPEN"
                  >
                    <span>{section.label}</span>
                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="grid gap-3 border-t border-black/10 pt-6">
              <p className="bat-demo-kicker">
                {locale === "fr" ? "Entreprise" : "Company"}
              </p>
              <p className="bat-demo-menu__small">{companyProfile.name}</p>
              <p className="bat-demo-menu__small">{companyProfile.address}</p>
            </div>

            <div className="grid gap-3 border-t border-black/10 pt-6">
              <p className="bat-demo-kicker">
                {locale === "fr" ? "Contact" : "Contact"}
              </p>
              <a
                href={`mailto:${companyProfile.email}`}
                className="bat-demo-menu__section-link justify-between"
                data-bat-cursor-card
                data-bat-cursor-label="EMAIL"
              >
                <span>{companyProfile.email}</span>
                <Mail className="h-3.5 w-3.5" strokeWidth={2} />
              </a>
              <a
                href={`tel:${companyProfile.phones[0].replace(/\s/g, "")}`}
                className="bat-demo-menu__section-link justify-between"
                data-bat-cursor-card
                data-bat-cursor-label="CALL"
              >
                <span>{companyProfile.phones[0]}</span>
                <Phone className="h-3.5 w-3.5" strokeWidth={2} />
              </a>
            </div>
          </div>
        </div>

        <div className="bat-demo-container pb-6">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-black/10 pt-4 text-[11px] uppercase tracking-[0.22em] text-black/42">
            <span>
              {locale === "fr"
                ? "Projet ouvert en démonstration"
                : "Project open in demo mode"}
            </span>
            <Link
              to="/"
              className="hover:text-black"
              onClick={onClose}
              data-bat-cursor-card
              data-bat-cursor-label="HOME"
            >
              {locale === "fr" ? "Accueil" : "Home"}
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}

function DemoFooter({
  projectSlug,
  locale,
  onNavigate,
}: {
  projectSlug: string;
  locale: Locale;
  onNavigate: (to: string) => void;
}) {
  const { t } = useLocale();
  const currentIndex = projects.findIndex(
    (project) => project.slug === projectSlug,
  );
  const prev = currentIndex > 0 ? projects[currentIndex - 1] : undefined;
  const next =
    currentIndex >= 0 && currentIndex < projects.length - 1
      ? projects[currentIndex + 1]
      : undefined;

  return (
    <footer id="contact" className="bat-demo-footer">
      <div className="bat-demo-container py-20 md:py-24 lg:py-28">
        <div className="grid gap-10 border-t border-white/10 pt-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <img
              src={iglooLogo}
              alt="Igloo Construction"
              className="h-11 w-auto object-contain brightness-0 invert"
            />
            <h2
              className="bat-demo-footer__title mt-8 max-w-3xl"
              data-bat-text-drift
              data-bat-text-drift-depth="16"
            >
              {locale === "fr"
                ? "Construire avec discipline, séquence et précision."
                : "Build with discipline, sequence, and precision."}
            </h2>
            <p className="bat-demo-footer__small mt-5 max-w-3xl">
              {locale === "fr"
                ? `${companyProfile.name} intervient sur des programmes résidentiels et mixtes depuis Alger, en coordonnant conception, exécution et livraison dans une même chaîne de production.`
                : `${companyProfile.name} works on residential and mixed-use programmes from Algiers, coordinating design, execution, and delivery inside one production chain.`}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="grid gap-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-white/52">
                {locale === "fr" ? "Bureau" : "Office"}
              </p>
              <address className="not-italic text-[14px] leading-7 text-white/72">
                <MapPin className="mb-3 h-4 w-4 text-white" />
                {companyProfile.address}
              </address>
            </div>

            <div className="grid gap-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-white/52">
                {locale === "fr" ? "Navigation" : "Navigation"}
              </p>
              <div className="grid gap-2 text-[14px] leading-7 text-white/72">
                <Link
                  to="/bat-demo/projects"
                  className="hover:text-white"
                  data-bat-cursor-card
                  data-bat-cursor-label="OPEN"
                >
                  {t("allProjects")}
                </Link>
                <button
                  type="button"
                  className="text-left hover:text-white"
                  onClick={() =>
                    onNavigate(`/bat-demo/projects/${projectSlug}`)
                  }
                  data-bat-cursor-card
                  data-bat-cursor-label="OPEN"
                >
                  {locale === "fr"
                    ? "Rafraîchir la démonstration"
                    : "Refresh demo"}
                </button>
                {prev ? (
                  <button
                    type="button"
                    className="text-left hover:text-white"
                    onClick={() =>
                      onNavigate(`/bat-demo/projects/${prev.slug}`)
                    }
                    data-bat-cursor-card
                    data-bat-cursor-label="PREV"
                  >
                    {t("previous")} · {prev.menuTitle}
                  </button>
                ) : null}
                {next ? (
                  <button
                    type="button"
                    className="text-left hover:text-white"
                    onClick={() =>
                      onNavigate(`/bat-demo/projects/${next.slug}`)
                    }
                    data-bat-cursor-card
                    data-bat-cursor-label="NEXT"
                  >
                    {t("next")} · {next.menuTitle}
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-4 border-t border-white/10 pt-6 text-[12px] leading-7 text-white/38 md:grid-cols-[1fr_auto]">
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <span>Igloo Construction</span>
            <span>{companyProfile.email}</span>
            <span>{companyProfile.phones[0]}</span>
          </div>
          <div className="text-left md:text-right">
            <span>© 2026 Igloo Construction</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function BatProjectDemo() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const lenis = useLenis();
  const { locale, t } = useLocale();
  const prefersReducedMotion = usePrefersReducedMotion();
  const hasFinePointer = useFinePointer();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPreloader, setShowPreloader] = useState(false);
  const [pageReady, setPageReady] = useState(true);
  const [headerTone, setHeaderTone] = useState<HeaderTone>("hero-light");

  const rootRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const heroImageRef = useRef<HTMLImageElement>(null);
  const heroShadeRef = useRef<HTMLDivElement>(null);
  const heroHeadlineRef = useRef<HTMLDivElement>(null);
  const heroInfoRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroFactsRef = useRef<HTMLDivElement>(null);
  const editorialRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLElement>(null);
  const mediaImageRef = useRef<HTMLImageElement>(null);
  const carouselViewportRef = useRef<HTMLDivElement>(null);
  const carouselTrackRef = useRef<HTMLDivElement>(null);

  const isJoHouseDemo = slug === "jo-house";
  const project = useMemo(
    () =>
      projects.find((item) => item.slug === slug) ??
      projects.find((item) => item.slug === "staoueli-11-41-villas") ??
      projects[0],
    [slug],
  );
  const model = useMemo(() => {
    if (!project) return null;

    const base = buildBatProjectPageModel(project, locale);

    if (!isJoHouseDemo) return base;

    const relatedProjects = JO_HOUSE_RELATED_PROJECTS.map((entry) => {
      const relatedProject = projects.find((item) => item.slug === entry.slug);
      if (!relatedProject) return null;

      return {
        ...relatedProject,
        title: entry.title,
        menuTitle: entry.title,
      };
    }).filter(Boolean);

    return {
      ...base,
      slug: "jo-house",
      displayTitles: {
        ...base.displayTitles,
        heroTitle: JO_HOUSE_DEMO_TITLE,
        heroTitleLines: JO_HOUSE_DEMO_TITLE_LINES,
        editorialTitle: "Jo House",
        relatedTitle: "Jo House",
      },
      hero: {
        ...base.hero,
        pretitle: "Jo House",
        title: JO_HOUSE_DEMO_TITLE,
        titleLines: JO_HOUSE_DEMO_TITLE_LINES,
        facts: getJoHouseFacts(locale),
      },
      editorialText: {
        title: "Jo House",
        paragraphs: JO_HOUSE_DEMO_PARAGRAPHS,
      },
      featureMedia: {
        ...base.featureMedia,
        caption: "",
      },
      relatedProjects:
        relatedProjects.length > 0
          ? (relatedProjects as typeof projects)
          : base.relatedProjects,
      extraSections: {
        technicalFacts: [],
        companyParagraphs: [],
        faq: [],
        details: [],
        programme: [],
        nearby: null,
        closing: {
          title: "Jo House",
          body: "",
        },
      },
    };
  }, [project, locale, isJoHouseDemo]);

  useEffect(() => {
    if (!pageReady || !model) return;

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    if (document.documentElement.classList.contains("bat-demo-route-transitioning")) {
      return;
    }

    lenis?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
  }, [lenis, model?.slug, pageReady]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    setIsMenuOpen(false);

    if (lenis) {
      lenis.scrollTo(element, { offset: -88 });
      return;
    }

    const top = element.getBoundingClientRect().top + window.scrollY - 88;
    window.scrollTo({
      top,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  const navigateTo = (
    to: string,
    transitionOptions: NavigateTransitionOptions = {},
  ) => {
    const isBatProjectRoute = to.startsWith("/bat-demo/projects");
    const targetPath = to.split("?")[0];
    const isBatProjectsIndex = targetPath === "/bat-demo/projects";

    if (isBatProjectsIndex) {
      setIsMenuOpen(false);
      navigate(targetPath);
      return;
    }

    if (
      isBatProjectRoute &&
      typeof window !== "undefined" &&
      window.location.pathname !== targetPath
    ) {
      const targetSlug = targetPath.split("/").filter(Boolean).pop();
      const targetProject =
        transitionOptions.targetProject ??
        projects.find((item) => item.slug === targetSlug) ??
        null;
      const targetModel = targetProject
        ? buildBatProjectPageModel(targetProject, locale)
        : null;

      setIsMenuOpen(false);
      preloadImage(targetModel?.hero.image.src);

      void runBatPageTransition({
        targetPath,
        imageSrc: targetModel?.hero.image.src,
        reducedMotion: prefersReducedMotion,
        lenis,
        navigate,
        afterNavigate: () => {
          lenis?.scrollTo(0, { immediate: true, force: true });
          window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        },
        onComplete: () => {
          requestAnimationFrame(() => ScrollTrigger.refresh(true));
        },
      });
      return;
    }

    setIsMenuOpen(false);
    navigate(targetPath);
  };

  useEffect(() => {
    if (!project || !model) return;

    document.title = `${model.editorialText.title} | Igloo Construction`;

    if (!document.documentElement.classList.contains("bat-demo-route-transitioning")) {
      if (lenis) {
        lenis.scrollTo(0, { immediate: true, force: true });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }
    }

    setIsMenuOpen(false);
    setHeaderTone("hero-light");

    if (showPreloader) return;

    return () => {
      document.title = "Igloo Construction";
    };
  }, [lenis, model, project, showPreloader]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;
    const locked =
      showPreloader || isMenuOpen || root.classList.contains("bat-demo-route-transitioning");

    root.classList.toggle("bat-demo-scroll-locked", locked);

    if (locked) {
      lenis?.stop();
    } else {
      lenis?.start();
    }

    return () => {
      root.classList.remove("bat-demo-scroll-locked");
      lenis?.start();
    };
  }, [isMenuOpen, lenis, showPreloader]);

  useGSAP(
    () => {
      if (!pageReady || !model) return;
      if (!rootRef.current) return;

      const splitTargets = Array.from(
        rootRef.current.querySelectorAll("[data-bat-split-lines]"),
      ) as HTMLElement[];
      const splitLineMap = new Map<HTMLElement, HTMLElement[]>();
      splitTargets.forEach((el) => {
        const lines = splitIntoLineReveal(el);
        if (lines.length) splitLineMap.set(el, lines);
      });

      let cleanupHeroEntryRelease = () => {};

      const heroCtx = gsap.context(() => {
        const heroTitleItems = Array.from(
          rootRef.current?.querySelectorAll(
            ".bat-demo-hero__title-line > span",
          ) ?? [],
        ) as HTMLElement[];
        const waitForPageTransition =
          typeof window !== "undefined" && consumeBatPageTransitionEntry();

        if (heroImageRef.current) {
          const parallaxRange = getHeroImageParallaxRange();
          gsap.set(heroImageRef.current, {
            clearProps: "transform,opacity",
          });
          gsap.set(heroImageRef.current, {
            x: 0,
            y: 0,
            xPercent: 0,
            yPercent: parallaxRange.from,
            opacity: 1,
            scale: 1,
            transformOrigin: "50% 50%",
          });
        }

        if (prefersReducedMotion) {
          gsap.set(
            [
              ".bat-demo-hero__pretitle",
              ".bat-demo-hero__headline",
              ".bat-demo-hero__tab",
              ".bat-demo-hero__fact-label",
              ".bat-demo-hero__fact-value",
              heroTitleItems,
            ],
            { clearProps: "all", opacity: 1, y: 0, yPercent: 0, scale: 1 },
          );
          gsap.set(".bat-demo-hero__line", {
            clearProps: "all",
            scaleX: 1,
            transformOrigin: "left center",
          });
          if (heroShadeRef.current) {
            gsap.set(heroShadeRef.current, { opacity: 0.1 });
          }
        } else {
          gsap.set(".bat-demo-hero__headline", {
            opacity: 1,
            y: 0,
            yPercent: 0,
            scale: 1,
          });
          gsap.set(".bat-demo-hero__pretitle", { y: 18, opacity: 0 });
          gsap.set(".bat-demo-hero__tab", { y: 12, opacity: 0 });
          gsap.set(".bat-demo-hero__line", {
            scaleX: 0,
            transformOrigin: "left center",
          });
          gsap.set(".bat-demo-hero__fact-label", { y: 12, opacity: 0 });
          gsap.set(".bat-demo-hero__fact-value", { y: 14, opacity: 0 });
          gsap.set(heroTitleItems, {
            yPercent: 102,
            opacity: 0,
            transformOrigin: "left bottom",
          });

          const heroTl = gsap.timeline({
            paused: waitForPageTransition,
            defaults: { ease: "power3.out" },
          });
          heroTl
            .to(".bat-demo-hero__pretitle", {
              y: 0,
              opacity: 1,
              duration: 0.58,
            }, 0.08)
            .to(heroTitleItems, {
              yPercent: 0,
              opacity: 1,
              duration: 0.82,
              stagger: 0.07,
            }, 0.16)
            .to(".bat-demo-hero__tab", {
              y: 0,
              opacity: 1,
              duration: 0.46,
            }, 0.72)
            .to(".bat-demo-hero__line", {
              scaleX: 1,
              duration: 0.66,
            }, 0.8)
            .to(".bat-demo-hero__fact-label", {
              y: 0,
              opacity: 1,
              duration: 0.48,
              stagger: 0.035,
            }, 1.02)
            .to(".bat-demo-hero__fact-value", {
              y: 0,
              opacity: 1,
              duration: 0.52,
              stagger: 0.035,
            }, 1.1);

          if (waitForPageTransition) {
            let hasPlayedHeroEntry = false;
            const playHeroEntry = () => {
              if (hasPlayedHeroEntry) return;
              hasPlayedHeroEntry = true;
              gsap.set(".bat-demo-hero__headline", { opacity: 1 });
              heroTl.restart();
              requestAnimationFrame(() => ScrollTrigger.refresh(true));
            };
            const removeListener = onBatPageTransitionComplete(playHeroEntry);
            const fallback = window.setTimeout(playHeroEntry, 5200);

            cleanupHeroEntryRelease = () => {
              removeListener();
              window.clearTimeout(fallback);
            };
          }
        }

        const lineRevealItems = Array.from(
          rootRef.current?.querySelectorAll(
            '[data-bat-text-reveal-mode="line"] [data-bat-text-reveal-item]',
          ) ?? [],
        ) as HTMLElement[];
        const blockRevealItems = Array.from(
          rootRef.current?.querySelectorAll(
            '[data-bat-text-reveal-mode="block"] [data-bat-text-reveal-item]',
          ) ?? [],
        ) as HTMLElement[];

        if (lineRevealItems.length) {
          gsap.set(lineRevealItems, {
            yPercent: 108,
            opacity: 0,
            transformOrigin: "left bottom",
          });
        }

        if (blockRevealItems.length) {
          gsap.set(blockRevealItems, {
            y: 18,
            opacity: 0,
            transformOrigin: "left bottom",
          });
        }

        const revealGroups = Array.from(
          rootRef.current?.querySelectorAll("[data-bat-text-reveal]") ?? [],
        ) as HTMLElement[];
        revealGroups.forEach((group) => {
          if (group.dataset.batTextRevealImmediate === "true") return;

          const items = Array.from(
            group.querySelectorAll("[data-bat-text-reveal-item]"),
          ) as HTMLElement[];
          if (!items.length) return;

          const start = group.dataset.batTextRevealStart ?? "top 86%";
          const stagger = Number(group.dataset.batTextRevealStagger ?? "0.08");
          const delay = Number(group.dataset.batTextRevealDelay ?? "0");
          const trigger =
            (group.closest("[data-bat-reveal]") as HTMLElement | null) ?? group;
          const mode = group.dataset.batTextRevealMode ?? "line";
          const isBlockMode = mode === "block";

          ScrollTrigger.create({
            trigger,
            start,
            once: true,
            onEnter: () => {
              gsap.to(
                items,
                isBlockMode
                  ? {
                      y: 0,
                      opacity: 1,
                      duration: 1.1,
                      delay,
                      stagger,
                      ease: "power2.out",
                      overwrite: "auto",
                    }
                  : {
                      yPercent: 0,
                      opacity: 1,
                      duration: 1.22,
                      delay,
                      stagger,
                      ease: "power3.out",
                      overwrite: "auto",
                    },
              );
            },
          });
        });

        const fadeTargets = Array.from(
          rootRef.current?.querySelectorAll("[data-bat-text-fade]") ?? [],
        ) as HTMLElement[];
        fadeTargets.forEach((target) => {
          gsap.set(target, { y: 18, opacity: 0 });
          gsap.to(target, {
            y: 0,
            opacity: 1,
            duration: 0.95,
            ease: "power2.out",
            scrollTrigger: {
              trigger: target,
              start: target.dataset.batTextFadeStart ?? "top 88%",
              once: true,
            },
          });
        });

        splitLineMap.forEach((lines, el) => {
          gsap.set(lines, { yPercent: 110 });
          gsap.to(lines, {
            yPercent: 0,
            duration: 0.95,
            ease: "power2.out",
            stagger: Number(el.dataset.batSplitStagger ?? "0.12"),
            scrollTrigger: {
              trigger: el,
              start: el.dataset.batSplitStart ?? "top 86%",
              toggleActions: "play none none reverse",
            },
          });
        });

        const ruleTargets = Array.from(
          rootRef.current?.querySelectorAll("[data-bat-rule]") ?? [],
        ) as HTMLElement[];
        ruleTargets.forEach((rule) => {
          gsap.fromTo(
            rule,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 0.9,
              ease: "power2.out",
              scrollTrigger: {
                trigger: rule,
                start: "top 92%",
                toggleActions: "play none none reverse",
              },
            },
          );
        });

        const driftTargets = Array.from(
          rootRef.current?.querySelectorAll("[data-bat-text-drift]") ?? [],
        ) as HTMLElement[];
        driftTargets.forEach((target) => {
          const depth = Number(
            target.dataset.batTextDriftDepth ??
              target.dataset.batTextDrift ??
              "14",
          );

          gsap.fromTo(
            target,
            { y: 0 },
            {
              y: -depth,
              ease: "none",
              scrollTrigger: {
                trigger: target,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
              },
            },
          );
        });

        const parallaxFrames = Array.from(
          rootRef.current?.querySelectorAll("[data-bat-parallax-frame]") ?? [],
        ) as HTMLElement[];
        parallaxFrames.forEach((frame) => {
          const image = frame.querySelector(
            "[data-bat-parallax-image]",
          ) as HTMLElement | null;
          if (!image || image === heroImageRef.current) return;

          const yFrom = Number(frame.dataset.batParallaxFrom ?? "-8");
          const yTo = Number(frame.dataset.batParallaxTo ?? "8");
          const start = frame.dataset.batParallaxStart ?? "top bottom";
          const end = frame.dataset.batParallaxEnd ?? "bottom top";

          gsap.set(image, { clearProps: "transform,opacity" });
          gsap.set(image, {
            x: 0,
            y: 0,
            xPercent: 0,
            yPercent: yFrom,
            scale: 1,
            opacity: 1,
            transformOrigin: "50% 50%",
          });

          gsap.to(image, {
            yPercent: yTo,
            ease: "none",
            scrollTrigger: {
              trigger: frame,
              start,
              end,
              scrub: true,
            },
          });
        });

        gsap.utils
          .toArray<HTMLElement>("[data-bat-reveal]")
          .forEach((section) => {
            gsap.fromTo(
              section,
              { opacity: 0, y: 34 },
              {
                opacity: 1,
                y: 0,
                duration: 0.82,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: section,
                  start: "top 82%",
                },
              },
            );
          });

        if (heroRef.current && heroImageRef.current && !prefersReducedMotion) {
          let activeTone: HeaderTone = "hero-light";
          const updateTone = (tone: HeaderTone) => {
            if (tone === activeTone) return;
            activeTone = tone;
            setHeaderTone(tone);
          };

          const heroTlScroll = gsap.timeline({
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                updateTone(self.progress < 0.9 ? "hero-light" : "editorial");
              },
              onEnter: () => updateTone("hero-light"),
              onEnterBack: () => updateTone("hero-light"),
              onLeave: () => updateTone("editorial"),
              onLeaveBack: () => updateTone("hero-light"),
            },
            defaults: { ease: "none" },
          });

          heroTlScroll
            .to(heroImageRef.current, {
              yPercent: () => getHeroImageParallaxRange().to,
              opacity: 0.72,
              duration: 1,
            }, 0)
            .to(heroShadeRef.current, { opacity: 0.1, duration: 1 }, 0)
            .to(heroHeadlineRef.current, {
              y: () =>
                window.innerWidth >= 1280
                  ? -42
                  : window.innerWidth >= 680
                    ? -30
                    : -20,
              duration: 0.56,
            }, 0);

          ScrollTrigger.create({
            trigger: editorialRef.current ?? heroRef.current,
            start: "top 22%",
            end: "bottom top",
            onEnter: () => updateTone("editorial"),
            onEnterBack: () => updateTone("editorial"),
            onLeaveBack: () => updateTone("hero-light"),
          });
        }
      }, rootRef);

      return () => {
        cleanupHeroEntryRelease();
        heroCtx.revert();
        splitTargets.forEach((el) => {
          el.textContent = "";
        });
      };
    },
    {
      scope: rootRef,
      dependencies: [
        model?.slug,
        pageReady,
        prefersReducedMotion,
      ],
    },
  );

  useEffect(() => {
    if (!pageReady || !model) return;
    if (!hasFinePointer) return;
    if (prefersReducedMotion) return;
    if (!carouselTrackRef.current) return;

    const track = carouselTrackRef.current;
    const items = Array.from(
      track.querySelectorAll("[data-bat-carousel-item]"),
    ) as HTMLElement[];
    if (!items.length) return;

    const getSnapPoints = () => {
      const leadingOffset = items[0]?.offsetLeft ?? 0;
      return items.map((item) => leadingOffset - item.offsetLeft);
    };

    let snaps = getSnapPoints();
    let currentX = gsap.getProperty(track, "x") as number;
    gsap.set(track, { x: currentX });

    const clampToBounds = (value: number) => {
      const minX = snaps[snaps.length - 1] ?? 0;
      return Math.min(0, Math.max(minX, value));
    };

    const snapToClosest = (value: number) =>
      snaps.reduce((closest, snap) =>
        Math.abs(snap - value) < Math.abs(closest - value) ? snap : closest,
      );

    const draggable = Draggable.create(track, {
      type: "x",
      allowNativeTouchScrolling: true,
      edgeResistance: 0.84,
      bounds: {
        minX: snaps[snaps.length - 1] ?? 0,
        maxX: 0,
      },
      onDrag() {
        currentX = gsap.getProperty(track, "x") as number;
      },
      onDragEnd() {
        const velocity =
          typeof this.getVelocity === "function" ? this.getVelocity("x") : 0;
        const projected = currentX + velocity * 0.18;
        const targetX = clampToBounds(snapToClosest(projected));

        gsap.to(track, {
          x: targetX,
          duration: 0.62,
          ease: "power3.out",
          overwrite: "auto",
          onUpdate() {
            currentX = gsap.getProperty(track, "x") as number;
          },
        });
      },
    });

    const handleResize = () => {
      snaps = getSnapPoints();
      const nextX = clampToBounds(gsap.getProperty(track, "x") as number);
      currentX = nextX;
      gsap.set(track, { x: nextX });
      draggable.forEach((instance) => {
        instance.applyBounds({
          minX: snaps[snaps.length - 1] ?? 0,
          maxX: 0,
        });
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      draggable.forEach((instance) => instance.kill());
      window.removeEventListener("resize", handleResize);
      gsap.set(track, { clearProps: "transform" });
    };
  }, [hasFinePointer, model?.slug, pageReady, prefersReducedMotion]);

  if (!project || !model) {
    return (
      <main className="bat-demo-page min-h-screen bg-white text-black">
        <div className="bat-demo-container flex min-h-screen items-center justify-center py-24 text-center">
          <div>
            <p className="bat-demo-kicker">
              {locale === "fr" ? "Introuvable" : "Not found"}
            </p>
            <h1 className="bat-demo-title mt-4">
              {locale === "fr" ? "Projet indisponible" : "Project unavailable"}
            </h1>
            <Link
              to="/bat-demo/projects"
              className="mt-8 inline-flex items-center gap-2 border border-black/15 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.24em]"
            >
              {t("allProjects")}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const related = model.relatedProjects;
  const showSupplementarySections = true;
  const prev =
    projects.findIndex((item) => item.slug === model.slug) > 0
      ? projects[projects.findIndex((item) => item.slug === model.slug) - 1]
      : undefined;
  const nextIndex = projects.findIndex((item) => item.slug === model.slug);
  const next =
    nextIndex >= 0 && nextIndex < projects.length - 1
      ? projects[nextIndex + 1]
      : undefined;

  return (
    <main
      ref={rootRef}
      className="bat-demo-page relative min-h-screen bg-white text-black"
    >
      {showPreloader ? (
        <BatDemoPreloader
          onComplete={() => {
            sessionStorage.setItem(BAT_DEMO_INTRO_KEY, "true");
            setShowPreloader(false);
            setPageReady(true);
          }}
        />
      ) : null}

      <BatDemoCursor />
      <DemoHeader
        isMenuOpen={isMenuOpen}
        tone={headerTone}
        onToggleMenu={() => setIsMenuOpen((value) => !value)}
      />
      <DemoMenu
        open={isMenuOpen}
        locale={locale}
        onClose={() => setIsMenuOpen(false)}
        onNavigate={navigateTo}
        onScrollTo={scrollToSection}
      />

      <div className="bat-demo-reveal-outer">
        <div className="bat-demo-reveal-inner">
          <div className="bat-demo-shell">
        <section ref={heroRef} id="hero" className="bat-demo-hero">
          <div className="bat-demo-hero__stage" aria-hidden="true">
            <div
              className="bat-demo-hero__image-wrap"
              data-bat-parallax-frame
              data-bat-parallax-hero
            >
              <img
                ref={heroImageRef}
                src={model.hero.image.src}
                alt={model.hero.image.alt[locale]}
                className="bat-demo-hero__image"
                data-bat-parallax-image
                data-bat-view-transition-hero
                decoding="async"
                fetchPriority="high"
                loading="eager"
              />
              <div className="bat-demo-hero__veil" />
            </div>
            <div ref={heroShadeRef} className="bat-demo-hero__shade" />
          </div>

          <div className="bat-demo-hero__content">
            <div className="bat-demo-hero__copy">
              <div ref={heroHeadlineRef} className="bat-demo-hero__headline">
                <p className="bat-demo-hero__pretitle">{model.hero.pretitle}</p>
                <h1
                  ref={heroTitleRef}
                  className="bat-demo-hero__title"
                  aria-label={model.hero.title}
                  data-bat-text-drift
                  data-bat-text-drift-depth="18"
                  data-bat-text-reveal
                  data-bat-text-reveal-mode="line"
                  data-bat-text-reveal-immediate="true"
                  data-bat-text-reveal-delay="0.28"
                  data-bat-text-reveal-start="top 96%"
                >
                  {model.hero.titleLines.map((line) => (
                    <span key={line} className="bat-demo-hero__title-line">
                      <span>{line}</span>
                    </span>
                  ))}
                </h1>
              </div>

              <div ref={heroInfoRef} className="bat-demo-hero__info">
                <div className="bat-demo-hero__meta-row">
                  <div className="bat-demo-hero__tab">
                    <span>
                      {locale === "fr" ? "Informations projet" : "Project info"}
                    </span>
                  </div>
                </div>

                <div className="bat-demo-hero__line" />
                <div ref={heroFactsRef} className="bat-demo-hero__facts">
                  {model.hero.facts.map((fact) => (
                    <div
                      key={`${fact.label}-${fact.value}`}
                      className="bat-demo-hero__fact"
                    >
                      <span className="bat-demo-hero__fact-label">
                        {fact.label}
                      </span>
                      <span className="bat-demo-hero__fact-value">
                        {fact.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="editorial"
          ref={editorialRef}
          className="bat-demo-overlap-panel"
          data-bat-reveal
        >
          <div className="bat-demo-container bat-demo-carousel__intro">
            <span className="bat-demo-rule" data-bat-rule />
            <div className="grid gap-10 pt-5 lg:grid-cols-[0.42fr_0.58fr] lg:gap-16 lg:pt-6">
              <div className="grid gap-4">
                <p className="bat-demo-kicker" data-bat-text-fade>
                  {locale === "fr" ? "Texte éditorial" : "Editorial text"}
                </p>
                <h2
                  className="bat-demo-title max-w-[11ch]"
                  data-bat-text-drift
                  data-bat-text-drift-depth="12"
                  data-bat-text-reveal
                  data-bat-text-reveal-mode="line"
                >
                  <span className="bat-demo-text-mask">
                    <span data-bat-text-reveal-item>
                      {model.editorialText.title}
                    </span>
                  </span>
                </h2>
              </div>

              <div
                className="grid gap-5 text-[15px] leading-8 text-black/76 md:text-[16px]"
                data-bat-text-drift
                data-bat-text-drift-depth="8"
              >
                {model.editorialText.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="bat-demo-paragraph-reveal"
                    data-bat-split-lines
                    data-bat-text={paragraph}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id="media"
          ref={mediaRef}
          className="bat-demo-container pb-16 md:pb-20 lg:pb-24"
          data-bat-reveal
        >
          <div
            className="bat-demo-media__frame"
            data-bat-parallax-frame
            data-bat-parallax-from="-8"
            data-bat-parallax-to="8"
          >
            <img
              ref={mediaImageRef}
              src={model.featureMedia.image.src}
              alt={model.featureMedia.image.alt[locale]}
              className="bat-demo-media__image"
              data-bat-parallax-image
              decoding="async"
              loading="lazy"
            />
          </div>
          {model.featureMedia.caption ? (
            <p className="bat-demo-media__caption">
              {model.featureMedia.caption}
            </p>
          ) : null}
        </section>

        <section
          id="related"
          className="bat-demo-carousel py-16 md:py-20 lg:py-24"
          data-bat-reveal
        >
          <div className="bat-demo-container bat-demo-carousel__intro">
            <span className="bat-demo-rule" data-bat-rule />
            <div className="bat-demo-carousel__intro-row">
              <div>
                <p className="bat-demo-kicker" data-bat-text-fade>
                  {t("relatedProjects")}
                </p>
                <h2
                  className="bat-demo-title mt-4 max-w-[10ch]"
                  data-bat-text-drift
                  data-bat-text-drift-depth="12"
                  data-bat-text-reveal
                  data-bat-text-reveal-mode="line"
                >
                  <span className="bat-demo-text-mask">
                    <span data-bat-text-reveal-item>
                      {locale === "fr" ? "Projets liés" : "Related projects"}
                    </span>
                  </span>
                </h2>
              </div>
              <button
                type="button"
                className="bat-demo-carousel__back"
                onClick={() => navigateTo("/bat-demo/projects")}
                data-bat-cursor-card
                data-bat-cursor-label="SCROLL"
              >
                {locale === "fr" ? "Retour aux projets" : "Back to projects"}
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
          </div>

          <div
            className="bat-demo-carousel__viewport mt-10 md:mt-14"
            data-bat-cursor-rail
            ref={carouselViewportRef}
          >
            <div ref={carouselTrackRef} className="bat-demo-carousel__track">
              {related.map((item) => {
                const itemContent = buildBatProjectPageModel(
                  item,
                  locale,
                  isJoHouseDemo
                    ? { displayTitleOverride: item.menuTitle }
                    : undefined,
                );
                const image = itemContent.hero.image;
                const itemPath = `/bat-demo/projects/${item.slug}`;

                return (
                  <div
                    key={item.slug}
                    className="bat-demo-carousel__item"
                    data-bat-carousel-item
                  >
                    <Link
                      to={itemPath}
                      className="bat-demo-carousel__link"
                      onPointerEnter={() => preloadImage(image.src)}
                      onClick={(event) => {
                        event.preventDefault();
                        const sourceImage =
                          event.currentTarget.querySelector("img") as
                            | HTMLImageElement
                            | null;
                        navigateTo(itemPath, {
                          sourceImage,
                          targetProject: item,
                        });
                      }}
                      data-bat-cursor-card
                      data-bat-cursor-label="VIEW"
                    >
                      <div
                        className="bat-demo-carousel__circle"
                        data-bat-parallax-frame
                        data-bat-parallax-from="-6"
                        data-bat-parallax-to="6"
                      >
                        <img
                          src={image.src}
                          alt={image.alt[locale]}
                          data-bat-parallax-image
                          data-bat-view-transition-hero
                          decoding="async"
                          loading="lazy"
                        />
                      </div>
                      <div className="bat-demo-carousel__title">
                        <span className="bat-demo-mask">
                          <span>{itemContent.displayTitles.relatedTitle}</span>
                        </span>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {showSupplementarySections ? (
          <>
            <section
              id="technical"
              className="bat-demo-container py-16 md:py-20 lg:py-24"
              data-bat-reveal
            >
              <div className="grid gap-10 border-t border-black/12 pt-5 lg:grid-cols-[0.42fr_0.58fr] lg:gap-16 lg:pt-6">
                <div>
                  <p className="bat-demo-kicker">
                    {locale === "fr"
                      ? "Maîtrise technique"
                      : "Technical mastery"}
                  </p>
                  <h2 className="bat-demo-title mt-4 max-w-[11ch]">
                    {locale === "fr"
                      ? "Repères et livrables"
                      : "Markers and deliverables"}
                  </h2>
                  <p className="mt-5 max-w-[54ch] text-[15px] leading-8 text-black/76">
                    {model.content.authority[locale]}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {model.extraSections.technicalFacts.map((item, index) => (
                    <div
                      key={`${item.label}-${item.value}`}
                      className="border-t border-[#111]/15 pt-4"
                    >
                      <p className="text-[11px] uppercase tracking-[0.26em] text-black/36">
                        {String(index + 1).padStart(2, "0")}
                      </p>
                      <h3 className="mt-2 text-[16px] font-medium text-black">
                        {item.label}
                      </h3>
                      <p className="mt-3 text-[15px] leading-7 text-black/72">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section
              id="company"
              className="bat-demo-container py-16 md:py-20 lg:py-24"
              data-bat-reveal
            >
              <div className="grid gap-10 border-t border-black/12 pt-5 lg:grid-cols-[0.42fr_0.58fr] lg:gap-16 lg:pt-6">
                <div>
                  <p className="bat-demo-kicker">
                    {locale === "fr"
                      ? "Intervention de l’entreprise"
                      : "Company delivery"}
                  </p>
                  <h2 className="bat-demo-title mt-4 max-w-[10ch]">
                    {locale === "fr" ? "Rôle d’Igloo" : "Igloo role"}
                  </h2>
                </div>
                <div className="grid gap-4">
                  {model.extraSections.companyParagraphs.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-[15px] leading-8 text-black/76 md:text-[16px]"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </section>

            {model.extraSections.faq.length > 0 ? (
              <section
                id="faq"
                className="bat-demo-container py-16 md:py-20 lg:py-24"
                data-bat-reveal
              >
                <div className="border-t border-black/12 pt-5 lg:pt-6">
                  <p className="bat-demo-kicker">
                    {locale === "fr"
                      ? "Questions fréquentes"
                      : "Frequently asked questions"}
                  </p>
                  <h2 className="bat-demo-title mt-4 max-w-[12ch]">
                    {locale === "fr" ? "Questions utiles" : "Useful questions"}
                  </h2>
                  <div className="mt-8 divide-y divide-black/10 border-y border-black/10">
                    {model.extraSections.faq.map((item, index) => (
                      <details
                        key={item.question[locale]}
                        className="group py-4 md:py-5"
                      >
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left text-[15px] leading-7 text-black/84">
                          <span className="flex gap-3">
                            <span className="text-[#111]">
                              {String(index + 1).padStart(2, "0")}.
                            </span>
                            <span>{item.question[locale]}</span>
                          </span>
                          <ChevronDown className="h-4 w-4 shrink-0 text-black/52 transition-transform group-open:rotate-180" />
                        </summary>
                        <p className="max-w-4xl pb-2 pl-12 pt-4 text-[15px] leading-8 text-black/68">
                          {item.answer[locale]}
                        </p>
                      </details>
                    ))}
                  </div>
                </div>
              </section>
            ) : null}

            {model.extraSections.details.length > 0 ? (
              <section
                id="details"
                className="bat-demo-container py-16 md:py-20 lg:py-24"
                data-bat-reveal
              >
                <div className="border-t border-black/12 pt-5 lg:pt-6">
                  <p className="bat-demo-kicker">
                    {locale === "fr"
                      ? "Détails & localisation"
                      : "Details & location"}
                  </p>
                  <div className="mt-6 grid gap-0 border border-black/10 md:grid-cols-2">
                    {model.extraSections.details.map((item, index) => (
                      <div
                        key={`${item.label[locale]}-${item.value[locale]}`}
                        className={`border-black/10 px-4 py-4 ${index % 2 === 0 ? "md:border-r" : ""} ${index < model.extraSections.details.length - 2 ? "border-b" : ""}`}
                      >
                        <p className="text-[11px] uppercase tracking-[0.18em] text-black/40">
                          {item.label[locale]}
                        </p>
                        <p className="mt-2 text-[15px] leading-7 text-black/82">
                          {item.value[locale]}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            ) : null}

            {model.extraSections.programme.length > 0 ? (
              <section
                id="programme"
                className="bat-demo-container py-16 md:py-20 lg:py-24"
                data-bat-reveal
              >
                <div className="border-t border-black/12 pt-5 lg:pt-6">
                  <p className="bat-demo-kicker">
                    {locale === "fr"
                      ? "Programme & portée"
                      : "Programme & scope"}
                  </p>
                  <div className="mt-6 grid gap-10 md:grid-cols-2">
                    {model.extraSections.programme.map((group) => (
                      <div key={group.title[locale]} className="grid gap-3">
                        <h3 className="border-b border-black/20 pb-2 text-[14px] font-medium text-black/88">
                          {group.title[locale]}
                        </h3>
                        <ul className="space-y-2">
                          {group.items.map((item) => (
                            <li
                              key={item[locale]}
                              className="flex gap-3 text-[14px] leading-7 text-black/72"
                            >
                              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-black" />
                              {item[locale]}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            ) : null}

            {model.extraSections.nearby ? (
              <section
                id="nearby"
                className="bat-demo-container py-16 md:py-20 lg:py-24"
                data-bat-reveal
              >
                <div className="border-t border-black/12 pt-5 lg:pt-6">
                  <p className="bat-demo-kicker">
                    {locale === "fr" ? "À proximité" : "What's around"}
                  </p>
                  <h2 className="bat-demo-title mt-4 max-w-[10ch]">
                    {locale === "fr" ? "Environnement" : "Surroundings"}
                  </h2>
                  <ul className="mt-8 divide-y divide-black/10 border-y border-black/10">
                    {model.extraSections.nearby.items.map((item) => (
                      <li
                        key={item[locale]}
                        className="flex gap-3 py-3 text-[15px] leading-7 text-black/72"
                      >
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-black" />
                        {item[locale]}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            ) : null}

            <section
              id="closing"
              className="bat-demo-container py-16 md:py-20 lg:py-24"
              data-bat-reveal
            >
              <div className="border-t border-black/12 pt-5 lg:pt-6">
                <p className="bat-demo-kicker">
                  {locale === "fr" ? "Projet livré" : "Project delivered"}
                </p>
                <h2 className="bat-demo-title mt-4 max-w-[14ch]">
                  {model.extraSections.closing.title}
                </h2>
                <p className="mt-5 max-w-[980px] text-[15px] leading-8 text-black/76 md:text-[16px]">
                  {model.extraSections.closing.body}
                </p>
                <div className="mt-6 flex flex-wrap gap-4">
                  <Link
                    to="/bat-demo/projects"
                    className="inline-flex items-center gap-2 border border-black/15 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.24em]"
                    data-bat-cursor-card
                    data-bat-cursor-label="OPEN"
                  >
                    {t("allProjects")}
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </section>
          </>
        ) : null}

        <DemoFooter
          projectSlug={model.slug}
          locale={locale}
          onNavigate={navigateTo}
        />
          </div>
        </div>
      </div>
    </main>
  );
}
