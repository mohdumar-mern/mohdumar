import mongoose from "mongoose";

const CONTACT_METHODS = ["Phone", "WhatsApp", "Email", "In Person", "Other"];

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

const LEAD_SOURCES = [
  "Google Maps",
  "Google Search",
  "Referral",
  "Social Media",
  "Other",
];

const BUSINESS_CATEGORIES = [
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

const contactHistorySchema = new mongoose.Schema(
  {
    method: {
      type: String,
      enum: CONTACT_METHODS,
      required: true,
    },
    contactedAt: {
      type: Date,
      default: Date.now,
    },
    outcome: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    nextFollowUpAt: {
      type: Date,
      default: null,
    },
  },
  { _id: true }
);

const leadSchema = new mongoose.Schema(
  {
    leadId: {
      type: String,
      required: true,
      immutable: true,
      unique: true,
      trim: true,
    },

    businessName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    category: {
      type: String,
      required: true,
      enum: BUSINESS_CATEGORIES,
    },

    customCategory: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
      validate: {
        validator(value) {
          return (
            this.category !== "Other" ||
            (typeof value === "string" && value.trim().length > 0)
          );
        },
        message: "Please specify the custom business category.",
      },
    },

    contactPerson: {
      type: String,
      trim: true,
      maxlength: 120,
      default: "",
    },

    phone: {
      type: String,
      trim: true,
      maxlength: 25,
      default: "",
    },

    whatsapp: {
      type: String,
      trim: true,
      maxlength: 25,
      default: "",
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 254,
      default: "",
      validate: {
        validator(value) {
          return !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: "Please provide a valid email address.",
      },
    },

    address: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    googleMapsUrl: {
      type: String,
      trim: true,
      maxlength: 2048,
      default: "",
    },

    websiteUrl: {
      type: String,
      trim: true,
      maxlength: 2048,
      default: "",
    },

    websiteStatus: {
      type: String,
      enum: WEBSITE_STATUSES,
      default: "Not Verified",
    },

    source: {
      type: String,
      enum: LEAD_SOURCES,
      default: "Google Maps",
    },

    status: {
      type: String,
      enum: LEAD_STATUSES,
      default: "New",
      index: true,
    },

    bestContactMethod: {
      type: String,
      enum: CONTACT_METHODS,
      default: "WhatsApp",
    },

    potentialBudget: {
      type: Number,
      min: 0,
      default: null,
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 5000,
      default: "",
    },

    nextFollowUpAt: {
      type: Date,
      default: null,
      index: true,
    },

    contactHistory: {
      type: [contactHistorySchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Helpful for searching leads by business and phone.
leadSchema.index({ businessName: 1, phone: 1 });

export default mongoose.model("Lead", leadSchema);
