import { motion } from "motion/react";
import { ArrowUpRight, Globe2, Link2, ShieldCheck } from "lucide-react";
import { openSubmitDialog } from "./SubmitCharityModal";

const ease = [0.16, 1, 0.3, 1] as const;

const POINTS = [
  { icon: ShieldCheck, text: "We verify the organisation before a single cent moves." },
  { icon: Link2, text: "You get a shareable Dotis link for your community." },
  { icon: Globe2, text: "Open to local charities and campaigns anywhere in the world." },
];

export function SubmitBand() {
  return (
    <section id="submit" className="relative bg-paper px-5 pb-16 pt-4 text-ink sm:px-6 sm:pb-24">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.85, ease }}
        className="mx-auto grid max-w-[1800px] gap-8 rounded-[2rem] bg-ink px-6 py-10 text-paper sm:px-10 sm:py-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14"
      >
        <div>
          <span className="inline-block bg-flare px-5 py-2 font-stamp text-[0.6rem] uppercase tracking-[0.3em] text-paper">
            Your cause, your campaign
          </span>
          <h2 className="mt-5 font-display text-[clamp(2rem,6.5vw,4.2rem)] uppercase leading-[0.92]">
            Submit your local charity<br />
            <span className="text-flare">start your own campaign</span>
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-paper/75 md:text-lg">
            Run a shelter, a food kitchen or a community fund? Send it to us. Once verified you get your own Dotis
            link, so supporters, influencers and community leaders can back your campaign just by browsing.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={openSubmitDialog}
              data-cursor-hover
              className="rise-button group inline-flex items-center justify-center gap-2 rounded-full bg-flare px-7 py-3.5 text-sm font-medium text-paper sm:text-base"
            >
              <span aria-hidden className="rise-fill rise-fill--paper" />
              <span className="rise-label transition-colors duration-500 group-hover:text-ink">Submit your charity</span>
              <ArrowUpRight className="rise-label h-4 w-4 transition-colors duration-500 group-hover:text-ink" />
            </button>
            <a
              href="#install"
              data-cursor-hover
              className="rise-button group inline-flex items-center justify-center gap-2 rounded-full border border-paper/25 px-7 py-3.5 text-sm font-medium text-paper sm:text-base"
            >
              <span aria-hidden className="rise-fill rise-fill--paper" />
              <span className="rise-label transition-colors duration-500 group-hover:text-ink">Install Dotis</span>
            </a>
          </div>
        </div>

        <ul className="grid grid-rows-3 divide-y divide-paper/15">
          {POINTS.map(({ icon: Icon, text }) => (
            <li key={text} className="flex min-h-20 items-center gap-4 py-5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-paper/10">
                <Icon className="h-5 w-5 text-flare" />
              </span>
              <p className="text-sm leading-relaxed text-paper/80 md:text-base">{text}</p>
            </li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}
