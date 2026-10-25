"use client";

import { createContext, useContext, useId, useState } from "react";

type Ctx = { open: boolean; toggle: () => void; panelId: string };
const DisclosureCtx = createContext<Ctx | null>(null);

function useDisclosure() {
  const ctx = useContext(DisclosureCtx);
  if (!ctx) throw new Error("Disclosure parts must be used inside <Disclosure>");
  return ctx;
}

/**
 * Mobile-only progressive disclosure. The provider holds one open/closed state; `DisclosureButton`
 * toggles it and `DisclosurePanel` regions collapse. From the md breakpoint up, CSS ignores the state:
 * panels are always expanded and the button is hidden, so desktop is the full layout.
 * Anything inside `.d-extra` is likewise hidden only while collapsed on mobile.
 */
export function Disclosure({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  return (
    <DisclosureCtx.Provider value={{ open, toggle: () => setOpen((o) => !o), panelId }}>
      <div className="disclosure" data-open={open}>
        {children}
      </div>
    </DisclosureCtx.Provider>
  );
}

export function DisclosureButton({
  label,
  openLabel = "Show less",
  tone = "light",
}: {
  label: string;
  openLabel?: string;
  tone?: "light" | "dark";
}) {
  const { open, toggle, panelId } = useDisclosure();
  return (
    <button type="button" className={`d-btn d-btn-${tone}`} aria-expanded={open} aria-controls={panelId} onClick={toggle}>
      {open ? openLabel : label}
      <span aria-hidden="true" className="d-icon" />
    </button>
  );
}

/** `primary` marks the panel the button controls (aria-controls needs a single id). */
export function DisclosurePanel({ children, primary = false }: { children: React.ReactNode; primary?: boolean }) {
  const { panelId } = useDisclosure();
  return (
    <div id={primary ? panelId : undefined} className="d-panel">
      <div className="d-inner">{children}</div>
    </div>
  );
}
