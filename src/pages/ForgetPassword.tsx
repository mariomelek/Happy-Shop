import React, { useState } from "react";
import {
  sendPasswordResetEmail,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  type ConfirmationResult,
} from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { Mail, Phone, ArrowLeft } from "lucide-react";

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [method, setMethod] = useState<"email" | "phone">("email");

  // Phone Auth States
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
  const [isOTPSent, setIsOTPSent] = useState(false);

  // --- Phone Reset Logic (Login via Phone) ---
  const setupRecaptcha = () => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container-forgot",
        {
          size: "invisible",
        },
      );
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return toast.error("Please enter your phone number");
    const loading = toast.loading("Sending OTP...");
    try {
      setupRecaptcha();
      const appVerifier = (window as any).recaptchaVerifier;
      const result = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        appVerifier,
      );
      setConfirmationResult(result);
      setIsOTPSent(true);
      toast.success("OTP sent to your phone", { id: loading });
    } catch (error: any) {
      toast.error("Failed to send OTP. Check format (+20...)", { id: loading });
    }
  };

  const verifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const loading = toast.loading("Verifying...");
    try {
      await confirmationResult?.confirm(verificationCode);
      toast.success("Access granted! Update your password in settings.", {
        id: loading,
      });
      navigate("/"); // توجيه اليوزر للرئيسية لأنه تم تسجيل دخوله فعلياً
    } catch (error: any) {
      toast.error("Invalid OTP code", { id: loading });
    }
  };

  // --- Email Reset Logic (Formik) ---
  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Required"),
    }),
    onSubmit: async (values) => {
      const loading = toast.loading("Sending reset link...");
      try {
        await sendPasswordResetEmail(auth, values.email);
        toast.success("Reset link sent! Check your inbox.", {
          id: loading,
          duration: 5000,
        });
      } catch (error: any) {
        toast.error("Email not found", { id: loading });
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-soft-white px-6">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl w-full max-w-md text-center border border-brand-gold/10">
        <h2 className="text-3xl font-serif text-brand-deep mb-2">
          Forgot <span className="text-brand-gold">Access?</span>
        </h2>

        <p className="text-brand-gray text-[10px] mb-8 uppercase tracking-widest leading-relaxed">
          Choose a way to get back into <br /> your premium account
        </p>

        <div id="recaptcha-container-forgot"></div>

        {/* Tabs Switcher */}
        <div className="flex bg-brand-soft-white p-1 rounded-2xl mb-8">
          <button
            onClick={() => {
              setMethod("email");
              setIsOTPSent(false);
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${method === "email" ? "bg-white shadow-sm text-brand-gold" : "text-brand-gray"}`}
          >
            <Mail size={14} /> Email
          </button>
          <button
            onClick={() => setMethod("phone")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${method === "phone" ? "bg-white shadow-sm text-brand-gold" : "text-brand-gray"}`}
          >
            <Phone size={14} /> Phone
          </button>
        </div>

        {method === "email" ? (
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="text-left">
              <input
                type="email"
                placeholder="Registered Email"
                {...formik.getFieldProps("email")}
                className={`w-full p-4 rounded-2xl bg-brand-soft-white/50 outline-none focus:ring-1 focus:ring-brand-gold text-sm ${formik.touched.email && formik.errors.email ? "ring-1 ring-red-400" : ""}`}
              />
              {formik.touched.email && (
                <p
                  className={`text-[10px] mt-2 ml-2 ${formik.errors.email ? "text-red-500" : ""}`}
                >
                  {formik.errors.email || "Email format valid ✔"}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={!formik.isValid || !formik.values.email}
              className="w-full py-4 rounded-2xl bg-brand-dark-green text-white font-bold text-xs tracking-widest  "
            >
              SEND RESET LINK
            </button>
          </form>
        ) : (
          <form
            onSubmit={isOTPSent ? verifyOTP : handlePhoneSubmit}
            className="space-y-4"
          >
            {!isOTPSent ? (
              <input
                type="tel"
                placeholder="+20 123 456 7890"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full p-4 rounded-2xl bg-brand-soft-white/50 outline-none focus:ring-1 focus:ring-brand-gold text-sm text-center"
              />
            ) : (
              <input
                type="text"
                placeholder="6-digit OTP"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full p-4 rounded-2xl bg-brand-soft-white/50 outline-none focus:ring-1 focus:ring-brand-gold text-sm text-center font-bold tracking-[0.5em]"
              />
            )}
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-brand-dark-green text-white font-bold text-xs tracking-widest shadow-lg"
            >
              {isOTPSent ? "VERIFY & LOGIN" : "SEND OTP CODE"}
            </button>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-gray-100">
          <Link
            to="/login"
            className="text-xs text-brand-gray hover:text-brand-gold transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <ArrowLeft size={14} /> Back to{" "}
            <span className="font-bold">Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
