"use client";

export default function SuccessScreen() {
  return (
    <div
      className="animate-scaleIn"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: "20px",
        padding: "16px 0",
      }}
    >
      {/* Checkmark circle */}
      <div
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #4A7C59 0%, #6AAE80 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 12px 32px rgba(74,124,89,0.3)",
        }}
      >
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <path
            d="M8 18L14.5 24.5L28 11"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "36px",
            fontWeight: 400,
            color: "var(--charcoal)",
            marginBottom: "10px",
            lineHeight: 1.2,
          }}
        >
          Partner Registration Sent
        </h2>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "14px",
            color: "var(--muted)",
            lineHeight: 1.7,
            maxWidth: "280px",
          }}
        >
          Congratulations on taking the first step towards digital growth. Your business profile is being reviewed for priority activation.
        </p>
      </div>

      <div
        style={{
          width: "100%",
          padding: "16px",
          background: "var(--cream)",
          borderRadius: "12px",
          border: "1px solid var(--border)",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "13px",
            color: "var(--muted)",
            lineHeight: 1.6,
          }}
        >
          📲 You will receive a confirmation call on WhatsApp or your phone number shortly..
        </p>
      </div>
    </div>
  );
}
