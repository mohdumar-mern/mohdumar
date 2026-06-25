import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Trash, Eye, Edit } from "lucide-react";
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
    navigate("/dashboard/skills/add"); // ✅ Make sure this route exists
  };

  return (
    <div className="p-4">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Skills List</h2>
        <button
          onClick={handleAddSkill}
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
        >
          + Add Skill
        </button>
      </div>

      {/* Loading */}
      {loading && <Skeleton rows={6} cols={4} />}

      {/* Error */}
      {error && !loading && (
        <p className="text-red-600 text-center py-4">{error}</p>
      )}

      {/* Empty */}
      {!loading && skills.length === 0 && (
        <p className="text-center text-gray-600">No projects found.</p>
      )}

      {!loading && skills?.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-orange-300">
            <thead className="bg-orange-100 text-black">
              <tr>
                <th className="px-4 py-2 border">Srno</th>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Date</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {skills.map((skill, index) => (
                <tr key={skill?._id} className="hover:bg-[#111] text-gray-300">
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="px-4 py-2 border">{skill?.title}</td>

                  <td className="px-4 py-2 border">
                    {skill?.createdAt
                      ? new Date(skill.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    <div className="flex justify-center items-center gap-3">
                      <button
                        title="Edit"
                        className="text-blue-600 hover:text-blue-800 transition"
                        onClick={() =>
                          navigate(`/dashboard/skills/${skill._id}/edit`)
                        }
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="text-green-600 hover:text-green-800 transition"
                        title="View"
                        onClick={() => handleView(skill._id)}
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 transition"
                        title="Delete"
                        onClick={() => handleDelete(skill._id)}
                      >
                        <Trash size={18} />
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
