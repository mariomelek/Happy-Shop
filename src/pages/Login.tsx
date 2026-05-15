import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithPhoneNumber,
  type ConfirmationResult,
  RecaptchaVerifier,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import {
  Eye,
  EyeOff,
  Phone,
  Mail,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

type LoginValues = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");

  // Phone Auth States
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
  const [isOTPSent, setIsOTPSent] = useState(false);

  // --- Google Login ---
  const handleGoogleLogin = async () => {
    const loadingToast = toast.loading("Connecting to Google...");
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("Welcome back to HappyShop!", { id: loadingToast });
      navigate("/");
    } catch (error: any) {
      toast.error("Google login failed", { id: loadingToast });
    }
  };

  // --- Phone Login Logic ---
  const setupRecaptcha = () => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        { size: "invisible" },
      );
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return toast.error("Please enter your phone number");
    const loading = toast.loading("Sending code...");
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
      toast.success("OTP sent successfully", { id: loading });
    } catch (error: any) {
      toast.error("Failed to send code. Use format: +201...", { id: loading });
    }
  };

  const verifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const loading = toast.loading("Verifying...");
    try {
      await confirmationResult?.confirm(verificationCode);
      toast.success("Login successful", { id: loading });
      navigate("/");
    } catch (error: any) {
      toast.error("Invalid code", { id: loading });
    }
  };

  // --- Email Login (Formik) ---
  const formik = useFormik<LoginValues>({
    initialValues: { email: "", password: "" },
    onSubmit: async (values) => {
      const loadingToast = toast.loading("Authenticating...");
      try {
        await signInWithEmailAndPassword(auth, values.email, values.password);
        toast.success("Welcome back!", { id: loadingToast });
        navigate("/");
      } catch (error: any) {
        toast.error("Invalid email or password", { id: loadingToast });
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-soft-white mt-15 px-6 py-12">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-brand-gold/10 text-center">
        <h2 className="text-3xl font-serif text-brand-deep mb-6">
          Welcome <span className="text-brand-gold">Back</span>
        </h2>

        {/* Hidden Recaptcha */}
        <div id="recaptcha-container"></div>

        {/* Login Method Tabs */}
        <div className="flex bg-brand-soft-white p-1 rounded-2xl mb-8">
          <button
            onClick={() => {
              setLoginMethod("email");
              setIsOTPSent(false);
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${loginMethod === "email" ? "bg-white shadow-sm text-brand-gold" : "text-brand-gray"}`}
          >
            <Mail size={14} /> Email
          </button>
          <button
            onClick={() => setLoginMethod("phone")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${loginMethod === "phone" ? "bg-white shadow-sm text-brand-gold" : "text-brand-gray"}`}
          >
            <Phone size={14} /> Phone
          </button>
        </div>

        {/* Forms Section */}
        {loginMethod === "email" ? (
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email Address"
              {...formik.getFieldProps("email")}
              className="w-full p-4 rounded-2xl bg-brand-soft-white/50 outline-none focus:ring-1 focus:ring-brand-gold text-sm"
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...formik.getFieldProps("password")}
                className="w-full p-4 rounded-2xl bg-brand-soft-white/50 outline-none focus:ring-1 focus:ring-brand-gold text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-brand-gray"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right px-2">
              <Link
                to="/forgot-password"
                className="text-[11px] text-brand-gray hover:text-brand-gold transition-colors font-medium italic"
              >
                Forgot your password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-brand-dark-green text-white font-bold text-xs tracking-widest shadow-lg hover:brightness-110 transition-all"
            >
              LOGIN WITH EMAIL
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
                placeholder="Enter 6-digit OTP"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full p-4 rounded-2xl bg-brand-soft-white/50 outline-none focus:ring-1 focus:ring-brand-gold text-sm text-center tracking-[1em] font-bold"
              />
            )}
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-brand-dark-green text-white font-bold text-xs tracking-widest shadow-lg"
            >
              {isOTPSent ? "VERIFY OTP" : "SEND CODE"}
            </button>
          </form>
        )}

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-brand-gold/10"></span>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
            <span className="bg-white px-2 text-brand-gray">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          type="button"
          className="w-full py-4 rounded-2xl border border-brand-gold/20 flex items-center justify-center gap-3 text-xs font-bold hover:bg-brand-soft-white transition-all mb-6 uppercase tracking-wider"
        >
          <ExternalLink size={18} className="text-red-500" />
          Sign in with Google
        </button>

        <p className="text-xs text-brand-gray font-medium">
          New here?{" "}
          <Link
            to="/register"
            className="text-brand-dark-green font-bold hover:text-brand-gold transition-colors"
          >
            Create Account <ArrowRight size={12} className="inline ml-1" />
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
