import express from "express";
import { protect } from "../middlewares/authMiddleware.js";

import {
  createContract,
  getContracts,
  getContractById,
  updateContract,
  deleteContract,
  downloadContractPdf,
  getContractVersions,
  updateContractStatus,
} from "../controllers/contractController.js";

const router = express.Router();

// All contract routes require authentication.
router.use(protect);

router.route("/").get(getContracts).post(createContract);

router
  .route("/:id")
  .get(getContractById)
  .patch(updateContract)
  .delete(deleteContract);

router
  .router("/:id/pdf")
  .get("/:id/pdf", downloadContractPdf)
  .get("/:id/versions", getContractVersions)
  .patch("/:id/status", updateContractStatus);

export default router;
