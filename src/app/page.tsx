"use client";

import { useEffect } from "react";
import { Gallery } from "@/components/site/gallery";
import { Chrome } from "@/components/site/chrome";
import { Loader } from "@/components/site/loader";
import {
  NewsletterOverlay,
  ProfileOverlay,
  SrOnlyContent,
} from "@/components/site/overlays";
import { useSite } from "@/components/site/store";

export default function Home() {
  const overlay = useSite((s) => s.overlay);

  useEffect(() => {
    // close any overlay when arriving home
    useSite.getState().setOverlay("none");
  }, []);

  return (
    <>
      <SrOnlyContent />
      <Loader />
      <Gallery hidden={overlay !== "none"} />
      <ProfileOverlay />
      <NewsletterOverlay />
      <Chrome />
    </>
  );
}
