import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  Captions,
  CaptionsIcon,
  ChevronLeft,
  Github,
  Layers,
  Link,
} from "lucide-react";

import Input from "../../../components/UI/Input/Input";
import {
  addProject,
  updateProject,
  clearError,
  clearMessage,
} from "../../../features/Project/projectSlice";

const ProjectAddUpdate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const { loading, error, message, projects } = useSelector(
    (state) => state.project
  );
  const existingProject = projects.find((p) => p._id === id);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    techStack: "",
    githubLink: "",
    liveDemo: "",
    imageUrl: "",
  });

  useEffect(() => {
    if (isEditing && existingProject) {
      setFormData({
        title: existingProject.title || "",
        description: existingProject.description || "",
        techStack: existingProject.techStack || "",
        githubLink: existingProject.githubLink || "",
        liveDemo: existingProject.liveDemo || "",
        imageUrl: existingProject.imageUrl || "",
      });
    }
  }, [isEditing, existingProject]);

  useEffect(() => {
    if (message || error) {
      const timeout = setTimeout(() => {
        dispatch(clearMessage());
        dispatch(clearError());
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [message, error, dispatch]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, value);
    });

    try {
      if (isEditing) {
        await dispatch(updateProject({ id, data: form })).unwrap();
      } else {
        await dispatch(addProject(form)).unwrap();
      }
      setTimeout(() => navigate("/dashboard/projects"), 1000);
    } catch (err) {
      console.error("Failed to submit project:", err);
    }
  };

  const renderInput = (props) => <Input {...props} />;

  return (
    <div className="max-w-3xl mx-auto font-mono">
      <button
        onClick={() => navigate("/dashboard/projects")}
        className="text-gray-400 hover:text-cyan-400 text-sm uppercase tracking-widest mb-6 inline-flex items-center transition"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back_to_Projects
      </button>

      <div className="flex items-center gap-2 text-pink-500 text-[11px] uppercase tracking-widest">
        <span>//</span>
        <span>{isEditing ? "Modify_Record" : "New_Record"}</span>
      </div>

      <h2 className="text-2xl font-extrabold uppercase tracking-tight text-white mt-2 mb-6">
        {isEditing ? (
          <>
            UPDATE{" "}
            <span className="text-cyan-400 drop-shadow-[0_0_14px_rgba(34,211,238,0.5)]">
              PROJECT
            </span>
          </>
        ) : (
          <>
            ADD{" "}
            <span className="text-cyan-400 drop-shadow-[0_0_14px_rgba(34,211,238,0.5)]">
              PROJECT
            </span>
          </>
        )}
      </h2>

      {error && (
        <div className="mb-4 px-4 py-3 border border-pink-500/30 bg-pink-500/10 text-pink-300 text-sm">
          {error}
        </div>
      )}
      {message && (
        <div className="mb-4 px-4 py-3 border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-sm">
          {message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 border border-cyan-500/15 bg-gradient-to-b from-cyan-950/10 to-black p-6 sm:p-8"
        style={{
          clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)",
        }}
      >
        {renderInput({
          label: "Project_Title",
          type: "text",
          name: "title",
          placeholder: "Enter project title",
          value: formData.title,
          onChange: handleChange,
          required: true,
          icon: Captions,
        })}

        {/* Description */}
        <div className="relative">
          <label
            htmlFor="description"
            className="block text-xs uppercase tracking-widest text-gray-500 mb-2"
          >
            Project_Description
          </label>
          <div className="relative">
            <CaptionsIcon className="absolute left-3 top-3.5 z-10 pointer-events-none text-pink-400 w-4 h-4" />
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter project description"
              rows="4"
              required
              className="w-full pl-10 pr-4 py-3 bg-[#0a0f17] border border-cyan-500/15 text-cyan-100 placeholder-gray-600 text-sm focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/30 transition resize-none"
              style={{
                clipPath: "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)",
              }}
            />
          </div>
        </div>

        {renderInput({
          label: "Tech_Stack",
          type: "text",
          name: "techStack",
          placeholder: "E.g. React, Node.js, MongoDB",
          value: formData.techStack,
          onChange: handleChange,
          icon: Layers,
        })}

        {renderInput({
          label: "Github_Link",
          type: "text",
          name: "githubLink",
          placeholder: "https://github.com/your-repo",
          value: formData.githubLink,
          onChange: handleChange,
          icon: Github,
        })}

        {renderInput({
          label: "Live_Demo_URL",
          type: "text",
          name: "liveDemo",
          placeholder: "https://yourdemo.com",
          value: formData.liveDemo,
          onChange: handleChange,
          icon: Link,
        })}

        {renderInput({
          label: "Project_Image_URL",
          type: "text",
          name: "imageUrl",
          placeholder: "Enter project image url",
          value: formData.imageUrl,
          onChange: handleChange,
          icon: Link,
        })}

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-400 text-black font-bold uppercase tracking-widest text-sm py-3 hover:bg-cyan-300 transition disabled:opacity-50"
            style={{ clipPath: "polygon(6% 0, 100% 0, 94% 100%, 0% 100%)" }}
          >
            {loading
              ? isEditing
                ? "Updating..."
                : "Adding..."
              : isEditing
              ? "Update_Project"
              : "Add_Project"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectAddUpdate;