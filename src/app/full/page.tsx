"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fullIndex } from "@/lib/projects";
import { Chrome } from "@/components/site/chrome";
import { Loader } from "@/components/site/loader";
import { useSite } from "@/components/site/store";

const ease = [0.22, 1, 0.36, 1] as const;

export default function FullIndexPage() {
  const ready = useSite((s) => s.ready);

  return (
    <>
      <div className="sr-only">
        <h1>Index — every project by Jesper Landberg</h1>
        <p>
          The full catalogue, featured or not. A featured project has a case
          study on this site; the rest are listed by name, with the client&apos;s
          own site linked where there is one.
        </p>
      </div>
      <Loader />
      <main className="fixed inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease, delay: 0.15 }}
        >
          <div className="absolute inset-0">
            <div className="mx-auto flex min-h-full max-w-[42rem] flex-wrap content-center items-center justify-center gap-x-24 gap-y-6 px-20 s:max-w-[90rem]">
              {fullIndex.map((entry) => (
                <span key={entry.title} className="relative flex">
                  {entry.internal ? (
                    <Link
                      href={entry.href}
                      className="pointer-events-auto cursor-pointer whitespace-nowrap text-18 tracking-[-0.05em] transition-opacity duration-300 ease-out has-hover:hover:opacity-50 s:text-30"
                    >
                      {entry.title}
                    </Link>
                  ) : (
                    <a
                      href={entry.href}
                      target="_blank"
                      rel="noopener"
                      className="pointer-events-auto cursor-pointer whitespace-nowrap text-18 tracking-[-0.05em] transition-opacity duration-300 ease-out has-hover:hover:opacity-50 s:text-30"
                    >
                      {entry.title}
                    </a>
                  )}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute left-full top-1/2 ml-12 -translate-x-1/2 -translate-y-1/2 text-8 leading-none"
                  >
                    ●
                  </span>
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </main>
      <Chrome />
    </>
  );
}
