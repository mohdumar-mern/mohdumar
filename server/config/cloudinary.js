import dotenv from 'dotenv'
import { v2 as cloudinary } from 'cloudinary';

dotenv.config()
// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Delete a file from Cloudinary by its public_id
 * @param {string} publicId - The public_id of the file in Cloudinary
 * @returns {Promise<object>} Cloudinary response
 */
export const deleteFileFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error(`❌ Failed to delete ${publicId} from Cloudinary:`, error);
    throw new Error('Cloudinary deletion failed');
  }
};

export default cloudinary;