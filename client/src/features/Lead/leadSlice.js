
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAuthHeaders } from "../../utils/AuthHeaders";

const API_URL = import.meta.env.VITE_REACT_APP_BACKEND_API_URL;

// Ensure the base URL ends with "/" and includes your API prefix if required.
const LEADS_URL = `${API_URL || ""}leads`;

// Extract a useful error message from the backend.
const getErrorMessage = (error, fallback) =>
  error.response?.data?.message ||
  error.message ||
  fallback;

// Query string builder for pagination, search and filters.
const buildQueryString = (params = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  });

  const queryString = query.toString();

  return queryString ? `?${queryString}` : "";
};

// FETCH LEADS
export const fetchLeads = createAsyncThunk(
  "leads/fetchLeads",
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryString = buildQueryString(params);

      const { data } = await axios.get(
        `${LEADS_URL}${queryString}`,
        { headers: getAuthHeaders() }
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to fetch leads.")
      );
    }
  }
);

// FETCH SINGLE LEAD
export const fetchLeadById = createAsyncThunk(
  "leads/fetchLeadById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${LEADS_URL}/${encodeURIComponent(id)}`,
        { headers: getAuthHeaders() }
      );

      return data.data.lead;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to fetch lead.")
      );
    }
  }
);

// CREATE LEAD
export const createLead = createAsyncThunk(
  "leads/createLead",
  async (leadPayload, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        LEADS_URL,
        leadPayload,
        { headers: getAuthHeaders() }
      );

      return data.data.lead;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to create lead.")
      );
    }
  }
);

// UPDATE LEAD
export const updateLead = createAsyncThunk(
  "leads/updateLead",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const { data } = await axios.patch(
        `${LEADS_URL}/${encodeURIComponent(id)}`,
        updates,
        { headers: getAuthHeaders() }
      );

      return data.data.lead;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to update lead.")
      );
    }
  }
);

// DELETE LEAD
export const deleteLead = createAsyncThunk(
  "leads/deleteLead",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(
        `${LEADS_URL}/${encodeURIComponent(id)}`,
        { headers: getAuthHeaders() }
      );

      return { id, leadId: data.data?.leadId };
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to delete lead.")
      );
    }
  }
);

// ADD CONTACT HISTORY
export const addContactHistory = createAsyncThunk(
  "leads/addContactHistory",
  async ({ id, contact }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${LEADS_URL}/${encodeURIComponent(id)}/contact-history`,
        contact,
        { headers: getAuthHeaders() }
      );

      return data.data.lead;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to add contact history.")
      );
    }
  }
);

const initialState = {
  leads: [],
  selectedLead: null,

  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },

  loading: false,
  detailsLoading: false,
  creating: false,
  updating: false,
  deleting: false,
  contactHistoryLoading: false,

  error: null,
  detailsError: null,
};

const leadSlice = createSlice({
  name: "leads",
  initialState,

  reducers: {
    clearLeadError: (state) => {
      state.error = null;
    },

    clearLeadDetailsError: (state) => {
      state.detailsError = null;
    },

    setSelectedLead: (state, action) => {
      state.selectedLead = action.payload;
    },

    clearSelectedLead: (state) => {
      state.selectedLead = null;
      state.detailsError = null;
    },

    resetLeads: () => initialState,
  },

  extraReducers: (builder) => {
    builder
      // FETCH LEADS
      .addCase(fetchLeads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.loading = false;
        state.leads = action.payload.data?.leads || [];
        state.pagination =
          action.payload.pagination || initialState.pagination;
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to fetch leads.";
      })

      // FETCH SINGLE LEAD
      .addCase(fetchLeadById.pending, (state) => {
        state.detailsLoading = true;
        state.detailsError = null;
      })
      .addCase(fetchLeadById.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.selectedLead = action.payload;
      })
      .addCase(fetchLeadById.rejected, (state, action) => {
        state.detailsLoading = false;
        state.detailsError =
          action.payload || "Failed to fetch lead.";
      })

      // CREATE LEAD
      .addCase(createLead.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createLead.fulfilled, (state, action) => {
        state.creating = false;

        // Avoid duplicates if the same record is already present.
        const exists = state.leads.some(
          (lead) => lead._id === action.payload._id
        );

        if (!exists && state.pagination.page === 1) {
          state.leads.unshift(action.payload);
        }

        state.selectedLead = action.payload;
        state.pagination.total += 1;
      })
      .addCase(createLead.rejected, (state, action) => {
        state.creating = false;
        state.error =
          action.payload || "Failed to create lead.";
      })

      // UPDATE LEAD
      .addCase(updateLead.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateLead.fulfilled, (state, action) => {
        state.updating = false;

        const updatedLead = action.payload;

        state.leads = state.leads.map((lead) =>
          lead._id === updatedLead._id ? updatedLead : lead
        );

        if (state.selectedLead?._id === updatedLead._id) {
          state.selectedLead = updatedLead;
        }
      })
      .addCase(updateLead.rejected, (state, action) => {
        state.updating = false;
        state.error =
          action.payload || "Failed to update lead.";
      })

      // DELETE LEAD
      .addCase(deleteLead.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteLead.fulfilled, (state, action) => {
        state.deleting = false;

        state.leads = state.leads.filter(
          (lead) => lead._id !== action.payload.id
        );

        if (
          state.selectedLead?._id === action.payload.id
        ) {
          state.selectedLead = null;
        }

        state.pagination.total = Math.max(
          0,
          state.pagination.total - 1
        );
      })
      .addCase(deleteLead.rejected, (state, action) => {
        state.deleting = false;
        state.error =
          action.payload || "Failed to delete lead.";
      })

      // ADD CONTACT HISTORY
      .addCase(addContactHistory.pending, (state) => {
        state.contactHistoryLoading = true;
        state.error = null;
      })
      .addCase(addContactHistory.fulfilled, (state, action) => {
        state.contactHistoryLoading = false;

        const updatedLead = action.payload;

        state.leads = state.leads.map((lead) =>
          lead._id === updatedLead._id ? updatedLead : lead
        );

        if (state.selectedLead?._id === updatedLead._id) {
          state.selectedLead = updatedLead;
        }
      })
      .addCase(addContactHistory.rejected, (state, action) => {
        state.contactHistoryLoading = false;
        state.error =
          action.payload || "Failed to add contact history.";
      });
  },
});

export const {
  clearLeadError,
  clearLeadDetailsError,
  setSelectedLead,
  clearSelectedLead,
  resetLeads,
} = leadSlice.actions;

export default leadSlice.reducer;
