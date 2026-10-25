
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
  downloadContractPdf,
  fetchContractById,
  fetchContractVersions,
} from "../../../features/agreements/contractsSlice";

import "./ContractDetails.css";

const CONTRACTS_PATH = "/dashboard/agreements";

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
};

const formatDateTime = (value) => {
  if (!value) return "Date unavailable";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : date.toLocaleString("en-IN");
};

const getErrorMessage = (error) => {
  if (typeof error === "string") return error;

  return error?.message || "Something went wrong. Please try again.";
};

export default function ContractDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    currentContract,
    versions = [],
    detailLoading,
    pdfLoading,
    error,
  } = useSelector((state) => state.contracts);

  useEffect(() => {
    if (!id) return;

    dispatch(fetchContractById(id));
    dispatch(fetchContractVersions(id));
  }, [dispatch, id]);

 
const handleDownloadPdf = async () => {
    if (!currentContract?._id) return;
  
    try {
      await dispatch(
        downloadContractPdf({
          id: currentContract._id,
          contractNumber: currentContract.contractNumber,
        })
      ).unwrap();
    } catch (error) {
      window.alert(
        typeof error === "string"
          ? error
          : error?.message || "PDF download failed."
      );
    }
  };
  

  if (detailLoading && currentContract?._id !== id) {
    return (
      <main className="contract-details">
        <div className="contract-details-state">
          <span className="contract-details-spinner" />
          <p>Loading contract details...</p>
        </div>
      </main>
    );
  }

  if (error && currentContract?._id !== id) {
    return (
      <main className="contract-details">
        <div className="contract-details-state">
          <h2>Unable to load contract</h2>
          <p role="alert">{getErrorMessage(error)}</p>

          <button
            type="button"
            onClick={() => navigate(CONTRACTS_PATH)}
          >
            ← Back to contracts
          </button>
        </div>
      </main>
    );
  }

  if (!currentContract || String(currentContract._id) !== String(id)) {
    return (
      <main className="contract-details">
        <div className="contract-details-state">
          <h2>Contract not found</h2>
          <p>The requested contract could not be found.</p>

          <button
            type="button"
            onClick={() => navigate(CONTRACTS_PATH)}
          >
            ← Back to contracts
          </button>
        </div>
      </main>
    );
  }

  const contract = currentContract;

  return (
    <main className="contract-details">
      <header className="contract-details-header">
        <button
          type="button"
          className="contract-back-button"
          onClick={() => navigate(CONTRACTS_PATH)}
        >
          ← Back
        </button>

        <div className="contract-details-heading">
          <span className="contract-details-eyebrow">
            CONTRACT DETAILS
          </span>

          <h1>{contract.title || "Untitled Contract"}</h1>

          <p>
            {contract.contractNumber || "Contract number unavailable"}
          </p>
        </div>

        <button
          type="button"
          className="contract-download-button"
          onClick={handleDownloadPdf}
          disabled={pdfLoading}
        >
          {pdfLoading ? "Preparing PDF..." : "↓ Download PDF"}
        </button>
      </header>

      {error && (
        <div className="contract-details-error" role="alert">
          {getErrorMessage(error)}
        </div>
      )}

      <section className="contract-details-card">
        <div className="contract-section-heading">
          <h2>Contract Information</h2>

          <span
            className={`contract-status contract-status-${contract.status || "draft"}`}
          >
            {contract.status || "draft"}
          </span>
        </div>

        <dl className="contract-information-grid">
          <div>
            <dt>Client Name</dt>
            <dd>{contract.clientName || "—"}</dd>
          </div>

          <div>
            <dt>Client Email</dt>
            <dd>{contract.clientEmail || "—"}</dd>
          </div>

          <div>
            <dt>Freelancer / Provider</dt>
            <dd>{contract.freelancerName || "—"}</dd>
          </div>

          <div>
            <dt>Payment Amount</dt>
            <dd>
              {contract.currency || "INR"}{" "}
              {Number(contract.paymentAmount || 0).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </dd>
          </div>

          <div>
            <dt>Start Date</dt>
            <dd>{formatDate(contract.startDate)}</dd>
          </div>

          <div>
            <dt>End Date</dt>
            <dd>{formatDate(contract.endDate)}</dd>
          </div>

          <div className="contract-information-full">
            <dt>Payment Terms</dt>
            <dd>{contract.paymentTerms || "No payment terms specified."}</dd>
          </div>
        </dl>
      </section>

      <section className="contract-details-card">
        <h2>Project Description</h2>

        <p className="contract-description">
          {contract.projectDescription || "No project description provided."}
        </p>
      </section>

      <section className="contract-details-card">
        <h2>Contract Clauses</h2>

        {contract.clauses?.length > 0 ? (
          <div className="contract-clauses-list">
            {contract.clauses.map((clause, index) => (
              <article
                className="contract-clause"
                key={clause._id || clause.id || index}
              >
                <span className="contract-clause-number">
                  CLAUSE {String(index + 1).padStart(2, "0")}
                </span>

                <h3>{clause.title || `Clause ${index + 1}`}</h3>

                <p>{clause.content || "No content provided."}</p>
              </article>
            ))}
          </div>
        ) : (
          <p className="contract-muted-text">
            No clauses have been added to this contract.
          </p>
        )}
      </section>

      <section className="contract-details-card">
        <h2>Version History</h2>

        {versions.length > 0 ? (
          <ol className="contract-version-list">
            {versions.map((version, index) => (
              <li key={version._id || version.version || index}>
                <div>
                  <strong>Version {version.version ?? index + 1}</strong>
                  <p>{formatDateTime(version.changedAt)}</p>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="contract-muted-text">
            No version history is available.
          </p>
        )}
      </section>
    </main>
  );
}
