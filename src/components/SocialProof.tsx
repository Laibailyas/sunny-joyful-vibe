import { animate, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { BadgeCheck, FileCheck2, Globe2, HeartHandshake, Quote, UtensilsCrossed, Users, Wallet } from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

const QUOTES = [
  {
    text: "I installed it, forgot about it, and three months later I'd funded 900 meals. Easiest good deed of my life.",
    name: "Mara V.",
    role: "Designer, Lisbon",
  },
  {
    text: "The dashboard shows exactly where every cent went. That transparency is why I still have it running.",
    name: "Devansh R.",
    role: "Student, Pune",
  },
  {
    text: "Our whole studio runs it overnight. Zero slowdown, and the wildlife fund gets a cheque every month.",
    name: "Ollie B.",
    role: "Studio lead, Manchester",
  },
];

const CHARITIES = [
  { name: "Feeding America", region: "USA" },
  { name: "charity: water", region: "Global" },
  { name: "WildAid", region: "Asia & Africa" },
  { name: "Direct Relief", region: "Global" },
  { name: "IFAW", region: "Global" },
  { name: "OXFAM", region: "UK & Global" },
  { name: "Mercy Corps", region: "Middle East" },
  { name: "WaterAid", region: "Africa & Asia" },
  { name: "CARE", region: "Global" },
  { name: "Action Against Hunger", region: "France & Global" },
  { name: "The Nature Conservancy", region: "Global" },
  { name: "Water.org", region: "Asia & Africa" },
];

const STATS = [
  { icon: UtensilsCrossed, to: 2.4, suffix: "M", decimals: 1, label: "meals funded", fill: 0.82 },
  { icon: Users, to: 180, suffix: "K", decimals: 0, label: "people sharing", fill: 0.64 },
  { icon: Globe2, to: 40, suffix: "+", decimals: 0, label: "whitelisted charities", fill: 0.5 },
  { icon: Wallet, to: 0, prefix: "$", decimals: 0, label: "cost to users", fill: 1 },
];

function StatNumber({ to, decimals, prefix = "", suffix = "", play }: { to: number; decimals: number; prefix?: string | undefined; suffix?: string | undefined; play: boolean }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!play) return;
    const controls = animate(0, to, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: (v) => setValue(v),
    });
    return () => controls.stop();
  }, [play, to]);

  return (
    <span>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}

export function SocialProof() {
  const statsRef = useRef<HTMLDivElement>(null);
  const inView = useInView(statsRef, { once: true, margin: "-15%" });

  return (
    <section id="proof" className="relative overflow-hidden bg-paper px-5 pb-16 pt-20 text-ink sm:px-6 sm:pb-24 sm:pt-28 md:pb-32 md:pt-44">
      <div className="relative mx-auto max-w-[1800px]">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.8, ease }}
        >
          <span className="inline-block bg-tape px-6 py-2 font-stamp text-xs font-medium uppercase tracking-[0.32em]">
            Trusted by people &amp; partners
          </span>
          <h2 className="mt-5 max-w-4xl font-display text-[clamp(2.2rem,8.6vw,5rem)] leading-[0.92]">
            Small habits, <span className="text-flare">enormous receipts</span>
          </h2>
        </motion.div>

        <div ref={statsRef} className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-14 md:grid-cols-4 md:gap-5">
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.08, ease }}
                whileHover={{ y: -6 }}
                className="group relative overflow-hidden rounded-3xl border border-ink/10 bg-tape/40 p-6 sm:p-7"
              >
                <span className="grid h-11 w-11 place-items-center rounded-full bg-ink text-paper transition-colors duration-300 group-hover:bg-flare">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="mt-6 font-display text-[clamp(2.6rem,5.4vw,4.4rem)] leading-none text-flare">
                  <StatNumber to={stat.to} decimals={stat.decimals} prefix={stat.prefix} suffix={stat.suffix} play={inView} />
                </p>
                <p className="mt-2 font-stamp text-[0.62rem] uppercase tracking-[0.26em] text-ink/50">{stat.label}</p>
                <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
                  <motion.div
                    className="h-full rounded-full bg-flare"
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${stat.fill * 100}%` } : { width: 0 }}
                    transition={{ duration: 1.4, delay: 0.15 + i * 0.08, ease }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
          className="mt-6 flex flex-col gap-3 rounded-3xl border border-ink/10 bg-paper p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6"
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-moss/15">
            <FileCheck2 className="h-5 w-5 text-moss" />
          </span>
          <p className="text-sm leading-relaxed text-ink/75 md:text-base">
            <strong className="font-medium text-ink">Full transparency:</strong> you can request proof of any donation
            at any time, including receipts, transfer records and charity confirmations for the funds your bandwidth generated.
          </p>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:gap-6 md:mt-14 md:grid-cols-3">
          {QUOTES.map((q, i) => (
            <motion.figure
              key={q.name}
              initial={{ opacity: 0, y: 90, rotate: i % 2 ? 1.5 : -1.5 }}
              whileInView={{ opacity: 1, y: 0, rotate: i % 2 ? 1 : -1 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.85, delay: i * 0.1, ease }}
              whileHover={{ rotate: 0, y: -8 }}
              className="relative flex flex-col rounded-3xl border border-ink/10 bg-tape/40 p-6 sm:p-8"
            >
              <Quote className="h-7 w-7 text-flare" />
              <blockquote className="mt-4 flex-1 text-base leading-relaxed sm:text-lg">{q.text}</blockquote>
              <figcaption className="mt-6 border-t border-ink/10 pt-4">
                <p className="font-medium">{q.name}</p>
                <p className="font-stamp text-[0.62rem] uppercase tracking-[0.26em] text-ink/50">{q.role}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8, ease }}
          className="mt-12 md:mt-16"
        >
          <div className="flex flex-wrap items-center gap-3">
            <p className="font-stamp text-[0.65rem] uppercase tracking-[0.3em] text-ink/50">Whitelisted charities</p>
            <span className="inline-flex items-center gap-2 rounded-full bg-tape px-4 py-1.5 font-stamp text-[0.58rem] uppercase tracking-[0.24em]">
              <Globe2 className="h-3.5 w-3.5 text-flare" /> Worldwide, 40+ countries
            </span>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            {CHARITIES.map((charity, i) => (
              <motion.span
                key={charity.name}
                initial={{ opacity: 0, scale: 0.94 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.04, ease }}
                whileHover={{ y: -4 }}
                data-cursor-hover
                className="flex items-center gap-2 rounded-full border border-moss/30 bg-paper px-5 py-2.5 text-sm"
              >
                <BadgeCheck className="h-4 w-4 text-moss" />
                {charity.name}
                <span className="font-stamp text-[0.55rem] uppercase tracking-[0.2em] text-ink/40">{charity.region}</span>
              </motion.span>
            ))}
          </div>
          <p className="mt-5 flex items-center gap-2 text-sm text-ink/60">
            <HeartHandshake className="h-4 w-4 text-flare" />
            Local charity missing? Submit it and we'll verify it wherever in the world it works.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
