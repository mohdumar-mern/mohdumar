
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import toast from "react-hot-toast";

import AgreementClauseEditor from "../components/AgreementClauseEditor";
import {
  createContract,
  updateContract,
  fetchContractById,
  clearCurrentContract,
  clearContractError,
  fetchLeadForContract,
} from "../../../features/agreements/contractsSlice";

import "./ContractForm.css";
import { defaultFreelanceClauses } from "./defaultClause";

const createInitialForm = () => ({
  title: "",
  clientName: "",
  clientEmail: "",
  freelancerName: "",
  projectDescription: "",
  paymentAmount: "",
  currency: "USD",
  paymentTerms: "",
  startDate: "",
  endDate: "",
  clauses: defaultFreelanceClauses.map((clause) => ({
    ...clause,
    id: crypto.randomUUID(),
  })),
});

const toDateInput = (value) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

const getErrorMessage = (error) => {
  if (typeof error === "string") return error;

  return (
    error?.message ||
    error?.error ||
    "Something went wrong. Please try again."
  );
};

export default function ContractForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const leadId = searchParams.get("leadId");

  const { id } = useParams();
  const isEditMode = Boolean(id);

  const {
    currentContract,
    detailLoading,
    saving,
    error,
  } = useSelector((state) => state.contracts);

  const [form, setForm] = useState(createInitialForm);
  const [loadedContractId, setLoadedContractId] = useState(null);
  const [pageError, setPageError] = useState("");

  // Both sections stay collapsed when the page opens.
  const [contractInfoOpen, setContractInfoOpen] = useState(false);

  useEffect(() => {
    dispatch(clearContractError());
    dispatch(clearCurrentContract());

    setLoadedContractId(null);
    setPageError("");

    if (isEditMode) {
      dispatch(fetchContractById(id));
    } else {
      setForm(createInitialForm());
    }

    return () => {
      dispatch(clearCurrentContract());
    };
  }, [dispatch, id, isEditMode]);

  // Prefill client details when opened from a lead.
  useEffect(() => {
    if (isEditMode || !leadId) return;

    let cancelled = false;

    const loadLead = async () => {
      try {
        const response = await dispatch(
          fetchLeadForContract(leadId)
        ).unwrap();

        if (cancelled) return;

        const lead =
          response?.lead ||
          response?.data?.lead ||
          response?.data ||
          response;

        setForm((previous) => ({
          ...previous,
          clientName:
            lead?.name ||
            lead?.fullName ||
            lead?.clientName ||
            previous.clientName,
          clientEmail:
            lead?.email ||
            lead?.clientEmail ||
            previous.clientEmail,
        }));
      } catch (loadError) {
        if (!cancelled) {
          setPageError(getErrorMessage(loadError));
        }
      }
    };

    loadLead();

    return () => {
      cancelled = true;
    };
  }, [dispatch, isEditMode, leadId]);

  // Populate form when an existing contract is loaded.
  useEffect(() => {
    if (!isEditMode || !currentContract?._id) return;
    if (String(currentContract._id) !== String(id)) return;
    if (loadedContractId === String(currentContract._id)) return;

    setForm({
      title: currentContract.title || "",
      clientName: currentContract.clientName || "",
      clientEmail: currentContract.clientEmail || "",
      freelancerName: currentContract.freelancerName || "",
      projectDescription: currentContract.projectDescription || "",
      paymentAmount: currentContract.paymentAmount ?? "",
      currency: currentContract.currency || "USD",
      paymentTerms: currentContract.paymentTerms || "",
      startDate: toDateInput(currentContract.startDate),
      endDate: toDateInput(currentContract.endDate),
      clauses: (currentContract.clauses || []).map((clause) => ({
        ...clause,
        id: clause._id || clause.id || crypto.randomUUID(),
        title: clause.title || "",
        content: clause.content || "",
      })),
    });

    setLoadedContractId(String(currentContract._id));
  }, [currentContract, id, isEditMode, loadedContractId]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleClausesChange = (clauses) => {
    setForm((previous) => ({
      ...previous,
      clauses,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setPageError("");

    if (!form.title.trim()) {
      setPageError("Contract title is required.");
      setContractInfoOpen(true);
      return;
    }

    if (!form.clientName.trim()) {
      setPageError("Client name is required.");
      setContractInfoOpen(true);
      return;
    }

    if (
      form.paymentAmount === "" ||
      !Number.isFinite(Number(form.paymentAmount)) ||
      Number(form.paymentAmount) < 0
    ) {
      setPageError("Enter a valid payment amount.");
      setContractInfoOpen(true);
      return;
    }

    if (
      form.startDate &&
      form.endDate &&
      new Date(form.endDate) < new Date(form.startDate)
    ) {
      setPageError("End date cannot be before start date.");
      setContractInfoOpen(true);
      return;
    }

    const payload = {
      ...form,
      leadId: isEditMode
        ? currentContract?.leadId?._id ||
          currentContract?.leadId ||
          null
        : leadId || null,
      title: form.title.trim(),
      clientName: form.clientName.trim(),
      clientEmail: form.clientEmail.trim(),
      freelancerName: form.freelancerName.trim(),
      paymentAmount: Number(form.paymentAmount),
      clauses: form.clauses.map((clause) => ({
        ...(clause._id ? { _id: clause._id } : {}),
        id: clause.id,
        title: clause.title,
        content: clause.content,
      })),
    };

    try {
      let result;

      if (isEditMode) {
        result = await dispatch(
          updateContract({ id, payload })
        ).unwrap();

        toast.success("Contract updated successfully.");
      } else {
        result = await dispatch(
          createContract(payload)
        ).unwrap();

        toast.success("Contract created successfully.");
      }

      const savedContract =
        result?.contract || result?.data || result;

      const savedId = savedContract?._id || id;

      if (!savedId) {
        navigate("/dashboard/agreements");
        return;
      }

      navigate(`/dashboard/agreements/${savedId}`);
    } catch (submitError) {
      setPageError(getErrorMessage(submitError));
      setContractInfoOpen(true);
    }
  };

  if (isEditMode && detailLoading && !loadedContractId) {
    return (
      <div className="contract-form-state">
        Loading contract details...
      </div>
    );
  }

  if (isEditMode && !detailLoading && !loadedContractId) {
    return (
      <div className="contract-form-state">
        <p>
          {error ||
            "Contract could not be loaded. Check its ID and permissions."}
        </p>

        <button
          type="button"
          className="contract-form-secondary"
          onClick={() => navigate("/dashboard/agreements")}
        >
          Back to Contracts
        </button>
      </div>
    );
  }

  return (
    <main className="contract-form-page">
      <header className="contract-form-header">
        <div>
          <p className="contract-form-eyebrow">
            CONTRACT MANAGEMENT
          </p>

          <h1>
            {isEditMode ? "Edit Contract" : "Create Contract"}
          </h1>

          <p>
            {isEditMode
              ? "Update agreement details and save your changes."
              : "Enter agreement details and customize your clauses."}
          </p>
        </div>

        <button
          type="button"
          className="contract-form-secondary"
          onClick={() =>
            navigate(
              isEditMode
                ? `/dashboard/agreements/${id}`
                : "/dashboard/agreements"
            )
          }
        >
          Cancel
        </button>
      </header>

      {(pageError || error) && (
        <div className="contract-form-error" role="alert">
          {pageError || error}
        </div>
      )}

      <form className="contract-form" onSubmit={handleSubmit}>
        <section className="contract-form-section">
          <button
            type="button"
            className="contract-form-section-toggle"
            onClick={() =>
              setContractInfoOpen((open) => !open)
            }
            aria-expanded={contractInfoOpen}
          >
            <span className="contract-section-heading">
              <span className="contract-section-number">
                01
              </span>

              <span className="contract-section-copy">
                <strong>Contract Information</strong>
                <small>
                  Client, payment, dates and project details
                </small>
              </span>
            </span>

            <span className="contract-section-toggle-right">
              {contractInfoOpen ? "Hide" : "Show"}
              <span
                className={`contract-chevron ${
                  contractInfoOpen ? "is-open" : ""
                }`}
              >
                ▼
              </span>
            </span>
          </button>

          {contractInfoOpen && (
            <div className="contract-form-section-content">
              <div className="contract-form-grid">
                <label className="contract-form-field">
                  Contract Title *
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    maxLength={200}
                    required
                  />
                </label>

                <label className="contract-form-field">
                  Client Name *
                  <input
                    name="clientName"
                    value={form.clientName}
                    onChange={handleChange}
                    maxLength={200}
                    required
                  />
                </label>

                <label className="contract-form-field">
                  Client Email
                  <input
                    name="clientEmail"
                    type="email"
                    value={form.clientEmail}
                    onChange={handleChange}
                  />
                </label>

                <label className="contract-form-field">
                  Freelancer / Provider
                  <input
                    name="freelancerName"
                    value={form.freelancerName}
                    onChange={handleChange}
                  />
                </label>

                <label className="contract-form-field">
                  Payment Amount *
                  <input
                    name="paymentAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.paymentAmount}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label className="contract-form-field">
                  Currency
                  <select
                    name="currency"
                    value={form.currency}
                    onChange={handleChange}
                  >
                    <option value="USD">USD</option>
                    <option value="INR">INR</option>
                    <option value="GBP">GBP</option>
                    <option value="EUR">EUR</option>
                    <option value="AED">AED</option>
                  </select>
                </label>

                <label className="contract-form-field">
                  Start Date
                  <input
                    name="startDate"
                    type="date"
                    value={form.startDate}
                    onChange={handleChange}
                  />
                </label>

                <label className="contract-form-field">
                  End Date
                  <input
                    name="endDate"
                    type="date"
                    min={form.startDate || undefined}
                    value={form.endDate}
                    onChange={handleChange}
                  />
                </label>

                <label className="contract-form-field contract-form-full">
                  Payment Terms
                  <textarea
                    name="paymentTerms"
                    rows={3}
                    value={form.paymentTerms}
                    onChange={handleChange}
                  />
                </label>

                <label className="contract-form-field contract-form-full">
                  Project Description
                  <textarea
                    name="projectDescription"
                    rows={4}
                    value={form.projectDescription}
                    onChange={handleChange}
                  />
                </label>
              </div>
            </div>
          )}
        </section>

        <section className="contract-form-section contract-clauses-section">
          <div className="contract-form-section-toggle contract-clauses-heading">
            <span className="contract-section-heading">
              <span className="contract-section-number">
                02
              </span>

              <span className="contract-section-copy">
                <strong>Contract Clauses</strong>
                <small>
                  {form.clauses.length} clauses · Each clause opens separately
                </small>
              </span>
            </span>
          </div>

          <div className="contract-form-section-content">
            <AgreementClauseEditor
              clauses={form.clauses}
              onChange={handleClausesChange}
              collapsible
              defaultCollapsed
              singleOpen
            />
          </div>
        </section>

        <footer className="contract-form-actions">
          <button
            type="button"
            className="contract-form-secondary"
            onClick={() =>
              navigate(
                isEditMode
                  ? `/dashboard/agreements/${id}`
                  : "/dashboard/agreements"
              )
            }
          >
            Cancel
          </button>

          <button
            type="submit"
            className="contract-form-primary"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : isEditMode
                ? "Save Changes"
                : "Create Contract"}
          </button>
        </footer>
      </form>
    </main>
  );
}
