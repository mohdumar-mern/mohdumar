import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Cog, Image } from "lucide-react";

import { Helmet } from "react-helmet-async";

import { addService } from "../../../features/service/serviceSlice";
import Input from "../../../components/UI/Input/Input";

const AddService = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, message } = useSelector((state) => state.service);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    file: "",
    category: "Frontend",
    status: "active",
  });

  const categories = ["Frontend", "Backend", "Database", "Tools", "Other"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("file", formData.file);
    data.append("category", formData.category);
    data.append("status", formData.status);

    dispatch(addService(data))
      .unwrap()
      .then(() => navigate("/dashboard/services"))
      .catch((err) => {
        console.error("Failed to add service:", err);
      });
  };

  return (
    <>
      <Helmet>
        <title>Add Service | Admin Dashboard</title>
        <meta
          name="description"
          content="Add a new service to the dashboard. Upload image, set category and status."
        />
      </Helmet>

      <div className="max-w-md mx-auto font-mono">
        <button
          onClick={() => navigate("/dashboard/services")}
          className="text-gray-400 hover:text-cyan-400 text-sm uppercase tracking-widest mb-6 inline-flex items-center transition"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back_to_Services
        </button>

        <div className="flex items-center gap-2 text-pink-500 text-[11px] uppercase tracking-widest">
          <span>//</span>
          <span>New_Record</span>
        </div>

        <h2 className="text-2xl font-extrabold uppercase tracking-tight text-white mt-2 mb-6">
          ADD{" "}
          <span className="text-cyan-400 drop-shadow-[0_0_14px_rgba(34,211,238,0.5)]">
            SERVICE
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
            label="Service_Title"
            placeholder="Enter service title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            icon={Cog}
          />

          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter service description"
              required
              rows="4"
              className="w-full px-4 py-3 bg-[#0a0f17] border border-cyan-500/15 text-cyan-100 placeholder-gray-600 text-sm focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/30 transition resize-none"
              style={{
                clipPath: "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)",
              }}
            />
          </div>

          <Input
            label="Service_Image"
            type="file"
            name="file"
            onChange={handleFileChange}
            accept="image/*"
            required
            icon={Image}
          />

          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
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

          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full bg-[#0a0f17] border border-cyan-500/15 text-cyan-100 text-sm px-4 py-3 focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/30 transition"
              style={{
                clipPath: "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)",
              }}
            >
              <option value="active" className="bg-black text-cyan-300">
                Active
              </option>
              <option value="inactive" className="bg-black text-cyan-300">
                Inactive
              </option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-400 text-black font-bold uppercase tracking-widest text-sm py-3 hover:bg-cyan-300 transition disabled:opacity-50"
            style={{ clipPath: "polygon(6% 0, 100% 0, 94% 100%, 0% 100%)" }}
          >
            {loading ? "Adding..." : "Add_Service"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-emerald-400 text-sm">
            {message}
          </p>
        )}
      </div>
    </>
  );
};

export default AddService;