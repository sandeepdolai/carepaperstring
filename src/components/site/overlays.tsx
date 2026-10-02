"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useSite } from "./store";
import { GoldRing } from "./gold-ring";

const ease = [0.22, 1, 0.36, 1] as const;

const socials = [
  { label: "Instagram", href: "https://www.instagram.com/jesperlandberg222/" },
  { label: "X", href: "https://x.com/jesper_alpacka" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/jesper-landberg-ba2984256/" },
];

function OverlayShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="pointer-events-none fixed left-1/2 top-1/2 z-40 w-420 -translate-x-1/2 -translate-y-1/2 s:w-600">
      <div className="absolute inset-x-20 top-1/2 flex -translate-y-1/2 flex-col items-center text-center text-white">
        {children}
      </div>
    </div>
  );
}

export function ProfileOverlay() {
  const open = useSite((s) => s.overlay === "profile");

  return (
    <AnimatePresence>
      {open && (
        <>
          <GoldRing />
          <OverlayShell>
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.55, ease, delay: 0.12 }}
              className="flex flex-col items-center"
            >
              <p className="max-w-[35rem] text-14 tracking-[-0.02em] s:max-w-[45rem]">
                Jesper Landberg, Swedish design engineer, named Awwwards
                Independent of the Year in 2022 and 2024, building visually
                rich, motion-driven websites. Usually lead or sole developer,
                responsible for front-end architecture, animation, interaction
                and CMS, alongside international agencies and creative teams.
              </p>
              <p className="label mt-25 opacity-60 s:mt-30">
                77 awards — 30× Awwwards, 40× FWA, 3× Webby, 2× Lovie.
              </p>
              <ul className="mt-25 flex list-none flex-wrap items-center justify-center gap-x-20 gap-y-8 s:mt-30">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener"
                      className="label pointer-events-auto block transition-opacity duration-300 ease-out has-hover:hover:opacity-60"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href="mailto:jesper@alpacka.studio"
                    className="label pointer-events-auto block transition-opacity duration-300 ease-out has-hover:hover:opacity-60"
                  >
                    Email
                  </a>
                </li>
              </ul>
            </motion.div>
          </OverlayShell>
        </>
      )}
    </AnimatePresence>
  );
}

export function NewsletterOverlay() {
  const open = useSite((s) => s.overlay === "newsletter");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setStatus(null);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ ok: true, msg: "On the list. Talk soon." });
        setEmail("");
      } else {
        setStatus({ ok: false, msg: data.error ?? "Something went wrong." });
      }
    } catch {
      setStatus({ ok: false, msg: "Something went wrong. Try again." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <GoldRing />
          <OverlayShell>
          <motion.div
            key="newsletter"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.55, ease, delay: 0.12 }}
            className="flex w-full flex-col items-center"
          >
            <p className="max-w-[30rem] text-14 tracking-[-0.02em] s:max-w-[32.5rem]">
              An occasional newsletter with insights and thoughts from a design
              engineer, drawn from over a decade of freelancing.
            </p>
            <form
              onSubmit={submit}
              noValidate
              aria-busy={busy}
              className="mt-25 flex w-full max-w-[26rem] items-center gap-x-8 s:mt-30 s:max-w-[32rem]"
            >
              <div className="flex h-40 min-w-0 w-full flex-1 items-center rounded-full bg-black px-20 text-14 tracking-[-0.02em] s:h-45">
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                  enterKeyHint="send"
                  aria-label="Email address"
                  placeholder="Email address"
                  className="h-full w-full border-0 bg-transparent text-white outline-none placeholder:text-white/40"
                />
              </div>
              <button
                type="submit"
                aria-label="Subscribe"
                disabled={busy}
                className="flex size-40 flex-none items-center justify-center rounded-full bg-white text-black transition-opacity duration-300 ease-out has-hover:hover:opacity-70 disabled:pointer-events-none s:size-45"
              >
                <ArrowRight className="size-[1.6rem]" strokeWidth={1.75} />
              </button>
            </form>
            <p
              role="status"
              aria-live="polite"
              className="label mt-15 min-h-[1.2em] w-full text-center"
            >
              {status && (
                <span className="inline-block opacity-60">{status.msg}</span>
              )}
            </p>
          </motion.div>
          </OverlayShell>
        </>
      )}
    </AnimatePresence>
  );
}

/** SEO-friendly hidden content, mirrors the reference sr-only block. */
export function SrOnlyContent() {
  return (
    <div className="sr-only">
      <h1>Jesper Landberg — design engineer</h1>
      <p>
        Jesper Landberg, Swedish design engineer, named Awwwards Independent of
        the Year in 2022 and 2024, building visually rich, motion-driven
        websites.
      </p>
      <p>
        Usually lead or sole developer, responsible for front-end architecture,
        animation, interaction and CMS, alongside international agencies and
        creative teams. Freelance, and available to studios and clients
        anywhere.
      </p>
      <p>77 awards — 30× Awwwards, 40× FWA, 3× Webby, 2× Lovie.</p>
      <h2>Featured work</h2>
      <ul>
        {[
          ["Nathan Riley", "/projects/nathan-riley"],
          ["Casa Di Solare", "/projects/casa-di-solare"],
          ["The Lookback", "/projects/the-lookback"],
          ["Book of Happiness", "/projects/book-of-happiness"],
          ["Dogelon Mars", "/projects/dogelon-mars"],
          ["Gil Huybrecht", "/projects/gil-huybrecht"],
          ["Discoveryland", "/projects/discoveryland"],
          ["Griflan", "/projects/griflan"],
        ].map(([t, h]) => (
          <li key={h}>
            <Link href={h}>{t}</Link>
          </li>
        ))}
      </ul>
      <h2>Elsewhere</h2>
      <ul>
        <li>
          <Link href="/full">Full index — every project by name</Link>
        </li>
        <li>
          <Link href="/newsletter">Newsletter</Link>
        </li>
        <li>
          <a href="mailto:jesper@alpacka.studio">jesper@alpacka.studio</a>
        </li>
      </ul>
    </div>
  );
}
