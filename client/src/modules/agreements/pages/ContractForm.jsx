
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AgreementClauseEditor from "../components/AgreementClauseEditor";
import "./ContractForm.css";
import { createContract } from "../../../features/agreements/contractsSlice";

const initialForm = {
  title: "",
  clientName: "",
  clientEmail: "",
  freelancerName: "",
  projectDescription: "",
  paymentAmount: "",
  currency: "INR",
  paymentTerms: "",
  startDate: "",
  endDate: "",
  clauses: [],
};

export default function ContractForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { saving, error } = useSelector((state) => state.contracts);

  const [form, setForm] = useState(initialForm);
  const [validationError, setValidationError] = useState("");

  const updateField = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleClausesChange = (clauses) => {
    setForm((previous) => ({ ...previous, clauses }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setValidationError("");

    if (!form.title.trim() || !form.clientName.trim()) {
      setValidationError("Contract title and client name are required.");
      return;
    }

    if (
      form.paymentAmount !== "" &&
      (!Number.isFinite(Number(form.paymentAmount)) ||
        Number(form.paymentAmount) < 0)
    ) {
      setValidationError("Enter a valid payment amount.");
      return;
    }

    if (
      form.startDate &&
      form.endDate &&
      form.endDate < form.startDate
    ) {
      setValidationError("End date cannot be earlier than start date.");
      return;
    }

    const payload = {
      ...form,
      paymentAmount:
        form.paymentAmount === "" ? 0 : Number(form.paymentAmount),
    };
    console.log("payroll", payload)

    const result = await dispatch(createContract(payload));

    if (createContract.fulfilled.match(result)) {
      const contract = result.payload?.contract;

      if (contract?._id) {
        navigate(`/dashboard/agreements/${contract._id}`);
      } else {
        navigate("/dashboard/agreements");
      }
    }
  };

  return (
    <main className="contract-form-page">
      <header className="contract-form-header">
        <div>
          <p className="contract-form-eyebrow">AGREEMENTS / NEW</p>
          <h1>Create Contract</h1>
          <p>Create and manage a contract for your project.</p>
        </div>

        <button
          type="button"
          className="contract-secondary-button"
          onClick={() => navigate("/dashboard/agreements")}
        >
          Cancel
        </button>
      </header>

      {(validationError || error) && (
        <div className="contract-form-error" role="alert">
          {validationError ||
            (typeof error === "string"
              ? error
              : error?.message || "Unable to save contract.")}
        </div>
      )}

      <form className="contract-form" onSubmit={handleSubmit}>
        <section className="contract-form-section">
          <h2>Basic Information</h2>

          <div className="contract-form-grid">
            <label className="contract-field contract-field-full">
              Contract Title *
              <input
                name="title"
                value={form.title}
                onChange={updateField}
                placeholder="Website Development Agreement"
                required
              />
            </label>

            <label className="contract-field">
              Client Name *
              <input
                name="clientName"
                value={form.clientName}
                onChange={updateField}
                placeholder="Client's full name"
                required
              />
            </label>

            <label className="contract-field">
              Client Email
              <input
                type="email"
                name="clientEmail"
                value={form.clientEmail}
                onChange={updateField}
                placeholder="client@example.com"
              />
            </label>

            <label className="contract-field contract-field-full">
              Freelancer / Service Provider
              <input
                name="freelancerName"
                value={form.freelancerName}
                onChange={updateField}
                placeholder="Your name or business name"
              />
            </label>
          </div>
        </section>

        <section className="contract-form-section">
          <h2>Project Details</h2>

          <label className="contract-field">
            Project Description
            <textarea
              name="projectDescription"
              value={form.projectDescription}
              onChange={updateField}
              placeholder="Describe the project, deliverables and scope..."
              rows={5}
            />
          </label>
        </section>

        <section className="contract-form-section">
          <h2>Payment & Timeline</h2>

          <div className="contract-form-grid">
            <label className="contract-field">
              Payment Amount
              <input
                type="number"
                name="paymentAmount"
                min="0"
                step="0.01"
                value={form.paymentAmount}
                onChange={updateField}
                placeholder="25000"
              />
            </label>

            <label className="contract-field">
              Currency
              <select
                name="currency"
                value={form.currency}
                onChange={updateField}
              >
                <option value="INR">INR — Indian Rupee</option>
                <option value="USD">USD — US Dollar</option>
                <option value="EUR">EUR — Euro</option>
                <option value="GBP">GBP — British Pound</option>
              </select>
            </label>

            <label className="contract-field contract-field-full">
              Payment Terms
              <textarea
                name="paymentTerms"
                value={form.paymentTerms}
                onChange={updateField}
                placeholder="e.g. 50% upfront and 50% on completion"
                rows={3}
              />
            </label>

            <label className="contract-field">
              Start Date
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={updateField}
              />
            </label>

            <label className="contract-field">
              End Date
              <input
                type="date"
                name="endDate"
                min={form.startDate || undefined}
                value={form.endDate}
                onChange={updateField}
              />
            </label>
          </div>
        </section>

        <section className="contract-form-section">
          <h2>Contract Clauses</h2>
          <p className="contract-form-hint">
            Add the terms and conditions that apply to this contract.
          </p>

          <AgreementClauseEditor
            clauses={form.clauses}
            onChange={handleClausesChange}
          />
        </section>

        <footer className="contract-form-footer">
          <button
            type="button"
            className="contract-secondary-button"
            onClick={() => navigate("/dashboard/agreements")}
          >
            Cancel
          </button>

          <button type="submit" disabled={saving}>
            {saving ? "Saving Contract..." : "Create Contract"}
          </button>
        </footer>
      </form>
    </main>
  );
}
