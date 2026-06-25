import multer from "multer";
import {CloudinaryStorage} from "multer-storage-cloudinary"
import cloudinary from "../config/cloudinary.js";

// Allowed file formats
const ALLOWED_FORMATS = ["jpg", "jpeg", "png", "pdf", "docx"];

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isPDF = file.mimetype === 'application/pdf';
    const folder = isPDF ? 'pdfs' : 'images';
    const resourceType = isPDF ? 'raw' : 'image'; // ✅ force PDF as raw
    const originalName = file.originalname.split('.')[0].replace(/\s+/g, "_");

    return {
      folder: `portfolio/${folder}`,
      resource_type: resourceType,
      public_id: `${Date.now()}-${originalName}`,
    };
  },
});


// Setup multer middleware
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = file.originalname.split(".").pop().toLowerCase();
    if (ALLOWED_FORMATS.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, JPEG, PNG, PDF, and DOCX files are allowed"), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

export default upload;
