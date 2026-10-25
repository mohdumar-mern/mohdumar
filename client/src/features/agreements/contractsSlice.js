
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAuthHeaders } from "../../utils/AuthHeaders";

const API_URL = import.meta.env.VITE_REACT_APP_BACKEND_API_URL;

// Expected API_URL includes /api/ and ends with "/".
const CONTRACTS_URL = `${(API_URL || "").replace(/\/+$/, "")}/contracts`;

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message || error.message || fallback;

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

// FETCH CONTRACTS
export const fetchContracts = createAsyncThunk(
  "contracts/fetchContracts",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${CONTRACTS_URL}${buildQueryString(params)}`,
        { headers: getAuthHeaders() }
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to fetch contracts.")
      );
    }
  }
);

// FETCH SINGLE CONTRACT
export const fetchContractById = createAsyncThunk(
  "contracts/fetchContractById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${CONTRACTS_URL}/${id}`, {
        headers: getAuthHeaders(),
      });

      return data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to fetch contract.")
      );
    }
  }
);

// CREATE CONTRACT
export const createContract = createAsyncThunk(
  "contracts/createContract",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(CONTRACTS_URL, payload, {
        headers: getAuthHeaders(),
      });

      return data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to create contract.")
      );
    }
  }
);

// UPDATE CONTRACT
// export const updateContract = createAsyncThunk(
//   "contracts/updateContract",
//   async ({ id, ...payload }, { rejectWithValue }) => {
//     try {
//       const { data } = await axios.patch(
//         `${CONTRACTS_URL}/${id}`,
//         payload,
//         { headers: getAuthHeaders() }
//       );

//       return data;
//     } catch (error) {
//       return rejectWithValue(
//         getErrorMessage(error, "Failed to update contract.")
//       );
//     }
//   }
// );

export const updateContract = createAsyncThunk(
    "contracts/updateContract",
    async ({ id, payload }, { rejectWithValue }) => {
      try {
        const response = await axios.patch(
          `${CONTRACTS_URL}/${id}`,
          payload,
          { headers: getAuthHeaders() }
        );
  
        return response.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
          error.message ||
          "Failed to update contract."
        );
      }
    }
  );
  
// DELETE CONTRACT
export const deleteContract = createAsyncThunk(
  "contracts/deleteContract",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`${CONTRACTS_URL}/${id}`, {
        headers: getAuthHeaders(),
      });

      return { id, ...data };
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to delete contract.")
      );
    }
  }
);

// UPDATE CONTRACT STATUS
export const updateContractStatus = createAsyncThunk(
  "contracts/updateContractStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const { data } = await axios.patch(
        `${CONTRACTS_URL}/${id}/status`,
        { status },
        { headers: getAuthHeaders() }
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to update contract status.")
      );
    }
  }
);

