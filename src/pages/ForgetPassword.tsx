import React from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";

const ForgotPassword: React.FC = () => {
  // ✅ إعداد التحقق (Validation Schema)
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const loadingToast = toast.loading("Sending reset link...");
      try {
        await sendPasswordResetEmail(auth, values.email);
        toast.success("Reset link sent! Please check your email.", {
          id: loadingToast,
          duration: 5000,
        });
      } catch (error: any) {
        toast.error("Failed to send reset link. User not found.", {
          id: loadingToast,
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const isFormValid = formik.isValid && formik.values.email;

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-soft-white px-6">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl w-full max-w-md text-center border border-brand-gold/10">
        <h2 className="text-3xl font-serif text-brand-deep mb-2">
          Reset <span className="text-brand-gold">Password</span>
        </h2>

        <p className="text-brand-gray text-[10px] mb-8 uppercase tracking-widest leading-relaxed">
          Enter your email and we'll send you <br /> a link to get back into
          your account
        </p>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* EMAIL */}
          <div className="text-left">
            <input
              type="email"
              placeholder="Your Registered Email"
              {...formik.getFieldProps("email")}
              className={`w-full p-4 rounded-2xl bg-brand-soft-white/50 outline-none focus:ring-1 focus:ring-brand-gold text-sm transition-all ${
                formik.touched.email && formik.errors.email
                  ? "ring-1 ring-red-400"
                  : ""
              }`}
            />

            {/* رسالة التحقق الحية (Live Feedback) كما في Login */}
            <p
              className={`text-[11px] mt-2 ml-2 transition-all duration-300 ${
                formik.touched.email
                  ? formik.errors.email
                    ? "text-red-500 opacity-100"
                    : "text-green-500 opacity-100"
                  : "opacity-0"
              }`}
            >
              {formik.touched.email
                ? formik.errors.email || "Email format is valid ✔"
                : ""}
            </p>
          </div>

          {/* RESET BUTTON */}
          <button
            type="submit"
            disabled={!isFormValid || formik.isSubmitting}
            className={`w-full py-4 rounded-2xl font-bold transition-all shadow-lg text-xs tracking-widest ${
              isFormValid && !formik.isSubmitting
                ? "bg-brand-dark-green text-white hover:brightness-110 cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
            }`}
          >
            {formik.isSubmitting ? "SENDING..." : "SEND RESET LINK"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <Link
            to="/login"
            className="text-xs text-brand-gray hover:text-brand-gold transition-colors flex items-center justify-center gap-2"
          >
            ← Back to <span className="font-bold">Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
