import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { fetchSingleSkill } from "../../../features/Skills/skillSlice";

const SkillDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { skill, loading, error } = useSelector((state) => state.skill);

  useEffect(() => {
    if (id) dispatch(fetchSingleSkill(id));
  }, [dispatch, id]);

  const renderDetailItem = (label, value) => (
    <div className="text-sm mb-2">
      <span className="text-xs uppercase tracking-widest text-gray-500">
        {label}:{" "}
      </span>
      <span className="text-cyan-300">{value || "N/A"}</span>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyan-400" />
      </div>
    );
  }
  if (error)
    return <p className="text-pink-500 text-center text-sm">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto font-mono">
      {skill && (
        <div
          className="border border-cyan-500/15 bg-gradient-to-b from-cyan-950/10 to-black p-6 sm:p-8"
          style={{
            clipPath: "polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 0 100%)",
          }}
        >
          <div className="flex items-center gap-2 text-pink-500 text-[11px] uppercase tracking-widest mb-2">
            <span>//</span>
            <span>Skill_Record</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-5">
            {skill.title}
          </h2>

          {skill.file?.url && (
            <img
              src={skill.file.url}
              alt={skill.title || "Skill"}
              loading="lazy"
              decoding="async"
              fetchPriority="high"
              className="w-32 h-32 rounded-full object-cover border-2 border-cyan-500/40 shadow-[0_0_16px_rgba(34,211,238,0.25)] mb-6"
            />
          )}

          {renderDetailItem("Category", skill.category)}
          {renderDetailItem("Level", skill.level)}
          {renderDetailItem(
            "Date_Added",
            skill.createdAt
              ? new Date(skill.createdAt).toLocaleDateString()
              : "N/A"
          )}

          {/* Action Buttons */}
          <div className="mt-6 pt-4 border-t border-cyan-500/10">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 bg-cyan-400 text-black text-xs font-bold uppercase tracking-widest px-5 py-2.5 hover:bg-cyan-300 transition"
              style={{ clipPath: "polygon(6% 0, 100% 0, 94% 100%, 0% 100%)" }}
            >
              <ChevronLeft size={16} />
              Back_to_Skills
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillDetail;