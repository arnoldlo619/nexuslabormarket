"use client";
import dynamic from "next/dynamic";
import "./globals.css";

const AnimatedHero = dynamic(() => import("./components/AnimatedHero"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-black text-white grid place-items-center">
      <p className="text-sm text-zinc-400">Loading experience…</p>
    </div>
  ),
});

export default function Page() {
  return <AnimatedHero variables={{ glowStrength: 0.35, overlay: 0.4, shadowBoost: 0.35 }} />;
}