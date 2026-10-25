import mongoose from "mongoose";

const counterSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },

    sequence: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  },
  {
    versionKey: false,
  }
);

export default mongoose.model("Counter", counterSchema);
