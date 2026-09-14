import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, useState } from "react";
import { ArrowUpRight, BadgeCheck, HandCoins, LifeBuoy, PawPrint, Utensils } from "lucide-react";
import wildlifeImage from "@/assets/cause-wildlife.jpg";
import foodImage from "@/assets/cause-food.jpg";
import disasterImage from "@/assets/cause-disaster.jpg";
import povertyImage from "@/assets/cause-poverty.jpg";

import { openSubmitDialog } from "./SubmitCharityModal";

const ease = [0.16, 1, 0.3, 1] as const;

const CAUSES = [
  {
    id: "wildlife",
    label: "Animal rescue",
    short: "Animals",
    icon: PawPrint,
    image: wildlifeImage,
    alt: "A wildlife rescue worker carrying a koala through a sanctuary",
    blurb: "Fund rescue, rehabilitation and protected habitats for animals with nowhere left to go.",
    charities: ["WildAid", "IFAW", "The Nature Conservancy"],
    unit: "animals treated",
    perDollar: 0.42,
  },
  {
    id: "food",
    label: "Food aid",
    short: "Food",
    icon: Utensils,
    image: foodImage,
    alt: "Volunteers preparing meals in a community kitchen",
    blurb: "Put warm meals on tables through community kitchens and trusted local food banks.",
    charities: ["Feeding America", "OXFAM", "Action Against Hunger"],
    unit: "meals served",
    perDollar: 8.5,
  },
  {
    id: "disaster",
    label: "Disaster response",
    short: "Response",
    icon: LifeBuoy,
    image: disasterImage,
    alt: "Disaster relief volunteers organizing emergency supplies after a flood",
    blurb: "Back first responders with shelter, medicine and supplies in the hours that matter most.",
    charities: ["Direct Relief", "Mercy Corps", "CARE"],
    unit: "emergency kits",
    perDollar: 1.1,
  },
  {
    id: "poverty",
    label: "Poverty relief",
    short: "Poverty",
    icon: HandCoins,
    image: povertyImage,
    alt: "A community worker handing out supplies in a low-income neighbourhood",
    blurb: "Support families with essentials, shelter and the small grants that break the cycle.",
    charities: ["CARE", "Mercy Corps", "OXFAM"],
    unit: "families supported",
    perDollar: 0.9,
  },
] as const;

function Counter({ value }: { value: number }) {
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 70, damping: 20 });
  const text = useTransform(spring, (v) => (v >= 100 ? Math.round(v).toLocaleString() : v.toFixed(1)));

  useEffect(() => mv.set(value), [mv, value]);
  return <motion.span>{text}</motion.span>;
}

