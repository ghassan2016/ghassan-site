import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { profile } from "@/lib/data";

export const alt = `${profile.name} — ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Link-preview card for LinkedIn, WhatsApp, X, Slack…
export default async function OpengraphImage() {
  const portrait = await readFile(join(process.cwd(), "public/portrait.png"));
  const portraitSrc = `data:image/png;base64,${portrait.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#060609",
          backgroundImage:
            "radial-gradient(circle at 10% 0%, rgba(75,59,255,0.55), transparent 50%), radial-gradient(circle at 70% 110%, rgba(31,182,214,0.3), transparent 45%)",
          color: "#f4f4f6",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "64px 0 64px 72px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 22, color: "#9d9daa", letterSpacing: 3 }}>
            <div style={{ width: 12, height: 12, borderRadius: 999, background: "#34d399" }} />
            GAZA, PALESTINE · REMOTE-READY
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 92, letterSpacing: -4, lineHeight: 1 }}>{profile.name}</div>
            <div style={{ fontSize: 52, marginTop: 18, color: "#b3a9ff" }}>{profile.role}</div>
          </div>
          <div style={{ display: "flex", fontSize: 24, color: "#9d9daa" }}>
            BrightGaza · Qareeb · Government &amp; human-rights platforms
          </div>
        </div>
        <div style={{ width: 420, height: "100%", display: "flex", position: "relative" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={portraitSrc} alt="" width={420} height={630} style={{ objectFit: "cover", objectPosition: "top" }} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              backgroundImage: "linear-gradient(90deg, #060609 0%, rgba(6,6,9,0) 35%, rgba(6,6,9,0) 70%, rgba(6,6,9,0.6) 100%)",
            }}
          />
        </div>
      </div>
    ),
    size
  );
}
