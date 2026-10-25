// Every fact here comes from the CV (14 Sep 2026). Do not add metrics or claims
// that are not on the CV without confirmation.

import type { IllustrationName } from "./illustrations";

export const site = {
  name: "Aimilianos Kourpas",
  title: "Aimilianos Kourpas — Frontend Engineer",
  description:
    "Frontend Software Engineer at Desquared, building production web interfaces with React and TypeScript. BSc in Computer Science, University of Piraeus.",
  email: "aimiliosk2002@gmail.com",
  github: "https://github.com/AimiliosKourpas",
  linkedin: "https://www.linkedin.com/in/aimilianos-kourpas/",
  cv: "/Aimilianos_Kourpas_CV.pdf",
} as const;

export const intro = "I build accessible, responsive interfaces with React and TypeScript.";

export const experience = {
  company: "Desquared",
  role: "Frontend Software Engineer",
  period: "November 2025 — Present",
  place: "Greece · Hybrid",
  summary:
    "I build and maintain production web applications using React and TypeScript, focusing on responsive interfaces, reusable design-system components and accessibility. My work also includes feature development, cross-browser improvements, automated testing and release preparation.",
};

// Client work referenced under the Desquared role. Names are shown only when SHOW_CLIENT_NAMES is
// true; none has been confirmed as publicly disclosed, so the anonymized label is the default.
// Keep descriptions free of internal or confidential detail.
export const SHOW_CLIENT_NAMES = false;
export const workReferences = [
  {
    name: "COSMOTE",
    label: "Telecom Selfcare platform",
    text: "React & TypeScript interfaces, design-system integration, accessibility and UAT improvements.",
  },
  {
    name: "WinnersCircle",
    label: "Community & engagement platform",
    text: "Feature integration, cross-browser fixes, automated testing and release validation.",
  },
  {
    name: "Gold Club",
    label: "Admin & registration platform",
    text: "Admin and registration interfaces, authentication flows, form validation and UAT fixes.",
  },
];

export type Project = {
  title: string;
  /** Year from repository history (GitHub created_at / first commit), not the CV range. */
  year: string;
  sentence: string;
  /** One short line for mobile cards; the full sentence is used from the md breakpoint up. */
  short: string;
  art: IllustrationName;
  /** `short` is the compact mobile link label. */
  primary: { label: string; short: string; href: string };
  code: string;
};

// Years verified via the GitHub API on 2026-10-18:
//  - birthdiary: repo created 2025-07-09 (first commit 2025-07-08)
//  - sorting-visualizer: created 2025-05-07 (first commit 2025-05-06)
//  - pathfinding-visualizer: created 2025-06-08
//  - GreekBERT thesis: GitHub repo was only uploaded 2025-05-02, so the year comes
//    from the University of Piraeus library record (issued 2024-07, defended 2024-07-16).
export const projects: Project[] = [
  {
    title: "BirthDiary",
    year: "2025",
    sentence:
      "A birthday reminder app I built end to end, with Google sign-in and automated email reminders.",
    short: "Birthday reminders, made simple.",
    art: "cake",
    primary: { label: "View live", short: "Live", href: "https://yourbirthdiary.vercel.app/" },
    code: "https://github.com/AimiliosKourpas/birthdiary",
  },
  {
    title: "Sorting Visualizer",
    year: "2025",
    sentence:
      "Merge, Quick, Heap and Bubble sort animated in real time, so you can watch the algorithms work.",
    short: "Sorting algorithms in action.",
    art: "bars",
    primary: { label: "View live", short: "Live", href: "https://aimilioskourpas.github.io/sorting-visualizer/" },
    code: "https://github.com/AimiliosKourpas/sorting-visualizer",
  },
  {
    title: "Pathfinding Visualizer",
    year: "2025",
    sentence:
      "A grid where A*, Dijkstra, BFS and DFS find their way through walls and generated mazes.",
    short: "Watch pathfinding algorithms work.",
    art: "path",
    primary: { label: "View live", short: "Live", href: "https://aimilioskourpas.github.io/pathfinding-visualizer/" },
    code: "https://github.com/AimiliosKourpas/pathfinding-visualizer",
  },
  {
    title: "GreekBERT Thesis",
    year: "2024",
    sentence: "My BSc thesis: fine-tuning GreekBERT to classify the sentiment of Greek tweets.",
    short: "Sentiment analysis of Greek tweets.",
    art: "text",
    primary: { label: "Read thesis", short: "Thesis", href: "https://dione.lib.unipi.gr/xmlui/handle/unipi/16795" },
    code: "https://github.com/AimiliosKourpas/thesis-sentiment-analysis",
  },
];

