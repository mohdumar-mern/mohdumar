import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { Helmet } from "react-helmet-async";
import {
  ChevronLeft,
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

      <div className="max-w-3xl mx-auto font-mono">
        <button
          type="button"
          onClick={() => navigate("/dashboard/profile")}
          className="text-gray-400 hover:text-cyan-400 text-sm uppercase tracking-widest mb-6 inline-flex items-center transition"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back_to_Profile
        </button>

        <div className="flex items-center gap-2 text-pink-500 text-[11px] uppercase tracking-widest">
          <span>//</span>
          <span>Modify_Record</span>
        </div>

        <h2 className="text-2xl font-extrabold uppercase tracking-tight text-white mt-2 mb-6">
          UPDATE{" "}
          <span className="text-cyan-400 drop-shadow-[0_0_14px_rgba(34,211,238,0.5)]">
            PROFILE
          </span>
        </h2>

        {message && (
          <div className="mb-4 px-4 py-3 border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-sm text-center">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 px-4 py-3 border border-pink-500/30 bg-pink-500/10 text-pink-300 text-sm text-center">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5 border border-cyan-500/15 bg-gradient-to-b from-cyan-950/10 to-black p-6 sm:p-8"
          style={{
            clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)",
          }}
        >
          <Input
            label="Full_Name"
            type="text"
            name="name"
            placeholder="Mohd Umar"
            value={formData.name}
            onChange={handleChange}
            required
            icon={User}
          />

          <Input
            label="Avatar_Image"
            type="file"
            name="avatar"
            onChange={handleChange}
            accept="image/*"
            icon={Image}
          />

          <Input
            label="Resume_(PDF/Doc)"
            type="file"
            name="resume"
            onChange={handleChange}
            accept=".pdf,.doc,.docx"
            icon={File}
          />

          <Input
            label="Github"
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

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-cyan-400 text-black font-bold uppercase tracking-widest text-sm py-3 hover:bg-cyan-300 transition"
              style={{ clipPath: "polygon(6% 0, 100% 0, 94% 100%, 0% 100%)" }}
            >
              Update_Profile
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UpdateProfile;