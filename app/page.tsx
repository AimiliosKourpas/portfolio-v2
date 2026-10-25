import { BackgroundArt } from "@/components/BackgroundArt";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@/components/Disclosure";
import { CertStatus } from "@/components/CertStatus";
import { CopyEmail } from "@/components/CopyEmail";
import { HeroPoster } from "@/components/HeroPoster";
import { HeroName } from "@/components/HeroName";
import { NodeIcon } from "@/components/NodeIcon";
import { Section } from "@/components/Section";
import { PALETTE } from "@/lib/palette";
import {
  algoexpertCertifications,
  microsoftCertifications,
  education,
  experience,
  intro,
  microsoftProfile,
  projects,
  site,
  skills,
  SHOW_CLIENT_NAMES,
  workReferences,
} from "@/lib/content";

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

// One flat color per project tile; ink text reads on all five.
const tiles = [
  { bg: PALETTE.orange, corner: "tile-tr tile-wide" },
  { bg: PALETTE.pink, corner: "tile-tl" },
  { bg: PALETTE.cyan, corner: "tile-br" },
  { bg: PALETTE.yellow, corner: "tile-bl" },
  { bg: PALETTE.green, corner: "tile-tr" },
] as const;

const groupMarks = ["m-circle", "m-square", "m-half", "m-diamond", "m-circle"] as const;
const groupColors = [PALETTE.cyan, PALETTE.pink, PALETTE.yellow, PALETTE.green, PALETTE.violet] as const;
// Skills tiers map to groups in a fixed color order so the primary group reads first.
const skillColor = [PALETTE.cyan, PALETTE.violet, PALETTE.pink, PALETTE.yellow, PALETTE.green] as const;


function skillGroup(g: (typeof skills)[number], i: number) {
  return (
    <div key={g.group}>
      <dt className={`mb-2 flex items-center gap-2 font-semibold ${g.tier === "core" ? "text-base" : "text-sm"}`}>
        <span aria-hidden="true" className={`mark ${groupMarks[i]}`} style={{ background: skillColor[i] }} />
        {g.group}
      </dt>
      <dd className="m-0 flex flex-wrap gap-1.5">
        {g.items.map((it) => (
          <span key={it} className={`skill skill-${g.tier}`} style={{ "--tint": skillColor[i] } as React.CSSProperties}>{it}</span>
        ))}
      </dd>
    </div>
  );
}

