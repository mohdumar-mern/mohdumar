import mongoose from "mongoose";
import Lead from "../models/Lead.js";
import generateLeadId from "../utils/generateLeadId.js";
import asyncHandler from "../utils/asyncHandler.js";
import { getPagination, getPaginationMeta } from "../utils/pagination.js";

const LEAD_STATUSES = [
  "New",
  "Contacted",
  "Interested",
  "Negotiation",
  "Follow-up",
  "Converted",
  "Lost",
];

const WEBSITE_STATUSES = [
  "No Website",
  "Outdated",
  "Needs Improvement",
  "Good Website",
  "Not Verified",
];

const LEAD_CATEGORIES = [
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

const LEAD_SOURCES = [
  "Google Maps",
  "Google Search",
  "Referral",
  "Social Media",
  "Other",
];

const CONTACT_METHODS = ["Phone", "WhatsApp", "Email", "In Person", "Other"];

const CONTACT_OUTCOMES = [
  "No Answer",
  "Connected",
  "Interested",
  "Not Interested",
  "Call Back",
  "Meeting Scheduled",
  "Other",
];

const EDITABLE_FIELDS = [
  "businessName",
  "category",
  "customCategory",
  "contactPerson",
  "phone",
  "whatsapp",
  "email",
  "address",
  "googleMapsUrl",
  "websiteUrl",
  "websiteStatus",
  "source",
  "status",
  "bestContactMethod",
  "potentialBudget",
  "notes",
  "nextFollowUpAt",
];

const CONTACT_HISTORY_FIELDS = [
  "method",
  "contactedAt",
  "outcome",
  "notes",
  "nextFollowUpAt",
];

const createError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const isPlainObject = (value) =>
  value !== null &&
  typeof value === "object" &&
  !Array.isArray(value) &&
  !(value instanceof Date);

const normalizeString = (value) => {
  if (typeof value !== "string") {
    throw createError("Text fields must contain valid strings.");
  }

  return value.trim();
};

const validateEnum = (value, allowedValues, fieldName) => {
  if (value === undefined || value === null || value === "") {
    return value;
  }

  if (typeof value !== "string" || !allowedValues.includes(value)) {
    throw createError(`Invalid ${fieldName} value.`);
  }

  return value;
};

const validateOptionalUrl = (value, fieldName) => {
  if (value === undefined || value === null || value === "") {
    return "";
  }

  if (typeof value !== "string") {
    throw createError(`${fieldName} must be a valid URL.`);
  }

  const trimmed = value.trim();

  try {
    const parsed = new URL(trimmed);

    if (!["http:", "https:"].includes(parsed.protocol)) {
      throw new Error("Invalid protocol");
    }

    return parsed.toString();
  } catch {
    throw createError(`${fieldName} must be a valid HTTP or HTTPS URL.`);
  }
};

const validateOptionalDate = (value, fieldName) => {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw createError(`${fieldName} must be a valid date.`);
  }

  return date;
};

const validateBudget = (value) => {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;

  const budget = Number(value);

  if (!Number.isFinite(budget) || budget < 0) {
    throw createError("Potential budget must be a non-negative number.");
  }

  return budget;
};

const rejectUnknownFields = (body, allowedFields) => {
  if (!isPlainObject(body)) {
    throw createError("Request body must be a JSON object.");
  }

  const unknownFields = Object.keys(body).filter(
    (key) => !allowedFields.includes(key)
  );

  if (unknownFields.length > 0) {
    throw createError(`Unsupported field(s): ${unknownFields.join(", ")}.`);
  }
};

