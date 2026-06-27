import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Code, Image } from "lucide-react";
import Input from "../../../components/UI/Input/Input";
import { addSkill, resetSkillsState } from "../../../features/Skills/skillSlice";

const AddAndUpdateSkill = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { loading, error, message } = useSelector((state) => state.skill);

  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    level: "Beginner",
    category: "Frontend",
    file: null,
  });

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        dispatch(resetSkillsState());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, error, dispatch]);

  const levels = ["Beginner", "Intermediate", "Advanced"];
  const categories = ["Frontend", "Backend", "Full Stack", "Database", "Tools", "Other"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formPayload = new FormData();
    formPayload.append("title", formData.title);
    formPayload.append("level", formData.level);
    formPayload.append("category", formData.category);
    if (formData.file) {
      formPayload.append("file", formData.file);
    }

    try {
      await dispatch(addSkill(formPayload)).unwrap();
      navigate("/dashboard/skills");
    } catch (err) {
      console.error(isEditing ? "Update failed:" : "Add failed:", err);
    }
  };

  return (
    <div className="max-w-md mx-auto font-mono">
      <button
        onClick={() => navigate("/dashboard/skills")}
        className="text-gray-400 hover:text-cyan-400 text-sm uppercase tracking-widest mb-6 inline-flex items-center transition"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back_to_Skills
      </button>

      <div className="flex items-center gap-2 text-pink-500 text-[11px] uppercase tracking-widest">
        <span>//</span>
        <span>{isEditing ? "Modify_Record" : "New_Record"}</span>
      </div>

      <h2 className="text-2xl font-extrabold uppercase tracking-tight text-white mt-2 mb-6">
        {isEditing ? "UPDATE" : "ADD"}{" "}
        <span className="text-cyan-400 drop-shadow-[0_0_14px_rgba(34,211,238,0.5)]">
          SKILL
        </span>
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 border border-cyan-500/15 bg-gradient-to-b from-cyan-950/10 to-black p-6"
        style={{
          clipPath: "polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 0 100%)",
        }}
      >
        <Input
          label="Skill_Name"
          placeholder="Enter skill name"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          icon={Code}
          required
        />

        <div>
          <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
            Level
          </label>
          <select
            name="level"
            value={formData.level}
            onChange={handleChange}
            className="w-full bg-[#0a0f17] border border-cyan-500/15 text-cyan-100 text-sm px-4 py-3 focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/30 transition"
            style={{
              clipPath: "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)",
            }}
          >
            {levels.map((level) => (
              <option key={level} value={level} className="bg-black text-cyan-300">
                {level}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Skill_Image"
          type="file"
          name="file"
          onChange={handleFileChange}
          accept="image/*"
          icon={Image}
          required={!isEditing}
        />

        <div>
          <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full bg-[#0a0f17] border border-cyan-500/15 text-cyan-100 text-sm px-4 py-3 focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/30 transition"
            style={{
              clipPath: "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)",
            }}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-black text-cyan-300">
                {cat}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-cyan-400 text-black font-bold uppercase tracking-widest text-sm py-3 hover:bg-cyan-300 transition disabled:opacity-50"
          style={{ clipPath: "polygon(6% 0, 100% 0, 94% 100%, 0% 100%)" }}
        >
          {loading ? "Adding..." : "Add_Skill"}
        </button>
      </form>

      {message && (
        <p className="mt-4 text-center text-emerald-400 text-sm">{message}</p>
      )}
      {error && (
        <p className="mt-2 text-center text-pink-500 text-sm">{error}</p>
      )}
    </div>
  );
};

export default AddAndUpdateSkill;