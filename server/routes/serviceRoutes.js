import express from "express";

const router = express.Router();
import upload from "../middlewares/multerMiddleware.js";
import {
  addService,
  getServices,
  getSingleService,
  updateService,
  deleteService,
} from "../controllers/servicesController.js";

router.get('/', getServices)
router.get('/:id/view', getSingleService)
router.post('/add',upload.single("file"),  addService)
router.put('/:id/edit', upload.single("file"), updateService)
router.delete('/:id', deleteService)

export default router