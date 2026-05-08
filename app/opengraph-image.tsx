import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "BearsCheck — Comparateur d'assurance auto";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "serif",
        }}
      >
        {/* Logo area */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "40px" }}>
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              background: "#C9A84C",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "36px",
            }}
          >
            🐻
          </div>
          <span style={{ color: "#C9A84C", fontSize: "48px", fontWeight: "700", letterSpacing: "-1px" }}>
            BearsCheck
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            color: "#FFFFFF",
            fontSize: "56px",
            fontWeight: "800",
            textAlign: "center",
            lineHeight: "1.15",
            margin: "0 0 24px",
            maxWidth: "900px",
          }}
        >
          Comparateur d&apos;assurance auto
        </h1>

        {/* Subtitle */}
        <p
          style={{
            color: "#9CA3AF",
            fontSize: "28px",
            textAlign: "center",
            margin: "0 0 48px",
            maxWidth: "700px",
          }}
        >
          Comparez les meilleures offres en 2 minutes
        </p>

        {/* Badges */}
        <div style={{ display: "flex", gap: "16px" }}>
          {["Gratuit", "Sans engagement", "100% sécurisé"].map((badge) => (
            <div
              key={badge}
              style={{
                background: "rgba(201, 168, 76, 0.15)",
                border: "1px solid rgba(201, 168, 76, 0.4)",
                borderRadius: "999px",
                padding: "10px 24px",
                color: "#C9A84C",
                fontSize: "20px",
                fontWeight: "600",
              }}
            >
              {badge}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
