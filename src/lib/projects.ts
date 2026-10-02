export interface Project {
  id: string;
  title: string;
  description: string;
  href: string;
  pills: string[];
  /** aspect ratio of the gallery card */
  cardAspect: [number, number];
  /** aspect ratios of the project page media stack */
  media: Array<[number, number]>;
}

export const projects: Project[] = [
  {
    id: "nathan-riley",
    title: "Nathan Riley",
    description:
      "Nathan is a UK-based digital creative specializing in art direction, surrealist 3D visuals, interactive experiences, and motion design.",
    href: "https://www.nrly.co/",
    pills: ["2023"],
    cardAspect: [2048, 1172],
    media: [
      [2048, 1172],
      [1787, 900],
      [1798, 905],
      [1792, 904],
    ],
  },
  {
    id: "casa-di-solare",
    title: "Casa Di Solare",
    description:
      "Solare extends Nikolas Type‘s Font Catalogue with a timeless, hyper-useable quintessential variable font, suitable for a wide field of applications.",
    href: "https://casadisolare.com/",
    pills: ["Unseen", "2024"],
    cardAspect: [2048, 1204],
    media: [
      [2048, 1204],
      [1280, 596],
      [1280, 644],
    ],
  },
  {
    id: "the-lookback",
    title: "The Lookback",
    description:
      "Digital capsule for Better Off® studio to document what inspired them and what they created over the last months/years.",
    href: "https://tlb.betteroff.studio/",
    pills: ["BetterOff® Studio", "2026", "Gil Huybrecht"],
    cardAspect: [1250, 720],
    media: [
      [1250, 720],
      [1620, 1080],
      [1500, 1897],
      [1500, 1000],
    ],
  },
  {
    id: "book-of-happiness",
    title: "Book of Happiness",
    description:
      "Helping leaders keep themselves and their people happy and mentally healthy.",
    href: "https://www.findworkhappiness.com/",
    pills: ["2024", "David Lubofsky"],
    cardAspect: [2048, 1114],
    media: [
      [2048, 1114],
      [1565, 908],
      [1568, 906],
      [1571, 906],
    ],
  },
  {
    id: "dogelon-mars",
    title: "Dogelon Mars",
    description:
      "Follow the story of Dogelon Mars as he explores the greatest mysteries of the universe and seeks to return to the planet he once called home with the help of the friends he’s made during his intergalactic travels.",
    href: "https://dogelonmars.com/",
    pills: ["Griflan", "2024"],
    cardAspect: [3360, 2200],
    media: [
      [3360, 2200],
      [3360, 2200],
      [3420, 2201],
      [3360, 2200],
    ],
  },
  {
    id: "gil-huybrecht",
    title: "Gil Huybrecht",
    description:
      "Gil Huybrecht is a Belgian digital designer and art director, based around Antwerp. He specializes in typography-heavy web design, art direction, interaction design, and branding.",
    href: "https://gilhuybrecht.com/",
    pills: ["2026", "Gil Huybrecht"],
    cardAspect: [1196, 720],
    media: [
      [1196, 720],
      [1280, 644],
      [1280, 604],
    ],
  },
  {
    id: "discoveryland",
    title: "Discoveryland",
    description:
      "Partnered with Outpost and Discovery Land Company to create an immersive, storytelling brand experience that showcasing DLCs international portfolio and capabilities while acting as a seamless transition across their  23 properties.",
    href: "https://discoverylandco.com/",
    pills: ["Outpost", "2026"],
    cardAspect: [1372, 1029],
    media: [
      [1372, 1029],
      [1280, 642],
      [1280, 642],
    ],
  },
  {
    id: "griflan",
    title: "Griflan",
    description:
      "Griflan is a creative studio at the intersection of design, strategy, and compelling storytelling, shaping brands that move culture and leave a lasting mark.",
    href: "https://griflan.com/",
    pills: ["2026"],
    cardAspect: [1162, 720],
    media: [
      [1162, 720],
      [1022, 720],
      [1280, 642],
    ],
  },
];

export function getProject(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}

export function getNeighbors(id: string): { prev: Project; next: Project } {
  const i = projects.findIndex((p) => p.id === id);
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];
  return { prev, next };
}

export interface IndexEntry {
  title: string;
  href: string;
  internal: boolean;
}

export const fullIndex: IndexEntry[] = [
  { title: "The Lookback", href: "/projects/the-lookback", internal: true },
  { title: "DoThings", href: "https://dothingsnyc.com/", internal: false },
  { title: "53 West 53", href: "https://53w53.com/", internal: false },
  { title: "Ross Mason®", href: "https://iamrossmason.com/", internal: false },
  { title: "Vucko™", href: "https://vucko.co/", internal: false },
  {
    title: "Ingrao",
    href: "https://ingrao.jesperlandberg.com/",
    internal: false,
  },
  {
    title: "111 West 57th Street",
    href: "https://111w57.com/",
    internal: false,
  },
  { title: "Better Off®", href: "https://betteroff.studio/", internal: false },
  { title: "Techspeed", href: "https://techspeed.com/", internal: false },
  { title: "Nathan Riley", href: "/projects/nathan-riley", internal: true },
  { title: "Dogelon Mars", href: "/projects/dogelon-mars", internal: true },
  { title: "Discoveryland", href: "/projects/discoveryland", internal: true },
  { title: "Griflan", href: "/projects/griflan", internal: true },
  {
    title: "Book of Happiness",
    href: "/projects/book-of-happiness",
    internal: true,
  },
  {
    title: "Chris Wilcock",
    href: "https://www.chriswilcock.co/",
    internal: false,
  },
  {
    title: "David Lubofsky",
    href: "https://www.davidlubofsky.com/",
    internal: false,
  },
  { title: "Casa Di Solare", href: "/projects/casa-di-solare", internal: true },
  {
    title: "Gil Huybrecht",
    href: "/projects/gil-huybrecht",
    internal: true,
  },
  { title: "Fivepathways", href: "https://fivepathways.com/", internal: false },
  {
    title: "Energy Park",
    href: "https://energy-park.outpost.design/",
    internal: false,
  },
  { title: "Outpost", href: "https://outpost.design/", internal: false },
  { title: "Mew", href: "https://mew.xyz/", internal: false },
  { title: "Primland", href: "https://ownprimland.com", internal: false },
];
