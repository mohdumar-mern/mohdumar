import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAuthHeaders } from "../../utils/AuthHeaders";

const API_URL = import.meta.env.VITE_REACT_APP_BACKEND_API_URL;

// — Fetch Profile
export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}profile`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile"
      );
    }
  }
);

// — Fetch Avatar
export const fetchAvatar = createAsyncThunk(
  "profile/fetchAvatar",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}profile/avatar`);
      return data; // { avatar: url, message? }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch avatar"
      );
    }
  }
);

// — Fetch Resume (PDF blob)
export const fetchResume = createAsyncThunk(
  "profile/fetchResume",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}profile/resume`, {
        responseType: "blob",
      });

      const blob = new Blob([res.data], {
        type: res.headers["content-type"] || "application/pdf",
      });

      const url = URL.createObjectURL(blob); // ✅ convert to URL
      return url;
    } catch (err) {
      console.log(err)
      return rejectWithValue("Failed to fetch resume");
    }
  }
);



// — Fetch Social Links
export const fetchSocialLinks = createAsyncThunk(
  "profile/fetchSocialLinks",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}profile/social-links`);
      return data; // { socialLinks: {...}, message? }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch social links"
      );
    }
  }
);

// — Add Profile
export const addProfile = createAsyncThunk(
  "profile/addProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const { data } = await axios.post(`${API_URL}profile/add`, formData, {
        headers,
      });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add profile"
      );
    }
  }
);

// — Update Profile
export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      const { data: resData } = await axios.put(
        `${API_URL}profile/${id}/edit`,
        data,
        { headers }
      );
      return resData;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  }
);

// — Initial state
const initialState = {
  profile: null,
  avatar: null,
  resume: null,        // will hold the blob URL
  socialLinks: null,
  loading: false,
  error: null,
  message: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // — fetchProfile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.profile = payload.data;
        state.message = payload.message || "Fetched profile successfully";
      })
      .addCase(fetchProfile.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // — fetchAvatar
      .addCase(fetchAvatar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvatar.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.avatar = payload.avatar;
        state.message = payload.message || "Fetched avatar successfully";
      })
      .addCase(fetchAvatar.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // — fetchResume
      .addCase(fetchResume.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResume.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.resume = payload; // now it's a serializable string URL
        state.message = "Fetched resume successfully";
      })      
      .addCase(fetchResume.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // — fetchSocialLinks
      .addCase(fetchSocialLinks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSocialLinks.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.socialLinks = payload.socialLinks;
        state.message =
          payload.message || "Fetched social links successfully";
      })
      .addCase(fetchSocialLinks.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // — addProfile
      .addCase(addProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProfile.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.profile = payload.data;
        state.message = payload.message || "Profile added successfully";
      })
      .addCase(addProfile.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // — updateProfile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.profile = payload.data;
        state.message = payload.message || "Profile updated successfully";
      })
      .addCase(updateProfile.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export default profileSlice.reducer;
