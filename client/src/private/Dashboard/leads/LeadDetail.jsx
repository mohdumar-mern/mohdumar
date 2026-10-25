import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Pencil,
  RefreshCw,
  Building2,
  UserRound,
  Phone,
  Mail,
  MapPin,
  Globe,
  CalendarClock,
  IndianRupee,
  MessageCircle,
  ExternalLink,
  FileText,
  Clock3,
  AlertCircle,
  LoaderCircle,
  Copy,
  Check,
} from "lucide-react";
import { getAuthHeaders } from "../../../utils/AuthHeaders";

const API_URL = (import.meta.env.VITE_REACT_APP_BACKEND_API_URL || "").replace(/\/+$/, "");

const STATUS_STYLES = {
  New: "border-sky-400/30 bg-sky-400/10 text-sky-300",
  Contacted: "border-violet-400/30 bg-violet-400/10 text-violet-300",
  Interested: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  Negotiation: "border-amber-400/30 bg-amber-400/10 text-amber-300",
  "Follow-up": "border-orange-400/30 bg-orange-400/10 text-orange-300",
  Converted: "border-green-400/30 bg-green-400/10 text-green-300",
  Lost: "border-pink-400/30 bg-pink-400/10 text-pink-300",
};

const safeExternalUrl = (value) => {
  if (typeof value !== "string" || !value.trim()) return "";
  const url = value.trim();
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
};

const formatDate = (value, withTime = false) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
};

