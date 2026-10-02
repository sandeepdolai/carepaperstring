"use client";

import { useEffect } from "react";
import { Gallery } from "@/components/site/gallery";
import { Chrome } from "@/components/site/chrome";
import { Loader } from "@/components/site/loader";
import { NewsletterOverlay, ProfileOverlay } from "@/components/site/overlays";
import { useSite } from "@/components/site/store";

export default function NewsletterPage() {
  const overlay = useSite((s) => s.overlay);

  // arrives with the newsletter sheet open, like the reference
  useEffect(() => {
    useSite.getState().setOverlay("newsletter");
  }, []);

  return (
    <>
      <div className="sr-only">
        <h1>Newsletter</h1>
        <p>
          An occasional newsletter with insights and thoughts from a design
          engineer, drawn from over a decade of freelancing.
        </p>
      </div>
      <Loader />
      <Gallery hidden={overlay !== "none"} />
      <ProfileOverlay />
      <NewsletterOverlay />
      <Chrome />
    </>
  );
}
