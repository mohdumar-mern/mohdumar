import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Base API URL from .env
const API_URL = import.meta.env.VITE_REACT_APP_BACKEND_API_URL;

// Async Thunks

// Fetch all skills
export const fetchSkills = createAsyncThunk("skills/fetchSkills", async (_, thunkAPI) => {
  try {
    const response = await axios.get(`${API_URL}skills`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch skills");
  }
});

// Fetch skill by ID
export const fetchSingleSkill = createAsyncThunk("skills/fetchSingleSkill", async (id, thunkAPI) => {
  try {
    const response = await axios.get(`${API_URL}skills/${id}/view`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch skill");
  }
});

// Add skill
export const addSkill = createAsyncThunk("skills/addSkill", async (skillData, thunkAPI) => {
  try {
    const response = await axios.post(`${API_URL}skills/add`, skillData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to add skill");
  }
});

// Update skill
export const updateSkill = createAsyncThunk("skills/updateSkill", async ({ id, skillData }, thunkAPI) => {
  try {
    const response = await axios.put(`${API_URL}skills/${id}/edit`, skillData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to update skill");
  }
});

// Delete skill
export const deleteSkill = createAsyncThunk("skills/deleteSkill", async (id, thunkAPI) => {
  try {
    await axios.delete(`${API_URL}skills/${id}`);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to delete skill");
  }
});

// Slice
const skillsSlice = createSlice({
  name: "skills",
  initialState: {
    skills: [],
    skill: null,
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    resetSkillsState: (state) => {
      state.error = null;
      state.message = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all skills
      .addCase(fetchSkills.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSkills.fulfilled, (state, action) => {
        state.skills = action.payload.data;
        state.message = action.payload.message || "Skill fetched successfully";
        state.loading = false;
      })
      .addCase(fetchSkills.rejected, (state, action) => {
        state.error = action.payload.message || "Failed to fetch skills";
        state.loading = false;
      })

      // Fetch single skill
      .addCase(fetchSingleSkill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSingleSkill.fulfilled, (state, action) => {
        state.skill = action.payload.data;
        state.loading = false;
      })
      .addCase(fetchSingleSkill.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // Add skill
      .addCase(addSkill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSkill.fulfilled, (state, action) => {
        state.skills.unshift(action.payload.skill);
        state.message = action.payload.message;
        state.loading = false;
      })
      .addCase(addSkill.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // Update skill
      .addCase(updateSkill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSkill.fulfilled, (state, action) => {
        const index = state.skills.findIndex(skill => skill._id === action.payload._id);
        if (index !== -1) state.skills[index] = action.payload;
        state.message = action.payload.message;
        state.loading = false;
      })
      .addCase(updateSkill.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // Delete skill
      .addCase(deleteSkill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSkill.fulfilled, (state, action) => {
        state.skills = state.skills.filter(skill => skill._id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteSkill.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { resetSkillsState } = skillsSlice.actions;
export default skillsSlice.reducer;
