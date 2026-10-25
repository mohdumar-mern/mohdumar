
import mongoose from "mongoose";

const clauseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Clause title is required"],
      trim: true,
      maxlength: [200, "Clause title cannot exceed 200 characters"],
    },
    content: {
      type: String,
      default: "",
      maxlength: [50000, "Clause content cannot exceed 50000 characters"],
    },
  },
  { _id: true }
);

const contractVersionSchema = new mongoose.Schema(
  {
    version: {
      type: Number,
      required: true,
    },
    snapshot: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
  },
  { _id: false }
);

const contractSchema = new mongoose.Schema(
  {
    contractNumber: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Contract title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    clientName: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
      maxlength: [200, "Client name cannot exceed 200 characters"],
    },
    clientEmail: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },
    freelancerName: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    projectDescription: {
      type: String,
      default: "",
      maxlength: 10000,
    },
    paymentAmount: {
      type: Number,
      min: [0, "Payment amount cannot be negative"],
      default: 0,
    },
    currency: {
      type: String,
      default: "INR",
      trim: true,
      uppercase: true,
      maxlength: 3,
    },
    paymentTerms: {
      type: String,
      default: "",
      maxlength: 5000,
    },
    startDate: {
      type: Date,
      default: null,
    },
    endDate: {
      type: Date,
      default: null,
    },
    clauses: {
      type: [clauseSchema],
      default: [],
    },
    status: {
      type: String,
      enum: ["draft", "sent", "signed", "cancelled"],
      default: "draft",
      index: true,
    },
    versions: {
      type: [contractVersionSchema],
      default: [],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
      index: true,
    },
    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      default: null,
    },
    signedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

contractSchema.index({ createdBy: 1, updatedAt: -1 });
contractSchema.index({ createdBy: 1, status: 1 });

const Contract = mongoose.model("Contract", contractSchema);

export default Contract;
