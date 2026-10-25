
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  UserRound,
  Globe,
  ClipboardList,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  CalendarClock,
  ChevronRight,
  Check,
  LoaderCircle,
  Layers,
} from "lucide-react";

import {
  createLead,
  updateLead,
  fetchLeadById,
  clearLeadError,
  clearLeadDetailsError,
} from "../../../features/Lead/leadSlice";

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

const SOURCES = [
  "Google Maps",
  "Google Search",
  "Referral",
  "Social Media",
  "Other",
];

const STATUSES = [
  "New",
  "Contacted",
  "Interested",
  "Negotiation",
  "Follow-up",
  "Converted",
  "Lost",
];

const CONTACT_METHODS = [
  "Phone",
  "WhatsApp",
  "Email",
  "In Person",
  "Other",
];

const INITIAL_FORM = {
  businessName: "",
  category: "Dental Clinic",
  customCategory: "",
  contactPerson: "",
  phone: "",
  whatsapp: "",
  email: "",
  address: "",
  googleMapsUrl: "",
  websiteUrl: "",
  websiteStatus: "Not Verified",
  source: "Google Maps",
  status: "New",
  bestContactMethod: "WhatsApp",
  potentialBudget: "",
  notes: "",
  nextFollowUpAt: "",
};

const STEPS = [
  { title: "Business Details", subtitle: "Identify the business", icon: Building2 },
  { title: "Contact Details", subtitle: "How to reach them", icon: UserRound },
  { title: "Website & Source", subtitle: "Research the prospect", icon: Globe },
  { title: "Follow-up & Notes", subtitle: "Plan the next action", icon: ClipboardList },
];

const toDateTimeLocal = (value) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const localDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60_000
  );

  return localDate.toISOString().slice(0, 16);
};

const mapLeadToForm = (lead) => ({
  ...INITIAL_FORM,
  ...Object.fromEntries(
    Object.keys(INITIAL_FORM).map((key) => [
      key,
      lead[key] ?? INITIAL_FORM[key],
    ])
  ),
  potentialBudget:
    lead.potentialBudget == null ? "" : String(lead.potentialBudget),
  nextFollowUpAt: toDateTimeLocal(lead.nextFollowUpAt),
});

const Field = ({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  type = "text",
  icon: Icon,
  required = false,
  options,
  rows = 3,
  hint,
  min,
}) => {
  const baseClass =
    "w-full bg-[#080d14] border border-cyan-500/20 text-cyan-100 " +
    "placeholder:text-gray-600 text-sm focus:outline-none focus:border-cyan-400/70 " +
    "focus:ring-1 focus:ring-cyan-400/20 transition";

  return (
    <div className="min-w-0">
      <label
        htmlFor={name}
        className="mb-2 block text-[10px] uppercase tracking-[0.18em] text-gray-400"
      >
        {label}
        {required && <span className="ml-1 text-pink-400">*</span>}
      </label>

      <div className="relative">
        {Icon && (
          <Icon
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-3.5 z-10 h-4 w-4 text-pink-400"
          />
        )}

        {options ? (
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className={`${baseClass} ${Icon ? "pl-10" : "pl-3"} pr-3 py-3`}
          >
            {options.map((option) => (
              <option key={option} value={option} className="bg-[#080d14]">
                {option}
              </option>
            ))}
          </select>
        ) : type === "textarea" ? (
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            required={required}
            className={`${baseClass} ${Icon ? "pl-10" : "pl-3"} pr-3 py-3 resize-y`}
          />
        ) : (
          <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            min={min}
            step={type === "number" ? "any" : undefined}
            className={`${baseClass} ${Icon ? "pl-10" : "pl-3"} pr-3 py-3`}
          />
        )}
      </div>

      {hint && (
        <p className="mt-1.5 text-xs text-gray-500">{hint}</p>
      )}
    </div>
  );
};

