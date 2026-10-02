"use client";

import { useEffect, useState } from "react";

const KEY = "ai-trend-saved";

export function useSaved() {
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) setSaved(JSON.parse(raw));
    } catch (e) {
      // ignore (private window, blocked storage, etc.)
    }
    setLoaded(true);
  }, []);

  function toggle(id: string) {
    setSaved((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        window.localStorage.setItem(KEY, JSON.stringify(next));
      } catch (e) {
        // ignore
      }
      return next;
    });
  }

  return { saved, toggle, loaded };
}
