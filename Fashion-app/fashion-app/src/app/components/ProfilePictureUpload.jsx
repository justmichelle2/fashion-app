import { useState } from "react";
import { Camera, X } from "lucide-react";
import ImageUploader from "./ImageUploader";
import { uploadProfilePicture } from "../services/imageUploadService";
import { db } from "../firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

export function ProfilePictureUpload({ userId, currentImage, onUploadSuccess, className = "" }) {
  const [showUploader, setShowUploader] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleUploadSuccess = async (result) => {
    try {
      // Save image URL to user profile in Firestore
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        profilePicture: result.url,
        updatedAt: new Date(),
      });
      console.log("Profile picture saved to Firestore");
    } catch (err) {
      console.error("Error saving profile picture:", err);
      setError("Failed to save profile picture");
      setTimeout(() => setError(""), 3000);
      return;
    }
    
    setShowUploader(false);
    setUploading(false);
    onUploadSuccess?.(result);
  };

  const handleUploadError = (errorMessage) => {
    setError(errorMessage);
    setUploading(false);
  };

  return (
    <div className={className}>
      <div className="relative inline-block">
        {/* Profile Image */}
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg flex items-center justify-center">
          {currentImage ? (
            <img
              src={currentImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-gray-300">
              <Camera size={40} />
            </div>
          )}
        </div>

        {/* Upload Button */}
        <button
          onClick={() => setShowUploader(true)}
          className="absolute bottom-0 right-0 bg-[#E76F51] text-white rounded-full p-3 hover:bg-[#D35F41] transition-all shadow-lg"
        >
          <Camera size={20} />
        </button>
      </div>

      {/* Upload Modal */}
      {showUploader && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[#2D2D2D] text-xl font-semibold">Upload Profile Picture</h2>
              <button
                onClick={() => setShowUploader(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
              >
                <X size={24} className="text-[#4B5563]" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            <ImageUploader
              uploadPath={`profiles/${userId}`}
              buttonText="Choose Profile Picture"
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
              showPreview={true}
              disabled={uploading}
            />

            <p className="text-[#4B5563] text-xs text-center mt-4">
              Recommended: Square image, at least 400x400px
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePictureUpload;
