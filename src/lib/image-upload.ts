import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Image optimization settings
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_DIMENSION = 200; // 200px max width/height for logos
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export interface ImageUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Optimize and resize an image file for logo upload
 */
function optimizeImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions maintaining aspect ratio
      let { width, height } = img;
      const aspectRatio = width / height;

      if (width > height) {
        width = Math.min(width, MAX_DIMENSION);
        height = width / aspectRatio;
      } else {
        height = Math.min(height, MAX_DIMENSION);
        width = height * aspectRatio;
      }

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Draw and compress image
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to optimize image'));
          }
        },
        'image/webp', // Use WebP for better compression
        0.8 // 80% quality
      );
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Upload a logo image to Firebase Storage
 */
export async function uploadLogo(
  file: File,
  userId: string,
  brandName: string
): Promise<ImageUploadResult> {
  try {
    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        success: false,
        error: 'Please upload a JPEG, PNG, or WebP image'
      };
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: 'File size must be less than 2MB'
      };
    }

    // Try to optimize the image, fallback to original if it fails
    let blobToUpload: Blob;
    try {
      blobToUpload = await optimizeImage(file);
    } catch (error) {
      blobToUpload = file;
    }

    // Create a unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop() || 'webp';
    const fileName = `logos/${userId}/${brandName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${timestamp}.${fileExtension}`;

    // Upload to Firebase Storage
    const storageRef = ref(storage, fileName);
    const snapshot = await uploadBytes(storageRef, blobToUpload);
    const downloadURL = await getDownloadURL(snapshot.ref);

    return {
      success: true,
      url: downloadURL
    };
  } catch (error) {
    console.error('Error uploading logo:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload image'
    };
  }
}

/**
 * Validate image file before upload
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Please upload a JPEG, PNG, or WebP image'
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: 'File size must be less than 2MB'
    };
  }

  return { valid: true };
}