const buildLeadPayload = (body, { isCreate = false } = {}) => {
  rejectUnknownFields(body, EDITABLE_FIELDS);

  const payload = {};

  for (const field of EDITABLE_FIELDS) {
    if (!Object.hasOwn(body, field)) continue;

    const value = body[field];

    switch (field) {
      case "category":
        payload.category = validateEnum(value, LEAD_CATEGORIES, "category");
        break;

      case "websiteStatus":
        payload.websiteStatus = validateEnum(
          value,
          WEBSITE_STATUSES,
          "website status"
        );
        break;

      case "source":
        payload.source = validateEnum(value, LEAD_SOURCES, "source");
        break;

      case "status":
        payload.status = validateEnum(value, LEAD_STATUSES, "lead status");
        break;

      case "bestContactMethod":
        payload.bestContactMethod = validateEnum(
          value,
          CONTACT_METHODS,
          "contact method"
        );
        break;

      case "googleMapsUrl":
      case "websiteUrl":
        payload[field] = validateOptionalUrl(value, field);
        break;

      case "nextFollowUpAt":
        payload.nextFollowUpAt = validateOptionalDate(
          value,
          "Next follow-up date"
        );
        break;

      case "potentialBudget":
        payload.potentialBudget = validateBudget(value);
        break;

      case "businessName":
      case "contactPerson":
      case "phone":
      case "whatsapp":
      case "email":
      case "address":
      case "customCategory":
      case "notes": {
        if (value === null && field !== "businessName") {
          payload[field] = "";
          break;
        }

        payload[field] = normalizeString(value);
        break;
      }

      default:
        payload[field] = value;
    }
  }

  if (isCreate && (!payload.businessName || !payload.businessName.trim())) {
    throw createError("Business name is required.");
  }

  return payload;
};

const validateCategoryCombination = (category, customCategory) => {
  if (!category) return;

  if (category === "Other") {
    if (typeof customCategory !== "string" || !customCategory.trim()) {
      throw createError(
        "Please enter a custom category when category is Other."
      );
    }
  }
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const validateObjectId = (id) => {
  if (!mongoose.isValidObjectId(id)) {
    throw createError("Invalid lead ID.", 400);
  }
};

const findLeadOrThrow = async (id) => {
  validateObjectId(id);

  const lead = await Lead.findById(id);

  if (!lead) {
    throw createError("Lead not found.", 404);
  }

  return lead;
};

/**
 * GET /api/leads
 * Search, filter and paginate leads.
 */
export const getLeads = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);

  const { search, status, category, websiteStatus, source, followUp } =
    req.query;

  const filter = {};

  if (search !== undefined) {
    if (typeof search !== "string") {
      throw createError("Search must be a string.");
    }

    const searchTerm = search.trim();

    if (searchTerm.length > 100) {
      throw createError("Search cannot exceed 100 characters.");
    }

    if (searchTerm) {
      const safeSearch = escapeRegex(searchTerm);
      const regex = new RegExp(safeSearch, "i");

      filter.$or = [
        { leadId: regex },
        { businessName: regex },
        { contactPerson: regex },
        { phone: regex },
        { email: regex },
        { address: regex },
      ];
    }
  }

  if (status !== undefined) {
    filter.status = validateEnum(status, LEAD_STATUSES, "lead status");
  }

  if (category !== undefined) {
    filter.category = validateEnum(category, LEAD_CATEGORIES, "category");
  }

  if (websiteStatus !== undefined) {
    filter.websiteStatus = validateEnum(
      websiteStatus,
      WEBSITE_STATUSES,
      "website status"
    );
  }

  if (source !== undefined) {
    filter.source = validateEnum(source, LEAD_SOURCES, "source");
  }

  if (followUp !== undefined) {
    if (!["upcoming", "overdue", "none"].includes(followUp)) {
      throw createError("Follow-up filter must be upcoming, overdue, or none.");
    }

    const now = new Date();

    if (followUp === "upcoming") {
      filter.nextFollowUpAt = { $gte: now };
    } else if (followUp === "overdue") {
      filter.nextFollowUpAt = { $lt: now, $ne: null };
    } else {
      filter.$and = [
        ...(filter.$and || []),
        {
          $or: [
            { nextFollowUpAt: null },
            { nextFollowUpAt: { $exists: false } },
          ],
        },
      ];
    }
  }

  const [leads, total] = await Promise.all([
    Lead.find(filter)
      .sort({ createdAt: -1, _id: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Lead.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: { leads },
    pagination: getPaginationMeta({ page, limit, total }),
  });
});

/**
 * GET /api/leads/:id
 * Get one lead.
 */
