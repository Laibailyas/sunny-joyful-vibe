import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { SunShape } from "./InstallSun";
import logo from "@/assets/logo.png";

const DURATION = 1400; // ms it takes the counter to fill on a fast load

const EXIT = 600; // fade-out duration

/**
 * Brand preloader: paper curtain, Dotis logo, spinning sun and a DM Mono
 * percentage. Waits for both the animation and the window load event, then
 * wipes away with an upward sweep.
 */
export function Preloader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(false);
  const start = useRef(0);
  const loadedRef = useRef(false);
  const rafRef = useRef(0);

  useEffect(() => {
    loadedRef.current = document.readyState === "complete";
    const onLoad = () => {
      loadedRef.current = true;
    };
    window.addEventListener("load", onLoad);

    // Lock scroll behind the curtain until it lifts.
    document.body.style.overflow = "hidden";

    const finish = () => {
      setProgress(100);
      setDone(true);
      setTimeout(() => {
        document.body.style.overflow = "";
        setGone(true);
      }, EXIT);
    };

    const tick = (now: number) => {
      if (!start.current) start.current = now;
      const elapsed = now - start.current;
      const p = Math.min(1, elapsed / DURATION);
      // Ease-out so the counter rushes early and lingers near 100.
      const eased = 1 - Math.pow(1 - p, 3);
      setProgress(Math.round(eased * 99));
      if (p < 1 || !loadedRef.current) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      finish();
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("load", onLoad);
      document.body.style.overflow = "";
    };
  }, []);

  if (gone) return null;

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={done ? { y: "-100%" } : { y: 0 }}
      transition={{ duration: EXIT / 1000, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-paper"
      aria-hidden
    >
      <div className="relative">
        <SunShape className="sun-orbit absolute -inset-9 h-[calc(100%+4.5rem)] w-[calc(100%+4.5rem)] text-flare/90" />
        <img
          src={logo}
          alt="Dotis"
          width={1038}
          height={357}
          className="relative h-12 w-auto sm:h-14"
        />
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mt-8 font-stamp text-[0.65rem] uppercase tracking-[0.35em] text-ink/70"
      >
        Let your feed, feed someone
      </motion.p>

      <div className="mt-6 h-px w-40 overflow-hidden bg-ink/15 sm:w-52">
        <div
          className="h-full bg-flare transition-[width] duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="mt-3 font-stamp text-xs tabular-nums text-ink/60">
        {progress}%
      </p>
    </motion.div>
  );
}
