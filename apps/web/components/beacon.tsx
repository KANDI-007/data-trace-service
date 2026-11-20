"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function VisitBeacon() {
  const path = usePathname();
  useEffect(() => {
    if (path.startsWith("/admin") || path.startsWith("/backend")) return;
    void fetch("/backend/visites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path }),
    }).catch(() => undefined);
  }, [path]);
  return null;
}
