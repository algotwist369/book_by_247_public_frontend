"use client";

interface Step {
  label: string;
}

interface Props {
  steps: Step[];
  current: number;
}

export default function StepProgress({ steps, current }: Props) {
  return (
    <div className="progress-track">
      {steps.map((s, i) => {
        const isDone = i < current;
        const isActive = i === current;
        
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", flex: i === steps.length - 1 ? "0 0 auto" : "1" }}>
            <div className={`step-dot ${isDone ? "done" : isActive ? "active" : "pending"}`}>
              {isDone ? "✓" : i + 1}
            </div>
            {i < steps.length - 1 && (
              <div className={`step-line ${isDone ? "done" : ""}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
