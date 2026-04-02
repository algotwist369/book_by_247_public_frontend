"use client";

import { useEffect, useRef } from "react";

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export default function OtpInput({ value, onChange }: Props) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    inputs.current[0]?.focus();
  }, []);

  const handleChange = (val: string, index: number) => {
    const digit = val.slice(-1);
    if (!/^\d*$/.test(digit)) return;

    const newOtp = value.split("");
    newOtp[index] = digit;
    const combined = newOtp.join("").slice(0, 6);
    onChange(combined);

    if (digit && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const data = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    onChange(data);
    if (data.length > 0) {
      inputs.current[Math.min(data.length, 5)]?.focus();
    }
  };

  return (
    <div className="otp-grid" onPaste={handlePaste}>
      {[...Array(6)].map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            inputs.current[i] = el;
          }}
          className={`otp-cell ${value[i] ? "filled" : ""}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ""}
          onChange={(e) => handleChange(e.target.value, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
        />
      ))}
    </div>
  );
}
