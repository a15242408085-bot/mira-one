import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import VideoStage from "../components/VideoStage.jsx";
import { pageTransition, rise } from "../motion.js";

const VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260304_102019_f84678ca-ffe7-49a5-895a-75ac1f71ad46.mp4";

export default function Project({ onBack }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.section
      {...pageTransition}
      className="absolute inset-0 overflow-y-auto bg-black"
    >
      <VideoStage src={VIDEO} variant="elliptic" />

      <div className="relative z-10 flex min-h-[50vh] flex-col justify-between px-[4vw] pb-8 pt-7 md:min-h-dvh">
        <header className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white/80 transition-colors hover:text-white"
          >
            <ArrowLeft size={14} strokeWidth={1.5} />
            Back Home
          </button>
          <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em]">
            <span>2/02</span>
            <span className="relative h-px w-[72px] overflow-hidden bg-white/20">
              <span className="absolute inset-y-0 left-0 w-full bg-white" />
            </span>
          </div>
        </header>

        <div className="mt-10 grid items-end gap-10 md:mt-0 md:grid-cols-[1.3fr_0.8fr] md:gap-[6vw]">
          <motion.h1
            variants={rise}
            initial="hidden"
            animate="show"
            custom={0.1}
            className="font-display text-[clamp(3rem,8.6vw,7.4rem)] font-medium uppercase leading-0.85 tracking-tighter"
          >
            Projecty Engine
          </motion.h1>
          <motion.div
            variants={rise}
            initial="hidden"
            animate="show"
            custom={0.2}
            className="md:justify-self-end md:pb-2"
          >
            <p className="max-w-[450px] font-sans text-[1.02rem] font-light leading-relaxed text-white/65 md:text-right">
              The flagship React engine behind Viktor-O commissions. A
              compositional runtime for cinematic interfaces, spatial data, and
              live architectural narrative.
            </p>
            {open && (
              <p className="mt-3.5 max-w-[450px] font-sans text-[1.02rem] font-light leading-relaxed text-white/65 md:ml-auto md:text-right">
                Every surface is a render target. Geometry, copy, and motion
                share one deterministic graph so a building can be previewed,
                instrumented, and shipped as a single system.
              </p>
            )}
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="mt-4 border-b border-white pb-0.5 font-mono text-[10px] uppercase tracking-[0.16em] md:ml-auto md:block"
            >
              {open ? "Read Less" : "Read More"}
            </button>
          </motion.div>
        </div>

        <div className="mt-14 flex flex-col justify-between gap-10 md:flex-row md:items-end">
          <div className="grid max-w-[720px] gap-10 md:grid-cols-2">
            <motion.article
              variants={rise}
              initial="hidden"
              animate="show"
              custom={0.3}
            >
              <h2 className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em]">
                01 // Core Architecture
              </h2>
              <p className="font-mono text-[11px] uppercase leading-relaxed tracking-[0.12em] text-white/60">
                Signal graph, isolated scenes, and a single render loop. No
                orphan state. No unmanaged side effects.
              </p>
            </motion.article>
            <motion.article
              variants={rise}
              initial="hidden"
              animate="show"
              custom={0.38}
            >
              <h2 className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em]">
                02 // Performance Metrics
              </h2>
              <p className="font-mono text-[11px] uppercase leading-relaxed tracking-[0.12em] text-white/60">
                60fps editorial motion. Sub-40ms hydration. Streaming assets
                with zero layout shift on first paint.
              </p>
            </motion.article>
          </div>

          <motion.div
            variants={rise}
            initial="hidden"
            animate="show"
            custom={0.46}
            className="md:text-right"
          >
            <div className="mb-4 flex gap-2.5 md:justify-end">
              <button
                type="button"
                aria-label="Previous"
                onClick={onBack}
                className="grid h-[42px] w-[42px] place-items-center rounded-full border border-white/20 transition-colors hover:bg-white/10"
              >
                <ArrowLeft size={16} strokeWidth={1.5} />
              </button>
              <button
                type="button"
                aria-label="Next"
                onClick={onBack}
                className="grid h-[42px] w-[42px] place-items-center rounded-full border border-white/20 transition-colors hover:bg-white/10"
              >
                <ArrowRight size={16} strokeWidth={1.5} />
              </button>
            </div>
            <p className="flex gap-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/70 md:justify-end">
              <span>2026.03</span>
              <span>|</span>
              <span>Viktor-O</span>
            </p>
            <p className="mt-2 font-sans text-sm font-light italic text-white/60">
              Architecture, compiled.
            </p>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
