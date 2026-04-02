"use client";

import { useState } from "react";

const DESIGNATIONS = ["Owner", "Manager", "Head Office Employee", "Marketing Team", "Other"];

interface PersonalData {
  name: string;
  designation: string;
}

interface Props {
  onNext: (data: PersonalData) => void;
  onBack: () => void;
  initial: PersonalData;
}

export default function Step2PersonalDetails({ onNext, onBack, initial }: Props) {
  const [name, setName] = useState(initial.name);
  const [designation, setDesignation] = useState(initial.designation);
  const [errors, setErrors] = useState<Partial<PersonalData>>({});

  const validate = () => {
    const e: Partial<PersonalData> = {};
    if (!name.trim() || name.trim().length < 2) e.name = "Name must be at least 2 characters";
    if (!designation) e.designation = "Please select your designation";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext({ name: name.trim(), designation });
  };

  return (
    <div className="animate-slideLeft" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontSize: "32px",
          fontWeight: 400,
          marginBottom: "8px",
        }}>
          Primary Contact
        </h2>
        <p style={{ fontSize: "14px", color: "var(--muted)", fontFamily: "var(--font-body)" }}>
          Details of the person managing this professional account.
        </p>
      </div>

      <div className="field-group animate-fadeUp delay-1">
        <label className="field-label">Full Name</label>
        <input
          className="field-input"
          type="text"
          placeholder="Priya Sharma"
          value={name}
          onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: "" })); }}
        />
        {errors.name && <p className="field-error">{errors.name}</p>}
      </div>

      <div className="field-group animate-fadeUp delay-2">
        <label className="field-label">Your Role / Designation</label>
        <select
          className="field-input field-select"
          value={designation}
          onChange={(e) => { setDesignation(e.target.value); setErrors((p) => ({ ...p, designation: "" })); }}
        >
          <option value="">Select your role</option>
          {DESIGNATIONS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        {errors.designation && <p className="field-error">{errors.designation}</p>}
      </div>

      <div className="flex-row animate-fadeUp delay-3">
        <button className="btn-ghost" onClick={onBack}>← Back</button>
        <button className="btn-primary" onClick={handleNext}>Continue →</button>
      </div>
    </div>
  );
}
