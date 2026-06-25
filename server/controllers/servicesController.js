import Service from "../models/servicesModel.js";
import expressAsyncHandler from "express-async-handler";
import { delCache, getCache, setCache } from "../utils/cache.js";

// @desc   Add Single Service
// @route  POST /api/services/add
// @access Public
export const addService = expressAsyncHandler(async (req, res) => {
  const { title, description, category, status = "active" } = req.body;

  if (!req.file) {
    return res.status(400).json({ success: false, error: "No service image uploaded" });
  }

  const fileUrl = req.file.path || req.file.url;
  const public_id = req.file.public_id || req.file.filename || null;

  const service = new Service({
    title,
    description,
    category,
    status,
    file: { url: fileUrl, public_id },
  });

  const savedService = await service.save();
  if (!savedService) return res.status(500).json({ message: "Failed to save service" });

  await delCache("allServices");
  res.status(201).json({ data: savedService });
});

// @desc   Get all Services
// @route  GET /api/services
// @access Public
export const getServices = expressAsyncHandler(async (req, res) => {
  const cacheKey = "allServices";
  const cached = await getCache(cacheKey);
  if (cached) return res.status(200).json({ from: "cache", data: cached });

  const services = await Service.find().lean();
  if (!services?.length) return res.status(404).json({ message: "Services not found" });

  await setCache(cacheKey, services, 300);
  res.status(200).json({ from: "db", data: services });
});


// @desc   Get Single Service by ID
// @route  GET /api/services/:id/view
// @access Public
export const getSingleService = expressAsyncHandler(async (req, res) => {
  const cacheKey = `service:${req.params.id}`;
  const cached = await getCache(cacheKey);
  if (cached) return res.status(200).json({ from: "cache", data: cached });

  const service = await Service.findById(req.params.id).lean();
  if (!service) return res.status(404).json({ message: "Service not found" });

  await setCache(cacheKey, service, 300);
  res.status(200).json({ from: "db", data: service });
});

// @desc   Update Service
// @route  PUT /api/services/:id/edit
// @access Public
export const updateService = expressAsyncHandler(async (req, res) => {
  const { title, description, category, status } = req.body;
  const service = await Service.findById(req.params.id);
  if (!service) return res.status(404).json({ message: "Service not found" });

  let fileUrl = service.file?.url || "";
  let public_id = service.file?.public_id || "";

  if (req.file) {
    fileUrl = req.file.path || req.file.url || fileUrl;
    public_id = req.file.public_id || req.file.filename || public_id;
  }

  const updatedService = await Service.findByIdAndUpdate(
    req.params.id,
    {
      title: title || service.title,
      description: description || service.description,
      category: category || service.category,
      status: status || service.status,
      file: { url: fileUrl, public_id },
    },
    { new: true, runValidators: true }
  ).lean();

  if (!updatedService) return res.status(400).json({ message: "Failed to update service" });

  await delCache("allServices");
  await delCache(`service:${req.params.id}`);
  res.status(200).json({ data: updatedService });
});

// @desc   Delete Service
// @route  DELETE /api/services/:id
// @access Public
export const deleteService = expressAsyncHandler(async (req, res) => {
  const service = await Service.findByIdAndDelete(req.params.id).lean();
  if (!service) return res.status(404).json({ message: "Service not found" });

  await delCache("allServices");
  await delCache(`service:${req.params.id}`);
  res.status(200).json({ message: "Service deleted successfully" });
});
