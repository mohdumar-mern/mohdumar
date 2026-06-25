import expressAsyncHandler from "express-async-handler";
import Project from "../models/projectModel.js";
import { getCache, setCache, delCache } from "../utils/cache.js";
import { deleteFileFromCloudinary } from "../config/cloudinary.js";

// @desc   Add a new project
// @route  POST /api/projects
// @access Public or Protected
export const addProject = expressAsyncHandler(async (req, res) => {
  const { title, description, techStack, liveDemo, githubLink, imageUrl } = req.body;
  console.log("Body data",req.body)

  const project = new Project({
    title,
    description,
    techStack,
    liveDemo,
    githubLink,
    imageUrl,
  });

  const savedProject = await project.save();
  if (!savedProject) {
    return res.status(500).json({ message: "Failed to save project" });
  }

  res.status(201).json({ data: savedProject });
});

// @desc   Get all projects (paginated with Redis cache)
// @route  GET /api/projects
// @access Public
export const getProjects = expressAsyncHandler(async (req, res) => {
  const { page = 1, limit = 9 } = req.query;
  const cacheKey = `allProject_page${page}_limit${limit}`;

  const cached = await getCache(cacheKey);
  if (cached) {
    return res.status(200).json({ from: "cache", ...cached });
  }

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { createdAt: -1 }, // 🔥 Sort by latest first
    lean: true,
  };

  const projects = await Project.paginate({}, options);

  if (!projects || !projects.docs?.length) {
    return res.status(404).json({ message: "No projects found" });
  }

  const response = {
    data: projects.docs,
    totalDocs: projects.totalDocs,
    limit: projects.limit,
    totalPages: projects.totalPages,
    currentPage: projects.page,
    pagingCounter: projects.pagingCounter,
    hasPrevPage: projects.hasPrevPage,
    hasNextPage: projects.hasNextPage,
    prevPage: projects.prevPage,
    nextPage: projects.nextPage,
  };

  await setCache(cacheKey, response, 300);
  res.status(200).json({ from: "db", ...response });
});

// @desc   Get Single Project by ID
// @route  GET /api/projects/:id
// @access Public
export const getProjectById = expressAsyncHandler(async (req, res) => {
  const cacheKey = `project:${req.params.id}`;
  const cached = await getCache(cacheKey);
  if (cached) return res.status(200).json({ from: "cache", data: cached });

  const project = await Project.findById(req.params.id).lean();
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  await setCache(cacheKey, project, 300);
  res.status(200).json({ from: "db", data: project });
});

// @desc   Update Single Project
// @route  PUT /api/projects/:id
// @access Public
export const updateProject = expressAsyncHandler(async (req, res) => {
  const { title, description, techStack, liveDemo, githubLink, imageUrl } = req.body;

  const project = await Project.findById(req.params.id);
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

 
  const updatedProject = await Project.findByIdAndUpdate(
    req.params.id,
    {
      title: title || project.title,
      description: description || project.description,
      techStack: techStack || project.techStack,
      liveDemo: liveDemo || project.liveDemo,
      githubLink: githubLink || project.githubLink,
      imageUrl: imageUrl || project.imageUrl,
    },
    { new: true, runValidators: true }
  ).lean();

  if (!updatedProject) {
    return res.status(400).json({ message: "Failed to update project" });
  }

  await delCache("allProject*");
  await delCache(`project:${req.params.id}`);
  res.status(200).json({ data: updatedProject });
});

// @desc   Delete Single Project
// @route  DELETE /api/projects/:id
// @access Public
export const deleteProject = expressAsyncHandler(async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id).lean();
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  await delCache("allProject*");
  await delCache(`project:${req.params.id}`);
  res.status(200).json({ message: "Project deleted successfully" });
});