const LeadAddUpdate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const {
    leads = [],
    selectedLead,
    loading,
    detailsLoading,
    creating,
    updating,
    error,
    detailsError,
  } = useSelector((state) => state.leads);

  const existingLead = useMemo(() => {
    if (!isEditing) return null;

    return (
      leads.find((lead) => lead._id === id) ||
      (selectedLead?._id === id ? selectedLead : null)
    );
  }, [isEditing, leads, selectedLead, id]);

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [step, setStep] = useState(0);
  const [formError, setFormError] = useState("");

  const isSaving = creating || updating;
  const isLoadingLead = isEditing && detailsLoading && !existingLead;

  useEffect(() => {
    dispatch(clearLeadError());
    dispatch(clearLeadDetailsError());

    if (isEditing && !existingLead) {
      dispatch(fetchLeadById(id));
    }
  }, [dispatch, id, isEditing, existingLead]);

  useEffect(() => {
    if (existingLead) {
      setFormData(mapLeadToForm(existingLead));
    } else if (!isEditing) {
      setFormData(INITIAL_FORM);
    }
  }, [existingLead, isEditing]);

  useEffect(() => {
    return () => {
      dispatch(clearLeadError());
      dispatch(clearLeadDetailsError());
    };
  }, [dispatch]);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setFormError("");
  }, []);

  const validateStep = (currentStep) => {
    if (currentStep === 0) {
      if (!formData.businessName.trim()) {
        return "Business name is required.";
      }

      if (
        formData.category === "Other" &&
        !formData.customCategory.trim()
      ) {
        return "Please enter the custom business category.";
      }
    }

    if (currentStep === 1 && formData.email.trim()) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(formData.email.trim())) {
        return "Please enter a valid email address.";
      }
    }

    if (currentStep === 2) {
      for (const [field, label] of [
        ["googleMapsUrl", "Google Maps URL"],
        ["websiteUrl", "Website URL"],
      ]) {
        const value = formData[field].trim();

        if (!value) continue;

        try {
          const url = new URL(value);

          if (!["http:", "https:"].includes(url.protocol)) {
            return `${label} must use HTTP or HTTPS.`;
          }
        } catch {
          return `Please enter a valid ${label}.`;
        }
      }
    }

    if (
      currentStep === 3 &&
      formData.potentialBudget !== "" &&
      (!Number.isFinite(Number(formData.potentialBudget)) ||
        Number(formData.potentialBudget) < 0)
    ) {
      return "Potential budget must be a non-negative number.";
    }

    return "";
  };

  const handleNext = () => {
    const validationError = validateStep(step);

    if (validationError) {
      setFormError(validationError);
      return;
    }

    setFormError("");
    setStep((current) => Math.min(current + 1, STEPS.length - 1));
  };

  const handlePrevious = () => {
    setFormError("");
    setStep((current) => Math.max(current - 1, 0));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateStep(step);

    if (validationError) {
      setFormError(validationError);
      return;
    }

    if (!formData.businessName.trim()) {
      setStep(0);
      setFormError("Business name is required.");
      return;
    }

    const payload = {
      ...formData,
      businessName: formData.businessName.trim(),
      customCategory: formData.customCategory.trim(),
      contactPerson: formData.contactPerson.trim(),
      phone: formData.phone.trim(),
      whatsapp: formData.whatsapp.trim(),
      email: formData.email.trim(),
      address: formData.address.trim(),
      googleMapsUrl: formData.googleMapsUrl.trim(),
      websiteUrl: formData.websiteUrl.trim(),
      notes: formData.notes.trim(),
      potentialBudget:
        formData.potentialBudget === ""
          ? null
          : Number(formData.potentialBudget),
      nextFollowUpAt: formData.nextFollowUpAt
        ? new Date(formData.nextFollowUpAt).toISOString()
        : null,
    };

    if (payload.category !== "Other") {
      payload.customCategory = "";
    }

    try {
      if (isEditing) {
        await dispatch(
          updateLead({ id, updates: payload })
        ).unwrap();
      } else {
        await dispatch(createLead(payload)).unwrap();
      }

      navigate("/dashboard/leads");
    } catch {
      // Redux stores and displays the backend error.
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field
                label="Business Name"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                placeholder="e.g. Bright Dental Clinic"
                icon={Building2}
                required
              />
            </div>

            <Field
              label="Business Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              options={CATEGORIES}
              icon={Layers}
              required
            />

            {formData.category === "Other" && (
              <Field
                label="Custom Category"
                name="customCategory"
                value={formData.customCategory}
                onChange={handleChange}
                placeholder="Enter business category"
                icon={Layers}
                required
              />
            )}

            <div className="sm:col-span-2">
              <Field
                label="Business Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Area, city, state"
                icon={MapPin}
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field
              label="Contact Person"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleChange}
              placeholder="Owner / manager name"
              icon={UserRound}
            />

            <Field
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              icon={Phone}
            />

            <Field
              label="WhatsApp Number"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              placeholder="WhatsApp number"
              icon={MessageCircle}
            />

            <Field
              label="Email Address"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="owner@example.com"
              type="email"
              icon={Mail}
            />

            <div className="sm:col-span-2">
              <Field
                label="Preferred Contact Method"
                name="bestContactMethod"
                value={formData.bestContactMethod}
                onChange={handleChange}
                options={CONTACT_METHODS}
                icon={MessageCircle}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="grid grid-cols-1 gap-5">
            <Field
              label="Google Maps URL"
              name="googleMapsUrl"
              value={formData.googleMapsUrl}
              onChange={handleChange}
              placeholder="https://www.google.com/maps/..."
              icon={MapPin}
              hint="Optional — paste the business listing link."
            />

            <Field
              label="Existing Website URL"
              name="websiteUrl"
              value={formData.websiteUrl}
              onChange={handleChange}
              placeholder="https://example.com"
              icon={Globe}
            />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field
                label="Website Status"
                name="websiteStatus"
                value={formData.websiteStatus}
                onChange={handleChange}
                options={WEBSITE_STATUSES}
                icon={Globe}
              />

              <Field
                label="Lead Source"
                name="source"
                value={formData.source}
                onChange={handleChange}
                options={SOURCES}
                icon={Layers}
              />
            </div>

            <Field
              label="Lead Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={STATUSES}
              icon={ClipboardList}
            />
          </div>
        );

      case 3:
        return (
          <div className="grid grid-cols-1 gap-5">
            <Field
              label="Potential Budget (INR)"
              name="potentialBudget"
              value={formData.potentialBudget}
              onChange={handleChange}
              placeholder="e.g. 10000"
              type="number"
              min="0"
              icon={ClipboardList}
            />

            <Field
              label="Next Follow-up"
              name="nextFollowUpAt"
              value={formData.nextFollowUpAt}
              onChange={handleChange}
              type="datetime-local"
              icon={CalendarClock}
            />

            <Field
              label="Lead Notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Business requirements, budget, discussion notes..."
              type="textarea"
              rows={5}
              icon={ClipboardList}
            />

            <div className="border border-cyan-500/15 bg-cyan-950/10 p-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-400">
                Record Preview
              </p>

              <h3 className="mt-2 text-lg font-bold text-white">
                {formData.businessName || "Unnamed Business"}
              </h3>

              <p className="mt-1 text-xs text-gray-400">
                {formData.category === "Other"
                  ? formData.customCategory || "Custom category not set"
                  : formData.category}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="border border-cyan-500/20 px-2 py-1 text-[10px] uppercase text-cyan-300">
                  {formData.status}
                </span>
                <span className="border border-pink-500/20 px-2 py-1 text-[10px] uppercase text-pink-300">
                  {formData.websiteStatus}
                </span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoadingLead) {
    return (
      <div className="mx-auto flex max-w-3xl items-center justify-center gap-3 py-24 font-mono text-cyan-300">
        <LoaderCircle className="h-5 w-5 animate-spin" />
        Loading lead record...
      </div>
    );
  }

  if (isEditing && !existingLead && detailsError) {
    return (
      <div className="mx-auto max-w-3xl font-mono">
        <button
          type="button"
          onClick={() => navigate("/dashboard/leads")}
          className="mb-6 inline-flex items-center text-sm text-gray-400 transition hover:text-cyan-400"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          BACK_TO_LEADS
        </button>

        <div className="border border-pink-500/30 bg-pink-500/10 p-5 text-sm text-pink-300">
          {detailsError}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl font-mono">
      <button
        type="button"
        onClick={() => navigate("/dashboard/leads")}
        className="mb-6 inline-flex items-center text-sm uppercase tracking-widest text-gray-400 transition hover:text-cyan-400"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back_to_Leads
      </button>

      <div className="text-[11px] uppercase tracking-[0.25em] text-pink-400">
        // {isEditing ? "Modify_Lead_Record" : "New_Lead_Record"}
      </div>

      <div className="mb-7 mt-2 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-extrabold uppercase tracking-tight text-white sm:text-3xl">
            {isEditing ? "Update " : "Add "}
            <span className="text-cyan-400 drop-shadow-[0_0_14px_rgba(34,211,238,0.35)]">
              Lead
            </span>
          </h1>

          <p className="mt-2 text-xs text-gray-500">
            {isEditing
              ? `Editing ${existingLead?.leadId || "lead record"}`
              : "Create a prospect record in four simple steps."}
          </p>
        </div>

        <div className="text-xs uppercase tracking-widest text-cyan-300">
          STEP_0{step + 1} / 0{STEPS.length}
        </div>
      </div>

      {(error || formError) && (
        <div
          role="alert"
          className="mb-4 border border-pink-500/30 bg-pink-500/10 px-4 py-3 text-sm text-pink-300"
        >
          {formError || error}
        </div>
      )}

      <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {STEPS.map((item, index) => {
          const Icon = item.icon;
          const active = index === step;
          const completed = index < step;

          return (
            <button
              key={item.title}
              type="button"
              onClick={() => {
                if (index <= step) {
                  setFormError("");
                  setStep(index);
                }
              }}
              disabled={index > step}
              className={`flex min-w-0 items-start gap-2 border p-3 text-left transition ${
                active
                  ? "border-cyan-400/60 bg-cyan-400/10"
                  : completed
                  ? "border-emerald-500/30 bg-emerald-500/5"
                  : "border-cyan-500/10 bg-black/30 opacity-60"
              }`}
            >
              <span
                className={`mt-0.5 shrink-0 ${
                  active
                    ? "text-cyan-300"
                    : completed
                    ? "text-emerald-400"
                    : "text-gray-500"
                }`}
              >
                {completed ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
              </span>

              <span className="min-w-0">
                <span className="block truncate text-[10px] uppercase tracking-wider text-gray-200">
                  {item.title}
                </span>
                <span className="mt-1 hidden text-[10px] text-gray-500 sm:block">
                  {item.subtitle}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative space-y-6 border border-cyan-500/15 bg-gradient-to-b from-cyan-950/10 to-black p-5 sm:p-8"
        style={{
          clipPath:
            "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)",
        }}
      >
        <div className="flex items-start justify-between gap-3 border-b border-cyan-500/10 pb-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-pink-400">
              Module / 0{step + 1}
            </p>
            <h2 className="mt-2 text-lg font-bold text-white sm:text-xl">
              {STEPS[step].title}
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              {STEPS[step].subtitle}
            </p>
          </div>

          <div className="border border-cyan-500/20 p-2 text-cyan-300">
            {React.createElement(STEPS[step].icon, {
              className: "h-5 w-5",
            })}
          </div>
        </div>

        {renderStep()}

        <div className="flex flex-col-reverse gap-3 border-t border-cyan-500/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={step === 0 || isSaving}
            className="inline-flex items-center justify-center border border-cyan-500/20 px-5 py-3 text-xs font-bold uppercase tracking-widest text-gray-300 transition hover:border-cyan-400/50 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </button>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center justify-center bg-cyan-400 px-6 py-3 text-xs font-bold uppercase tracking-widest text-black transition hover:bg-cyan-300"
            >
              Next Step
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSaving || loading}
              className="inline-flex items-center justify-center bg-cyan-400 px-6 py-3 text-xs font-bold uppercase tracking-widest text-black transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  {isEditing ? "Update Lead" : "Create Lead"}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          )}
        </div>

        <p className="text-[10px] uppercase tracking-widest text-gray-600">
          * Required fields
        </p>
      </form>
    </div>
  );
};

export default LeadAddUpdate;
