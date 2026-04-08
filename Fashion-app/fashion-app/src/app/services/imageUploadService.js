import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "../firebaseConfig";

/**
 * Upload an image to Firebase Storage
 * @param {File} file - The image file to upload
 * @param {string} path - Storage path (e.g., "profiles/userId", "portfolios/designerId")
 * @param {string} fileName - Optional custom file name (defaults to file.name)
 * @returns {Promise<{url: string, path: string, fileName: string}>}
 */
export async function uploadImage(file, path, fileName = null) {
  if (!file || !path) {
    throw new Error("File and path are required");
  }

  // Validate file is image
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed");
  }

  // Validate file size (max 5MB)
  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File size must be less than 5MB");
  }

  try {
    const timestamp = Date.now();
    const fileExtension = file.name.split(".").pop();
    const uploadFileName = fileName || `${timestamp}-${file.name}`;
    const storagePath = `${path}/${uploadFileName}`;

    // Create storage reference
    const storageRef = ref(storage, storagePath);

    // Upload file with metadata
    const metadata = {
      contentType: file.type,
      customMetadata: {
        uploadedAt: new Date().toISOString(),
      },
    };

    const snapshot = await uploadBytes(storageRef, file, metadata);

    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    return {
      url: downloadURL,
      path: storagePath,
      fileName: uploadFileName,
      size: file.size,
      type: file.type,
    };
  } catch (error) {
    console.error("Image upload error:", error);
    if (error.code === "storage/canceled") {
      throw new Error("Upload was cancelled");
    }
    if (error.code === "storage/quota-exceeded") {
      throw new Error("Storage quota exceeded. Please try again later.");
    }
    throw new Error(error.message || "Failed to upload image");
  }
}

/**
 * Upload profile picture
 * @param {File} file - Profile image file
 * @param {string} userId - User ID
 * @returns {Promise<{url: string, path: string}>}
 */
export async function uploadProfilePicture(file, userId) {
  if (!userId) throw new Error("User ID is required");
  return uploadImage(file, `profiles/${userId}`, `profile-pic`);
}

/**
 * Upload portfolio images
 * @param {File} file - Portfolio image file
 * @param {string} designerId - Designer ID
 * @param {string} portfolioId - Optional portfolio/project ID
 * @returns {Promise<{url: string, path: string}>}
 */
export async function uploadPortfolioImage(file, designerId, portfolioId = null) {
  if (!designerId) throw new Error("Designer ID is required");
  const basePath = `portfolios/${designerId}`;
  const folder = portfolioId ? `${basePath}/${portfolioId}` : basePath;
  return uploadImage(file, folder);
}

/**
 * Upload work samples/designs
 * @param {File} file - Work sample image
 * @param {string} designerId - Designer ID
 * @param {string} designId - Design/order ID
 * @returns {Promise<{url: string, path: string}>}
 */
export async function uploadWorkSample(file, designerId, designId) {
  if (!designerId || !designId) {
    throw new Error("Designer ID and Design ID are required");
  }
  return uploadImage(file, `work-samples/${designerId}/${designId}`);
}

/**
 * Upload measurement body images
 * @param {File} file - Body measurement image
 * @param {string} customerId - Customer ID
 * @param {string} imageType - Type of image (front, side, back)
 * @returns {Promise<{url: string, path: string}>}
 */
export async function uploadMeasurementImage(file, customerId, imageType = "photo") {
  if (!customerId) throw new Error("Customer ID is required");
  return uploadImage(file, `measurements/${customerId}`, `${imageType}-${Date.now()}`);
}

/**
 * Upload order/design images
 * @param {File} file - Design image
 * @param {string} orderId - Order ID
 * @returns {Promise<{url: string, path: string}>}
 */
export async function uploadOrderImage(file, orderId) {
  if (!orderId) throw new Error("Order ID is required");
  return uploadImage(file, `orders/${orderId}`);
}

/**
 * Delete image from Firebase Storage
 * @param {string} storagePath - Full storage path of the image
 * @returns {Promise<void>}
 */
export async function deleteImage(storagePath) {
  if (!storagePath) {
    throw new Error("Storage path is required");
  }

  try {
    const storageRef = ref(storage, storagePath);
    await deleteObject(storageRef);
  } catch (error) {
    console.error("Image deletion error:", error);
    if (error.code === "storage/object-not-found") {
      console.warn("Image not found, but proceeding...");
      return;
    }
    throw new Error(error.message || "Failed to delete image");
  }
}

/**
 * Upload multiple images
 * @param {File[]} files - Array of image files
 * @param {string} path - Storage path
 * @returns {Promise<Array>}
 */
export async function uploadMultipleImages(files, path) {
  if (!files || files.length === 0) {
    throw new Error("No files provided");
  }

  try {
    const uploads = files.map((file) => uploadImage(file, path));
    return await Promise.all(uploads);
  } catch (error) {
    console.error("Batch upload error:", error);
    throw new Error(error.message || "Failed to upload some images");
  }
}

/**
 * Validate image file before upload
 * @param {File} file - File to validate
 * @returns {object} {isValid: boolean, error?: string}
 */
export function validateImageFile(file) {
  if (!file) {
    return { isValid: false, error: "No file selected" };
  }

  if (!file.type.startsWith("image/")) {
    return { isValid: false, error: "File must be an image (JPG, PNG, GIF, WebP)" };
  }

  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  if (file.size > MAX_SIZE) {
    return {
      isValid: false,
      error: `File size must be less than 5MB (current: ${(file.size / 1024 / 1024).toFixed(2)}MB)`,
    };
  }

  const validExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
  const fileExtension = file.name.split(".").pop()?.toLowerCase();
  if (!validExtensions.includes(fileExtension)) {
    return {
      isValid: false,
      error: `File format not supported. Allowed: ${validExtensions.join(", ")}`,
    };
  }

  return { isValid: true };
}

/**
 * Get image dimensions
 * @param {File} file - Image file
 * @returns {Promise<{width: number, height: number}>}
 */
export function getImageDimensions(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
