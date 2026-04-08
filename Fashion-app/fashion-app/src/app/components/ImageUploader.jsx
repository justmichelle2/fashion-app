import { useState, useRef } from "react";
import { Upload, X, CheckCircle, AlertCircle, Loader } from "lucide-react";
import { uploadImage, validateImageFile } from "../services/imageUploadService";

export function ImageUploader({ 
  onUploadSuccess, 
  onUploadError,
  uploadPath,
  maxSize = 5,
  acceptedFormats = "image/*",
  buttonText = "Upload Image",
  showPreview = true,
  multiple = false,
  className = "",
  disabled = false
}) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setError("");
    setSuccess(false);

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setError(validation.error);
      onUploadError?.(validation.error);
      return;
    }

    // Show preview
    if (showPreview) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }

    // Upload
    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 30, 90));
      }, 300);

      const result = await uploadImage(file, uploadPath);

      clearInterval(progressInterval);
      setUploadProgress(100);
      setSuccess(true);
      onUploadSuccess?.(result);

      // Reset after success
      setTimeout(() => {
        fileInputRef.current.value = "";
        setSuccess(false);
        setUploadProgress(0);
      }, 2000);
    } catch (err) {
      setError(err.message);
      onUploadError?.(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      fileInputRef.current.files = files;
      handleFileSelect({ target: { files } });
    }
  };

  return (
    <div className={className}>
      <div
        onClick={() => !disabled && !uploading && fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
          uploading || disabled
            ? "border-gray-200 bg-gray-50 cursor-not-allowed"
            : "border-[#E76F51]/30 hover:border-[#E76F51]/60 hover:bg-[#E76F51]/5"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats}
          multiple={multiple}
          onChange={handleFileSelect}
          disabled={uploading || disabled}
          className="hidden"
        />

        {/* Preview Image */}
        {preview && (
          <div className="mb-4 relative inline-block">
            <img
              src={preview}
              alt="Preview"
              className="h-32 w-32 object-cover rounded-lg border border-gray-200"
            />
            {!uploading && !success && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setPreview(null);
                  fileInputRef.current.value = "";
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
        )}

        {/* Upload Status */}
        {uploading ? (
          <div>
            <Loader className="mx-auto mb-3 text-[#E76F51] animate-spin" size={32} />
            <p className="text-[#4B5563] font-semibold mb-3">Uploading...</p>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-gradient-to-r from-[#E76F51] to-[#F4A261] transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-[#4B5563] text-xs">{uploadProgress}%</p>
          </div>
        ) : success ? (
          <div>
            <CheckCircle className="mx-auto mb-3 text-green-500" size={32} />
            <p className="text-green-600 font-semibold">Upload successful!</p>
          </div>
        ) : error ? (
          <div>
            <AlertCircle className="mx-auto mb-3 text-red-500" size={32} />
            <p className="text-red-600 font-semibold mb-2">Upload failed</p>
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        ) : (
          <div>
            <Upload className="mx-auto mb-3 text-[#E76F51]" size={32} />
            <p className="text-[#2D2D2D] font-semibold mb-1">{buttonText}</p>
            <p className="text-[#4B5563] text-xs">
              or drag and drop
            </p>
            <p className="text-[#4B5563] text-xs mt-2">
              Max size: {maxSize}MB
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageUploader;
