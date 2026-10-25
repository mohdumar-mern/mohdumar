import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import Contract from "../models/contractModel.js";
import { getPagination, getPaginationMeta } from "../utils/pagination.js";
import { generateContractPdf } from "../services/contractPdfService.js";
import { generateContractNumber } from "../services/contractNumberService.js";

const CONTRACT_STATUSES = ["draft", "sent", "signed", "cancelled"];

const EDITABLE_FIELDS = [
  "title",
  "clientName",
  "clientEmail",
  "freelancerName",
  "projectDescription",
  "paymentAmount",
  "currency",
  "paymentTerms",
  "startDate",
  "endDate",
  "clauses",
  "status",
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

const rejectUnknownFields = (body, allowedFields) => {
  if (!isPlainObject(body)) {
    throw createError("Request body must be a JSON object.");
  }

  const unknownFields = Object.keys(body).filter(
    (key) => !allowedFields.includes(key)
  );

  if (unknownFields.length) {
    throw createError(`Unsupported field(s): ${unknownFields.join(", ")}.`);
  }
};

const normalizeString = (value, fieldName, maxLength) => {
  if (typeof value !== "string") {
    throw createError(`${fieldName} must be a string.`);
  }

  const result = value.trim();

  if (result.length > maxLength) {
    throw createError(`${fieldName} cannot exceed ${maxLength} characters.`);
  }

  return result;
};

const validateDate = (value, fieldName) => {
  if (value === null || value === "") return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw createError(`${fieldName} must be a valid date.`);
  }

  return date;
};

const validateClauses = (clauses) => {
  if (!Array.isArray(clauses)) {
    throw createError("Clauses must be an array.");
  }

  if (clauses.length > 100) {
    throw createError("A contract cannot contain more than 100 clauses.");
  }

  return clauses.map((clause) => {
    if (!isPlainObject(clause)) {
      throw createError("Each clause must be an object.");
    }

    const allowedClauseFields = ["_id", "id", "title", "content"];

    rejectUnknownFields(clause, allowedClauseFields);

    const title = normalizeString(clause.title, "Clause title", 200);

    if (!title) {
      throw createError("Clause title is required.");
    }

    const content =
      clause.content === undefined
        ? ""
        : normalizeString(clause.content, "Clause content", 50000);

    const result = { title, content };

    // Preserve existing clause IDs when editing or reordering.
    const clauseId = clause._id ?? clause.id;

    if (clauseId !== undefined) {
      if (!mongoose.isValidObjectId(clauseId)) {
        throw createError("Invalid clause ID.");
      }

      result._id = clauseId;
    }

    return result;
  });
};

const buildContractPayload = (body, { isCreate = false } = {}) => {
  rejectUnknownFields(body, EDITABLE_FIELDS);

  const payload = {};

  for (const field of EDITABLE_FIELDS) {
    if (!Object.hasOwn(body, field)) continue;

    const value = body[field];

    switch (field) {
      case "title":
        payload.title = normalizeString(value, "Title", 200);
        if (!payload.title) throw createError("Contract title is required.");
        break;

      case "clientName":
        payload.clientName = normalizeString(value, "Client name", 200);
        if (!payload.clientName) throw createError("Client name is required.");
        break;

      case "clientEmail": {
        const email = normalizeString(value, "Client email", 254).toLowerCase();

        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          throw createError("Please provide a valid client email.");
        }

        payload.clientEmail = email;
        break;
      }

      case "freelancerName":
        payload.freelancerName = normalizeString(value, "Freelancer name", 200);
        break;

      case "projectDescription":
        payload.projectDescription = normalizeString(
          value,
          "Project description",
          10000
        );
        break;

      case "paymentTerms":
        payload.paymentTerms = normalizeString(value, "Payment terms", 5000);
        break;

      case "currency": {
        const currency = normalizeString(value, "Currency", 3).toUpperCase();

        if (!/^[A-Z]{3}$/.test(currency)) {
          throw createError("Currency must be a three-letter currency code.");
        }

        payload.currency = currency;
        break;
      }

      case "paymentAmount": {
        const amount = Number(value);

        if (
          value === null ||
          value === "" ||
          !Number.isFinite(amount) ||
          amount < 0
        ) {
          throw createError("Payment amount must be a non-negative number.");
        }

        payload.paymentAmount = amount;
        break;
      }

      case "startDate":
      case "endDate":
        payload[field] = validateDate(value, field);
        break;

      case "clauses":
        payload.clauses = validateClauses(value);
        break;

      case "status":
        if (!CONTRACT_STATUSES.includes(value)) {
          throw createError("Invalid contract status.");
        }

        payload.status = value;
        break;

      default:
        throw createError(`Unsupported field: ${field}.`);
    }
  }

  if (isCreate) {
    if (!payload.title) throw createError("Contract title is required.");
    if (!payload.clientName) throw createError("Client name is required.");
  }

  const effectiveStartDate = payload.startDate;
  const effectiveEndDate = payload.endDate;

  if (
    effectiveStartDate instanceof Date &&
    effectiveEndDate instanceof Date &&
    effectiveEndDate < effectiveStartDate
  ) {
    throw createError("End date cannot be earlier than start date.");
  }

  return payload;
};

