import React from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import toast from "react-hot-toast";

type RegisterValues = {
  email: string;
  password: string;
};

const Register: React.FC = () => {
  const navigate = useNavigate();

  // ✅ Custom Validation (same style as login)
  const validate = (values: RegisterValues) => {
    const errors: Partial<RegisterValues> = {};

    // EMAIL
    if (!values.email) {
      errors.email = "Email is required";
    } else if (!values.email.includes("@")) {
      errors.email = "Email must contain @";
    } else if (!values.email.includes(".")) {
      errors.email = "Enter valid email format";
    }

    // PASSWORD
    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    return errors;
  };

  const formik = useFormik<RegisterValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validate,
    validateOnChange: true,
    validateOnBlur: true,

    onSubmit: async (values, { setSubmitting }) => {
      const loadingToast = toast.loading("Creating account...");

      try {
        await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password,
        );

        toast.success("Account created successfully!", {
          id: loadingToast,
        });

        navigate("/");
      } catch (error: any) {
        toast.error("Registration failed", {
          id: loadingToast,
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const isFormValid =
    formik.values.email && formik.values.password.length >= 6 && formik.isValid;

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-soft-white px-6">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl w-full max-w-md border border-brand-gold/10">
        <h2 className="text-3xl font-serif text-brand-deep mb-2 text-center">
          Join <span className="text-brand-gold">HappyShop</span>
        </h2>

        <p className="text-brand-gray text-[10px] text-center mb-8 uppercase tracking-widest">
          Create your premium account
        </p>

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          {/* EMAIL */}
          <div className="text-left">
            <input
              type="email"
              placeholder="Email Address"
              {...formik.getFieldProps("email")}
              className={`w-full p-4 rounded-2xl bg-brand-soft-white/50 outline-none focus:ring-1 focus:ring-brand-gold text-sm ${
                formik.touched.email && formik.errors.email
                  ? "ring-1 ring-red-400"
                  : ""
              }`}
            />

            <p
              className={`text-[11px] mt-1 ml-2 transition-all duration-300 ${
                formik.touched.email
                  ? formik.errors.email
                    ? "text-red-500 opacity-100"
                    : "text-green-500 opacity-100"
                  : "opacity-0"
              }`}
            >
              {formik.touched.email
                ? formik.errors.email || "Email looks good ✔"
                : ""}
            </p>
          </div>

          {/* PASSWORD */}
          <div className="text-left">
            <input
              type="password"
              placeholder="Password"
              {...formik.getFieldProps("password")}
              className={`w-full p-4 rounded-2xl bg-brand-soft-white/50 outline-none focus:ring-1 focus:ring-brand-gold text-sm ${
                formik.touched.password && formik.errors.password
                  ? "ring-1 ring-red-400"
                  : ""
              }`}
            />

            <p
              className={`text-[11px] mt-1 ml-2 transition-all duration-300 ${
                formik.touched.password
                  ? formik.errors.password
                    ? "text-red-500 opacity-100"
                    : "text-green-500 opacity-100"
                  : "opacity-0"
              }`}
            >
              {formik.touched.password
                ? formik.errors.password || "Strong password ✔"
                : ""}
            </p>
          </div>

          {/* BUTTON ALWAYS VISIBLE */}
          <button
            type="submit"
            disabled={!isFormValid || formik.isSubmitting}
            className={`w-full py-4 rounded-2xl font-bold transition-all shadow-lg text-xs tracking-widest ${
              isFormValid && !formik.isSubmitting
                ? "bg-brand-dark-green text-white hover:brightness-110 cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {formik.isSubmitting ? "LOADING..." : "REGISTER"}
          </button>
        </form>

        <p className="text-center mt-6 text-xs text-brand-gray">
          Already have an account?{" "}
          <Link to="/login" className="text-brand-gold font-bold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
