"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { projects } from "@/lib/projects";
import { useSite } from "./store";

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

/** tilt (deg) applied to every card — the reference cards lean back slightly (top recedes) */
const LEAN_X = 9;

/** Perspective grid floor + ambient glow, with light parallax. */
function FloorGrid({
  progressRef,
}: {
  progressRef: React.RefObject<number>;
}) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      if (gridRef.current) {
        const p = progressRef.current ?? 0;
        gridRef.current.style.backgroundPositionX = `${-p * 0.25}px`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [progressRef]);

  return (
    <div
      aria-hidden
      className="floor-layer pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* lit floor pool under the cards */}
      <div
        className="absolute inset-x-0 bottom-[2%] h-[38%]"
        style={{
          background:
            "radial-gradient(ellipse 75% 62% at 50% 62%, rgba(214,176,120,0.13), rgba(120,95,55,0.05) 48%, transparent 74%)",
        }}
      />
      {/* faint perspective grid inside the pool */}
      <div
        ref={gridRef}
        className="absolute inset-x-[-40%] bottom-[6%] h-[30%]"
        style={{
          transform: "perspective(38rem) rotateX(61deg)",
          transformOrigin: "50% 0%",
          backgroundImage:
            "linear-gradient(rgba(64,64,64,0.55) 1px, transparent 1px), linear-gradient(90deg, rgba(64,64,64,0.55) 1px, transparent 1px)",
          backgroundSize: "6rem 6rem",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 30%, black 55%, transparent 96%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 30%, black 55%, transparent 96%)",
        }}
      />
    </div>
  );
}

function Card({
  index,
  project,
  onNavigate,
}: {
  index: number;
  project: (typeof projects)[number];
  onNavigate: (e: React.MouseEvent) => void;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    (ref.current as HTMLElement & { _index?: number })._index = index;
  }, [index]);

  return (
    <article
      ref={ref}
      className="relative w-full s:h-[43.5svh] s:max-h-[55rem] s:w-auto flex-none cursor-pointer rounded-15 s:rounded-20 will-change-transform"
      style={{ aspectRatio: `${project.cardAspect[0]} / ${project.cardAspect[1]}` }}
    >
      <Link
        href={`/projects/${project.id}`}
        onClick={onNavigate}
        className="block size-full overflow-hidden rounded-[inherit] shadow-[0_9rem_8rem_-5rem_rgba(0,0,0,0.9)]"
        aria-label={project.title}
      >
        <img
          src="/media/placeholder.jpg"
          alt=""
          draggable={false}
          className="pointer-events-none size-full select-none object-cover"
        />
        {/* subtle scrim so titles read on light media (reference media is dark) */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 block h-[22%]"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.34), rgba(0,0,0,0.14) 55%, transparent)",
          }}
        />
      </Link>
      <p className="pointer-events-none absolute inset-x-10 bottom-10 s:inset-x-20 s:bottom-10 flex items-end justify-between">
        <span
          className="whitespace-nowrap text-16 tracking-[-0.05em] s:text-18"
          style={{ textShadow: "0 1px 3px rgba(0,0,0,0.65), 0 2px 14px rgba(0,0,0,0.55)" }}
        >
          {project.title}
        </span>
        <span
          aria-hidden
          className="flex size-25 items-center justify-center rounded-full bg-black text-white"
        >
          <ArrowRight className="size-[1.35rem]" strokeWidth={1.75} />
        </span>
      </p>
    </article>
  );
}

