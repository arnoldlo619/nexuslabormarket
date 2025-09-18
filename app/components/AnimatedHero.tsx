"use client";

// AnimatedHero.tsx — Hero with full-bleed video, parallax glows, dashboard toggle,
// accessibility, URL sync, and Theme Controls with CSS variables.

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState, CSSProperties } from "react";

export type AnimatedHeroProps = { variables?: Partial<{ glowStrength: number; overlay: number; shadowBoost: number; }>; };

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.06 } }) } as const;
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } } as const;

export default function AnimatedHero({ variables }: AnimatedHeroProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: rootRef, offset: ["start start", "end start"] });
  const glowY1 = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const glowY2 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const glowScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  const [view, setView] = useState<"video" | "dashboard">("video");
  const isVideo = view === "video";

  const prefersReduced = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const videoSources = useMemo(() => ({ src: "/video/nexus-hero-demo.mp4", poster: "/img/nexus-hero-poster.jpg" }), []);

  useEffect(() => { if (typeof window === "undefined") return; const params = new URLSearchParams(window.location.search); const v = params.get("view"); if (v === "video" || v === "dashboard") setView(v); }, []);
  useEffect(() => { if (typeof window === "undefined") return; const params = new URLSearchParams(window.location.search); params.set("view", view); window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`); }, [view]);
  useEffect(() => { const vid = videoRef.current; if (!vid) return; const handle = () => { if (document.hidden || prefersReduced || view !== "video") { vid.pause(); } else { vid.play().catch(() => {}); } }; handle(); document.addEventListener("visibilitychange", handle); return () => document.removeEventListener("visibilitychange", handle); }, [prefersReduced, view]);

  const [glowStrength, setGlowStrength] = useState(variables?.glowStrength ?? 0.3);
  const [overlay, setOverlay] = useState(variables?.overlay ?? 0.4);
  const [shadowBoost, setShadowBoost] = useState(variables?.shadowBoost ?? 0.35);
  const styleVars: CSSProperties = { ["--glow-strength" as any]: clamp01(glowStrength), ["--overlay" as any]: clamp01(overlay), ["--shadow-boost" as any]: clamp01(shadowBoost) };

  return (
    <div ref={rootRef} style={styleVars} className="min-h-screen bg-[#0a0f0c] text-white relative overflow-hidden">
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 z-0" initial={{ opacity: 0 }} animate={{ opacity: isVideo && !prefersReduced ? 1 : 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
        <video ref={videoRef} className="h-full w-full object-cover" src={videoSources.src} poster={videoSources.poster} autoPlay={!prefersReduced} muted loop playsInline />
        <div className="absolute inset-0" style={{ background: `rgba(0,0,0,var(--overlay))` }} />
      </motion.div>
      <noscript><div className="absolute inset-0 z-0 bg-[url('/img/nexus-hero-poster.jpg')] bg-cover bg-center" /></noscript>
      <div className="pointer-events-none absolute inset-0 z-0">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: Number(glowStrength) }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} className="absolute -top-40 -left-40 h-[42rem] w-[42rem] rounded-full blur-3xl" style={{ y: glowY1 as any, scale: glowScale as any, background: `radial-gradient(closest-side, rgba(34,197,94,${clamp01(glowStrength)}), rgba(0,0,0,0) 70%)` }} />
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: Number(glowStrength) }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.1 }} className="absolute -bottom-40 -right-40 h-[38rem] w-[38rem] rounded-full blur-3xl" style={{ y: glowY2 as any, scale: glowScale as any, background: `radial-gradient(closest-side, rgba(16,185,129,${clamp01(glowStrength)}), rgba(0,0,0,0) 70%)` }} />
      </div>
      <motion.header variants={fadeUp} initial={prefersReduced ? undefined : "hidden"} animate={prefersReduced ? undefined : "show"} className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Logo />
        <nav className="hidden gap-8 md:flex">
          {["Product", "Use Cases", "Pricing", "Docs", "Contact"].map((item, i) => (
            <motion.a custom={i} variants={fadeUp} href="#" key={item} className="text-sm text-zinc-300 transition-colors duration-200 hover:text-white">{item}</motion.a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a href="#" className="rounded-xl border border-emerald-500/30 px-3 py-1.5 text-sm text-emerald-300 transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-500/10 hover:shadow-[0_8px_30px_rgba(16,185,129,var(--shadow-boost))]">Sign in</a>
          <a href="#" className="rounded-xl bg-emerald-500 px-3 py-1.5 text-sm font-medium text-black transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-400 hover:shadow-[0_8px_30px_rgba(16,185,129,calc(var(--shadow-boost)+0.1))]">Request demo</a>
        </div>
      </motion.header>
      <motion.section variants={stagger} initial={prefersReduced ? undefined : "hidden"} animate={prefersReduced ? undefined : "show"} className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 pb-16 pt-8 md:grid-cols-2 md:gap-16 md:pb-24 md:pt-16">
        <div>
          <motion.span variants={fadeUp} className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1 text-xs font-medium text-emerald-300"><span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.8)]" />AI‑Native College‑to‑Career OS</motion.span>
          <motion.h1 variants={fadeUp} className="text-balance text-4xl font-semibold tracking-tight md:text-6xl">From <span className="text-emerald-400">Enrollment</span> to <span className="text-emerald-400">Employment</span> <em className="italic">Optimized</em></motion.h1>
          <motion.p variants={fadeUp} className="mt-5 max-w-xl text-pretty text-zinc-300 md:text-lg">Nexus is an AI‑native advising and workflow automation platform that turns student data and real‑time labor‑market signals into personalized pathways, nudges, and outcomes. Built for students and young professionals preparing for an AI‑centric workforce.</motion.p>
          <motion.div variants={fadeUp} className="mt-6 flex flex-wrap gap-3">
            <a href="#" className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-black shadow-[0_8px_30px_rgba(16,185,129,calc(var(--shadow-boost)+0.05))] transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-400 hover:shadow-[0_10px_34px_rgba(16,185,129,calc(var(--shadow-boost)+0.15))]">Launch interactive demo</a>
            <a href="#" className="rounded-xl border border-emerald-400/30 px-4 py-2.5 text-sm font-semibold text-emerald-200 transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-400/10">Watch 60‑sec overview</a>
          </motion.div>
          <motion.ul variants={fadeUp} className="mt-6 grid max-w-xl grid-cols-1 gap-2 text-sm text-zinc-400 sm:grid-cols-2">
            <li className="flex items-center gap-2"><Check /> Personalized advising flows</li>
            <li className="flex items-center gap-2"><Check /> LMI‑aligned course & skills mapping</li>
            <li className="flex items-center gap-2"><Check /> Auto‑generated resumes & portfolios</li>
            <li className="flex items-center gap-2"><Check /> Faculty & employer insights dashboard</li>
          </motion.ul>
        </div>
        <motion.div variants={fadeUp} className="relative">
          <div className="mb-4 inline-flex rounded-xl border border-white/10 bg-black/20 p-1 backdrop-blur">
            {(["video", "dashboard"] as const).map((k) => (
              <button key={k} onClick={() => setView(k)} className={`px-3 py-1.5 text-xs font-medium capitalize transition-all ${view === k ? "rounded-lg bg-emerald-500 text-black shadow-[0_8px_24px_rgba(16,185,129,var(--shadow-boost))]" : "text-zinc-300 hover:text-white"}`} aria-pressed={view === k}>{k}</button>
            ))}
          </div>
          <motion.div initial={{ opacity: 0, y: 12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className={`relative rounded-2xl border border-white/5 bg-zinc-900/60 p-4 shadow-2xl backdrop-blur transition-all duration-300 ${isVideo ? "hover:shadow-[0_20px_60px_rgba(16,185,129,var(--shadow-boost))]" : "hover:shadow-[0_16px_48px_rgba(16,185,129,calc(var(--shadow-boost)-0.1))]"}`}>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-emerald-400" /><p className="text-xs text-zinc-200">Student Dashboard — Arnold Lopez</p></div>
              <div className="flex items-center gap-2 text-xs text-zinc-300"><span className="rounded-md border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-emerald-300">Real‑time</span><span>Sep 17</span></div>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                { label: "Employability Score", value: "87", sub: "+3 this week" },
                { label: "Skills Aligned", value: "32", sub: "to target roles" },
                { label: "Gaps Identified", value: "4", sub: "action items" },
                { label: "Applications Ready", value: "6", sub: "auto‑generated" },
              ].map((c, i) => (
                <motion.div key={c.label} custom={i} variants={fadeUp} initial={prefersReduced ? undefined : "hidden"} animate={prefersReduced ? undefined : "show"}>
                  <StatCard {...c} />
                </motion.div>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              <motion.div variants={fadeUp} className="col-span-2 rounded-xl border border-white/5 bg-zinc-950 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-500/30"><h3 className="mb-2 text-sm text-zinc-300">Pathway Readiness</h3><GradientAreaChart /></motion.div>
              <motion.div variants={fadeUp} className="rounded-xl border border-white/5 bg-zinc-950 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-500/30"><h3 className="mb-2 text-sm text-zinc-300">Smart Tasks</h3><ul className="space-y-2 text-sm text-zinc-300"><li className="flex items-start gap-2"><Bullet /> Map EECS courses to LMI skills — due Fri</li><li className="flex items-start gap-2"><Bullet /> Generate resume highlights from capstone</li><li className="flex items-start gap-2"><Bullet /> Schedule mock interview: ML Engineer</li></ul></motion.div>
            </div>
            <motion.div variants={fadeUp} className="mt-4 rounded-xl border border-white/5 bg-zinc-950 p-4">
              <div className="mb-2 flex items-center justify-between"><h3 className="text-sm text-zinc-300">Course → Skill → Role Alignment</h3><a href="#" className="text-xs text-emerald-300 transition-colors duration-200 hover:text-emerald-200">View all</a></div>
              <div className="grid grid-cols-12 gap-3 text-xs text-zinc-300">
                <div className="col-span-5 text-zinc-400">Course</div>
                <div className="col-span-4 text-zinc-400">Skill</div>
                <div className="col-span-3 text-zinc-400">Role Match</div>
                {[
                  ["CS 188: AI", "Prompt Engineering", "AI Engineer"],
                  ["CS 170: Algorithms", "Optimization", "Data Scientist"],
                  ["EE 16B: Design II", "Systems Thinking", "Product Engineer"],
                ].map(([course, skill, role], i) => (
                  <motion.div key={`row-${i}`} className="contents" initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.5 }}>
                    <div className="col-span-5 transition-colors duration-150 hover:text-white">{course}</div>
                    <div className="col-span-4 transition-colors duration-150 hover:text-white">{skill}</div>
                    <div className="col-span-3"><span className="rounded-md bg-emerald-500/15 px-2 py-0.5 text-emerald-300 transition-colors duration-150 hover:bg-emerald-500/25">{role}</span></div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.section>
      <motion.section variants={fadeUp} initial={prefersReduced ? undefined : "hidden"} whileInView={prefersReduced ? undefined : "show"} viewport={{ once: true, amount: 0.6 }} className="relative z-10 mx-auto max-w-7xl px-6 pb-20">
        <div className="rounded-2xl border border-white/5 bg-zinc-900/60 p-5 backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-500/30"><p className="text-center text-sm text-zinc-400">Built for students, faculty, and employers — align learning with the labor market and automate the busywork.</p></div>
      </motion.section>
      <footer className="relative z-10 mx-auto max-w-7xl px-6 pb-10 text-xs text-zinc-500">© {new Date().getFullYear()} Nexus. All rights reserved.</footer>
      <ThemeControls glowStrength={glowStrength} overlay={overlay} shadowBoost={shadowBoost} setGlowStrength={setGlowStrength} setOverlay={setOverlay} setShadowBoost={setShadowBoost} />
    </div>
  );
}

function ThemeControls({ glowStrength, overlay, shadowBoost, setGlowStrength, setOverlay, setShadowBoost }: { glowStrength: number; overlay: number; shadowBoost: number; setGlowStrength: (n: number) => void; setOverlay: (n: number) => void; setShadowBoost: (n: number) => void; }) {
  const [open, setOpen] = useState(true);
  const copySnippet = async () => { const snippet = `<AnimatedHero variables={{ glowStrength: ${'${round2(glowStrength)}'}, overlay: ${'${round2(overlay)}'}, shadowBoost: ${'${round2(shadowBoost)}'} }} />`; try { await navigator.clipboard.writeText(snippet); } catch {} };
  return (
    <div className="fixed bottom-4 right-4 z-50 select-none">
      <div className="mb-2 flex justify-end">
        <button onClick={() => setOpen(!open)} className="rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-zinc-200 backdrop-blur transition hover:bg-black/60" aria-expanded={open}>{open ? "Hide Theme Controls" : "Show Theme Controls"}</button>
      </div>
      {open && (
        <div className="w-80 rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
          <h3 className="mb-3 text-sm font-medium text-white">Theme Controls</h3>
          <SliderRow label="Glow Strength" value={glowStrength} onChange={setGlowStrength} />
          <SliderRow label="Overlay" value={overlay} onChange={setOverlay} />
          <SliderRow label="Shadow Boost" value={shadowBoost} onChange={setShadowBoost} />
          <div className="mt-3 flex items-center justify-between gap-2">
            <code className="block max-w-[60%] truncate rounded-md bg-black/40 px-2 py-1 text-[10px] text-emerald-300">glow:{round2(glowStrength)} overlay:{round2(overlay)} shadow:{round2(shadowBoost)}</code>
            <button onClick={copySnippet} className="rounded-md bg-emerald-500 px-3 py-1 text-xs font-medium text-black transition hover:bg-emerald-400">Copy snippet</button>
          </div>
        </div>
      )}
    </div>
  );
}

function SliderRow({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <div className="mb-3">
      <div className="mb-1 flex items-center justify-between text-xs text-zinc-300"><span>{label}</span><span>{round2(value)}</span></div>
      <input className="w-full accent-emerald-500" type="range" min={0} max={1} step={0.01} value={value} onChange={(e) => onChange(parseFloat((e.target as HTMLInputElement).value))} aria-label={label} />
    </div>
  );
}

function Logo() {
  return (
    <a href="#" className="group inline-flex items-center gap-3">
      <motion.svg initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} width="30" height="30" viewBox="0 0 100 100" className="drop-shadow-[0_8px_24px_rgba(16,185,129,0.35)] transition-transform duration-300 group-hover:scale-105">
        <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#34d399" /><stop offset="100%" stopColor="#10b981" /></linearGradient></defs>
        <rect x="10" y="10" width="80" height="80" rx="18" fill="url(#g)" />
        <path d="M30 65V35l40 30V35" stroke="#02140f" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      </motion.svg>
      <div><span className="block text-sm font-semibold tracking-wide text-white">Nexus</span><span className="block -mt-1 text-[10px] tracking-[0.2em] text-emerald-300/80">COLLEGE→CAREER OS</span></div>
    </a>
  );
}

function Check() { return (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-emerald-400"><path fillRule="evenodd" d="M2.25 12a9.75 9.75 0 1119.5 0 9.75 9.75 0 01-19.5 0zm14.28-2.03a.75.75 0 10-1.06-1.06L10.5 13.38l-1.97-1.97a.75.75 0 10-1.06 1.06l2.5 2.5c.3.3.77.3 1.06 0l5.56-5.56z" clipRule="evenodd" /></svg>); }
function Bullet() { return <span className="mt-1 inline-block h-2 w-2 flex-none rounded-full bg-emerald-400" />; }
function StatCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-xl border border-white/5 bg-zinc-950 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-500/30">
      <p className="text-xs text-zinc-400">{label}</p>
      <div className="mt-1 flex items-baseline gap-2"><span className="text-2xl font-semibold text-white">{value}</span><span className="text-[10px] text-emerald-300">{sub}</span></div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-zinc-800"><div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400" style={{ width: `${Math.min(Number(value), 100)}%` }} /></div>
    </div>
  );
}
function GradientAreaChart() {
  return (
    <svg viewBox="0 0 400 160" className="h-40 w-full">
      <defs>
        <linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="rgba(16,185,129,0.8)" /><stop offset="100%" stopColor="rgba(16,185,129,0.0)" /></linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4" result="coloredBlur" /><feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <rect x="0" y="0" width="400" height="160" rx="12" fill="#09090b" />
      <polyline fill="url(#area)" stroke="none" points="0,120 20,118 40,112 60,105 80,110 100,96 120,92 140,88 160,82 180,78 200,70 220,68 240,72 260,64 280,66 300,58 320,60 340,52 360,54 380,46 400,46 400,160 0,160" />
      <polyline filter="url(#glow)" fill="none" stroke="#34d399" strokeWidth="2.5" points="0,120 20,118 40,112 60,105 80,110 100,96 120,92 140,88 160,82 180,78 200,70 220,68 240,72 260,64 280,66 300,58 320,60 340,52 360,54 380,46 400,46" />
    </svg>
  );
}
function clamp01(n: number) { return Math.max(0, Math.min(1, n)); }
function round2(n: number) { return Math.round(n * 100) / 100; }
