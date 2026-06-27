import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Trash, Eye, Edit, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchSkills, deleteSkill } from "../../../features/Skills/skillSlice";
import Skeleton from "../../../components/UI/Skeleton/TableSkeleton";

const SkillsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { skills, loading, error } = useSelector((state) => state.skill);

  useEffect(() => {
    dispatch(fetchSkills());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this skill?")) {
      dispatch(deleteSkill(id))
        .unwrap()
        .then(() => {
          dispatch(fetchSkills());
        })
        .catch((err) => {
          console.error("Failed to delete skill:", err);
        });
    }
  };

  const handleView = (id) => {
    navigate(`/dashboard/skills/${id}/view`);
  };

  const handleAddSkill = () => {
    navigate("/dashboard/skills/add");
  };

  return (
    <div className="font-mono">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center gap-2 text-pink-500 text-[11px] uppercase tracking-widest">
            <span>//</span>
            <span>Registry</span>
          </div>
          <h2 className="text-xl font-bold uppercase tracking-tight text-white mt-1">
            Skills_List
          </h2>
        </div>
        <button
          onClick={handleAddSkill}
          className="flex items-center gap-2 bg-cyan-400 text-black text-xs font-bold uppercase tracking-widest px-5 py-2.5 hover:bg-cyan-300 transition"
          style={{ clipPath: "polygon(6% 0, 100% 0, 94% 100%, 0% 100%)" }}
        >
          <Plus className="w-4 h-4" />
          Add_Skill
        </button>
      </div>

      {/* Loading */}
      {loading && <Skeleton rows={6} cols={4} />}

      {/* Error */}
      {error && !loading && (
        <p className="text-pink-500 text-center text-sm py-4">{error}</p>
      )}

      {/* Empty */}
      {!loading && skills.length === 0 && (
        <p className="text-center text-gray-500 text-sm uppercase tracking-widest">
          No_skills_found
        </p>
      )}

      {!loading && skills?.length > 0 && (
        <div className="overflow-x-auto border border-cyan-500/15">
          <table className="min-w-full text-sm">
            <thead className="bg-cyan-500/5 text-cyan-300 text-xs uppercase tracking-widest">
              <tr>
                <th className="px-4 py-3 text-left">Sr_No</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {skills.map((skill, index) => (
                <tr
                  key={skill?._id}
                  className="hover:bg-cyan-500/5 text-gray-300 border-b border-cyan-500/10"
                >
                  <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                  <td className="px-4 py-3 text-white">{skill?.title}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {skill?.createdAt
                      ? new Date(skill.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center items-center gap-4">
                      <button
                        title="Edit"
                        className="text-cyan-400 hover:text-cyan-300 transition"
                        onClick={() =>
                          navigate(`/dashboard/skills/${skill._id}/edit`)
                        }
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="text-emerald-400 hover:text-emerald-300 transition"
                        title="View"
                        onClick={() => handleView(skill._id)}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="text-pink-400 hover:text-pink-300 transition"
                        title="Delete"
                        onClick={() => handleDelete(skill._id)}
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SkillsList;