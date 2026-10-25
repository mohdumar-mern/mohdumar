import Counter from "../models/Counter.js";

const generateLeadId = async () => {
  const year = new Date().getFullYear();
  const counterKey = `lead-${year}`;

  const counter = await Counter.findOneAndUpdate(
    { _id: counterKey },
    { $inc: { sequence: 1 } },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );

  const formattedNumber = String(counter.sequence).padStart(3, "0");

  return `LED-${year}-${formattedNumber}`;
};

export default generateLeadId;
