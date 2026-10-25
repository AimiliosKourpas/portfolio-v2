"use client";

import { useEffect, useRef, useState } from "react";

async function copy(text: string) {
  try {
    // A pending permission prompt can leave writeText unresolved; fall back after a moment.
    await Promise.race([
      navigator.clipboard.writeText(text),
      new Promise((_, reject) => setTimeout(() => reject(new Error("clipboard timeout")), 800)),
    ]);
    return true;
  } catch {
    // Fallback for browsers or contexts without the async clipboard API.
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    ta.remove();
    return ok;
  }
}

export function CopyEmail({ email }: { email: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const onClick = async () => {
    const ok = await copy(email);
    setState(ok ? "copied" : "failed");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 2000);
  };

  return (
    <>
      <span className="copy-wrap">
        <button type="button" onClick={onClick} className="copy-btn" aria-label="Copy email address">
          <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {state === "copied" ? (
              <path d="M5 12.5l4.5 4.5L19 7.5" />
            ) : (
              <>
                <rect x="9" y="9" width="11" height="11" rx="2.5" />
                <path d="M5 15V6.5A2.5 2.5 0 0 1 7.5 4H15" />
              </>
            )}
          </svg>
        </button>
        {state !== "idle" ? (
          <span aria-hidden="true" className="copy-tip">
            {state === "copied" ? "Copied!" : "Press Ctrl/⌘+C"}
          </span>
        ) : null}
      </span>
      <span role="status" aria-live="polite" className="sr-only">
        {state === "copied" ? "Email address copied to clipboard" : state === "failed" ? "Copy failed. Select the address and copy it manually." : ""}
      </span>
    </>
  );
}