const validateContractId = (id) => {
  if (!mongoose.isValidObjectId(id)) {
    throw createError("Invalid contract ID.");
  }
};

const findOwnedContractOrThrow = async (id, userId) => {
  validateContractId(id);

  const contract = await Contract.findOne({
    _id: id,
    createdBy: userId,
  });

  if (!contract) {
    throw createError("Contract not found.", 404);
  }

  return contract;
};

const createSnapshot = (contract) => ({
  contractNumber: contract.contractNumber,
  title: contract.title,
  clientName: contract.clientName,
  clientEmail: contract.clientEmail,
  freelancerName: contract.freelancerName,
  projectDescription: contract.projectDescription,
  paymentAmount: contract.paymentAmount,
  currency: contract.currency,
  paymentTerms: contract.paymentTerms,
  startDate: contract.startDate,
  endDate: contract.endDate,
  clauses: contract.clauses.map((clause) => ({
    _id: clause._id,
    title: clause.title,
    content: clause.content,
  })),
  status: contract.status,
  signedAt: contract.signedAt,
});

const recordVersion = (contract, userId) => {
  contract.versions.push({
    version: (contract.versions.at(-1)?.version ?? 0) + 1,
    snapshot: createSnapshot(contract),
    changedAt: new Date(),
    changedBy: userId,
  });
};

// GET /api/contracts
export const getContracts = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const { search, status } = req.query;

  const filter = { createdBy: req.user._id };

  if (status !== undefined) {
    if (!CONTRACT_STATUSES.includes(status)) {
      throw createError("Invalid contract status.");
    }

    filter.status = status;
  }

  if (search !== undefined) {
    if (typeof search !== "string" || search.length > 100) {
      throw createError("Search must be a string of at most 100 characters.");
    }

    const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    if (escaped) {
      filter.$or = [
        { title: new RegExp(escaped, "i") },
        { clientName: new RegExp(escaped, "i") },
        { contractNumber: new RegExp(escaped, "i") },
      ];
    }
  }

  const [contracts, total] = await Promise.all([
    Contract.find(filter)
      .sort({ updatedAt: -1, _id: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Contract.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: { contracts },
    pagination: getPaginationMeta({ page, limit, total }),
  });
});

// GET /api/contracts/:id
export const getContractById = asyncHandler(async (req, res) => {
  const contract = await findOwnedContractOrThrow(req.params.id, req.user._id);

  res.status(200).json({
    success: true,
    data: { contract },
  });
});

// POST /api/contracts
export const createContract = asyncHandler(async (req, res) => {
  const payload = buildContractPayload(req.body, { isCreate: true });

  const contract = new Contract({
    ...payload,
    contractNumber: await generateContractNumber(),
    createdBy: req.user._id,
    lastModifiedBy: req.user._id,
  });

  // Save the initial version as version 1.
  recordVersion(contract, req.user._id);

  await contract.save();

  res.status(201).json({
    success: true,
    message: "Contract created successfully.",
    data: { contract },
  });
});

