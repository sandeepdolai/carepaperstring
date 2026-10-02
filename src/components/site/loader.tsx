"use client";

import { useEffect, useState } from "react";
import { useSite } from "./store";

/** Mirrors the reference loader: two bars + a pulsing dot, centered. Plays once per session. */
export function Loader() {
  const ready = useSite((s) => s.ready);
  const setReady = useSite((s) => s.setReady);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let played = false;
    try {
      played = sessionStorage.getItem("jl-intro") === "1";
    } catch {}

    const timers: ReturnType<typeof setTimeout>[] = [];

    // skip the intro on returns within the same session
    const intro = setTimeout(() => {
      setReady(true);
      try {
        sessionStorage.setItem("jl-intro", "1");
      } catch {}
    }, played ? 0 : 1500);
    timers.push(intro);

    if (played) {
      const hide = setTimeout(() => setHidden(true), 60);
      timers.push(hide);
    }

    return () => timers.forEach(clearTimeout);
  }, [setReady]);

  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => setHidden(true), 700);
    return () => clearTimeout(t);
  }, [ready]);

  if (hidden) return null;

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-90 flex items-center justify-center bg-black transition-opacity duration-500 ease-out"
      style={{ opacity: ready ? 0 : 1 }}
    >
      <div className="flex items-center gap-x-8">
        <span className="block h-[0.45rem] w-[5rem] rounded-full bg-white" />
        <span className="block h-[0.45rem] w-[2.6rem] rounded-full bg-white" />
        <span className="loader-dot block size-[0.45rem] rounded-full bg-white" />
      </div>
    </div>
  );
}
