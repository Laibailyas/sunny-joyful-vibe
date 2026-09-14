import { motion } from "motion/react";
import { useState } from "react";
import { Eye, Lock, Power, ShieldCheck, Wifi } from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

const CARDS = [
  {
    icon: Lock,
    title: "Never your personal data",
    body: "Dotis only forwards public web requests. Your files, messages, photos and browsing history are never read, stored or shared.",
  },
  {
    icon: Wifi,
    title: "Only the slice you spare",
    body: "A hard cap keeps Dotis on the leftovers of your connection. Streaming, calls and gaming always come first.",
  },
  {
    icon: Eye,
    title: "See every request",
    body: "A live activity log shows exactly how much bandwidth was shared and what it earned, down to the cent.",
  },
  {
    icon: ShieldCheck,
    title: "Enterprise-grade vetting",
    body: "Traffic comes only from screened business clients under contract. Abusive traffic is blocked before it reaches you.",
  },
];

export function SecurityControl() {
  const [on, setOn] = useState(true);

  return (
    <section id="security" className="relative overflow-hidden bg-ink px-5 pb-16 pt-20 text-paper sm:px-6 sm:pb-24 sm:pt-28 md:pb-32 md:pt-44">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-1/3 h-[36rem] w-[36rem] rounded-full bg-flare/20 blur-[130px]"
        animate={{ opacity: [0.4, 0.75, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto grid max-w-[1800px] grid-cols-1 items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.8, ease }}
          className="lg:sticky lg:top-28"
        >
          <span className="inline-block bg-flare px-6 py-2 font-stamp text-xs font-medium uppercase tracking-[0.32em] text-paper">
            Security &amp; control
          </span>
          <h2 className="mt-5 font-display text-[clamp(2.2rem,8.6vw,5rem)] leading-[0.92]">
            You stay
            <br />
            <span className="text-flare">in charge</span>
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-paper/70 md:text-lg">
            One switch turns sharing on or off. No background surprises, no hidden
            usage, nothing tied to who you are.
          </p>

          <div className="mt-8 flex items-center gap-4 rounded-2xl border border-leaf/45 bg-moss/[0.22] p-4 sm:gap-5 sm:p-5">
            <button
              type="button"
              data-cursor-hover
              onClick={() => setOn((v) => !v)}
              aria-pressed={on}
              className={`relative h-11 w-20 shrink-0 rounded-full transition-colors duration-500 ${on ? "bg-flare" : "bg-paper/20"}`}
            >
              <motion.span
                layout
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
                className={`absolute top-1.5 grid h-8 w-8 place-items-center rounded-full bg-paper ${on ? "right-1.5" : "left-1.5"}`}
              >
                <Power className={`h-4 w-4 ${on ? "text-flare" : "text-ink/50"}`} />
              </motion.span>
            </button>
            <div>
              <p className="font-medium">{on ? "Sharing is on" : "Sharing is paused"}</p>
              <p className="text-sm text-paper/55">
                {on ? "Earning quietly in the background." : "Nothing is being shared right now."}
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
          {CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.article
                key={card.title}
                initial={{ opacity: 0, y: 85 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.8, delay: i * 0.09, ease }}
                whileHover={{ y: -6 }}
                className="group relative overflow-hidden rounded-3xl border border-leaf/40 bg-moss/[0.18] p-6 sm:p-7"
              >
                <span className="absolute inset-x-0 -bottom-24 h-32 bg-flare/25 blur-3xl transition-all duration-500 group-hover:-bottom-10" />
                <span className="relative grid h-12 w-12 place-items-center rounded-2xl bg-flare">
                  <Icon className="h-6 w-6 text-paper" />
                </span>
                <h3 className="relative mt-5 font-display text-xl uppercase leading-tight sm:text-2xl">{card.title}</h3>
                <p className="relative mt-3 text-sm leading-relaxed text-paper/65">{card.body}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
