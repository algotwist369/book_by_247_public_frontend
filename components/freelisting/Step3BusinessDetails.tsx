"use client";

import { useState } from "react";

const OUTLET_TYPES = ["Company Owned", "Franchisee"];
const HEAR_ABOUT_US = ["Google", "Facebook/Instagram", "Your Customer", "Industry Friends", "Other"];

interface BusinessData {
  businessName: string;
  numberOfBranches: string;
  city: string;
  outletType: string;
  hearAboutUs: string;
}

interface Props {
  onSubmit: (data: BusinessData) => void;
  onBack: () => void;
  initial: BusinessData;
  loading: boolean;
}

export default function Step3BusinessDetails({ onSubmit, onBack, initial, loading }: Props) {
  const [form, setForm] = useState<BusinessData>(initial);
  const [errors, setErrors] = useState<Partial<BusinessData>>({});

  const set = (key: keyof BusinessData, val: string) => {
    setForm((p) => ({ ...p, [key]: val }));
    setErrors((p) => ({ ...p, [key]: "" }));
  };

  const validate = () => {
    const e: Partial<BusinessData> = {};
    if (!form.businessName.trim() || form.businessName.trim().length < 2)
      e.businessName = "Business name must be at least 2 characters";
    const branches = parseInt(form.numberOfBranches);
    if (!form.numberOfBranches || isNaN(branches) || branches < 1)
      e.numberOfBranches = "Must be at least 1 branch";
    if (!form.city.trim() || form.city.trim().length < 2)
      e.city = "Please enter a valid city name";
    if (!form.outletType) e.outletType = "Please select outlet type";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onSubmit(form);
  };

  return (
    <div className="animate-slideLeft" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontSize: "32px",
          fontWeight: 400,
          marginBottom: "8px",
        }}>
          Business Details
        </h2>
        <p style={{ fontSize: "14px", color: "var(--muted)", fontFamily: "var(--font-body)" }}>
          Last step — tell us about your business.
        </p>
      </div>

      <div className="field-group animate-fadeUp delay-1">
        <label className="field-label">Salon / Spa / Beauty Center Name</label>
        <input
          className="field-input"
          type="text"
          placeholder="Bliss Beauty Studio"
          value={form.businessName}
          onChange={(e) => set("businessName", e.target.value)}
        />
        {errors.businessName && <p className="field-error">{errors.businessName}</p>}
      </div>

      <div className="flex-row animate-fadeUp delay-2">
        <div className="field-group" style={{ flex: 1 }}>
          <label className="field-label">No. of Branches</label>
          <input
            className="field-input"
            type="number"
            inputMode="numeric"
            min={1}
            placeholder="1"
            value={form.numberOfBranches}
            onChange={(e) => set("numberOfBranches", e.target.value)}
          />
          {errors.numberOfBranches && <p className="field-error">{errors.numberOfBranches}</p>}
        </div>

        <div className="field-group" style={{ flex: 2 }}>
          <label className="field-label">City</label>
          <input
            className="field-input"
            type="text"
            placeholder="Mumbai"
            value={form.city}
            onChange={(e) => set("city", e.target.value)}
          />
          {errors.city && <p className="field-error">{errors.city}</p>}
        </div>
      </div>

      <div className="field-group animate-fadeUp delay-3">
        <label className="field-label">Outlet Type</label>
        <select
          className="field-input field-select"
          value={form.outletType}
          onChange={(e) => set("outletType", e.target.value)}
        >
          <option value="">Select outlet type</option>
          {OUTLET_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        {errors.outletType && <p className="field-error">{errors.outletType}</p>}
      </div>

      <div className="field-group animate-fadeUp delay-4">
        <label className="field-label">
          How did you hear about us?{" "}
          <span style={{ textTransform: "none", color: "var(--muted)", letterSpacing: 0, fontWeight: 400 }}>
            (Optional)
          </span>
        </label>
        <select
          className="field-input field-select"
          value={form.hearAboutUs}
          onChange={(e) => set("hearAboutUs", e.target.value)}
        >
          <option value="">Select an option</option>
          {HEAR_ABOUT_US.map((h) => (
            <option key={h} value={h}>{h}</option>
          ))}
        </select>
      </div>

      <div className="flex-row animate-fadeUp delay-5">
        <button className="btn-ghost" onClick={onBack} disabled={loading}>← Back</button>
        <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? <span className="spinner" /> : "Submit Listing"}
        </button>
      </div>
    </div>
  );
}
