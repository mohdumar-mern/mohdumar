
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  RefreshCw,
  Pencil,
  Trash2,
  Phone,
  Mail,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Building2,
  Globe,
  MapPin,
  X,
  Users,
  AlertCircle,
  LoaderCircle,
  ExternalLink,
} from "lucide-react";

import {
  fetchLeads,
  deleteLead,
  clearLeadError,
} from "../../../features/Lead/leadSlice";

const STATUSES = [
  "New",
  "Contacted",
  "Interested",
  "Negotiation",
  "Follow-up",
  "Converted",
  "Lost",
];

const CATEGORIES = [
  "Dental Clinic",
  "Salon / Beauty Parlour",
  "Coaching Centre",
  "Restaurant / Cafe",
  "Gym / Fitness Centre",
  "Interior Designer",
  "Real Estate",
  "Retail Shop",
  "Other",
];

const WEBSITE_STATUSES = [
  "No Website",
  "Outdated",
  "Needs Improvement",
  "Good Website",
  "Not Verified",
];

const STATUS_STYLES = {
  New: "border-sky-400/30 bg-sky-400/10 text-sky-300",
  Contacted: "border-violet-400/30 bg-violet-400/10 text-violet-300",
  Interested: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  Negotiation: "border-amber-400/30 bg-amber-400/10 text-amber-300",
  "Follow-up": "border-orange-400/30 bg-orange-400/10 text-orange-300",
  Converted: "border-green-400/30 bg-green-400/10 text-green-300",
  Lost: "border-pink-400/30 bg-pink-400/10 text-pink-300",
};

