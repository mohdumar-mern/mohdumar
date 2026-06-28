import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { getAuthHeaders } from "../../utils/AuthHeaders";


const API_URL = import.meta.env.VITE_REACT_APP_BACKEND_API_URL;

// Get all blogs (public)
export const fetchBlogs = createAsyncThunk(
  "blog/fetchBlogs",
  async ({ page = 1, limit = 10, tag = "", search = "" } = {}, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${API_URL}blogs?page=${page}&limit=${limit}&tag=${tag}&search=${search}`
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch blogs");
    }
  }
);

// Get single blog by slug
export const fetchBlogBySlug = createAsyncThunk(
  "blog/fetchBlogBySlug",
  async (slug, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}blogs/${slug}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Blog not found");
    }
  }
);

// Get admin blogs
export const fetchAdminBlogs = createAsyncThunk(
  "blog/fetchAdminBlogs",
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${API_URL}blogs/admin/all?page=${page}&limit=${limit}`,
        {
          headers: getAuthHeaders(), // ← yeh use karo
        }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch blogs");
    }
  }
);
// Create blog
export const createBlog = createAsyncThunk(
  "blog/createBlog",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}blogs`, data, {
        headers: getAuthHeaders(), // ← yeh use karo
    });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create blog");
    }
  }
);

// Update blog
export const updateBlog = createAsyncThunk(
  "blog/updateBlog",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${API_URL}blogs/${id}`, data, {
        headers: getAuthHeaders(), // ← yeh use karo
    });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update blog");
    }
  }
);

// Delete blog
export const deleteBlog = createAsyncThunk(
  "blog/deleteBlog",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}blogs/${id}`, {
        headers: getAuthHeaders(), // ← yeh use karo
    });
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete blog");
    }
  }
);

// Get tags
export const fetchTags = createAsyncThunk(
  "blog/fetchTags",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}blogs/tags`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch tags");
    }
  }
);

const blogSlice = createSlice({
  name: "blog",
  initialState: {
    blogs: [],
    blog: null,
    tags: [],
    pagination: null,
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    clearBlogStatus(state) {
      state.error = null;
      state.message = null;
    },
    clearBlog(state) {
      state.blog = null;
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state) => {
      state.loading = true;
      state.error = null;
    };
    const handleRejected = (state, action) => {
      state.loading = false;
      state.error = action.payload;
    };

    builder
      // Fetch blogs
      .addCase(fetchBlogs.pending, handlePending)
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload.blogs;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchBlogs.rejected, handleRejected)

      // Fetch blog by slug
      .addCase(fetchBlogBySlug.pending, handlePending)
      .addCase(fetchBlogBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.blog = action.payload.blog;
      })
      .addCase(fetchBlogBySlug.rejected, handleRejected)

      // Fetch admin blogs
      .addCase(fetchAdminBlogs.pending, handlePending)
      .addCase(fetchAdminBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload.blogs;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAdminBlogs.rejected, handleRejected)

      // Create blog
      .addCase(createBlog.pending, handlePending)
      .addCase(createBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(createBlog.rejected, handleRejected)

      // Update blog
      .addCase(updateBlog.pending, handlePending)
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(updateBlog.rejected, handleRejected)

      // Delete blog
      .addCase(deleteBlog.pending, handlePending)
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = state.blogs.filter((b) => b._id !== action.payload);
        state.message = "Blog deleted successfully";
      })
      .addCase(deleteBlog.rejected, handleRejected)

      // Fetch tags
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.tags = action.payload.tags;
      });
  },
});

export const { clearBlogStatus, clearBlog } = blogSlice.actions;
export default blogSlice.reducer;