export function Gallery({ hidden }: { hidden: boolean }) {
  const ready = useSite((s) => s.ready);
  const overlay = useSite((s) => s.overlay);
  const stageRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const current = useRef(0);
  const target = useRef(0);
  const progressRef = useRef(0);
  const metrics = useRef({ min: 0, max: 0 });
  const initRef = useRef(false);
  const drag = useRef({
    active: false,
    moved: 0,
    axis: null as "x" | "y" | null,
    lastX: 0,
    lastY: 0,
    velocity: 0,
    lastT: 0,
  });
  const hovered = useRef(-1);
  const disabledRef = useRef(false);
  const [entered, setEntered] = useState(false);

  const isDesktop = () =>
    typeof window !== "undefined" && window.innerWidth >= 650;

  const measure = useCallback(() => {
    const row = rowRef.current;
    if (!row) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    if (vw >= 650) {
      const total = row.scrollWidth;
      if (!(total > 0)) return; // layout not settled yet — retry later
      metrics.current.min = 0;
      metrics.current.max = Math.max(0, total - vw);
      if (!initRef.current) {
        initRef.current = true;
        const raw = sessionStorage.getItem("jl-progress");
        const saved = raw === null ? NaN : Number(raw);
        if (Number.isFinite(saved)) {
          current.current = saved;
          target.current = saved;
        } else {
          const first = row.firstElementChild as HTMLElement | null;
          const init = first ? first.offsetWidth * 0.334 : 0;
          current.current = init;
          target.current = init;
        }
      }
    } else {
      const total = row.scrollHeight;
      if (!(total > 0)) return;
      metrics.current.min = -99;
      metrics.current.max = Math.max(0, total - vh + 99);
      if (!initRef.current) {
        initRef.current = true;
        const raw = sessionStorage.getItem("jl-progress");
        const saved = raw === null ? NaN : Number(raw);
        if (Number.isFinite(saved)) {
          current.current = saved;
          target.current = saved;
        } else {
          current.current = -99;
          target.current = -99;
        }
      }
    }
    if (metrics.current.max > 0) {
      target.current = clamp(
        target.current,
        metrics.current.min,
        metrics.current.max
      );
      current.current = clamp(
        current.current,
        metrics.current.min,
        metrics.current.max
      );
    }
  }, []);

  // initial mount: measure + start rAF
  useEffect(() => {
    measure();
    const onResize = () => {
      measure();
      target.current = clamp(
        target.current,
        metrics.current.min,
        metrics.current.max
      );
    };
    window.addEventListener("resize", onResize);

    let raf = 0;
    let last = performance.now();
    let saveTick = 0;
    const tick = (now: number) => {
      const dt = clamp(now - last, 1, 64) / 16.667;
      last = now;

      // persist gallery position (SPA-like state keep on route changes)
      if (++saveTick % 60 === 0 && initRef.current) {
        try {
          sessionStorage.setItem(
            "jl-progress",
            String(Math.round(current.current))
          );
        } catch {}
      }

      // spring back when out of bounds
      const { min, max } = metrics.current;
      if (target.current < min) target.current = min + (target.current - min) * Math.pow(0.82, dt);
      if (target.current > max) target.current = max + (target.current - max) * Math.pow(0.82, dt);

      const alpha = 1 - Math.pow(1 - 0.16, dt);
      current.current += (target.current - current.current) * alpha;
      progressRef.current = current.current;

      const row = rowRef.current;
      if (row) {
        if (isDesktop()) {
          row.style.transform = `translateY(-50%) translate3d(${-current.current}px, 0, 0)`;
          const vw = window.innerWidth;
          const cards = row.children;
          for (let i = 0; i < cards.length; i++) {
            const card = cards[i] as HTMLElement;
            const center = card.offsetLeft + card.offsetWidth / 2 - current.current;
            const n = (center - vw / 2) / (vw / 2);
            const angle = clamp(n * 14, -21, 21);
            const dist = Math.abs(n);
            const scale = (1 - Math.min(dist, 1.6) * 0.08) * (hovered.current === i ? 1.045 : 1);
            const lift = 30 - Math.min(dist, 1.6) * 72;
            /** cylinders pull cards toward the viewer axis, tightening visual gaps */
            const pull = -Math.sign(n) * Math.min(dist, 1.5) * 40;
            const opacity = 1 - smoothstep(1.02, 1.52, dist);
            card.style.transform = `translateX(${pull.toFixed(1)}px) translateZ(${lift.toFixed(1)}px) rotateX(${LEAN_X}deg) rotateY(${angle.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
            card.style.opacity = opacity.toFixed(3);
          }
        } else {
          row.style.transform = `translate3d(0, ${-current.current}px, 0)`;
          const vh = window.innerHeight;
          const cards = row.children;
          for (let i = 0; i < cards.length; i++) {
            const card = cards[i] as HTMLElement;
            const center = card.offsetTop + card.offsetHeight / 2 - current.current;
            const n = (center - vh / 2) / (vh / 2);
            const dist = Math.abs(n);
            const opacity = 1 - smoothstep(0.9, 1.45, dist);
            card.style.transform = "";
            card.style.opacity = opacity.toFixed(3);
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [measure]);

  // re-measure when fonts/images/layout settle
  useEffect(() => {
    const t1 = setTimeout(measure, 300);
    const t2 = setTimeout(measure, 1200);
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => measure()).catch(() => {});
    }
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [measure]);

  // wheel navigation
  useEffect(() => {
    disabledRef.current = overlay !== "none" || !ready;
  }, [overlay, ready]);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (disabledRef.current) return;
      const delta =
        Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (delta === 0) return;
      e.preventDefault();
      const { min, max } = metrics.current;
      const next = target.current + delta;
      if (next < min) target.current = min + (next - min) * 0.25;
      else if (next > max) target.current = max + (next - max) * 0.25;
      else target.current = next;
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  // drag / touch navigation
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const onDown = (e: PointerEvent) => {
      if (disabledRef.current) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      drag.current = {
        active: true,
        moved: 0,
        axis: null,
        lastX: e.clientX,
        lastY: e.clientY,
        velocity: 0,
        lastT: performance.now(),
      };
    };
    const onMove = (e: PointerEvent) => {
      const d = drag.current;
      if (!d.active) return;
      const dx = e.clientX - d.lastX;
      const dy = e.clientY - d.lastY;
      if (!d.axis) {
        if (Math.abs(dx) > 6 || Math.abs(dy) > 6) {
          d.axis = isDesktop() ? "x" : "y";
        } else return;
      }
      const delta = d.axis === "x" ? dx : dy;
      d.moved += Math.abs(delta);
      d.lastX = e.clientX;
      d.lastY = e.clientY;
      const now = performance.now();
      const dt = Math.max(now - d.lastT, 1);
      d.velocity = d.velocity * 0.7 + (delta / dt) * 0.3;
      d.lastT = now;

      const { min, max } = metrics.current;
      const next = target.current - delta * 1.55;
      if (next < min) target.current = min + (next - min) * 0.3;
      else if (next > max) target.current = max + (next - max) * 0.3;
      else target.current = next;
    };
    const onUp = () => {
      const d = drag.current;
      if (!d.active) return;
      d.active = false;
      if (d.axis && Math.abs(d.velocity) > 0.05) {
        const { min, max } = metrics.current;
        const momentum = -d.velocity * 260;
        const next = target.current + momentum;
        if (next < min) target.current = min + (next - min) * 0.3;
        else if (next > max) target.current = max + (next - max) * 0.3;
        else target.current = next;
      }
      setTimeout(() => {
        drag.current.moved = 0;
        drag.current.axis = null;
      }, 50);
    };

    stage.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      stage.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, []);

  // keyboard accessibility (left/right/up/down)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (disabledRef.current) return;
      const step = window.innerWidth * 0.18;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        target.current = clamp(target.current + step, metrics.current.min, metrics.current.max);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        target.current = clamp(target.current - step, metrics.current.min, metrics.current.max);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onNavigate = useCallback((e: React.MouseEvent) => {
    if (drag.current.moved > 8) {
      e.preventDefault();
    }
  }, []);

  // hover tracking for scale-up
  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const cards = Array.from(row.children) as HTMLElement[];
    const enters = cards.map((c, i) => {
      const fn = () => (hovered.current = i);
      c.addEventListener("pointerenter", fn);
      return fn;
    });
    const leave = () => (hovered.current = -1);
    row.addEventListener("pointerleave", leave);
    return () => {
      cards.forEach((c, i) => c.removeEventListener("pointerenter", enters[i]));
      row.removeEventListener("pointerleave", leave);
    };
  }, []);

  // entrance animation
  useEffect(() => {
    if (ready && !entered) {
      const t = setTimeout(() => setEntered(true), 60);
      return () => clearTimeout(t);
    }
  }, [ready, entered]);

  const visible = entered && !hidden;

  return (
    <div
      ref={stageRef}
      className="fixed inset-0 overflow-hidden transition-[opacity,transform] duration-500 ease-out"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1)" : "scale(0.96)",
        pointerEvents: hidden ? "none" : "auto",
        touchAction: "none",
      }}
    >
      <div
        className="stage-scale absolute inset-0"
        style={{
          perspective: "110rem",
          perspectiveOrigin: "50% 50%",
        }}
      >
        <FloorGrid progressRef={progressRef} />
        <div
          ref={rowRef}
          className="absolute top-0 flex w-full flex-col gap-y-20 px-20 s:top-1/2 s:w-auto s:flex-row s:gap-x-10 s:px-0"
          style={{ transformStyle: "preserve-3d" }}
        >
          {projects.map((p, i) => (
            <Card key={p.id} index={i} project={p} onNavigate={onNavigate} />
          ))}
        </div>
      </div>
    </div>
  );
}