import mongoose from 'mongoose';
import mongoosePaginate from "mongoose-paginate-v2"

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name must be at most 50 characters long'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/.+\@.+\..+/, 'Please enter a valid email address'],
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^\+?[0-9]{7,15}$/, 'Please enter a valid phone number'], // supports international
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    minlength: [10, 'Message must be at least 10 characters long'],
    maxlength: [500, 'Message must be at most 500 characters long'],
  },
}, { timestamps: true });

contactSchema.plugin(mongoosePaginate)
const Contact = mongoose.model('Contact', contactSchema);
export default Contact;