const formatCurrency = (value) => {
  if (value === undefined || value === null || value === "") return "—";
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const valueOrDash = (value) =>
  value === undefined || value === null || String(value).trim() === "" ? "—" : value;

const DetailItem = ({ icon: Icon, label, children, className = "" }) => (
  <div className={`min-w-0 border-b border-cyan-500/10 py-4 last:border-b-0 ${className}`}>
    <p className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-gray-500">
      {Icon && <Icon className="h-3.5 w-3.5 text-cyan-400" />}
      {label}
    </p>
    <div className="min-w-0 break-words text-sm leading-6 text-gray-200">{children ?? "—"}</div>
  </div>
);

const Section = ({ icon: Icon, title, description, children, className = "" }) => (
  <section className={`min-w-0 overflow-hidden border border-cyan-500/15 bg-black/50 ${className}`}>
    <header className="flex min-w-0 items-start gap-3 border-b border-cyan-500/10 px-4 py-4 sm:px-5">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center border border-cyan-500/20 bg-cyan-500/5">
        <Icon className="h-4 w-4 text-cyan-300" />
      </div>
      <div className="min-w-0">
        <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-white">{title}</h2>
        {description && <p className="mt-1 text-xs leading-5 text-gray-500">{description}</p>}
      </div>
    </header>
    <div className="px-4 sm:px-5">{children}</div>
  </section>
);

const LeadDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const fetchLeadDetails = useCallback(async () => {
    if (!id) {
      setError("Lead ID is missing from the URL.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      if (!API_URL) {
        throw new Error("Backend API URL is not configured. Check VITE_REACT_APP_BACKEND_API_URL.");
      }
      const response = await axios.get(`${API_URL}/leads/${encodeURIComponent(id)}`, {
        headers: getAuthHeaders(),
      });

      const payload = response?.data;
      const record = payload?.lead ?? payload?.data?.lead ?? payload?.data ?? payload;
      if (!record || typeof record !== "object" || !(record._id || record.leadId)) {
        throw new Error("The API response did not contain a lead record.");
      }
      setLead(record);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 404) setError("This lead could not be found. It may have been deleted.");
      else if (status === 401 || status === 403) setError("You are not authorized to view this lead. Please sign in again.");
      else setError(err?.response?.data?.message || err?.message || "Failed to load lead details.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchLeadDetails();
  }, [fetchLeadDetails]);

  const websiteUrl = useMemo(() => safeExternalUrl(lead?.websiteUrl), [lead?.websiteUrl]);
  const mapsUrl = useMemo(() => safeExternalUrl(lead?.googleMapsUrl), [lead?.googleMapsUrl]);
  const whatsappNumber = String(lead?.whatsapp || lead?.phone || "").replace(/\D/g, "");
  const overdue = Boolean(
    lead?.nextFollowUpAt &&
      !Number.isNaN(new Date(lead.nextFollowUpAt).getTime()) &&
      new Date(lead.nextFollowUpAt) < new Date() &&
      !["Converted", "Lost"].includes(lead?.status),
  );

  const copyLeadId = async () => {
    const text = String(lead?.leadId || lead?._id || "");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setError("Could not copy the Lead ID. Please copy it manually.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[360px] flex-col items-center justify-center gap-3 text-cyan-300">
        <LoaderCircle className="h-8 w-8 animate-spin" />
        <p className="text-xs uppercase tracking-[0.2em]">Loading lead details...</p>
      </div>
    );
  }

  if (error && !lead) {
    return (
      <div className="mx-auto w-full min-w-0 max-w-5xl space-y-5 font-mono">
        <button
          type="button"
          onClick={() => navigate("/dashboard/leads")}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gray-400 hover:text-cyan-300"
        >
          <ArrowLeft className="h-4 w-4" /> Back to leads
        </button>
        <div role="alert" className="flex items-start gap-3 border border-pink-500/25 bg-pink-500/5 p-5 text-sm text-pink-200">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold">Unable to load lead</p>
            <p className="mt-2 break-words text-xs leading-6 text-pink-200/80">{error}</p>
            <button
              type="button"
              onClick={fetchLeadDetails}
              className="mt-4 inline-flex items-center gap-2 border border-pink-400/30 px-3 py-2 text-xs uppercase tracking-wider hover:bg-pink-500/10"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!lead) return null;

  return (
    <div className="mx-auto w-full min-w-0 max-w-[1400px] space-y-5 font-mono">
      {/* Page actions */}
      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => navigate("/dashboard/leads")}
          className="inline-flex w-fit items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-gray-400 transition hover:text-cyan-300"
        >
          <ArrowLeft className="h-4 w-4" /> Back to lead database
        </button>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={fetchLeadDetails}
            className="inline-flex min-h-10 items-center justify-center gap-2 border border-cyan-500/20 px-3 py-2 text-[10px] uppercase tracking-widest text-cyan-300 transition hover:border-cyan-400/50 hover:bg-cyan-400/5"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
          <button
            type="button"
            onClick={() => navigate(`/dashboard/leads/edit/${lead._id}`)}
            className="inline-flex min-h-10 items-center justify-center gap-2 bg-cyan-400 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-black transition hover:bg-cyan-300"
          >
            <Pencil className="h-3.5 w-3.5" /> Edit lead
          </button>
        </div>
      </div>

      {error && (
        <div role="alert" className="flex items-start gap-2 border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-200">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span className="min-w-0 break-words">{error}</span>
        </div>
      )}

      {/* Lead identity card */}
      <section className="min-w-0 overflow-hidden border border-cyan-500/20 bg-gradient-to-br from-cyan-950/20 via-black to-black">
        <div className="flex min-w-0 flex-col gap-5 p-4 sm:p-6 lg:flex-row lg:items-start lg:justify-between lg:p-8">
          <div className="flex min-w-0 items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-cyan-400/30 bg-cyan-400/10 sm:h-14 sm:w-14">
              <Building2 className="h-6 w-6 text-cyan-300" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] uppercase tracking-[0.24em] text-pink-400">// Client_Acquisition / Lead_Profile</p>
              <h1 className="mt-3 break-words text-2xl font-extrabold uppercase tracking-tight text-white sm:text-3xl">
                {valueOrDash(lead.businessName)}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="border border-cyan-500/20 bg-black/50 px-2.5 py-1.5 text-[10px] text-cyan-300">
                  {lead.leadId || "No Lead ID"}
                </span>
                <button
                  type="button"
                  onClick={copyLeadId}
                  className="inline-flex items-center gap-1.5 border border-gray-700 px-2.5 py-1.5 text-[10px] text-gray-400 hover:border-cyan-400/40 hover:text-cyan-300"
                >
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {copied ? "Copied" : "Copy ID"}
                </button>
                <span className={`inline-flex items-center border px-2.5 py-1.5 text-[10px] uppercase tracking-wider ${STATUS_STYLES[lead.status] || "border-gray-500/30 bg-gray-500/10 text-gray-300"}`}>
                  {lead.status || "Unknown status"}
                </span>
                {overdue && (
                  <span className="inline-flex items-center gap-1 border border-orange-400/30 bg-orange-400/10 px-2.5 py-1.5 text-[10px] uppercase text-orange-300">
                    <Clock3 className="h-3 w-3" /> Follow-up overdue
                  </span>
                )}
              </div>
              <p className="mt-4 max-w-3xl text-sm leading-6 text-gray-500">
                Detailed business prospect record, contact information, opportunity value and follow-up history.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:min-w-[290px] lg:grid-cols-1">
            <div className="border border-cyan-500/15 bg-black/50 p-3">
              <p className="text-[9px] uppercase tracking-widest text-gray-500">Potential budget</p>
              <p className="mt-2 break-words text-lg font-bold text-white">{formatCurrency(lead.potentialBudget)}</p>
            </div>
            <div className="border border-cyan-500/15 bg-black/50 p-3">
              <p className="text-[9px] uppercase tracking-widest text-gray-500">Created</p>
              <p className="mt-2 text-sm font-semibold text-gray-200">{formatDate(lead.createdAt)}</p>
            </div>
            <div className="col-span-2 border border-cyan-500/15 bg-black/50 p-3 sm:col-span-1 lg:col-span-1">
              <p className="text-[9px] uppercase tracking-widest text-gray-500">Next follow-up</p>
              <p className={`mt-2 text-sm font-semibold ${overdue ? "text-orange-300" : "text-gray-200"}`}>
                {formatDate(lead.nextFollowUpAt)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Details grid */}
      <div className="grid min-w-0 grid-cols-1 items-start gap-4 xl:grid-cols-2">
        <Section icon={UserRound} title="Contact information" description="Primary contact details for this prospect">
          <div className="grid min-w-0 grid-cols-1 gap-x-8 sm:grid-cols-2">
            <DetailItem icon={UserRound} label="Contact person">{valueOrDash(lead.contactPerson)}</DetailItem>
            <DetailItem icon={Phone} label="Phone">
              {lead.phone ? <a className="break-all text-cyan-300 hover:text-cyan-200" href={`tel:${lead.phone}`}>{lead.phone}</a> : "—"}
            </DetailItem>
            <DetailItem icon={Mail} label="Email">
              {lead.email ? <a className="break-all text-cyan-300 hover:text-cyan-200" href={`mailto:${lead.email}`}>{lead.email}</a> : "—"}
            </DetailItem>
            <DetailItem icon={MessageCircle} label="WhatsApp">
              {whatsappNumber ? (
                <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-emerald-300 hover:text-emerald-200">
                  {lead.whatsapp || lead.phone} <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ) : "—"}
            </DetailItem>
            <DetailItem icon={MapPin} label="Address" className="sm:col-span-2">{valueOrDash(lead.address)}</DetailItem>
          </div>
        </Section>

        <Section icon={Building2} title="Business profile" description="Business classification and online presence">
          <div className="grid min-w-0 grid-cols-1 gap-x-8 sm:grid-cols-2">
            <DetailItem icon={Building2} label="Business name">{valueOrDash(lead.businessName)}</DetailItem>
            <DetailItem icon={FileText} label="Category">
              {lead.category === "Other" ? valueOrDash(lead.customCategory || "Other") : valueOrDash(lead.category)}
            </DetailItem>
            <DetailItem icon={Globe} label="Website status">{valueOrDash(lead.websiteStatus || "Not Verified")}</DetailItem>
            <DetailItem icon={FileText} label="Lead source">{valueOrDash(lead.source)}</DetailItem>
            <DetailItem icon={Globe} label="Website URL" className="sm:col-span-2">
              {websiteUrl ? (
                <a href={websiteUrl} target="_blank" rel="noreferrer" className="inline-flex max-w-full items-center gap-2 break-all text-cyan-300 hover:text-cyan-200">
                  <span>{lead.websiteUrl}</span><ExternalLink className="h-3.5 w-3.5 shrink-0" />
                </a>
              ) : "—"}
            </DetailItem>
            <DetailItem icon={MapPin} label="Google Maps" className="sm:col-span-2">
              {mapsUrl ? (
                <a href={mapsUrl} target="_blank" rel="noreferrer" className="inline-flex max-w-full items-center gap-2 break-all text-cyan-300 hover:text-cyan-200">
                  <span>Open location in Google Maps</span><ExternalLink className="h-3.5 w-3.5 shrink-0" />
                </a>
              ) : "—"}
            </DetailItem>
          </div>
        </Section>

        <Section icon={IndianRupee} title="Opportunity & follow-up" description="Sales pipeline and next action">
          <div className="grid min-w-0 grid-cols-1 gap-x-8 sm:grid-cols-2">
            <DetailItem icon={IndianRupee} label="Potential budget">{formatCurrency(lead.potentialBudget)}</DetailItem>
            <DetailItem icon={CalendarClock} label="Next follow-up">{formatDate(lead.nextFollowUpAt, true)}</DetailItem>
            <DetailItem icon={FileText} label="Lead status">
              <span className={`inline-flex border px-2 py-1 text-[10px] uppercase tracking-wider ${STATUS_STYLES[lead.status] || "border-gray-500/30 bg-gray-500/10 text-gray-300"}`}>
                {lead.status || "Unknown"}
              </span>
            </DetailItem>
            <DetailItem icon={Clock3} label="Last updated">{formatDate(lead.updatedAt, true)}</DetailItem>
          </div>
        </Section>

        <Section icon={FileText} title="Notes & additional details" description="Internal notes and any extra information">
          <div className="py-4">
            <p className="mb-2 text-[10px] uppercase tracking-[0.16em] text-gray-500">Notes</p>
            <div className="min-h-24 whitespace-pre-wrap break-words border border-cyan-500/10 bg-[#05090d] p-4 text-sm leading-7 text-gray-300">
              {valueOrDash(lead.notes)}
            </div>
          </div>
          {lead.description && (
            <div className="border-t border-cyan-500/10 py-4">
              <p className="mb-2 text-[10px] uppercase tracking-[0.16em] text-gray-500">Description</p>
              <p className="whitespace-pre-wrap break-words text-sm leading-7 text-gray-300">{lead.description}</p>
            </div>
          )}
        </Section>
      </div>

      {/* Record metadata */}
      <section className="grid min-w-0 grid-cols-1 gap-3 border border-cyan-500/10 bg-black/30 p-4 text-[10px] text-gray-600 sm:grid-cols-2 sm:p-5">
        <p className="min-w-0 break-all">Database record: <span className="text-gray-400">{lead._id || "—"}</span></p>
        <p className="min-w-0 break-words sm:text-right">Created: <span className="text-gray-400">{formatDate(lead.createdAt, true)}</span></p>
      </section>

      <div className="flex flex-wrap justify-end gap-2 pb-2">
        <Link
          to="/dashboard/leads"
          className="inline-flex min-h-10 items-center justify-center gap-2 border border-cyan-500/20 px-4 py-2 text-[10px] uppercase tracking-widest text-gray-300 transition hover:border-cyan-400/50 hover:text-cyan-300"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to leads
        </Link>
        <button
          type="button"
          onClick={() => navigate(`/dashboard/leads/edit/${lead._id}`)}
          className="inline-flex min-h-10 items-center justify-center gap-2 bg-cyan-400 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-black transition hover:bg-cyan-300"
        >
          <Pencil className="h-3.5 w-3.5" /> Edit this lead
        </button>
      </div>
    </div>
  );
};

export default LeadDetails;
