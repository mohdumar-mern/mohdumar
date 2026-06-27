import React, { useState, useEffect, useCallback } from "react";
import { Mail, Lock, ShieldCheck } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { Helmet } from "react-helmet-async";

import Container from "../../components/UI/Container/Container";
import Input from "../../components/UI/Input/Input";
import { loginAdmin, clearAuthError } from "../../features/Auth/authSlice";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [formError, setFormError] = useState(null);

  const { token, loading, error } = useSelector((state) => state.auth);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormError(null);
  }, []);

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      return "Please fill in both email and password.";
    }
    return null;
  };

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const validationError = validateForm();
      if (validationError) {
        setFormError(validationError);
        return;
      }
      dispatch(loginAdmin(formData));
    },
    [dispatch, formData]
  );

  useEffect(() => {
    if (token) {
      toast.success("Login successful!");
      navigate("/dashboard");
    }
  }, [token, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAuthError());
    }
  }, [error, dispatch]);

  return (
    <>
      <Helmet>
        <title>Login | Mohd Umar - Admin Access</title>
        <meta
          name="description"
          content="Login to access the admin dashboard of Mohd Umar's MERN stack application."
        />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://umarportfolio-frontend.vercel.app/login" />
      </Helmet>

      <Container>
        <section className="min-h-[80vh] w-full max-w-md mx-auto flex items-center justify-center font-mono">
          <div className="w-full">
            {/* Eyebrow */}
            <div className="flex items-center justify-center gap-2 text-pink-500 text-xs uppercase tracking-widest mb-3">
              <span>//</span>
              <span>Admin_Access</span>
            </div>

            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white text-center">
              SYSTEM{" "}
              <span className="text-cyan-400 drop-shadow-[0_0_18px_rgba(34,211,238,0.6)]">
                LOGIN
              </span>
            </h1>

            {/* Underline accent */}
            <div className="h-[2px] w-28 bg-gradient-to-r from-cyan-400 to-transparent mx-auto mt-4 mb-10" />

            {/* Panel */}
            <div
              className="border border-cyan-500/20 bg-gradient-to-b from-cyan-950/15 to-black p-8"
              style={{
                clipPath:
                  "polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 0 100%)",
              }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {formError && (
                  <p className="text-pink-500 text-sm text-center">{formError}</p>
                )}

                <Input
                  label="Operator_Email"
                  name="email"
                  type="email"
                  placeholder="lorem@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  icon={Mail}
                />
                <Input
                  label="Access_Key"
                  name="password"
                  type="password"
                  placeholder="********"
                  value={formData.password}
                  onChange={handleChange}
                  icon={Lock}
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-cyan-400 text-black font-bold uppercase tracking-widest text-sm py-3 hover:bg-cyan-300 transition disabled:opacity-50"
                  style={{
                    clipPath: "polygon(6% 0, 100% 0, 94% 100%, 0% 100%)",
                  }}
                >
                  <ShieldCheck className="w-4 h-4" />
                  {loading ? "Authenticating..." : "Authenticate"}
                </button>
              </form>
            </div>
          </div>
        </section>
      </Container>
    </>
  );
};

export default LoginPage;