export function ChooseCause() {
  const [active, setActive] = useState(0);
  const [amount, setAmount] = useState(12);
  const cause = CAUSES[active];

  return (
    <section id="causes" className="relative overflow-hidden bg-paper pb-16 pt-20 text-ink sm:pb-24 sm:pt-28 md:pb-32 md:pt-44">
      <div className="mx-auto max-w-[1800px] px-5 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.8, ease }}
          className="flex flex-col items-start gap-5 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <span className="inline-block bg-tape px-6 py-2 font-stamp text-xs font-medium uppercase tracking-[0.32em]">Step three</span>
            <h2 className="mt-5 font-display text-[clamp(2.2rem,8.6vw,5.4rem)] leading-[0.92]">
              Select the cause<br /><span className="text-flare">you want to support</span>
            </h2>
          </div>
          <p className="max-w-sm text-base leading-relaxed text-ink/70 md:text-lg">
            Dotis only pays verified charities. Pick your cause or submit your local charity for verification.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 44 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-8%" }}
        transition={{ duration: 0.9, ease }}
        className="mt-10 px-4 sm:px-3 md:mt-20 md:px-6"
      >
        <div className="mx-auto flex h-[640px] max-w-[1880px] flex-col gap-2 md:h-[680px] md:flex-row md:gap-3">
          {CAUSES.map((item, index) => {
            const isActive = active === index;
            const Icon = item.icon;
            return (
              <motion.article
                key={item.id}
                layout
                transition={{ layout: { duration: 0.75, ease } }}
                className="relative min-h-0 overflow-hidden bg-ink text-paper"
                animate={{ flex: isActive ? 8 : 1 }}
              >
                <button
                  type="button"
                  onClick={() => setActive(index)}
                  aria-label={`Select ${item.label}`}
                  aria-pressed={isActive}
                  data-cursor-hover
                  className="absolute inset-0 z-10 w-full text-left"
                >
                  <span className="sr-only">Select {item.label}</span>
                </button>

                <motion.img
                  src={item.image}
                  alt={item.alt}
                  loading="lazy"
                  width={1280}
                  height={900}
                  className="absolute inset-0 h-full w-full object-cover"
                  animate={{
                    scale: isActive ? 1 : 1.08,
                    filter: isActive
                      ? "grayscale(1) contrast(1.12) brightness(1.02)"
                      : "grayscale(1) contrast(1.05) brightness(0.72)",
                  }}
                  transition={{ duration: 0.9, ease }}
                />
                <span className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/10 to-ink/20" />

                <div
                  className={`pointer-events-none absolute z-20 flex items-center gap-3 ${
                    isActive
                      ? "left-4 top-4 md:left-5 md:top-5"
                      : "left-4 top-1/2 -translate-y-1/2 md:left-5 md:top-5 md:translate-y-0"
                  }`}
                >
                  <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${isActive ? "bg-flare" : "bg-paper/90"}`}>
                    <Icon className={`h-5 w-5 ${isActive ? "text-paper" : "text-ink"}`} />
                  </span>
                  <AnimatePresence>
                    {isActive && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        className="flex items-center gap-2 whitespace-nowrap bg-paper px-4 py-2 font-stamp text-[0.6rem] uppercase tracking-[0.24em] text-ink"
                      >
                        <BadgeCheck className="h-4 w-4 text-flare" /> Verified only
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                <AnimatePresence mode="wait">
                  {isActive ? (
                    <motion.div
                      key="open"
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 16 }}
                      transition={{ duration: 0.55, delay: 0.2, ease }}
                      className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-5 md:p-8 lg:p-10"
                    >
                      <div className="grid items-end gap-6 lg:grid-cols-[1fr_0.9fr]">
                        <div>
                          <p className="font-stamp text-[0.62rem] uppercase tracking-[0.3em] text-paper/70">0{index + 1} / choose your impact</p>
                          <h3 className="mt-3 font-display text-[clamp(1.9rem,5vw,5.4rem)] uppercase leading-[0.9]">{item.label}</h3>
                          <p className="mt-3 max-w-xl text-sm leading-relaxed text-paper/80 md:text-base">{item.blurb}</p>
                          <div className="mt-5 flex flex-wrap gap-2">
                            {item.charities.map((name) => (
                              <span key={name} className="whitespace-nowrap border border-paper/30 bg-ink/35 px-2 py-1 text-[0.6rem] tracking-wide backdrop-blur-sm sm:px-3 sm:py-1.5 sm:text-xs sm:tracking-normal">{name}</span>
                            ))}
                          </div>
                        </div>

                        <div className="pointer-events-auto bg-paper p-5 text-ink md:p-6">
                          <div className="flex items-center justify-between font-stamp text-[0.6rem] uppercase tracking-[0.2em] text-ink/60">
                            <span>Monthly earnings</span><span className="text-ink">${amount}</span>
                          </div>
                          <input
                            type="range"
                            min={2}
                            max={40}
                            value={amount}
                            onChange={(event) => setAmount(Number(event.target.value))}
                            aria-label="Monthly bandwidth earnings"
                            className="mt-4 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-ink/15 accent-[oklch(0.585_0.221_30.5)]"
                          />
                          <p className="mt-5 flex items-end gap-2">
                            <span className="font-display text-5xl leading-none text-flare"><Counter value={amount * item.perDollar} /></span>
                            <span className="pb-1 text-xs uppercase tracking-[0.14em] text-ink/60">{item.unit}</span>
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="closed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pointer-events-none absolute inset-x-0 inset-y-0 z-20 flex items-center justify-center md:inset-y-auto md:bottom-8">
                      <span className="font-display text-2xl uppercase md:[writing-mode:vertical-rl] md:rotate-180">{item.short}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            );
          })}
        </div>

        <div className="mx-auto mt-5 flex max-w-[1880px] flex-col items-start justify-between gap-4 border-t border-ink/15 px-1 pt-5 md:flex-row md:items-center md:gap-6 md:px-0">
          <p className="max-w-3xl text-sm leading-relaxed text-ink/65">
            Everything shown on your Impact Dashboard is donated directly to your chosen charity, and you can request proof of any donation at any time. We cover infrastructure, security and operating costs separately.
          </p>
          <button
            type="button"
            onClick={openSubmitDialog}
            data-cursor-hover
            className="rise-button group inline-flex shrink-0 items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper"
          >
            <span aria-hidden className="rise-fill rise-fill--flare" />
            <span className="rise-label">Submit your local charity</span>
            <ArrowUpRight className="rise-label h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </section>
  );
}