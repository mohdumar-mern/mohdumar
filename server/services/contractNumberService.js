
import ContractCounter from "../models/contractCounterModel.js";

export const generateContractNumber = async () => {
  const year = new Date().getFullYear();
  const counterId = `contract-${year}`;

  const counter = await ContractCounter.findOneAndUpdate(
    { _id: counterId },
    { $inc: { sequence: 1 } },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );

  return `CTR-${year}-${String(counter.sequence).padStart(6, "0")}`;
};
