"use client";

import { useState } from "react";

interface Props {
  onVerified: (mobile: string) => void;
}

export default function Step1Phone({ onVerified }: Props) {
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [mobileError, setMobileError] = useState("");

  const handleContinue = async () => {
    setMobileError("");
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setMobileError("Enter a valid 10-digit Indian mobile number");
      return;
    }
    
    setLoading(true);
    // Directly proceed to next step without OTP verification
    try {
      onVerified(mobile);
    } catch (err: any) {
      setMobileError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-slideRight">
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <div>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "32px",
            fontWeight: 400,
            color: "var(--charcoal)",
            lineHeight: 1.2,
            marginBottom: "8px",
          }}>
            Verify Business Account
          </h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--muted)" }}>
            Enter your mobile number to begin your professional journey with Bookby24/7.
          </p>
        </div>

        <div className="field-group animate-fadeUp delay-1">
          <label className="field-label">Mobile Number</label>
          <div style={{ position: "relative" }}>
            <span style={{
              position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)",
              fontFamily: "var(--font-body)", fontSize: "15px", color: "var(--muted)",
            }}>+91</span>
            <input
              className="field-input"
              style={{ paddingLeft: "44px" }}
              type="tel"
              inputMode="numeric"
              maxLength={10}
              placeholder="9876543210"
              value={mobile}
              onChange={(e) => {
                setMobileError("");
                setMobile(e.target.value.replace(/\D/g, "").slice(0, 10));
              }}
              onKeyDown={(e) => e.key === "Enter" && handleContinue()}
            />
          </div>
          {mobileError && <p className="field-error">{mobileError}</p>}
        </div>

        <button
          className="btn-primary animate-fadeUp delay-2"
          onClick={handleContinue}
          disabled={loading || mobile.length !== 10}
        >
          {loading ? <span className="spinner" /> : "Continue"}
        </button>
      </div>
    </div>
  );
}
