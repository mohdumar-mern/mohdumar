import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  Captions,
  CaptionsIcon,
  ChevronLeft,
  Github,
  Image,
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
        imageUrl: existingProject.imageUrl || ""
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

  // const handleFileChange = useCallback((e) => {
  //   setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
  // }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "file" && value) {
        form.append("file", value);
      } else {
        form.append(key, value);
      }
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
    <div className="max-w-3xl mx-auto p-6 bg-black rounded-lg shadow-md">
      <button
        onClick={() => navigate("/dashboard/projects")}
        className="text-white font-semibold text-lg mb-4 inline-flex items-center"
      >
        <ChevronLeft className="mr-1" />
        Back to Projects
      </button>

      <h2 className="text-2xl font-bold mb-6 text-orange-500">
        {isEditing ? "Update Project" : "Add New Project"}
      </h2>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
      {message && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{message}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        {renderInput({
          label: "Project Title",
          type: "text",
          name: "title",
          placeholder: "Enter project title",
          value: formData.title,
          onChange: handleChange,
          required: true,
          icon: Captions,
        })}

        {/* Description */}
        <div className="space-y-2 relative">
          <label htmlFor="description" className="block font-medium text-[#BDC3C7]">
            Project Description
          </label>
          <CaptionsIcon className="absolute left-3 top-10 text-orange-500 w-5 h-5" />
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter project description"
            rows="4"
            required
            className="w-full pl-10 pr-4 py-2 border text-white bg-transparent border-orange-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none transition"
          />
        </div>

        {renderInput({
          label: "Tech Stack",
          type: "text",
          name: "techStack",
          placeholder: "E.g. React, Node.js, MongoDB",
          value: formData.techStack,
          onChange: handleChange,
          icon: Layers,
        })}

        {renderInput({
          label: "GitHub Link",
          type: "text",
          name: "githubLink",
          placeholder: "https://github.com/your-repo",
          value: formData.githubLink,
          onChange: handleChange,
          icon: Github,
        })}

        {renderInput({
          label: "Live Demo URL",
          type: "text",
          name: "liveDemo",
          placeholder: "https://yourdemo.com",
          value: formData.liveDemo,
          onChange: handleChange,
          icon: Link,
        })}

        {renderInput({
          label: "Project Image Url",
          type: "text",
          name: "imageUrl",
          placeholder: "Enter project image url",
          value: formData.imageUrl,
          onChange: handleChange,
          icon: Link,
        })}

        <div className="text-center pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition duration-300 disabled:opacity-50"
          >
            {loading
              ? isEditing
                ? "Updating..."
                : "Adding..."
              : isEditing
              ? "Update Project"
              : "Add Project"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectAddUpdate;
