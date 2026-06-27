import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Helmet } from "react-helmet-async";
import { Github, Linkedin, Twitter, Instagram, Youtube, Link as LinkIcon, FileText } from "lucide-react";
import {
  fetchProfile,
  fetchResume,
} from "../../../features/Profile/profileSlice";

const platformIcons = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  instagram: Instagram,
  youtube: Youtube,
};

const ProfileDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, profile, resume } = useSelector(
    (state) => state.profile,
    shallowEqual
  );

  const {
    avatar,
    socialLinks,
    name: fullName = "Mohd Umar",
    _id: profileId,
  } = profile || {};

  const hasSocialLinks =
    socialLinks && Object.values(socialLinks).some((link) => link);

  const fetchProfileData = useCallback(() => {
    if (!profile || Object.keys(profile).length === 0) {
      dispatch(fetchProfile());
      dispatch(fetchResume());
    }
  }, [dispatch, profile]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  const handleUpdateProfile = () => {
    if (profileId) navigate(`/dashboard/profile/${profileId}/edit`);
  };

  if (loading) {
    return (
      <div className="text-center mt-12">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyan-400 mx-auto"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Profile | Admin Dashboard</title>
        <meta
          name="description"
          content="View and manage your profile details and social links."
        />
      </Helmet>

      <div className="font-mono">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="flex items-center gap-2 text-pink-500 text-[11px] uppercase tracking-widest">
              <span>//</span>
              <span>Operator_Profile</span>
            </div>
            <h2 className="text-xl font-bold uppercase tracking-tight text-white mt-1">
              Profile
            </h2>
          </div>
          {profileId && (
            <button
              onClick={handleUpdateProfile}
              className="bg-cyan-400 text-black text-xs font-bold uppercase tracking-widest px-5 py-2.5 hover:bg-cyan-300 transition"
              style={{ clipPath: "polygon(6% 0, 100% 0, 94% 100%, 0% 100%)" }}
            >
              Update_Profile
            </button>
          )}
        </div>

        {error && !loading && (
          <p className="text-center text-pink-500 text-sm">
            {error || "Something went wrong while fetching the profile."}
          </p>
        )}

        {!loading && !error && !profile && (
          <p className="text-center text-gray-500 text-sm uppercase tracking-widest">
            No_profile_data_found
          </p>
        )}

        {!loading && profile && (
          <div
            className="max-w-2xl mx-auto border border-cyan-500/15 bg-gradient-to-b from-cyan-950/10 to-black p-6 sm:p-8"
            style={{
              clipPath: "polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 0 100%)",
            }}
          >
            <div className="flex flex-col items-center gap-4 mb-8">
              {avatar?.url && (
                <img
                  src={avatar.url}
                  alt="User Avatar"
                  loading="lazy"
                  decoding="async"
                  fetchPriority="high"
                  className="w-28 h-28 rounded-full object-cover border-2 border-cyan-500/40 shadow-[0_0_18px_rgba(34,211,238,0.25)]"
                />
              )}

              <h2 className="text-2xl font-extrabold text-white">{fullName}</h2>

              {resume && (
                <a
                  href={resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 text-xs uppercase tracking-widest transition"
                >
                  <FileText className="w-3.5 h-3.5" />
                  View_Resume
                </a>
              )}
            </div>

            {hasSocialLinks && (
              <div>
                <div className="flex items-center gap-2 text-pink-500 text-[11px] uppercase tracking-widest mb-3">
                  <span>//</span>
                  <span>Social_Links</span>
                </div>
                <div className="space-y-0">
                  {Object.entries(socialLinks).map(([platform, link]) => {
                    if (!link) return null;
                    const Icon = platformIcons[platform] || LinkIcon;
                    return (
                      <a
                        key={platform}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 border border-cyan-500/15 px-4 py-3 -mt-px hover:border-cyan-400/40 hover:bg-cyan-500/5 transition-colors"
                      >
                        <Icon className="w-4 h-4 text-pink-400 shrink-0" />
                        <span className="text-sm text-gray-300 truncate">
                          {link}
                        </span>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ProfileDetail;