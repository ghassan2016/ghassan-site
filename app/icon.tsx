import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 18,
          background: "linear-gradient(135deg, #8b7bff, #4fd1e8)",
          color: "#060609",
          fontSize: 42,
          fontWeight: 700,
        }}
      >
        G
      </div>
    ),
    size
  );
}
