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
  router.get("/:id/versions", getContractVersions);
router
  .route("/:id/pdf")
  .get(downloadContractPdf)
  // .get(getContractVersions)
  .patch(updateContractStatus);

export default router;
