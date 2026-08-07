"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import "./freelisting.css";
import StepProgress from "@/components/freelisting/ui/StepProgress";
import Step1Phone from "@/components/freelisting/Step1Phone";
import { submitListing, ListingPayload } from "@/lib/freelisting-api";
import AiReadabilitySection from "@/components/seo/AiReadabilitySection";

const Step2PersonalDetails = dynamic(() => import("@/components/freelisting/Step2PersonalDetails"), { ssr: false });
const Step3BusinessDetails = dynamic(() => import("@/components/freelisting/Step3BusinessDetails"), { ssr: false });
const SuccessScreen = dynamic(() => import("@/components/freelisting/SuccessScreen"), { ssr: false });

const STEPS = [
  { label: "Mobile Number" },
  { label: "Your Details" },
  { label: "Business Details" },
];

interface FormState {
  mobile: string;
  name: string;
  designation: string;
  businessName: string;
  numberOfBranches: string;
  city: string;
  outletType: string;
  hearAboutUs: string;
}

const EMPTY: FormState = {
  mobile: "",
  name: "",
  designation: "",
  businessName: "",
  numberOfBranches: "",
  city: "",
  outletType: "",
  hearAboutUs: "",
};

export default function FreeListingPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleStep1 = (mobile: string) => {
    setForm((p) => ({ ...p, mobile }));
    setStep(1);
  };

  const handleStep2 = (data: { name: string; designation: string }) => {
    setForm((p) => ({ ...p, ...data }));
    setStep(2);
  };

  const handleStep3 = async (data: {
    businessName: string;
    numberOfBranches: string;
    city: string;
    outletType: string;
    hearAboutUs: string;
  }) => {
    setSubmitError("");
    setLoading(true);
    const payload: ListingPayload = {
      mobile: form.mobile,
      name: form.name,
      designation: form.designation,
      businessName: data.businessName,
      numberOfBranches: parseInt(data.numberOfBranches),
      city: data.city,
      outletType: data.outletType,
      hearAboutUs: data.hearAboutUs || undefined,
    };
    try {
      await submitListing(payload);
      setDone(true);
    } catch (err: any) {
      setSubmitError(err?.response?.data?.message || "Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="freelisting-container">
      <main style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "var(--ivory)",
      }}>
        {/* Background decorative elements */}
        <div style={{
          position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        }}>
          <div style={{
            position: "absolute", top: "-10%", right: "-5%",
            width: "500px", height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(201,169,110,0.08) 0%, transparent 70%)",
          }} />
          <div style={{
            position: "absolute", bottom: "-5%", left: "-8%",
            width: "400px", height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(139,74,74,0.06) 0%, transparent 70%)",
          }} />
          <svg
            style={{ position: "absolute", top: "5%", left: "3%", opacity: 0.04 }}
            width="200" height="200" viewBox="0 0 200 200"
          >
            <circle cx="100" cy="100" r="80" stroke="#2b202c" strokeWidth="1" fill="none" />
            <circle cx="100" cy="100" r="50" stroke="#2C2520" strokeWidth="0.5" fill="none" />
            <circle cx="100" cy="100" r="20" stroke="#2C2520" strokeWidth="0.5" fill="none" />
          </svg>
        </div>

        <div style={{
          width: "100%",
          maxWidth: "440px",
          position: "relative",
          zIndex: 1,
        }}>
          {/* Header branding */}
          <header className="animate-fadeUp" style={{ textAlign: "center", marginBottom: "36px" }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 16px",
              background: "var(--cream)",
              border: "1px solid var(--border)",
              borderRadius: "100px",
              marginBottom: "16px",
            }}>
              <span style={{ fontSize: "14px", color: "var(--charcoal)" }}>✦</span>
              <span style={{
                fontFamily: "var(--font-body)",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--warm-tan)",
              }}>
                Business Partner Program
              </span>
            </div>
            <h1 style={{
              fontFamily: "var(--font-display)",
              fontSize: "42px",
              fontWeight: 300,
              color: "var(--charcoal)",
              lineHeight: 1.1,
              letterSpacing: "-0.5px",
            }}>
              Scale Your Business With 
              <br />
              <em style={{ fontStyle: "italic", fontWeight: 400, color: "var(--warm-tan)" }}>Bookby24/7 Network</em>
            </h1>
          </header>

          {/* Card */}
          <div
            className="animate-fadeUp delay-1"
            style={{
              background: "var(--white)",
              borderRadius: "24px",
              padding: "36px 32px",
              boxShadow: "0 4px 6px rgba(44,37,32,0.04), 0 20px 60px rgba(44,37,32,0.08)",
              border: "1px solid var(--border)",
            }}
          >
            {!done && (
              <StepProgress steps={STEPS} current={step} />
            )}

            {done ? (
              <SuccessScreen />
            ) : step === 0 ? (
              <Step1Phone onVerified={handleStep1} />
            ) : step === 1 ? (
              <Step2PersonalDetails
                onNext={handleStep2}
                onBack={() => setStep(0)}
                initial={{ name: form.name, designation: form.designation }}
              />
            ) : (
              <>
                {submitError && (
                  <div style={{
                    padding: "12px 14px",
                    background: "#FDF0F0",
                    border: "1px solid #F5C6C6",
                    borderRadius: "100px",
                    marginBottom: "16px",
                  }}>
                    <p style={{ fontSize: "13px", color: "var(--error)", fontFamily: "var(--font-body)", textAlign: "center" }}>
                      {submitError}
                    </p>
                  </div>
                )}
                <Step3BusinessDetails
                  onSubmit={handleStep3}
                  onBack={() => setStep(1)}
                  loading={loading}
                  initial={{
                    businessName: form.businessName,
                    numberOfBranches: form.numberOfBranches,
                    city: form.city,
                    outletType: form.outletType,
                    hearAboutUs: form.hearAboutUs,
                  }}
                />
              </>
            )}
          </div>

          {/* Footer */}
          <p
            className="animate-fadeUp delay-2"
            style={{
              textAlign: "center",
              fontFamily: "var(--font-body)",
              fontSize: "12px",
              color: "var(--muted)",
              marginTop: "20px",
            }}
          >
            By continuing, you agree to our Terms & Privacy Policy.
          </p>
        </div>
      </main>

      <AiReadabilitySection 
        aboutTitle="Grow Your Business with Us"
        aboutContent="BookBy247 provides a powerful platform for salon and spa owners to list their business, manage appointments, and reach a wider audience. Join India's fastest-growing wellness network and transform your digital presence today."
      />
    </div>
  );
}
