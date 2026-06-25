import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { Helmet } from 'react-helmet-async';
import {
  ArrowLeft,
  File,
  Github,
  Image,
  Instagram,
  Linkedin,
  Twitter,
  User,
  Youtube,
} from "lucide-react";

import {
  fetchProfile,
  updateProfile,
  // clearError,
  // clearMessage,
} from "../../../features/Profile/profileSlice";
import Input from "../../../components/UI/Input/Input";

const UpdateProfile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { profile, error, message } = useSelector((state) => state.profile);

  const [formData, setFormData] = useState({
    name: "",
    avatar: null,
    resume: null,
    github: "",
    linkedin: "",
    twitter: "",
    instagram: "",
    youtube: "",
  });

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        name: profile.name || "",
        github: profile?.socialLinks?.github || "",
        linkedin: profile?.socialLinks?.linkedin || "",
        twitter: profile?.socialLinks?.twitter || "",
        instagram: profile?.socialLinks?.instagram || "",
        youtube: profile?.socialLinks?.youtube || "",
      }));
    }
  }, [profile]);

  useEffect(() => {
    if (message || error) {
      const timeout = setTimeout(() => {
        // dispatch(clearMessage());
        // dispatch(clearError());
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [message, error, dispatch]);

  const handleChange = useCallback((e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files?.[0] || value,
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    if (formData.avatar) data.append("avatar", formData.avatar);
    if (formData.resume) data.append("resume", formData.resume);
    data.append("github", formData.github);
    data.append("linkedin", formData.linkedin);
    data.append("twitter", formData.twitter);
    data.append("instagram", formData.instagram);
    data.append("youtube", formData.youtube);

    try {
      await dispatch(updateProfile({ id, data })).unwrap();
      navigate("/dashboard/profile");
    } catch (err) {
      console.error("Update profile error:", err);
    }
  };

  return (
    <>
      <Helmet>
        <title>Update Profile | Admin Panel</title>
        <meta name="description" content="Update your personal and social profile details." />
      </Helmet>

      <div className="max-w-3xl mx-auto p-6 bg-black rounded-lg shadow-md">
        <button
          type="button"
          onClick={() => navigate("/dashboard/profile")}
          className="text-white font-semibold text-lg mb-4 inline-flex items-center"
        >
          <ArrowLeft className="mr-2" />
          Back to Profile
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center text-orange-500">
          Update Profile
        </h2>

        {message && (
          <p className="mb-4 p-3 bg-green-100 text-green-700 rounded text-center">
            {message}
          </p>
        )}
        {error && (
          <p className="mb-4 p-3 bg-red-100 text-red-700 rounded text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            name="name"
            placeholder="Mohd Umar"
            value={formData.name}
            onChange={handleChange}
            required
            icon={User}
          />

          <Input
            label="Avatar Image"
            type="file"
            name="avatar"
            onChange={handleChange}
            accept="image/*"
            icon={Image}
          />

          <Input
            label="Resume (PDF/Doc)"
            type="file"
            name="resume"
            onChange={handleChange}
            accept=".pdf,.doc,.docx"
            icon={File}
          />

          <Input
            label="GitHub"
            type="url"
            name="github"
            placeholder="https://github.com/mohdumar-mern"
            value={formData.github}
            onChange={handleChange}
            icon={Github}
          />

          <Input
            label="LinkedIn"
            type="url"
            name="linkedin"
            placeholder="https://linkedin.com/in/username"
            value={formData.linkedin}
            onChange={handleChange}
            icon={Linkedin}
          />

          <Input
            label="Twitter"
            type="url"
            name="twitter"
            placeholder="https://twitter.com/username"
            value={formData.twitter}
            onChange={handleChange}
            icon={Twitter}
          />

          <Input
            label="Instagram"
            type="url"
            name="instagram"
            placeholder="https://instagram.com/username"
            value={formData.instagram}
            onChange={handleChange}
            icon={Instagram}
          />

          <Input
            label="YouTube"
            type="url"
            name="youtube"
            placeholder="https://youtube.com/@username"
            value={formData.youtube}
            onChange={handleChange}
            icon={Youtube}
          />

          <div className="text-center">
            <button
              type="submit"
              className="bg-orange-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-orange-600 transition duration-200"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UpdateProfile;
