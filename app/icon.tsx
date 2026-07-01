import { ImageResponse } from "next/og";
import { SEO_CONFIG } from "@/lib/seo-config";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: SEO_CONFIG.themeColor,
          color: "white",
          display: "flex",
          fontSize: 13,
          fontWeight: 800,
          height: "100%",
          justifyContent: "center",
          width: "100%",
        }}
      >
        B7
      </div>
    ),
    size
  );
}
