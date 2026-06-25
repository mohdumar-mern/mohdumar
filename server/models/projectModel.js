import mongoose from 'mongoose';
import mongoosePaginate from "mongoose-paginate-v2"

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    minlength: [3, 'Title must be at least 3 characters'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [10, 'Description must be at least 10 characters'],
    trim: true,
  },
  techStack: {
    type: [String],
    required: [true, 'Tech stack is required'],
    validate: {
      validator: (arr) => Array.isArray(arr) && arr.length > 0,
      message: 'Tech stack must include at least one technology',
    },
  },
  githubLink: {
    type: String,
    validate: {
      validator: (v) => !v || /^https?:\/\/.+/.test(v),
      message: 'GitHub link must be a valid URL',
    },
  },
  liveDemo: {
    type: String,
    validate: {
      validator: (v) => !v || /^https?:\/\/.+/.test(v),
      message: 'Live demo must be a valid URL (if provided)',
    },
  },
  imageUrl: {
    type: String,
    validate: {
      validator: (v) => !v || /^https?:\/\/.+/.test(v),
      message: 'Image url is invalid (if provided)',
    },
  },
  // file: {
  //   url: String,
  //   public_id: String,
  // },
}, { timestamps: true });

projectSchema.plugin(mongoosePaginate)
const Project = mongoose.model('Project', projectSchema);
export default Project;
