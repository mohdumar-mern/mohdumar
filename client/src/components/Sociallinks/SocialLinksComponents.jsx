import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSocialLinks } from "../../features/Profile/profileSlice";
import SocialLinksCard from "../UI/card/SocialLilnksCard";

const SkeletonCircle = ({ className = "" }) => (
  <div
    className={`w-10 h-10 bg-gray-300 rounded-full animate-pulse ${className}`}
    role="status"
    aria-label="Loading social link"
  />
);

const SocialLinksComponents = ({ color }) => {
  const dispatch = useDispatch();
  const { socialLinks, loading } = useSelector((state) => state.profile);

  useEffect(() => {
    if (!socialLinks) {
      dispatch(fetchSocialLinks());
    }
  }, [dispatch, socialLinks]);

  if (loading) {
    return (
      <div className="flex gap-3 mt-4" aria-busy="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonCircle key={i} />
        ))}
      </div>
    );
  }

  if (!socialLinks || Object.keys(socialLinks).length === 0) {
    return (
      <p className="text-center text-yellow-400 mt-10" role="status">
        No social links available.
      </p>
    );
  }

  return <SocialLinksCard socialLinks={socialLinks} color={color} />;
};

export default React.memo(SocialLinksComponents);
