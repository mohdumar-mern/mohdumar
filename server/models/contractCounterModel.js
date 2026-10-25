
import mongoose from "mongoose";

const contractCounterSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  sequence: {
    type: Number,
    default: 0,
    min: 0,
  },
});

const ContractCounter = mongoose.model(
  "ContractCounter",
  contractCounterSchema
);

export default ContractCounter;
