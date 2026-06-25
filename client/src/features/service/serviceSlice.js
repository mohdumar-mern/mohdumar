import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Base API URL from .env
const API_URL = import.meta.env.VITE_REACT_APP_BACKEND_API_URL;

// Async Thunks

// Fetch all services
export const fetchServices = createAsyncThunk("services/fetchServices", async (_, thunkAPI) => {
  try {
    const response = await axios.get(`${API_URL}services`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch services");
  }
});

// Fetch service by ID
export const fetchSingleService = createAsyncThunk("services/fetchSingleService", async (id, thunkAPI) => {
  try {
    const response = await axios.get(`${API_URL}services/${id}/view`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch service");
  }
});

// Add service
export const addService = createAsyncThunk("services/addService", async (serviceData, thunkAPI) => {
  try {
    const response = await axios.post(`${API_URL}services/add`, serviceData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to add service");
  }
});

// Update service
export const updateservice = createAsyncThunk("services/updateservice", async ({ id, serviceData }, thunkAPI) => {
  try {
    const response = await axios.put(`${API_URL}services/${id}`, serviceData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to update service");
  }
});

// Delete service
export const deleteservice = createAsyncThunk("services/deleteservice", async (id, thunkAPI) => {
  try {
    await axios.delete(`${API_URL}services/${id}`);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to delete service");
  }
});

// Slice
const serviceSlice = createSlice({
  name: "services",
  initialState: {
    services: [],
    service: null,
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    resetservicesState: (state) => {
      state.services = [];
      state.service = null;
      state.loading = false;
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all services
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.services = action.payload.data;
        state.message = action.payload.message || "service fetched successfully";
        state.loading = false;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.error = action.payload.message || "Failed to fetch services";
        state.loading = false;
      })

      // Fetch single service
      .addCase(fetchSingleService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSingleService.fulfilled, (state, action) => {
        state.service = action.payload.data;
        state.loading = false;
      })
      .addCase(fetchSingleService.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // Add service
      .addCase(addService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addService.fulfilled, (state, action) => {
        state.services.unshift(action.payload.service);
        state.message = action.payload.message;
        state.loading = false;
      })
      .addCase(addService.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // Update service
      .addCase(updateservice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateservice.fulfilled, (state, action) => {
        const index = state.services.findIndex(service => service._id === action.payload._id);
        if (index !== -1) state.services[index] = action.payload;
        state.message = action.payload.message;
        state.loading = false;
      })
      .addCase(updateservice.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // Delete service
      .addCase(deleteservice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteservice.fulfilled, (state, action) => {
        state.services = state.services.filter(service => service._id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteservice.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { resetservicesState } = serviceSlice.actions;
export default serviceSlice.reducer;
