import React, { useState, useEffect, useCallback } from "react";
import { Mail, LogIn, Lock } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { Helmet } from 'react-helmet-async';

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
        <section className="min-h-[80vh] w-full max-w-xl mx-auto flex items-center justify-center">
          <div className="bg-black w-full shadow-2xl rounded-xl p-8 md:p-10">
            <h2 className="text-3xl font-bold text-white mb-6 text-center flex items-center justify-center gap-2">
              <LogIn className="text-orange-500" />
              Login
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {formError && (
                <p className="text-red-500 text-center">{formError}</p>
              )}

              <Input
                label="Email Address"
                name="email"
                type="email"
                placeholder="lorem@gmail.com"
                value={formData.email}
                onChange={handleChange}
                icon={Mail}
              />
              <Input
                label="Password"
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
                className="w-full bg-orange-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
              >
                <span className="flex items-center justify-center gap-2">
                  <LogIn />
                  {loading ? "Logging in..." : "Login"}
                </span>
              </button>
            </form>
          </div>
        </section>
      </Container>
    </>
  );
};

export default LoginPage;
