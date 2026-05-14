import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

type LoginValues = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const validate = (values: LoginValues) => {
    const errors: Partial<LoginValues> = {};

    if (!values.email) {
      errors.email = "Email is required";
    } else if (!values.email.includes("@")) {
      errors.email = "Email must contain @";
    }

    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    return errors;
  };

  const formik = useFormik<LoginValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validate,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { setSubmitting }) => {
      const loadingToast = toast.loading("Logging in...");
      try {
        await signInWithEmailAndPassword(auth, values.email, values.password);
        toast.success("Welcome back!", { id: loadingToast });
        navigate("/");
      } catch (error: any) {
        toast.error("Invalid email or password", { id: loadingToast });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const isFormValid =
    formik.isValid && formik.values.email && formik.values.password;

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-soft-white px-6">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl w-full max-w-md border border-brand-gold/10 text-center">
        <h2 className="text-3xl font-serif text-brand-deep mb-2">
          Welcome <span className="text-brand-gold">Back</span>
        </h2>

        <p className="text-brand-gray text-[10px] mb-8 uppercase tracking-widest">
          Login to your premium account
        </p>

        <form onSubmit={formik.handleSubmit} className="space-y-5" noValidate>
          {/* EMAIL */}
          <div className="text-left">
            <input
              type="email"
              placeholder="Email"
              {...formik.getFieldProps("email")}
              className={`w-full p-4 rounded-2xl bg-brand-soft-white/50 outline-none focus:ring-1 focus:ring-brand-gold text-sm ${
                formik.touched.email && formik.errors.email
                  ? "ring-1 ring-red-400"
                  : ""
              }`}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-[10px] text-red-500 mt-1 ml-2 font-medium">
                {formik.errors.email}
              </p>
            )}
          </div>

          {/* PASSWORD */}
          <div className="relative text-left">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...formik.getFieldProps("password")}
              className={`w-full p-4 pr-12 rounded-2xl bg-brand-soft-white/50 outline-none focus:ring-1 focus:ring-brand-gold text-sm ${
                formik.touched.password && formik.errors.password
                  ? "ring-1 ring-red-400"
                  : ""
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-[18px] text-gray-500 hover:text-brand-gold transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {formik.touched.password && formik.errors.password && (
              <p className="text-[10px] text-red-500 mt-1 ml-2 font-medium">
                {formik.errors.password}
              </p>
            )}
          </div>

          {/* ✅ FORGOT PASSWORD LINK */}
          <div className="text-right px-2">
            <Link
              to="/forget-password"
              className="text-[11px] text-brand-gray hover:text-brand-gold transition-colors font-medium"
            >
              Forget Password?
            </Link>
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={!isFormValid || formik.isSubmitting}
            className={`w-full py-4 rounded-2xl font-bold transition-all shadow-lg text-xs tracking-widest ${
              isFormValid && !formik.isSubmitting
                ? "bg-brand-dark-green text-white hover:brightness-110 cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
            }`}
          >
            {formik.isSubmitting ? "LOADING..." : "LOGIN"}
          </button>
        </form>

        <p className="mt-8 text-xs text-brand-gray text-center">
          New here?{" "}
          <Link
            to="/register"
            className="text-brand-dark-green font-bold hover:text-brand-gold transition-colors"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
