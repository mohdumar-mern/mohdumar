import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Code, Image } from "lucide-react";
import Input from "../../../components/UI/Input/Input";
import { addSkill,  resetSkillsState } from "../../../features/Skills/skillSlice";

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



  // Clear messages after 3 seconds
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
    <div className="max-w-md mx-auto p-6 bg-black rounded-lg shadow">
      <button
        onClick={() => navigate("/dashboard/skills")}
        className="text-white font-semibold text-lg mb-4 inline-flex items-center"
      >
        <ChevronLeft className="mr-1" />
        Back to Skills
      </button>

      <h2 className="text-2xl font-semibold mb-4 text-orange-500">
      Add Skill
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Skill Name"
          placeholder="Enter skill name"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          icon={Code}
          required
          className="w-full border border-gray-300 rounded p-2"
        />

        <div>
          <label className="block mb-1 text-[#BDC3C7]">Level</label>
          <select
            name="level"
            value={formData.level}
            onChange={handleChange}
            className="w-full bg-black border border-orange-500 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {levels.map((level) => (
              <option key={level} value={level} className="bg-black text-orange-500">
                {level}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Skill Image"
          type="file"
          name="file"
          onChange={handleFileChange}
          accept="image/*"
          icon={Image}
          required={!isEditing}
        />

        <div>
          <label className="block mb-1 text-[#BDC3C7]">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full bg-black border border-orange-500 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-black text-orange-500">
                {cat}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded ${
            loading ? "bg-orange-600 cursor-not-allowed" : "bg-orange-600 hover:bg-orange-700"
          } text-white`}
        >
          {loading ?  "Adding..."  : "Add Skill"}
        </button>
      </form>

      {message && <p className="mt-4 text-center text-green-600">{message}</p>}
      {error && <p className="mt-2 text-center text-red-500">{error}</p>}
    </div>
  );
};

export default AddAndUpdateSkill;
