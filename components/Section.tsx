export type GlyphKind = "dome" | "quarter" | "arch" | "sun";

/** The page's one recurring mark: a flat geometric glyph before each heading. */
export function Glyph({ kind, color }: { kind: GlyphKind; color: string }) {
  return <span aria-hidden="true" className={`glyph glyph-${kind}`} style={{ background: color }} />;
}

export function Section({
  id,
  title,
  glyph,
  color,
  children,
}: {
  id: string;
  title: string;
  glyph: GlyphKind;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-4 py-14 md:py-24">
      <h2 id={`${id}-title`} className="h2">
        <Glyph kind={glyph} color={color} />
        {title}
      </h2>
      <div className="mt-8 md:mt-12">{children}</div>
    </section>
  );
}
