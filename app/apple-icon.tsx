import { ImageResponse } from "next/og";
import { SEO_CONFIG } from "@/lib/seo-config";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: SEO_CONFIG.themeColor,
          color: "white",
          display: "flex",
          flexDirection: "column",
          fontSize: 48,
          fontWeight: 800,
          gap: 8,
          height: "100%",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <span>B7</span>
        <span style={{ fontSize: 18, fontWeight: 700 }}>BookBy247</span>
      </div>
    ),
    size
  );
}
