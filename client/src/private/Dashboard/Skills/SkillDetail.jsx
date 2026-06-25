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
    <p className=" text-base mb-2">
      <span className="font-medium text-gray-300">{label}:</span>{" "}
      {value || "N/A"}
    </p>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500" />
      </div>
    );
  }
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* Skill Detail Card */}
      {skill && (
        <div className=" rounded-2xl shadow-lg p-6">
          <h2 className="text-3xl font-bold  mb-6">{skill.title}</h2>

          {renderDetailItem("Category", skill.category)}
          {renderDetailItem("Level", skill.level)}
          {renderDetailItem(
            "Date Added",
            skill.createdAt
              ? new Date(skill.createdAt).toLocaleDateString()
              : "N/A"
          )}

          {skill.file?.url && (
            <div className="mt-6 rounded-xl overflow-hidden ">
              <img
                src={skill.file.url}
                alt={skill.title || "Skill"}
                loading="lazy"
                decoding="async"
                fetchpriority="high"
                className="w-64 h-auto object-cover "
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              <ChevronLeft size={18} />
              Back to Skills List
            </button>
           
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillDetail;
