import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSocialLinks } from "../../features/Profile/profileSlice";
import SocialLinksCard from "../UI/card/SocialLilnksCard";

const SkeletonCircle = ({ className = "" }) => (
  <div
    className={`w-10 h-10 bg-cyan-900/30 border border-cyan-500/20 rounded-full animate-pulse ${className}`}
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
      <p className="text-center text-cyan-400/70 font-mono text-sm mt-10" role="status">
        // no_social_links_found
      </p>
    );
  }

  return <SocialLinksCard socialLinks={socialLinks} color={color} />;
};

export default React.memo(SocialLinksComponents);