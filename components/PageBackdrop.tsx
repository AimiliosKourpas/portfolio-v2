/**
 * Page-wide backdrop: a handful of flat, very low-opacity shapes from the poster vocabulary,
 * set in the margins and bleeding off the edges. Purely decorative and static (no JS, no animation).
 */
export function PageBackdrop() {
  return (
    <div aria-hidden="true" className="backdrop">
      <span className="bd bd-dots" />
      <span className="bd bd-pink" />
      <span className="bd bd-arch" />
      <span className="bd bd-sun" />
      <span className="bd bd-quarter" />
    </div>
  );
}
