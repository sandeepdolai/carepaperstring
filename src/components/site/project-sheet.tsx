"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import type { Project } from "@/lib/projects";

const ease = [0.22, 1, 0.36, 1] as const;

function ProgressRing({ progress }: { progress: number }) {
  const r = 42;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 100 100" className="size-full -rotate-90">
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke="black"
        strokeWidth="6"
        opacity="0.9"
      />
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke="black"
        strokeWidth="6"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - progress)}
        style={{ transition: "stroke-dashoffset 120ms linear" }}
      />
    </svg>
  );
}

export function ProjectSheet({
  project,
  prev,
  next,
}: {
  project: Project;
  prev: Project;
  next: Project;
}) {
  const router = useRouter();
  const mediaRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  // forward wheel over the whole sheet to the media column (desktop)
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      const media = mediaRef.current;
      if (!media) return;
      const desktop = window.innerWidth >= 650;
      if (!desktop) return;
      const rect = media.getBoundingClientRect();
      const overMedia =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
      if (!overMedia) {
        media.scrollTop += e.deltaY;
      }
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  const onScroll = () => {
    const el = mediaRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    setProgress(max > 0 ? el.scrollTop / max : 0);
  };

  return (
    <main className="pointer-events-none fixed inset-0 z-20">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease }}
        className="pointer-events-auto fixed inset-y-15 inset-x-20 flex flex-col gap-y-40 overflow-hidden rounded-15 bg-white s:inset-y-20 s:inset-x-50 s:flex-row s:items-start s:gap-x-100 s:rounded-20 s:pl-40 s:pr-120 s:pt-40"
      >
        <div className="flex size-full flex-col overflow-y-auto no-scrollbar s:flex-row s:items-start s:gap-x-100 s:overflow-hidden">
          {/* left column */}
          <div className="flex flex-col items-start px-15 pt-40 s:flex-1 s:px-0 s:pt-0">
            <h1 className="whitespace-nowrap text-35 font-regular leading-none tracking-[-0.05em] text-black s:text-45">
              {project.title}
            </h1>
            <div className="mt-15 max-w-[40rem] text-14 tracking-[-0.035em] text-black s:mt-20 s:text-16">
              {project.description}
            </div>
            <div className="mt-30 flex items-start gap-12 s:mt-45">
              <a
                href={project.href}
                target="_blank"
                rel="noopener"
                aria-label={`Visit ${project.title}`}
                className="inline-flex aspect-square h-[2em] items-center justify-center rounded-full bg-black text-white transition-transform duration-300 ease-out has-hover:hover:scale-105"
              >
                <ArrowUpRight className="size-[1em]" strokeWidth={1.75} />
              </a>
              <div className="flex flex-wrap gap-4 s:gap-2">
                {project.pills.map((pill) => (
                  <span
                    key={pill}
                    className="inline-flex h-[2em] items-center whitespace-nowrap rounded-full bg-cream px-[1.25em] text-black"
                  >
                    <span className="label">{pill}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* media column */}
          <div
            ref={mediaRef}
            onScroll={onScroll}
            className="flex w-full flex-col items-center gap-y-30 pb-80 s:h-full s:w-700 s:shrink-0 s:gap-y-60 s:overflow-y-auto s:pb-0 no-scrollbar"
          >
            {project.media.map(([w, h], i) => (
              <div
                key={i}
                className="w-full flex-none overflow-hidden"
                style={{ aspectRatio: `${w} / ${h}` }}
              >
                { }
                <img
                  src="/media/placeholder.jpg"
                  alt={`${project.title} — media ${i + 1}`}
                  draggable={false}
                  className="pointer-events-none size-full select-none object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* scroll progress ring */}
        <div className="absolute bottom-15 left-15 size-25 s:bottom-30 s:left-30">
          <ProgressRing progress={progress} />
        </div>

        {/* close */}
        <Link
          href="/"
          aria-label="Close project"
          onClick={(e) => {
            e.preventDefault();
            router.push("/");
          }}
          className="absolute bottom-15 right-15 flex size-40 items-center justify-center rounded-full bg-black text-white transition-transform duration-300 ease-out has-hover:hover:scale-105 s:bottom-auto s:right-30 s:top-30 s:size-45"
        >
          <X className="size-[1.5rem]" strokeWidth={1.75} />
        </Link>
      </motion.div>

      {/* related projects: static peeks at the screen edges with tap/hover zones */}
      {(
        [
          {
            p: prev,
            side: "left" as const,
            label: `Previous project: ${prev.title}`,
          },
          {
            p: next,
            side: "right" as const,
            label: `Next project: ${next.title}`,
          },
        ] as const
      ).map(({ p, side, label }) => (
        <div
          key={side}
          className={`invisible pointer-events-none fixed inset-100 ${
            side === "left"
              ? "-translate-x-[calc(100%+9rem)] s:-translate-x-[calc(100%+7.5rem)]"
              : "translate-x-[calc(100%+9rem)] s:translate-x-[calc(100%+7.5rem)]"
          }`}
        >
          <div
            aria-hidden
            className="visible absolute inset-0 overflow-hidden rounded-15 opacity-30 s:rounded-20"
          >
            { }
            <img
              src="/media/placeholder.jpg"
              alt=""
              draggable={false}
              className="size-full select-none rounded-[inherit] object-cover"
            />
          </div>
          <Link
            href={`/projects/${p.id}`}
            aria-label={label}
            onClick={(e) => {
              e.preventDefault();
              router.push(`/projects/${p.id}`);
            }}
            className={`visible pointer-events-auto absolute inset-0 cursor-pointer ${
              side === "left" ? "-right-25" : "-left-25"
            }`}
          />
        </div>
      ))}
    </main>
  );
}