function msCard(c: (typeof microsoftCertifications)[number], i: number) {
  return (
    <li key={c.title} className={`cert-card ${i === 0 ? "cert-feature" : ""}`}>
      <span className="cert-badge">
        {/* Official Microsoft Certified Associate badge, see ASSETS.md */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logos/microsoft-associate-badge.svg" alt="" width={64} height={64} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="hidden text-xs font-semibold uppercase tracking-wide text-ink/55 min-[400px]:block">Microsoft Certified</span>
        <span className="display block text-[1.0625rem] leading-snug">{c.title}</span>
        <span className="block text-sm text-ink/70">Expires {c.expires.label}</span>
      </span>
      <span className="flex flex-none flex-col items-end gap-1.5">
        <span className="hidden text-right min-[480px]:block">
          <span className="block text-[0.625rem] font-semibold uppercase leading-none tracking-wider text-ink/50">Earned</span>
          <span className="cert-year block">{c.earnedYear}</span>
        </span>
        <CertStatus expiresISO={c.expires.iso} />
      </span>
    </li>
  );
}

// On mobile only the first sentence shows until the work references are expanded.
const [summaryFirst, ...summaryTail] = experience.summary.split(/(?<=\.)\s+/);
const summaryRest = summaryTail.join(" ");

export default function Home() {
  return (
    <main className="wrap grid-bg pt-[max(1rem,env(safe-area-inset-top))]">
      {/* 1 · Hero poster */}
      <section aria-label="Introduction" className="pb-6 pt-4 md:pb-10 md:pt-8">
        <HeroPoster>
          <div className="relative mt-2 md:mt-4">
            <HeroName />
          </div>
          <p className="relative mt-4 md:mt-5">
            <a href="#experience" className="pill hero-name">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-green" />
              Frontend Software Engineer
            </a>
          </p>
          <div className="poster-foot relative">
            <p className="max-w-[24ch] text-xl font-medium leading-snug md:text-[1.625rem]">{intro}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#work" className="btn btn-primary">Selected work <span aria-hidden="true">↓</span></a>
              <a href={site.cv} className="btn btn-ghost" {...ext}>CV (PDF) <span aria-hidden="true">↗</span></a>
            </div>
          </div>
        </HeroPoster>
      </section>

      {/* 2 · Current experience */}
      <section id="experience" aria-labelledby="experience-title" className="scroll-mt-4 py-10 md:py-16">
        <h2 id="experience-title" className="sr-only">Current experience</h2>
        <div className="now-card">
          <span aria-hidden="true" className="now-shape now-shape-a" />
          <span aria-hidden="true" className="now-shape now-shape-b" />
          <Disclosure>
            <div className="relative lg:grid lg:grid-cols-12 lg:items-end lg:gap-12">
              <div className="lg:col-span-5">
                {/* Official Desquared logo (light-on-dark), see ASSETS.md */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logos/desquared.svg" alt="Desquared" width={1400} height={350} className="h-10 w-auto md:h-14 lg:h-16" />
                <p className="mt-5 text-lg font-medium text-white">{experience.role}</p>
                <p className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="pill-solid">{experience.period}</span>
                </p>
              </div>
              <p className="mt-4 max-w-[46ch] text-[1.0625rem] leading-relaxed text-white/80 lg:col-span-5 lg:col-start-6 lg:mt-0 lg:text-lg">
                {summaryFirst}
                {summaryRest ? <span className="d-extra"> {summaryRest}</span> : null}
              </p>
            </div>
            <DisclosureButton label="Explore my work" openLabel="Show less" tone="dark" />
            <DisclosurePanel primary>
              <ul className="work-strip relative mt-7 grid list-none gap-5 p-0 md:grid-cols-3 md:gap-6">
                {workReferences.map((w, i) => (
                  <li key={w.name}>
                    <p className="flex items-center gap-2 text-sm font-semibold text-white">
                      <span aria-hidden="true" className={`mark ${groupMarks[i]}`} style={{ background: [PALETTE.yellow, PALETTE.cyan, PALETTE.pink][i] }} />
                      {SHOW_CLIENT_NAMES ? w.name : w.label}
                    </p>
                    <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-white/75">{w.text}</p>
                  </li>
                ))}
              </ul>
            </DisclosurePanel>
          </Disclosure>
        </div>
      </section>

      {/* 3 · Selected work */}
      <Section id="work" title="Selected work" glyph="quarter" color={PALETTE.pink}>
        <ul className="m-0 grid list-none gap-4 p-0 md:grid-cols-2 md:gap-6">
          {projects.map((p, i) => (
            <li key={p.title} className={`tile ${tiles[i].corner}`} style={{ background: tiles[i].bg }}>
              <div className="tile-head">
                <h3 className="display text-[1.5rem] leading-tight md:text-[1.625rem]">{p.title}</h3>
                <p className="mt-1 text-sm font-medium opacity-70">{p.year}</p>
              </div>
              <div className="tile-art">
                <NodeIcon name={p.art} />
              </div>
              <div className="tile-body">
                <p className="max-w-[44ch] text-[0.9375rem] leading-snug md:text-base md:leading-relaxed">
                  <span className="md:hidden">{p.short}</span>
                  <span className="hidden md:inline">{p.sentence}</span>
                </p>
                {p.stack && <p className="mt-2 hidden text-sm font-medium opacity-70 md:block">{p.stack}</p>}
                <p className="mt-1 flex flex-wrap items-center gap-x-5 md:mt-2 md:gap-x-6">
                  <a href={p.primary.href} className="link-ink inline-flex min-h-11 items-center font-semibold" {...ext}>
                    <span className="md:hidden">{p.primary.short}</span>
                    <span className="hidden md:inline">{p.primary.label}</span>
                    <span aria-hidden="true" className="ml-1">↗</span>
                  </a>
                  {p.code && (
                    <a href={p.code} className="link-ink inline-flex min-h-11 items-center font-semibold" {...ext}>
                      <span className="md:hidden">Code</span>
                      <span className="hidden md:inline">GitHub</span>
                      <span aria-hidden="true" className="ml-1">↗</span>
                    </a>
                  )}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* 4 · Education, skills, certifications */}
      <Section id="foundation" title="Background" glyph="arch" color={PALETTE.violet}>
        <div className="grid gap-8 md:grid-cols-12 md:gap-10">
          <div className="flex min-w-0 flex-col gap-8 md:col-span-7">
            {/* Education: warm yellow field with a geometric corner */}
            <div className="edu">
              <span aria-hidden="true" className="edu-shape" />
              <span aria-hidden="true" className="edu-dot" />
              <div className="relative flex items-center gap-4 pr-16">
                <span className="badge-tile badge-lg">
                  {/* Official University of Piraeus crest, see ASSETS.md */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/logos/unipi-crest.png" alt="" width={256} height={256} />
                </span>
                <div>
                  <p className="display text-2xl md:text-[1.75rem]">{education.school}</p>
                  <p className="text-sm text-ink/70">{education.place}</p>
                </div>
              </div>
              <ul className="relative mt-5 grid list-none gap-3 p-0">
                {education.degrees.map((d, i) => (
                  <li key={d.title} className="degree-card">
                    <p className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <span className="display text-lg">{d.title}</span>
                      <span className="text-sm font-semibold tabular-nums">
                        {d.period}
                        {d.highlights.length ? "" : " · In progress"}
                      </span>
                    </p>
                    <p className="mt-0.5 text-ink/75">{d.detail}</p>
                    {d.highlights.length ? (
                      <ul className="mt-3 flex list-none flex-wrap gap-x-5 gap-y-1.5 p-0 text-[0.9375rem] font-medium">
                        {d.highlights.map((h, j) => (
                          <li key={h} className="flex items-center gap-2">
                            <span aria-hidden="true" className={`mark ${groupMarks[(i + j) % 4]}`} style={{ background: groupColors[(j + 1) % 4] }} />
                            {h}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>

            <Disclosure>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <h3 className="display text-xl">Certifications</h3>
                <a href={microsoftProfile} className="link text-sm font-medium" {...ext}>Microsoft Learn profile ↗</a>
              </div>

              {/* Microsoft: cyan field. The first two stay visible on mobile. */}
              <div className="cert-panel cert-ms mt-3">
                <div className="relative flex items-center gap-3">
                  {/* Official Microsoft logo, see ASSETS.md */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/logos/microsoft.png" alt="Microsoft" width={216} height={46} className="h-5 w-auto" />
                  <span className="text-sm text-ink/70">{microsoftCertifications.length} certifications</span>
                </div>
                <ul className="relative mt-4 grid list-none gap-2.5 p-0">
                  {microsoftCertifications.slice(0, 2).map((c, i) => msCard(c, i))}
                </ul>
                <DisclosureButton label="View all certifications" openLabel="Show fewer" />
                <DisclosurePanel primary>
                  <ul className="relative mt-2.5 grid list-none gap-2.5 p-0">
                    {microsoftCertifications.slice(2).map((c, i) => msCard(c, i + 2))}
                  </ul>
                </DisclosurePanel>
              </div>

              {/* AlgoExpert: lavender field */}
              <DisclosurePanel>
                <div className="cert-panel cert-ae mt-4">
                  <div className="relative flex items-center gap-3">
                    {/* Official AlgoExpert wordmark, see ASSETS.md */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/logos/algoexpert.png" alt="AlgoExpert" width={520} height={122} className="h-7 w-auto rounded-md" />
                    <span className="text-sm text-ink/70">{algoexpertCertifications.length} certifications</span>
                  </div>
                  <ul className="relative mt-4 grid list-none gap-2.5 p-0">
                    {algoexpertCertifications.map((c) => (
                      <li key={c.title} className="cert-card">
                        <span className="cert-badge">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src="/logos/algoexpert-icon.png" alt="" width={64} height={64} className="rounded-lg" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="hidden text-xs font-semibold uppercase tracking-wide text-ink/55 min-[400px]:block">AlgoExpert</span>
                          <span className="display block text-[1.0625rem] leading-snug">{c.title}</span>
                          <span className="block text-sm text-ink/70">Earned {c.earned}</span>
                        </span>
                        <span className="cert-year hidden min-[480px]:block">{c.earned.slice(-4)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </DisclosurePanel>
            </Disclosure>
          </div>

          <div className="flex min-w-0 flex-col gap-8 md:col-span-5">
            <div>
              <h3 className="display text-xl">Skills</h3>
              <Disclosure>
                <dl className="mt-4 grid gap-5">
                  {skills.map((g, i) => (g.tier === "core" ? skillGroup(g, i) : null))}
                </dl>
                <DisclosureButton label="View all skills" openLabel="Show fewer" />
                <DisclosurePanel primary>
                  <dl className="mt-5 grid gap-5">
                    {skills.map((g, i) => (g.tier !== "core" ? skillGroup(g, i) : null))}
                  </dl>
                </DisclosurePanel>
              </Disclosure>
            </div>
            <BackgroundArt />
          </div>
        </div>
      </Section>

      {/* 5 · Contact */}
      <section id="contact" aria-labelledby="contact-title" className="scroll-mt-4 pb-10 pt-14 md:pb-14 md:pt-24">
        <div className="contact-card">
          <span aria-hidden="true" className="c-shape c-shape-a" />
          <span aria-hidden="true" className="c-shape c-shape-b" />
          <span aria-hidden="true" className="c-shape c-shape-c" />
          <div className="relative">
            <h2 id="contact-title" className="h2 !text-white">Say hello.</h2>
            <div className="mt-6 flex items-center gap-2.5">
              <a
                href={`mailto:${site.email}`}
                className="link-white inline-block min-w-0 break-all text-[clamp(0.8rem,calc((100vw-140px)/14.2),1.25rem)] font-semibold md:text-4xl"
              >
                {site.email}
              </a>
              <CopyEmail email={site.email} />
            </div>
            <p className="mt-6 flex flex-wrap gap-x-8 gap-y-1">
              <a href={site.github} className="link-white inline-flex min-h-11 items-center font-medium" {...ext}>GitHub ↗</a>
              <a href={site.linkedin} className="link-white inline-flex min-h-11 items-center font-medium" {...ext}>LinkedIn ↗</a>
              <a href={site.cv} className="link-white inline-flex min-h-11 items-center font-medium" {...ext}>CV (PDF) ↗</a>
            </p>
          </div>
        </div>
        <p className="meta mt-8">© {new Date().getFullYear()} {site.name}</p>
      </section>
    </main>
  );
}
