
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearContractError, deleteContract, fetchContracts, updateContractStatus } from "../../../features/agreements/contractsSlice";
import "./ContractsDashboard.css";
export default function ContractsDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    contracts = [],
    loading,
    deleting,
    error,
  } = useSelector((state) => state.contracts);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    dispatch(fetchContracts());
  }, [dispatch]);

  const filteredContracts = contracts.filter((contract) => {
    const query = search.toLowerCase();

    const matchesSearch = [
      contract.contractNumber,
      contract.title,
      contract.clientName,
      contract.freelancerName,
    ].some((value) => String(value || "").toLowerCase().includes(query));

    return matchesSearch && (!status || contract.status === status);
  });

  const handleDelete = async (contract) => {
    const confirmed = window.confirm(
      `Delete "${contract.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    const result = await dispatch(deleteContract(contract._id));

    if (deleteContract.fulfilled.match(result)) {
      dispatch(fetchContracts());
    }
  };

  const handleStatusChange = async (contract, nextStatus) => {
    const result = await dispatch(
      updateContractStatus({
        id: contract._id,
        status: nextStatus,
      })
    );

    if (updateContractStatus.fulfilled.match(result)) {
      dispatch(fetchContracts());
    }
  };

  return (
    <main className="contracts-dashboard">
      <header className="contracts-header">
        <div>
          <h1>Contract Generator</h1>
          <p>Create, manage and download your contracts.</p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/dashboard/agreements/new")}
        >
          + Create Contract
        </button>
      </header>

      {error && (
        <div role="alert" className="contracts-error">
          {typeof error === "string"
            ? error
            : error.message || "Something went wrong."}

          <button
            type="button"
            onClick={() => dispatch(clearContractError())}
          >
            Dismiss
          </button>
        </div>
      )}

      <section className="contracts-toolbar">
        <input
          type="search"
          placeholder="Search contract, client or number..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Search contracts"
        />

        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          aria-label="Filter by status"
        >
          <option value="">All statuses</option>
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="signed">Signed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </section>

      {loading ? (
        <p>Loading contracts...</p>
      ) : filteredContracts.length === 0 ? (
        <section className="contracts-empty">
          <h2>No contracts found</h2>
          <p>Create a contract to get started, or change your search.</p>
          <button
            type="button"
            onClick={() => navigate("/dashboard/agreements/new")}
          >
            Create your first contract
          </button>
        </section>
      ) : (
        <div className="contracts-table-wrapper">
          <table className="contracts-table">
            <thead>
              <tr>
                <th>Contract</th>
                <th>Client</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredContracts.map((contract) => (
                <tr key={contract._id}>
                  <td>
                    <strong>{contract.title}</strong>
                    <small>{contract.contractNumber || "—"}</small>
                  </td>

                  <td>{contract.clientName || "—"}</td>

                  <td>
                    {contract.currency || "INR"}{" "}
                    {Number(contract.paymentAmount || 0).toLocaleString(
                      "en-IN"
                    )}
                  </td>

                  <td>
                    <span
                      className={`contract-status contract-status-${contract.status}`}
                    >
                      {contract.status}
                    </span>
                  </td>

                  <td>
                    {contract.createdAt
                      ? new Date(contract.createdAt).toLocaleDateString()
                      : "—"}
                  </td>

                  <td>
                    <div className="contract-actions">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/dashboard/agreements/${contract._id}`)
                        }
                      >
                        View
                      </button>

                      {contract.status !== "signed" &&
                        contract.status !== "cancelled" && (
                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/dashboard/agreements/${contract._id}/edit`)
                            }
                          >
                            Edit
                          </button>
                        )}

                      {contract.status === "draft" && (
                        <button
                          type="button"
                          onClick={() =>
                            handleStatusChange(contract, "sent")
                          }
                        >
                          Mark Sent
                        </button>
                      )}

                      <button
                        type="button"
                        disabled={deleting}
                        onClick={() => handleDelete(contract)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
