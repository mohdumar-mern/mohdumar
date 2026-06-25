import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAuthHeaders } from "../../utils/AuthHeaders";

const API_URL = import.meta.env.VITE_REACT_APP_BACKEND_API_URL;

// Fetch paginated projects
export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async ({ page = 1, limit = 6 } = {}, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}projects/?page=${page}&limit=${limit}`, );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

// Fetch single project
export const fetchSingleProject = createAsyncThunk(
  "projects/fetchSingleProject",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}projects/${id}/view`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

// Add a new project
export const addProject = createAsyncThunk(
  "projects/addProject",
  async (projectData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}projects/add`, projectData, {
        headers: getAuthHeaders(),
      });
      console.log(response)
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

// Update project
export const updateProject = createAsyncThunk(
  "projects/updateProject",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const response = await axios.put(`${API_URL}projects/${id}/edit`, data, { headers });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


// Delete a project
export const deleteProject = createAsyncThunk(
  "projects/deleteProject",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}projects/${id}`, {
        headers: getAuthHeaders(),
      });
      return id;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

// Initial State
const initialState = {
  projects: [],
  project: null,
  loading: false,
  error: null,
  message: null,
  totalProjects: 0,
  totalPages: 0,
  currentPage: 1,
  projectsPerPage: 6,
};

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    clearProjectState: (state) => {
      state.project = null;
      state.message = null;
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // Fetch projects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        const { data, totalDocs, totalPages, currentPage, limit } = action.payload;
        state.projects = data;
        state.totalProjects = totalDocs;
        state.totalPages = totalPages;
        state.currentPage = currentPage;
        state.projectsPerPage = limit;
        state.loading = false;
        state.message = "Projects fetched successfully.";
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.projects = [];
        state.error = action.payload;
      })

      // Fetch single project
      .addCase(fetchSingleProject.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.project = null;
      })
      .addCase(fetchSingleProject.fulfilled, (state, action) => {
        state.loading = false;
        state.project = action.payload.data;
        state.message = "Project fetched successfully.";
      })
      .addCase(fetchSingleProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add project
      .addCase(addProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects.unshift(action.payload); // optional: update UI optimistically
        state.message = "Project added successfully.";
      })
      .addCase(addProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update project
.addCase(updateProject.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(updateProject.fulfilled, (state, action) => {
  state.loading = false;
  state.message = "Project updated successfully.";

  // Update the specific project in the projects list
  const index = state.projects.findIndex(p => p._id === action.payload._id);
  if (index !== -1) {
    state.projects[index] = action.payload;
  }

  // Optionally also update the `project` state if you're using it
  state.project = action.payload;
})
.addCase(updateProject.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})


      // Delete project
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = state.projects.filter((proj) => proj._id !== action.payload);
        state.message = "Project deleted successfully.";
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProjectState, clearError, clearMessage } = projectSlice.actions;
export default projectSlice.reducer;
