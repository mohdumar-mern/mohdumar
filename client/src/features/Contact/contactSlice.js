import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_REACT_APP_BACKEND_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// Send contact request
export const sendContactRequest = createAsyncThunk(
  "contact/sendContactRequest",
  async (contactData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}contacts/add`, contactData, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      const err = error.response?.data;
      return rejectWithValue(
        err?.message ||
          err?.errors?.[0]?.msg ||
          error.message ||
          "Failed to send message"
      );
    }
  }
);

// Fetch paginated contacts
export const fetchContacts = createAsyncThunk(
  "contact/fetchContacts",
  async ({ page = 1, limit = 6 } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}contacts/?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch contacts"
      );
    }
  }
);

// Fetch single contact
export const fetchSingleContact = createAsyncThunk(
  "contact/fetchSingleContact",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}contacts/${id}/view`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch contact"
      );
    }
  }
);

// Delete contact
export const deleteContactMessage = createAsyncThunk(
  "contact/deleteContactMessage",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}contacts/${id}`);
      return response.data;
    } catch (error) {
      const err = error.response?.data;
      return rejectWithValue(err?.error || err?.message || error.message);
    }
  }
);

// Initial state
const initialState = {
  contacts: [],
  contact: null,
  loading: false,
  error: null,
  message: null,
  totalContacts: 0,
  totalPages: 0,
  currentPage: 1,
  contactPerPage: 6,
};

// Slice
const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {
    clearContactStatus: (state) => {
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Send contact
      .addCase(sendContactRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(sendContactRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || "Message sent successfully.";
      })
      .addCase(sendContactRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong.";
      })

      // Fetch contacts
      .addCase(fetchContacts.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        const { data, totalDocs, totalPages, currentPage, limit } =
          action.payload;
        state.contacts = data;
        state.totalContacts = totalDocs;
        state.totalPages = totalPages;
        state.currentPage = currentPage;
        state.contactPerPage = limit;
        state.loading = false;
        state.message = "Contacts fetched successfully.";
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.loading = false;
        state.contacts = [];
        state.error = action.payload || "Failed to fetch contacts.";
      })

      // Fetch single contact
      .addCase(fetchSingleContact.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(fetchSingleContact.fulfilled, (state, action) => {
        state.contact = action.payload.contact;
        state.loading = false;
        state.message = action.payload.message || "Contact fetched successfully.";
      })
      .addCase(fetchSingleContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch contact.";
      })

      // Delete contact
      .addCase(deleteContactMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteContactMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.message =
          action.payload.message || "Contact message deleted successfully.";
        state.contacts = state.contacts.filter(
          (contact) => contact._id !== action.meta.arg
        );
      })
      .addCase(deleteContactMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete contact message.";
      });
  },
});

export const { clearContactStatus } = contactSlice.actions;
export default contactSlice.reducer;