// FETCH VERSION HISTORY
export const fetchContractVersions = createAsyncThunk(
  "contracts/fetchContractVersions",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${CONTRACTS_URL}/${id}/versions`,
        { headers: getAuthHeaders() }
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to fetch contract versions.")
      );
    }
  }
);

export const fetchLeadForContract = createAsyncThunk(
    "contracts/fetchLeadForContract",
    async (leadId, { rejectWithValue }) => {
      try {
        const response = await axios.get(
          `${API_URL.replace(/\/+$/, "")}/leads/${leadId}`,
          {
            headers: getAuthHeaders(),
          }
        );
  
        return response.data?.lead || response.data?.data || response.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Unable to load lead details."
        );
      }
    }
  );

// DOWNLOAD CONTRACT PDF

export const downloadContractPdf = createAsyncThunk(
    "contracts/downloadContractPdf",
    async ({ id, contractNumber }, { rejectWithValue }) => {
      try {
        const response = await axios.get(
          `${CONTRACTS_URL}/${id}/pdf`,
          {
            headers: getAuthHeaders(),
            responseType: "blob",
          }
        );
  
        const blob = response.data;
  
        if (!(blob instanceof Blob) || blob.size === 0) {
          throw new Error("The PDF file is empty.");
        }
  
        // Download directly; do not return the Blob to Redux.
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
  
        link.href = url;
        link.download = `${contractNumber || "contract"}.pdf`;
  
        document.body.appendChild(link);
        link.click();
        link.remove();
  
        window.URL.revokeObjectURL(url);
  
        return { id, success: true };
      } catch (error) {
        if (error.response?.data instanceof Blob) {
          const message = await error.response.data.text();
          return rejectWithValue(
            message || "Failed to download contract PDF."
          );
        }
  
        return rejectWithValue(
          error.message || "Failed to download contract PDF."
        );
      }
    }
  );
  

const initialState = {
  contracts: [],
  currentContract: null,
  versions: [],
  pagination: null,
  loading: false,
  detailLoading: false,
  saving: false,
  deleting: false,
  pdfLoading: false,
  error: null,
};

const contractsSlice = createSlice({
  name: "contracts",
  initialState,
  reducers: {
    clearContractError: (state) => {
      state.error = null;
    },
    clearCurrentContract: (state) => {
      state.currentContract = null;
      state.versions = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH LIST
      .addCase(fetchContracts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContracts.fulfilled, (state, action) => {
        state.loading = false;

        const result = action.payload?.data;
        state.contracts = Array.isArray(result?.contracts)
          ? result.contracts
          : Array.isArray(result)
            ? result
            : [];

        state.pagination = result?.pagination || null;
      })
      .addCase(fetchContracts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // FETCH DETAIL
      .addCase(fetchContractById.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchContractById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.currentContract =
          action.payload?.data?.contract ?? action.payload?.data ?? null;
      })
      .addCase(fetchContractById.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload || action.error.message;
      })

      // CREATE
      .addCase(createContract.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createContract.fulfilled, (state, action) => {
        state.saving = false;
        const contract =
          action.payload?.data?.contract ?? action.payload?.data;

        if (contract?._id) {
          state.contracts.unshift(contract);
          state.currentContract = contract;
        }
      })
      .addCase(createContract.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || action.error.message;
      })

      // UPDATE
      .addCase(updateContract.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateContract.fulfilled, (state, action) => {
        state.saving = false;
        const contract =
          action.payload?.data?.contract ?? action.payload?.data;

        if (contract?._id) {
          state.contracts = state.contracts.map((item) =>
            item._id === contract._id ? contract : item
          );
          state.currentContract = contract;
        }
      })
      .addCase(updateContract.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || action.error.message;
      })

      // DELETE
      .addCase(deleteContract.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteContract.fulfilled, (state, action) => {
        state.deleting = false;
        state.contracts = state.contracts.filter(
          (item) => item._id !== action.payload.id
        );

        if (state.currentContract?._id === action.payload.id) {
          state.currentContract = null;
        }
      })
      .addCase(deleteContract.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload || action.error.message;
      })

      // STATUS UPDATE
      .addCase(updateContractStatus.fulfilled, (state, action) => {
        const contract =
          action.payload?.data?.contract ?? action.payload?.data;

        if (contract?._id) {
          state.contracts = state.contracts.map((item) =>
            item._id === contract._id ? contract : item
          );

          if (state.currentContract?._id === contract._id) {
            state.currentContract = contract;
          }
        }
      })
      .addCase(updateContractStatus.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })

      // VERSION HISTORY
      .addCase(fetchContractVersions.fulfilled, (state, action) => {
        state.versions = action.payload?.data?.versions || [];
      })
      .addCase(fetchContractVersions.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })

      // PDF
      .addCase(downloadContractPdf.pending, (state) => {
        state.pdfLoading = true;
        state.error = null;
      })
      .addCase(downloadContractPdf.fulfilled, (state) => {
        state.pdfLoading = false;
      })
      .addCase(downloadContractPdf.rejected, (state, action) => {
        state.pdfLoading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearContractError, clearCurrentContract } =
  contractsSlice.actions;

export default contractsSlice.reducer;
