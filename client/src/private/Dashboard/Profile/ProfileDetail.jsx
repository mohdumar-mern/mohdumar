import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Helmet } from 'react-helmet-async';
import {
  fetchProfile,
  fetchResume,
} from "../../../features/Profile/profileSlice";

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
      dispatch(fetchResume()); // ✅ Fixed missing parentheses
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Profile | Admin Dashboard</title>
        <meta name="description" content="View and manage your profile details and social links." />
      </Helmet>

      <div className="min-h-screen p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Profile</h2>
          {profileId && (
            <button
              onClick={handleUpdateProfile}
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition duration-200"
            >
              Update Profile
            </button>
          )}
        </div>

        {error && !loading && (
          <p className="text-center text-red-600 font-medium">
            {error || "Something went wrong while fetching the profile."}
          </p>
        )}

        {!loading && !error && !profile && (
          <p className="text-center text-gray-500">No profile data found.</p>
        )}

        {!loading && profile && (
          <div className="max-w-2xl mx-auto bg-black rounded-lg p-6 shadow-md">
            <h2 className="text-2xl font-bold text-gray-200 mb-4">
              {fullName}
            </h2>

            <div className="flex flex-col items-center gap-4 mb-6">
              {avatar?.url && (
                <img
                  src={avatar.url}
                  alt="User Avatar"
                  loading="lazy"
                  decoding="async"
                  fetchpriority="high"
                  className="w-32 h-32 rounded-full object-cover border border-orange-500"
                />
              )}

              {resume && (
                <a
                  href={resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-500 hover:underline"
                >
                  View Resume
                </a>
              )}
            </div>

            {hasSocialLinks && (
              <div className="text-gray-300 space-y-2">
                <h3 className="font-semibold text-lg mb-2">Social Links</h3>
                {Object.entries(socialLinks).map(
                  ([platform, link]) =>
                    link && (
                      <p key={platform}>
                        <strong className="capitalize">{platform}:</strong>{" "}
                        <a
                          href={link}
                          className="text-blue-500 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {link}
                        </a>
                      </p>
                    )
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ProfileDetail;