export const getLeadById = asyncHandler(async (req, res) => {
  const lead = await findLeadOrThrow(req.params.id);

  res.status(200).json({
    success: true,
    data: { lead },
  });
});

/**
 * POST /api/leads
 * Create a lead with a server-generated lead ID.
 */
export const createLead = asyncHandler(async (req, res) => {
  const payload = buildLeadPayload(req.body, { isCreate: true });

  validateCategoryCombination(payload.category, payload.customCategory);

  const leadId = await generateLeadId();

  const lead = await Lead.create({
    ...payload,
    leadId,
  });

  res.status(201).json({
    success: true,
    message: "Lead created successfully.",
    data: { lead },
  });
});

/**
 * PATCH /api/leads/:id
 * Update editable lead fields only.
 */
export const updateLead = asyncHandler(async (req, res) => {
  const lead = await findLeadOrThrow(req.params.id);
  const payload = buildLeadPayload(req.body);

  if (Object.keys(payload).length === 0) {
    throw createError("Provide at least one field to update.");
  }

  const effectiveCategory = payload.category ?? lead.category;

  const effectiveCustomCategory = Object.hasOwn(payload, "customCategory")
    ? payload.customCategory
    : lead.customCategory;

  validateCategoryCombination(effectiveCategory, effectiveCustomCategory);

  // If category changes away from Other, remove its custom value.
  if (Object.hasOwn(payload, "category") && payload.category !== "Other") {
    payload.customCategory = "";
  }

  for (const [key, value] of Object.entries(payload)) {
    lead[key] = value;
  }

  await lead.save();

  res.status(200).json({
    success: true,
    message: "Lead updated successfully.",
    data: { lead },
  });
});

/**
 * DELETE /api/leads/:id
 * Permanently delete a lead.
 * Generated lead IDs are not reused because the counter only increments.
 */
export const deleteLead = asyncHandler(async (req, res) => {
  const lead = await findLeadOrThrow(req.params.id);

  await lead.deleteOne();

  res.status(200).json({
    success: true,
    message: "Lead deleted successfully.",
    data: { leadId: lead.leadId },
  });
});

/**
 * POST /api/leads/:id/contact-history
 * Append a contact attempt to the lead's history.
 */
export const addContactHistory = asyncHandler(async (req, res) => {
  const lead = await findLeadOrThrow(req.params.id);

  rejectUnknownFields(req.body, CONTACT_HISTORY_FIELDS);

  const { method, contactedAt, outcome, notes, nextFollowUpAt } = req.body;

  if (!method || !outcome) {
    throw createError("Contact method and outcome are required.");
  }

  const validatedMethod = validateEnum(
    method,
    CONTACT_METHODS,
    "contact method"
  );

  const validatedOutcome = validateEnum(
    outcome,
    CONTACT_OUTCOMES,
    "contact outcome"
  );

  let validatedNotes = "";

  if (notes !== undefined && notes !== null) {
    validatedNotes = normalizeString(notes);
  }

  const contactDate =
    validateOptionalDate(contactedAt, "Contact date") || new Date();

  const followUpDate = validateOptionalDate(
    nextFollowUpAt,
    "Next follow-up date"
  );

  const historyEntry = {
    method: validatedMethod,
    contactedAt: contactDate,
    outcome: validatedOutcome,
    notes: validatedNotes,
    ...(followUpDate !== undefined ? { nextFollowUpAt: followUpDate } : {}),
  };

  lead.contactHistory.push(historyEntry);

  // Keep lead status and next follow-up in sync where appropriate.
  if (validatedOutcome === "Interested" && lead.status === "New") {
    lead.status = "Interested";
  } else if (
    ["Connected", "No Answer", "Call Back"].includes(validatedOutcome) &&
    lead.status === "New"
  ) {
    lead.status = "Contacted";
  }

  if (followUpDate !== undefined) {
    lead.nextFollowUpAt = followUpDate;
  }

  await lead.save();

  res.status(201).json({
    success: true,
    message: "Contact history added successfully.",
    data: { lead },
  });
});
