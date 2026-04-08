import { storage } from "../firebaseConfig";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

/**
 * ============================================
 * FIREBASE CLOUD STORAGE SERVICE
 * Handles file uploads: images, measurements, designs
 * ============================================
 */

/**
 * UPLOAD IMAGE
 * Uploads an image file to Firebase Cloud Storage
 * @param {File} file - The image file to upload
 * @param {string} folder - Storage folder path (e.g., "users", "designs", "measurements")
 * @param {string} fileName - Custom file name (optional, uses timestamp if not provided)
 * @returns {Promise} - Download URL of uploaded file
 */
export const uploadImage = async (file, folder, fileName = null) => {
  try {
    if (!file) throw new Error("No file provided");
    if (!folder) throw new Error("Folder path is required");

    // Validate file is image
    if (!file.type.startsWith("image/")) {
      throw new Error("File must be an image");
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error("Image size must be less than 5MB");
    }

    // Generate file name
    const finalFileName = fileName || `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `${folder}/${finalFileName}`);

    // Upload file
    const snapshot = await uploadBytes(storageRef, file);

    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    return {
      success: true,
      url: downloadURL,
      fileName: finalFileName,
      path: snapshot.ref.fullPath,
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    return { success: false, error: error.message };
  }
};

/**
 * UPLOAD MULTIPLE IMAGES
 * Uploads multiple image files
 */
export const uploadMultipleImages = async (files, folder) => {
  try {
    if (!files || files.length === 0) throw new Error("No files provided");

    const uploadPromises = Array.from(files).map((file) => uploadImage(file, folder));
    const results = await Promise.all(uploadPromises);

    const successful = results.filter((r) => r.success);
    const failed = results.filter((r) => !r.success);

    return {
      success: failed.length === 0,
      uploaded: successful.map((r) => ({ url: r.url, fileName: r.fileName })),
      failed: failed.map((r) => r.error),
      total: files.length,
    };
  } catch (error) {
    console.error("Error uploading multiple images:", error);
    return { success: false, error: error.message };
  }
};

/**
 * UPLOAD MEASUREMENT IMAGE
 * Uploads measurement photo with user context
 * Folder structure: measurements/{userId}/{orderId}
 */
export const uploadMeasurementImage = async (userId, orderId, file) => {
  try {
    if (!userId || !orderId || !file) {
      throw new Error("userId, orderId, and file are required");
    }

    const folder = `measurements/${userId}/${orderId}`;
    const fileName = `${Date.now()}_measurement.jpg`;

    const result = await uploadImage(file, folder, fileName);

    if (result.success) {
      return {
        success: true,
        url: result.url,
        orderId,
        userId,
        uploadedAt: new Date(),
      };
    }

    return result;
  } catch (error) {
    console.error("Error uploading measurement image:", error);
    return { success: false, error: error.message };
  }
};

/**
 * UPLOAD DESIGN IMAGE
 * Uploads design portfolio image
 * Folder structure: designs/{designerId}
 */
export const uploadDesignImage = async (designerId, file) => {
  try {
    if (!designerId || !file) {
      throw new Error("designerId and file are required");
    }

    const folder = `designs/${designerId}`;
    const fileName = `${Date.now()}_design.jpg`;

    const result = await uploadImage(file, folder, fileName);

    if (result.success) {
      return {
        success: true,
        url: result.url,
        designerId,
        uploadedAt: new Date(),
      };
    }

    return result;
  } catch (error) {
    console.error("Error uploading design image:", error);
    return { success: false, error: error.message };
  }
};

/**
 * UPLOAD PROFILE PICTURE
 * Uploads user profile picture
 * Folder structure: profiles/{userId}
 */
export const uploadProfilePicture = async (userId, file) => {
  try {
    if (!userId || !file) {
      throw new Error("userId and file are required");
    }

    const folder = `profiles/${userId}`;
    const fileName = `profile_picture.jpg`;

    const result = await uploadImage(file, folder, fileName);

    if (result.success) {
      return {
        success: true,
        url: result.url,
        userId,
        uploadedAt: new Date(),
      };
    }

    return result;
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    return { success: false, error: error.message };
  }
};

/**
 * DELETE FILE
 * Deletes a file from Cloud Storage
 * @param {string} filePath - Full path to file (from uploadImage result)
 */
export const deleteFile = async (filePath) => {
  try {
    if (!filePath) throw new Error("File path is required");

    const fileRef = ref(storage, filePath);
    await deleteObject(fileRef);

    return { success: true, message: "File deleted successfully" };
  } catch (error) {
    console.error("Error deleting file:", error);
    return { success: false, error: error.message };
  }
};

/**
 * GET FILE URL
 * Gets download URL for a file
 */
export const getFileURL = async (filePath) => {
  try {
    if (!filePath) throw new Error("File path is required");

    const fileRef = ref(storage, filePath);
    const url = await getDownloadURL(fileRef);

    return { success: true, url };
  } catch (error) {
    console.error("Error getting file URL:", error);
    return { success: false, error: error.message };
  }
};

/**
 * STORAGE FOLDER STRUCTURE
 * 
 * profiles/
 *   {userId}/
 *     profile_picture.jpg
 *
 * designs/
 *   {designerId}/
 *     {timestamp}_design.jpg
 *     {timestamp}_design.jpg
 *
 * measurements/
 *   {userId}/
 *     {orderId}/
 *       {timestamp}_measurement.jpg
 *
 * chat/
 *   {conversationId}/
 *     {timestamp}_attachment.jpg
 */
