import { motion, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, type RefObject } from "react";
import dotisMark from "@/assets/dotis-mark-orange.png";

const POINTS = 48;
const sunPath = (() => {
  const pts: string[] = [];
  for (let i = 0; i < POINTS * 2; i++) {
    const r = i % 2 === 0 ? 50 : 43;
    const a = (Math.PI * i) / POINTS - Math.PI / 2;
    pts.push(`${(50 + r * Math.cos(a)).toFixed(2)},${(50 + r * Math.sin(a)).toFixed(2)}`);
  }
  return pts.join(" ");
})();

export function SunShape({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <polygon points={sunPath} fill="currentColor" />
    </svg>
  );
}

const START_SIZE = 40;
const END_SIZE = 260;
const RANGE = 700;
const MOBILE_BP = 768;
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function InstallSun({ anchorRef }: { anchorRef: RefObject<HTMLElement | null> }) {
  const { scrollY } = useScroll();
  const x = useMotionValue(-999);
  const y = useMotionValue(-999);
  const size = useMotionValue(START_SIZE);
  const badgeOpacity = useMotionValue(0);
  const markOpacity = useMotionValue(0);
  const textTarget = useMotionValue(0);
  // 0 -> still a corner badge, 1 -> fully bloomed into the half-sun behind the final section.
  const ctaBlend = useMotionValue(0);
  // Spring keeps the label fade-in soft instead of snapping.
  const textOpacity = useSpring(textTarget, { stiffness: 90, damping: 26 });
  const textScale = useMotionValue(0.095);
  const fontSize = useTransform([size, textScale], (vals: number[]) => (vals[0] ?? 0) * (vals[1] ?? 0));
  const zIndex = useTransform(ctaBlend, (v) => (v > 0.5 ? 3 : 40));
  const pointerEvents = useTransform(ctaBlend, (v) => (v > 0.5 ? "none" : "auto"));

  const update = (sy: number) => {
    const el = anchorRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const isMobile = window.innerWidth < MOBILE_BP;
    // On phones the badge stays a small, fully visible corner sun instead of a
    // giant disc that swallows the screen.
    const startSize = isMobile ? 30 : START_SIZE;
    const endSize = isMobile ? 78 : END_SIZE;
    const p = easeInOut(clamp01(sy / RANGE));
    const s = lerp(startSize, endSize, p);
    const startX = rect.left + rect.width / 2 - s / 2;
    const startY = rect.top + sy + rect.height / 2 - s / 2;
    const endX = isMobile ? window.innerWidth - s - 14 : window.innerWidth - s * 0.84;
    const endY = isMobile ? window.innerHeight - s - 14 : window.innerHeight - s * 0.84;
    textScale.set(isMobile ? 0.15 : 0.095);

    let finalSize = s;
    let finalX = lerp(startX, endX, p);
    let finalY = lerp(startY, endY, p);

    // Phase 2: as the final CTA section arrives, the badge blooms into a giant
    // half-sun sitting on the bottom edge of the viewport, behind that section's copy.
    const ctaEl = document.getElementById("install");
    let ctaProgress = 0;
    if (ctaEl) {
      const ctaRect = ctaEl.getBoundingClientRect();
      const startAt = window.innerHeight * 0.95;
      const endAt = window.innerHeight * 0.1;
      ctaProgress = clamp01((startAt - ctaRect.top) / (startAt - endAt));
    }

    if (ctaProgress > 0) {
      // A big half-sun sitting right on the bottom edge of the viewport — wide
      // enough that its points reach toward the side collages, but its bottom
      // half runs off the screen instead of ballooning to cover everything.
      // Mobile: a full sun centred behind the copy, narrow enough that the side
      // collages stay visible. Desktop keeps the half-sun on the bottom edge.
      const bigSize = isMobile
        ? Math.min(window.innerWidth * 1.9, window.innerHeight * 1.05)
        : Math.min(window.innerWidth * 0.85, window.innerHeight * 1.7);
      const bigX = window.innerWidth / 2 - bigSize / 2;
      // Mobile mirrors the reference: a wide half-sun rising from the bottom
      // edge, with the copy sitting inside its visible half.
      const bigY = window.innerHeight - bigSize / 2;
      finalSize = lerp(finalSize, bigSize, ctaProgress);
      finalX = lerp(finalX, bigX, ctaProgress);
      finalY = lerp(finalY, bigY, ctaProgress);
    }

    x.set(finalX);
    y.set(finalY);
    size.set(finalSize);
    badgeOpacity.set(sy > 2 ? 1 : 0);
    // Keep the mark visible only while the sun travels, then fade it away
    // before the badge reaches its full resting size.
    const markEnter = clamp01((p - 0.04) / 0.12);
    const markExit = 1 - clamp01((p - 0.72) / 0.22);
    markOpacity.set(markEnter * markExit * 0.88);
    // Label only appears once the sun has settled into the bottom-right corner,
    // and is hidden again once the half-sun takes over.
    textTarget.set(clamp01((p - 0.9) / 0.09) * (1 - clamp01(ctaProgress / 0.25)));
    ctaBlend.set(ctaProgress);
  };

  useMotionValueEvent(scrollY, "change", update);
  useEffect(() => {
    const run = () => update(window.scrollY);
    run();
    const t = setTimeout(run, 1600);
    window.addEventListener("resize", run);
    window.addEventListener("scroll", run, { passive: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", run);
      window.removeEventListener("scroll", run);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.a
      href="#install"
      data-cursor-hover
      aria-label="Install Dotis"
      className="install-sun fixed left-0 top-0 block text-flare"
      style={{ x, y, width: size, height: size, opacity: badgeOpacity, zIndex, pointerEvents }}
    >
      <SunShape className="sun-orbit h-full w-full drop-shadow-[0_18px_40px_rgba(0,0,0,0.25)]" />
      <span className="pointer-events-none absolute inset-0 grid place-items-center">
        <motion.img
          src={dotisMark}
          alt=""
          aria-hidden
          style={{ opacity: markOpacity }}
          className="install-sun-mark h-[54%] w-[54%] object-contain"
        />
      </span>
      <motion.span
        style={{ opacity: textOpacity, fontSize }}
        className="install-sun-text absolute inset-0 grid place-items-center text-center font-sans font-normal leading-[1.3] text-paper"
      >
        <span>
          Install
          <br />
          Dotis
        </span>
      </motion.span>
    </motion.a>
  );
}