export const education = {
  school: "University of Piraeus",
  place: "Piraeus, Greece",
  degrees: [
    {
      title: "BSc Computer Science",
      detail: "Department of Informatics",
      period: "Sep 2020 – Jul 2024",
      highlights: ["Top 3 graduate", "Academic Distinction Award", "GPA 7.96 / 10.0"],
    },
    // Official English title varies on cs.unipi.gr ("Advanced Informatics Systems" on the
    // program page, "Advanced Informatics and Computing Systems" on the aims page). The program
    // page wording is used. No end date: the MSc is in progress.
    {
      title: "MSc Advanced Informatics Systems",
      detail: "Software Development and Artificial Intelligence",
      period: "From 2026",
      highlights: [],
    },
  ],
};

// Tiers: "core" is daily professional frontend work; the rest are supporting or academic. All items
// come from the CV, the projects on this site, or confirmed Desquared work. No proficiency levels.
export const skills: { group: string; tier: "core" | "ui" | "more"; items: string[] }[] = [
  { group: "Core Frontend", tier: "core", items: ["React", "TypeScript", "JavaScript", "HTML5", "CSS / SCSS", "Storybook", "Vitest"] },
  {
    group: "UI Engineering",
    tier: "ui",
    items: ["Responsive Design", "Accessibility", "Design Systems", "CSS Modules", "Figma implementation"],
  },
  {
    group: "Additional Technologies",
    tier: "more",
    items: ["Next.js", "Tailwind CSS", "Angular", "Node.js", ".NET Core", "PostgreSQL", "MySQL", "Supabase"],
  },
  { group: "Languages & AI", tier: "more", items: ["Python", "C++", "Java", "NLP", "Deep Learning"] },
  { group: "Tools", tier: "more", items: ["Git", "Azure", "Agile"] },
];

export type Certification = {
  /** Official title after "Microsoft Certified:". */
  title: string;
  earned: string;
  earnedYear: string;
  /** Display label and ISO date (end of the expiry day, UTC). */
  expires: { label: string; iso: string };
};

// The five Microsoft certifications, newest first. Titles and dates were provided by the owner
// from their Microsoft Learn profile (all Active and Online Verifiable). No credential IDs or
// verification links are listed because none could be confirmed as public URLs.
export const microsoftCertifications: Certification[] = [
  {
    title: "SQL AI Developer Associate",
    earned: "Sep 18, 2026",
    earnedYear: "2026",
    expires: { label: "Sep 19, 2027", iso: "2027-09-19T23:59:59Z" },
  },
  {
    title: "Azure AI Cloud Developer Associate",
    earned: "Aug 22, 2026",
    earnedYear: "2026",
    expires: { label: "Aug 23, 2027", iso: "2027-08-23T23:59:59Z" },
  },
  {
    title: "Azure AI Apps and Agents Developer Associate",
    earned: "Aug 4, 2026",
    earnedYear: "2026",
    expires: { label: "Aug 5, 2027", iso: "2027-08-05T23:59:59Z" },
  },
  {
    title: "Azure Administrator Associate",
    earned: "Jul 8, 2023",
    earnedYear: "2023",
    expires: { label: "Jul 9, 2027", iso: "2027-07-09T23:59:59Z" },
  },
  {
    title: "Azure Data Scientist Associate",
    earned: "Nov 19, 2022",
    earnedYear: "2022",
    expires: { label: "Nov 20, 2026", iso: "2026-11-20T23:59:59Z" },
  },
];

// AlgoExpert dates come from the CV; no expiry is stated, so none is shown.
export const algoexpertCertifications = [
  { title: "Front End Expert", earned: "Jul 2025" },
  { title: "Programming Expert", earned: "May 2023" },
];

export const microsoftProfile = "https://learn.microsoft.com/en-us/users/aimilianoskourpas-4181/";