// PATCH /api/contracts/:id
export const updateContract = asyncHandler(async (req, res) => {
  const contract = await findOwnedContractOrThrow(req.params.id, req.user._id);

  const payload = buildContractPayload(req.body);

  if (Object.keys(payload).length === 0) {
    throw createError("Provide at least one field to update.");
  }

  const currentStart = Object.hasOwn(payload, "startDate")
    ? payload.startDate
    : contract.startDate;

  const currentEnd = Object.hasOwn(payload, "endDate")
    ? payload.endDate
    : contract.endDate;

  if (currentStart && currentEnd && currentEnd < currentStart) {
    throw createError("End date cannot be earlier than start date.");
  }

  // Do not allow changing a signed contract through this general endpoint.
  if (contract.status === "signed") {
    throw createError("Signed contracts cannot be edited.");
  }

  if (payload.status === "signed") {
    throw createError(
      "Use a dedicated signing workflow to mark a contract as signed."
    );
  }

  const changed = Object.entries(payload).some(([key, value]) => {
    const currentValue = contract[key];

    if (key === "clauses") {
      const normalize = (clauses) =>
        clauses.map((clause) => ({
          id: String(clause._id ?? clause.id ?? ""),
          title: clause.title,
          content: clause.content,
        }));

      return (
        JSON.stringify(normalize(currentValue)) !==
        JSON.stringify(normalize(value))
      );
    }

    if (currentValue instanceof Date || value instanceof Date) {
      return (
        (currentValue ? new Date(currentValue).getTime() : null) !==
        (value ? new Date(value).getTime() : null)
      );
    }

    return String(currentValue ?? "") !== String(value ?? "");
  });

  if (!changed) {
    return res.status(200).json({
      success: true,
      message: "No changes detected.",
      data: { contract },
    });
  }

  // Keep a snapshot of the current version before applying changes.
  recordVersion(contract, req.user._id);

  for (const [key, value] of Object.entries(payload)) {
    contract[key] = value;
  }

  contract.lastModifiedBy = req.user._id;

  await contract.save();

  res.status(200).json({
    success: true,
    message: "Contract updated successfully.",
    data: { contract },
  });
});

// DELETE /api/contracts/:id
export const deleteContract = asyncHandler(async (req, res) => {
  const contract = await findOwnedContractOrThrow(req.params.id, req.user._id);

  if (contract.status === "signed") {
    throw createError("Signed contracts cannot be deleted.");
  }

  await contract.deleteOne();

  res.status(200).json({
    success: true,
    message: "Contract deleted successfully.",
    data: { id: contract._id },
  });
});

export const downloadContractPdf = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    res.status(400);
    throw new Error("Invalid contract ID.");
  }

  const contract = await Contract.findOne({
    _id: id,
    createdBy: req.user._id,
  });

  if (!contract) {
    res.status(404);
    throw new Error("Contract not found.");
  }

  const pdfBuffer = await generateContractPdf(contract);

  const contractRef = String(contract.contractNumber || contract._id).replace(
    /[^a-zA-Z0-9_-]/g,
    "_"
  );

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="contract-${contractRef}.pdf"`
  );
  res.setHeader("Content-Length", pdfBuffer.length);
  res.setHeader("Cache-Control", "private, no-store");

  return res.status(200).send(pdfBuffer);
});

export const getContractVersions = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    res.status(400);
    throw new Error("Invalid contract ID.");
  }

  const contract = await Contract.findOne({
    _id: id,
    createdBy: req.user._id,
  }).select("contractNumber title versions");

  if (!contract) {
    res.status(404);
    throw new Error("Contract not found.");
  }

  res.status(200).json({
    success: true,
    data: {
      contractId: contract._id,
      contractNumber: contract.contractNumber,
      title: contract.title,
      versions: contract.versions,
    },
  });
});

export const updateContractStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowedTransitions = {
    draft: ["sent", "cancelled"],
    sent: ["draft", "cancelled"],
    cancelled: [],
    signed: [],
  };

  if (!mongoose.isValidObjectId(id)) {
    res.status(400);
    throw new Error("Invalid contract ID.");
  }

  if (!["draft", "sent", "cancelled"].includes(status)) {
    res.status(400);
    throw new Error(
      "Invalid status. Signing requires a separate signing workflow."
    );
  }

  const contract = await Contract.findOne({
    _id: id,
    createdBy: req.user._id,
  });

  if (!contract) {
    res.status(404);
    throw new Error("Contract not found.");
  }

  if (!allowedTransitions[contract.status]?.includes(status)) {
    res.status(400);
    throw new Error(
      `Status transition from '${contract.status}' to '${status}' is not allowed.`
    );
  }

  // Record the previous state before changing the status.
  recordVersion(contract, req.user._id);

  contract.status = status;
  contract.lastModifiedBy = req.user._id;

  await contract.save();

  res.status(200).json({
    success: true,
    message: "Contract status updated successfully.",
    data: { contract },
  });
});