const formatCurrency = (value) => {
  if (value === undefined || value === null || value === "") {
    return "—";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (value) => {
  if (!value) return "Not scheduled";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Invalid date";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex whitespace-nowrap border px-2.5 py-1 text-[10px] uppercase tracking-wider ${
      STATUS_STYLES[status] ||
      "border-gray-500/30 bg-gray-500/10 text-gray-300"
    }`}
  >
    {status || "Unknown"}
  </span>
);

const IconAction = ({ label, onClick, children, danger = false }) => (
  <button
    type="button"
    title={label}
    aria-label={label}
    onClick={onClick}
    className={`inline-flex h-9 w-9 items-center justify-center border transition ${
      danger
        ? "border-pink-500/20 text-pink-300 hover:border-pink-400/60 hover:bg-pink-500/10"
        : "border-cyan-500/20 text-cyan-300 hover:border-cyan-400/60 hover:bg-cyan-400/10"
    }`}
  >
    {children}
  </button>
);

const LeadList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    leads = [],
    pagination = {},
    loading,
    deleting,
    error,
  } = useSelector((state) => state.leads);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [websiteStatus, setWebsiteStatus] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [deletingId, setDeletingId] = useState(null);

  const loadLeads = useCallback(
    (overrides = {}) => {
      dispatch(
        fetchLeads({
          page,
          limit,
          search,
          status,
          category,
          websiteStatus,
          ...overrides,
        })
      );
    },
    [dispatch, page, limit, search, status, category, websiteStatus]
  );

  // Debounce search input to avoid sending a request for every keystroke.
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 350);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  const handleFilterChange = (setter) => (event) => {
    setter(event.target.value);
    setPage(1);
  };

  const handleReset = () => {
    setSearchInput("");
    setSearch("");
    setStatus("");
    setCategory("");
    setWebsiteStatus("");
    setPage(1);
    dispatch(clearLeadError());
  };

  const handleDelete = async (lead) => {
    const confirmed = window.confirm(
      `Delete ${lead.businessName || "this lead"} (${lead.leadId})?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingId(lead._id);

    try {
      await dispatch(deleteLead(lead._id)).unwrap();

      // Refresh the current page. If its last record was deleted,
      // move back one page when possible.
      const currentTotal = pagination.total || 0;
      const remainingOnPage = leads.length - 1;
      const newTotal = Math.max(0, currentTotal - 1);
      const lastPage = Math.max(1, Math.ceil(newTotal / limit));
      const nextPage = Math.min(page, lastPage);

      setPage(nextPage);

      // If the page doesn't change, fetch it again explicitly.
      if (nextPage === page) {
        dispatch(
          fetchLeads({
            page: nextPage,
            limit,
            search,
            status,
            category,
            websiteStatus,
          })
        );
      }
    } catch {
      // The Redux slice stores the error message.
    } finally {
      setDeletingId(null);
    }
  };

  const total = pagination.total ?? 0;
  const totalPages = pagination.totalPages ?? 0;
  const hasPreviousPage = pagination.hasPreviousPage ?? page > 1;
  const hasNextPage = pagination.hasNextPage ?? page < totalPages;

  const showingFrom = total === 0 ? 0 : (page - 1) * limit + 1;
  const showingTo = Math.min(page * limit, total);

  return (
    <div className="mx-auto max-w-[1500px] space-y-6 font-mono">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-pink-400">
            // Client_Acquisition / CRM
          </p>

          <h1 className="mt-2 text-2xl font-extrabold uppercase tracking-tight text-white sm:text-3xl">
            Leads <span className="text-cyan-400">Management</span>
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Track prospects, contact details and follow-ups.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/dashboard/leads/add")}
          className="inline-flex items-center justify-center bg-cyan-400 px-5 py-3 text-xs font-bold uppercase tracking-widest text-black transition hover:bg-cyan-300"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Lead
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="border border-cyan-500/15 bg-gradient-to-br from-cyan-950/20 to-black p-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-widest text-gray-500">
              Total Leads
            </p>
            <Users className="h-4 w-4 text-cyan-400" />
          </div>
          <p className="mt-3 text-2xl font-bold text-white">{total}</p>
          <p className="mt-1 text-[10px] text-gray-600">
            Matching current filters
          </p>
        </div>

        <div className="border border-emerald-500/15 bg-gradient-to-br from-emerald-950/10 to-black p-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-widest text-gray-500">
              Interested on This Page
            </p>
            <Building2 className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="mt-3 text-2xl font-bold text-white">
            {leads.filter((lead) => lead.status === "Interested").length}
          </p>
          <p className="mt-1 text-[10px] text-gray-600">
            Current page only
          </p>
        </div>

        <div className="border border-pink-500/15 bg-gradient-to-br from-pink-950/10 to-black p-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-widest text-gray-500">
              Follow-ups Due
            </p>
            <Phone className="h-4 w-4 text-pink-400" />
          </div>
          <p className="mt-3 text-2xl font-bold text-white">
            {leads.filter((lead) => {
              if (!lead.nextFollowUpAt) return false;
              const date = new Date(lead.nextFollowUpAt);
              return !Number.isNaN(date.getTime()) && date < new Date();
            }).length}
          </p>
          <p className="mt-1 text-[10px] text-gray-600">
            Overdue on this page
          </p>
        </div>
      </div>

      {/* Search and filters */}
      <div className="border border-cyan-500/15 bg-black/50 p-4 sm:p-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <div className="relative sm:col-span-2 xl:col-span-2">
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-cyan-400" />
            <input
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search business, phone, email, Lead ID..."
              className="w-full border border-cyan-500/20 bg-[#080d14] py-3 pl-10 pr-10 text-sm text-cyan-100 placeholder:text-gray-600 focus:border-cyan-400/60 focus:outline-none"
            />

            {searchInput && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setSearchInput("")}
                className="absolute right-3 top-3 text-gray-500 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <select
            value={status}
            onChange={handleFilterChange(setStatus)}
            className="border border-cyan-500/20 bg-[#080d14] px-3 py-3 text-xs text-gray-300 focus:border-cyan-400/60 focus:outline-none"
          >
            <option value="">All Lead Statuses</option>
            {STATUSES.map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>

          <select
            value={category}
            onChange={handleFilterChange(setCategory)}
            className="border border-cyan-500/20 bg-[#080d14] px-3 py-3 text-xs text-gray-300 focus:border-cyan-400/60 focus:outline-none"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>

          <select
            value={websiteStatus}
            onChange={handleFilterChange(setWebsiteStatus)}
            className="border border-cyan-500/20 bg-[#080d14] px-3 py-3 text-xs text-gray-300 focus:border-cyan-400/60 focus:outline-none"
          >
            <option value="">All Website Statuses</option>
            {WEBSITE_STATUSES.map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[10px] uppercase tracking-widest text-gray-500">
            {loading ? "Synchronizing records..." : `${total} records found`}
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center border border-pink-500/20 px-3 py-2 text-[10px] uppercase tracking-widest text-pink-300 transition hover:bg-pink-500/10"
            >
              <X className="mr-2 h-3.5 w-3.5" />
              Reset
            </button>

            <button
              type="button"
              onClick={() => loadLeads()}
              disabled={loading}
              className="inline-flex items-center border border-cyan-500/20 px-3 py-2 text-[10px] uppercase tracking-widest text-cyan-300 transition hover:bg-cyan-400/10 disabled:opacity-50"
            >
              {loading ? (
                <LoaderCircle className="mr-2 h-3.5 w-3.5 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-3.5 w-3.5" />
              )}
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 border border-pink-500/30 bg-pink-500/10 p-4 text-sm text-pink-300"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div className="flex-1">{error}</div>
          <button
            type="button"
            onClick={() => dispatch(clearLeadError())}
            aria-label="Dismiss error"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Leads table */}
      <div className="overflow-hidden border border-cyan-500/15 bg-black/50">
        <div className="flex items-center justify-between border-b border-cyan-500/10 px-4 py-4 sm:px-5">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-white">
              Lead Database
            </h2>
            <p className="mt-1 text-[10px] text-gray-600">
              Prospect records and contact information
            </p>
          </div>

          <span className="hidden text-[10px] uppercase tracking-widest text-cyan-400 sm:block">
            {loading ? "Loading..." : "System / Ready"}
          </span>
        </div>

        {loading && leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-cyan-300">
            <LoaderCircle className="h-7 w-7 animate-spin" />
            <p className="text-xs uppercase tracking-widest">
              Loading lead records...
            </p>
          </div>
        ) : leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-5 py-20 text-center">
            <Building2 className="h-10 w-10 text-gray-700" />
            <h3 className="mt-4 text-sm font-bold uppercase tracking-widest text-gray-300">
              No Leads Found
            </h3>
            <p className="mt-2 max-w-sm text-xs leading-6 text-gray-500">
              Try changing your search or filters, or create your first lead.
            </p>
            <button
              type="button"
              onClick={() => navigate("/dashboard/leads/add")}
              className="mt-5 inline-flex items-center bg-cyan-400 px-4 py-3 text-xs font-bold uppercase tracking-widest text-black hover:bg-cyan-300"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create First Lead
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-cyan-500/10 bg-cyan-950/10 text-[10px] uppercase tracking-widest text-gray-500">
                    <th className="px-5 py-4 font-medium">Lead / Business</th>
                    <th className="px-4 py-4 font-medium">Contact</th>
                    <th className="px-4 py-4 font-medium">Category</th>
                    <th className="px-4 py-4 font-medium">Website</th>
                    <th className="px-4 py-4 font-medium">Status</th>
                    <th className="px-4 py-4 font-medium">Budget</th>
                    <th className="px-4 py-4 font-medium">Follow-up</th>
                    <th className="px-5 py-4 text-right font-medium">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {leads.map((lead) => (
                    <tr
                      key={lead._id}
                      className="border-b border-cyan-500/[0.07] transition hover:bg-cyan-400/[0.025]"
                    >
                      <td className="px-5 py-4">
                        <div className="max-w-[240px]">
                          <p className="truncate text-sm font-semibold text-white">
                            {lead.businessName}
                          </p>
                          <p className="mt-1 text-[10px] text-cyan-400">
                            {lead.leadId}
                          </p>
                          {lead.address && (
                            <p className="mt-2 flex items-start gap-1.5 text-[10px] leading-4 text-gray-500">
                              <MapPin className="mt-0.5 h-3 w-3 shrink-0" />
                              <span className="line-clamp-2">{lead.address}</span>
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="space-y-2">
                          {lead.contactPerson && (
                            <p className="text-xs text-gray-300">
                              {lead.contactPerson}
                            </p>
                          )}

                          {lead.phone && (
                            <a
                              href={`tel:${lead.phone}`}
                              className="flex items-center gap-2 text-[11px] text-gray-400 hover:text-cyan-300"
                            >
                              <Phone className="h-3 w-3" />
                              {lead.phone}
                            </a>
                          )}

                          {lead.email && (
                            <a
                              href={`mailto:${lead.email}`}
                              className="flex items-center gap-2 text-[11px] text-gray-400 hover:text-cyan-300"
                            >
                              <Mail className="h-3 w-3" />
                              <span className="max-w-[150px] truncate">{lead.email}</span>
                            </a>
                          )}

                          {lead.whatsapp && (
                            <a
                              href={`https://wa.me/${lead.whatsapp.replace(/\D/g, "")}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-[10px] text-emerald-400 hover:text-emerald-300"
                            >
                              <MessageCircle className="h-3 w-3" />
                              WhatsApp
                              <ExternalLink className="h-2.5 w-2.5" />
                            </a>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <p className="text-xs text-gray-300">
                          {lead.category === "Other"
                            ? lead.customCategory || "Other"
                            : lead.category || "—"}
                        </p>
                        <p className="mt-1 text-[10px] text-gray-600">
                          {lead.source || "Unknown source"}
                        </p>
                      </td>

                      <td className="px-4 py-4">
                        <p className="text-xs text-gray-300">
                          {lead.websiteStatus || "Not Verified"}
                        </p>
                        {lead.websiteUrl && (
                          <a
                            href={lead.websiteUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 inline-flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-300"
                          >
                            Open website
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                        {lead.googleMapsUrl && (
                          <a
                            href={lead.googleMapsUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 flex items-center gap-1 text-[10px] text-gray-500 hover:text-cyan-300"
                          >
                            <Globe className="h-3 w-3" />
                            Google Maps
                          </a>
                        )}
                      </td>

                      <td className="px-4 py-4">
                        <StatusBadge status={lead.status} />
                      </td>

                      <td className="px-4 py-4 text-xs tabular-nums text-gray-300">
                        {formatCurrency(lead.potentialBudget)}
                      </td>

                      <td className="px-4 py-4">
                        <p className="whitespace-nowrap text-xs text-gray-300">
                          {formatDate(lead.nextFollowUpAt)}
                        </p>
                        {lead.nextFollowUpAt &&
                          new Date(lead.nextFollowUpAt) < new Date() && (
                            <p className="mt-1 text-[10px] uppercase text-orange-400">
                              Overdue
                            </p>
                          )}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <IconAction
                            label="Edit lead"
                            onClick={() =>
                              navigate(`/dashboard/leads/edit/${lead._id}`)
                            }
                          >
                            <Pencil className="h-4 w-4" />
                          </IconAction>

                          <IconAction
                            label="Delete lead"
                            danger
                            onClick={() => handleDelete(lead)}
                          >
                            {deletingId === lead._id ? (
                              <LoaderCircle className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </IconAction>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col gap-4 border-t border-cyan-500/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div className="flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-widest text-gray-500">
                <span>
                  Showing{" "}
                  <span className="text-cyan-300">{showingFrom}-{showingTo}</span>
                  {" "}of{" "}
                  <span className="text-cyan-300">{total}</span>
                </span>

                <label className="flex items-center gap-2">
                  Per page
                  <select
                    value={limit}
                    onChange={(event) => {
                      setLimit(Number(event.target.value));
                      setPage(1);
                    }}
                    className="border border-cyan-500/20 bg-[#080d14] px-2 py-1.5 text-gray-300 focus:outline-none"
                  >
                    {[10, 20, 50, 100].map((value) => (
                      <option key={value} value={value}>{value}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={!hasPreviousPage || loading}
                  className="inline-flex items-center border border-cyan-500/20 px-3 py-2 text-xs text-gray-300 transition hover:border-cyan-400/50 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Previous
                </button>

                <span className="min-w-[90px] text-center text-[10px] uppercase tracking-widest text-cyan-300">
                  Page {page} / {Math.max(1, totalPages)}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setPage((current) =>
                      totalPages ? Math.min(totalPages, current + 1) : current + 1
                    )
                  }
                  disabled={!hasNextPage || loading}
                  className="inline-flex items-center border border-cyan-500/20 px-3 py-2 text-xs text-gray-300 transition hover:border-cyan-400/50 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Next
                  <ChevronRight className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {deleting && (
        <p className="text-[10px] uppercase tracking-widest text-gray-600">
          Processing delete request...
        </p>
      )}
    </div>
  );
};

export default LeadList;
