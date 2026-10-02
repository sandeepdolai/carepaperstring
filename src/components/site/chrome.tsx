"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSite } from "./store";

/** Fixed page chrome: wordmark + profile toggle on top, view nav + newsletter toggle at bottom. */
export function Chrome() {
  const overlay = useSite((s) => s.overlay);
  const toggleOverlay = useSite((s) => s.toggleOverlay);
  const pathname = usePathname();
  const onFull = pathname === "/full";
  const profileOpen = overlay === "profile";
  const newsletterOpen = overlay === "newsletter";

  return (
    <div className="pointer-events-none fixed inset-0 z-40 flex flex-col justify-between px-40 py-25 text-white s:px-80 s:py-40">
      <div className="flex items-start justify-between">
        <Link
          href="/"
          className="label pointer-events-auto cursor-pointer transition-opacity duration-300 ease-out has-hover:hover:opacity-60"
        >
          Jesper Landberg
        </Link>
        <button
          type="button"
          aria-expanded={profileOpen}
          onClick={() => toggleOverlay("profile")}
          className="label pointer-events-auto cursor-pointer transition-opacity duration-300 ease-out has-hover:hover:opacity-60"
        >
          {profileOpen ? "Close" : "Profile"}
        </button>
      </div>
      <div className="relative flex justify-start">
        <nav
          aria-label="Project views"
          className="label pointer-events-auto relative flex cursor-default gap-x-5"
        >
          <Link
            href="/"
            aria-current={onFull ? undefined : "page"}
            className="transition-opacity duration-500 ease-out has-hover:hover:opacity-100"
          >
            Featured
          </Link>
          <span aria-hidden className="opacity-50">
            /
          </span>
          <Link
            href="/full"
            className={`transition-opacity duration-500 ease-out has-hover:hover:opacity-100 ${
              onFull ? "" : "opacity-50"
            }`}
          >
            Full
          </Link>
        </nav>
        <button
          type="button"
          aria-expanded={newsletterOpen}
          onClick={() => toggleOverlay("newsletter")}
          className="label pointer-events-auto absolute bottom-0 right-0 cursor-pointer transition-opacity duration-300 ease-out has-hover:hover:opacity-60"
        >
          {newsletterOpen ? "Close" : "Newsletter"}
        </button>
      </div>
    </div>
  );
}
