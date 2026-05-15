import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  type ConfirmationResult,
} from "firebase/auth";
import { auth, googleProvider, db } from "../firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { Mail, Phone, Eye, EyeOff, ExternalLink } from "lucide-react";

type RegisterValues = {
  email: string;
  password: string;
};

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [regMethod, setRegMethod] = useState<"email" | "phone">("email");

  // Phone Auth States
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
  const [isOTPSent, setIsOTPSent] = useState(false);

  // --- دالة إنشاء مستند المستخدم في Firestore ---
  // نستخدمها بعد أي عملية تسجيل ناجحة
  const createUserDocument = async (user: any) => {
    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      // لا نكتب البيانات إلا إذا كان المستخدم جديداً تماماً
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email || "",
          phoneNumber: user.phoneNumber || "",
          displayName: user.displayName || "New Member",
          points: 100, // الهدية الترحيبية
          wishlist: [],
          orders: [],
          createdAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error("Error creating user document:", error);
    }
  };

  // --- Google Registration ---
  const handleGoogleReg = async () => {
    const loadingToast = toast.loading("Connecting to Google...");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await createUserDocument(result.user); // تهيئة البيانات
      toast.success("Welcome to HappyShop!", { id: loadingToast });
      navigate("/");
    } catch (error: any) {
      toast.error("Google registration failed", { id: loadingToast });
    }
  };

  // --- Phone Registration ---
  const setupRecaptcha = () => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container-reg",
        { size: "invisible" },
      );
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return toast.error("Please enter a phone number");
    const loading = toast.loading("Sending verification code...");
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
      toast.success("OTP sent!", { id: loading });
    } catch (error: any) {
      toast.error("Check number format (+20...)", { id: loading });
    }
  };

  const verifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const loading = toast.loading("Verifying...");
    try {
      const result = await confirmationResult?.confirm(verificationCode);
      if (result?.user) {
        await createUserDocument(result.user); // تهيئة البيانات للهاتف
      }
      toast.success("Account verified!", { id: loading });
      navigate("/");
    } catch (error: any) {
      toast.error("Invalid OTP code", { id: loading });
    }
  };

  // --- Email Registration (Formik) ---
  const formik = useFormik<RegisterValues>({
    initialValues: { email: "", password: "" },
    validate: (values) => {
      const errors: Partial<RegisterValues> = {};
      if (!values.email) errors.email = "Required";
      if (!values.password || values.password.length < 6)
        errors.password = "Min 6 chars";
      return errors;
    },
    onSubmit: async (values) => {
      const loadingToast = toast.loading("Creating account...");
      try {
        const result = await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password,
        );
        await createUserDocument(result.user); // تهيئة البيانات للإيميل
        toast.success("Account created!", { id: loadingToast });
        navigate("/");
      } catch (error: any) {
        toast.error("Email already in use or error", { id: loadingToast });
      }
    },
  });

  const isFormValid =
    formik.isValid && formik.values.email && formik.values.password;

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-soft-white mt-15 px-6 py-12">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl w-full max-w-md border border-brand-gold/10 text-center">
        <h2 className="text-3xl font-serif text-brand-deep mb-2">
          Join <span className="text-brand-gold">HappyShop</span>
        </h2>
        <p className="text-brand-gray text-[10px] mb-8 uppercase tracking-widest">
          Create your premium account
        </p>

        <div id="recaptcha-container-reg"></div>

        {/* Tabs Switcher */}
        <div className="flex bg-brand-soft-white p-1 rounded-2xl mb-8">
          <button
            onClick={() => {
              setRegMethod("email");
              setIsOTPSent(false);
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${regMethod === "email" ? "bg-white shadow-sm text-brand-gold" : "text-brand-gray"}`}
          >
            <Mail size={14} /> Email
          </button>
          <button
            onClick={() => setRegMethod("phone")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${regMethod === "phone" ? "bg-white shadow-sm text-brand-gold" : "text-brand-gray"}`}
          >
            <Phone size={14} /> Phone
          </button>
        </div>

        {regMethod === "email" ? (
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
            <button
              type="submit"
              disabled={!isFormValid || formik.isSubmitting}
              className={`w-full py-4 rounded-2xl font-bold transition-all shadow-lg text-xs tracking-widest ${isFormValid ? "bg-brand-dark-green text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"}`}
            >
              REGISTER WITH EMAIL
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
                className="w-full p-4 rounded-2xl bg-brand-soft-white/50 outline-none focus:ring-1 focus:ring-brand-gold text-sm text-center font-bold tracking-widest"
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

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-brand-gold/10"></span>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
            <span className="bg-white px-2 text-brand-gray">
              Or Register with
            </span>
          </div>
        </div>

        <button
          onClick={handleGoogleReg}
          className="w-full py-4 rounded-2xl border border-brand-gold/20 flex items-center justify-center gap-3 text-xs font-bold hover:bg-brand-soft-white transition-all mb-6 uppercase tracking-wider"
        >
          <ExternalLink size={18} className="text-red-500" />
          Join with Google
        </button>

        <p className="text-xs text-brand-gray">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-brand-dark-green font-bold hover:text-brand-gold"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
