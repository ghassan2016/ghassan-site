"use client";

import { useEffect, useState } from "react";
import { profile } from "@/lib/data";

/** Live clock in Ghassan's time zone. Renders "--:--" until hydrated. */
export function LocalTime({ className }: { className?: string }) {
  const [now, setNow] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: profile.timeZone,
    });
    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className={className} suppressHydrationWarning>
      {now ?? "--:--"}
    </span>
  );
}
