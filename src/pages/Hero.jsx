import { motion } from "motion/react";
import { Snowflake, Maximize, Zap } from "lucide-react";
import VideoStage from "../components/VideoStage.jsx";
import { pageTransition, rise } from "../motion.js";

const VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260304_101127_49ce07b7-f19a-4882-b19c-1d2a27d97ac3.mp4";

const specs = [
  ["Stack", "React · R3F"],
  ["Logic", "Deterministic"],
  ["Uptime", "99.99%"],
  ["Scale", "Multi-region"],
];

const tags = ["TS/JS", "V1", "Full-Stack", "Cloud-Ready"];

export default function Hero({ onNext }) {
  return (
    <motion.section
      {...pageTransition}
      className="absolute inset-0 overflow-y-auto bg-black"
    >
      <VideoStage src={VIDEO} variant="radial" />

      <div className="relative z-10 flex min-h-[50vh] flex-col justify-between px-[4vw] pb-8 pt-7 md:min-h-dvh">
        <header className="flex items-center justify-end gap-7">
          <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em]">
            <span>1/01</span>
            <span className="relative h-px w-[72px] overflow-hidden bg-white/20">
              <span className="absolute inset-y-0 left-0 w-1/2 bg-white" />
            </span>
          </div>
          <button
            type="button"
            onClick={onNext}
            className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/80 transition-colors hover:text-white"
          >
            Next Project
          </button>
        </header>

        <div className="mt-10 grid items-end gap-10 md:mt-0 md:grid-cols-[1.4fr_0.7fr] md:gap-[6vw]">
          <div>
            <motion.div
              variants={rise}
              initial="hidden"
              animate="show"
              custom={0.05}
              className="mb-5 flex gap-3.5 text-white/80"
            >
              <Snowflake size={16} strokeWidth={1.5} />
              <Maximize size={16} strokeWidth={1.5} />
              <Zap size={16} strokeWidth={1.5} />
            </motion.div>
            <motion.h1
              variants={rise}
              initial="hidden"
              animate="show"
              custom={0.12}
              className="font-display text-[clamp(2.1rem,6vw,5.2rem)] font-medium uppercase leading-[0.92] tracking-tighter"
            >
              Viktor-O // Modern Architect
            </motion.h1>
            <motion.p
              variants={rise}
              initial="hidden"
              animate="show"
              custom={0.22}
              className="mt-6 max-w-[450px] font-sans text-[1.02rem] font-light leading-relaxed text-white/65"
            >
              Buildings that behave like software. Viktor-O designs spatial systems
              where structure, light, and computation occupy a single continuous
              surface.
            </motion.p>
          </div>

          <motion.dl
            variants={rise}
            initial="hidden"
            animate="show"
            custom={0.28}
            className="border-t border-white/20"
          >
            {specs.map(([label, value]) => (
              <div
                key={label}
                className="grid grid-cols-[88px_1fr] gap-4 border-b border-white/20 py-3.5"
              >
                <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-white/40">
                  {label}
                </dt>
                <dd className="font-mono text-[11px] uppercase tracking-[0.12em]">
                  {value}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <div className="mt-12 flex flex-col items-stretch justify-between gap-8 md:flex-row md:items-end">
          <motion.button
            type="button"
            onClick={onNext}
            variants={rise}
            initial="hidden"
            animate="show"
            custom={0.36}
            className="flex min-w-0 items-center gap-4 border border-white/10 bg-white/5 px-4 py-3.5 text-left backdrop-blur-xl transition-colors hover:border-white/20 hover:bg-white/10 md:min-w-[420px]"
          >
            <img
              src="https://picsum.photos/seed/tech/200/200"
              alt="VK-01 React Engine"
              width="72"
              height="72"
              className="h-[72px] w-[72px] object-cover"
            />
            <span>
              <small className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.16em] text-white/50">
                Featured unit
              </small>
              <strong className="block font-sans text-[1.05rem] font-normal">
                VK-01: React Engine
              </strong>
            </span>
            <em className="ml-auto whitespace-nowrap font-mono text-[10px] not-italic uppercase tracking-[0.14em]">
              View Project
            </em>
          </motion.button>

          <motion.ul
            variants={rise}
            initial="hidden"
            animate="show"
            custom={0.42}
            className="flex flex-wrap justify-start gap-2 md:justify-end"
          >
            {tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-white/20 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em]"
              >
                {tag}
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
    </motion.section>
  );
}
