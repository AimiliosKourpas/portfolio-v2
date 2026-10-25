"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * Current status of a credential. The static HTML says "Expires <date>"; once mounted the
 * browser clock decides between Active and Expired so a build never goes stale.
 */
export function CertStatus({ expiresISO, label }: { expiresISO?: string; label?: string }) {
  const expired = useSyncExternalStore(
    subscribe,
    () => (expiresISO ? Date.now() > Date.parse(expiresISO) : false),
    () => null, // server and hydration render: neutral until the browser clock is read
  );

  if (!expiresISO) return <span className="status status-none">{label ?? "No expiry"}</span>;
  if (expired === null) return <span className="status status-none">Valid</span>;
  return expired ? (
    <span className="status status-expired">Expired</span>
  ) : (
    <span className="status status-active">Active</span>
  );
}
