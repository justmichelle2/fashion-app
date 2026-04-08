import { useState } from "react";
import { Upload, Trash2, Eye, Loader } from "lucide-react";
import ImageUploader from "./ImageUploader";
import { uploadWorkSample, deleteImage } from "../services/imageUploadService";

export function WorkSamplesUploader({ designerId, orderId, onSamplesUpdate, readOnly = false, className = "" }) {
  const [samples, setSamples] = useState([]);
  const [showUploader, setShowUploader] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleUploadSuccess = async (result) => {
    const newSample = {
      id: result.fileName,
      url: result.url,
      path: result.path,
      uploadedAt: new Date(),
      caption: "",
      stage: "in-progress", // or "final"
    };
    
    setSamples([newSample, ...samples]);
    setShowUploader(false);
    setUploading(false);
    onSamplesUpdate?.([newSample, ...samples]);
  };

  const handleDelete = async (sample) => {
    setDeleting(sample.id);
    try {
      await deleteImage(sample.path);
      const updated = samples.filter(s => s.id !== sample.id);
      setSamples(updated);
      onSamplesUpdate?.(updated);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(""), 3000);
    } finally {
      setDeleting(null);
    }
  };

  const updateCaption = (id, caption) => {
    const updated = samples.map(s => 
      s.id === id ? { ...s, caption } : s
    );
    setSamples(updated);
  };

  const updateStage = (id, stage) => {
    const updated = samples.map(s => 
      s.id === id ? { ...s, stage } : s
    );
    setSamples(updated);
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[#2D2D2D] text-xl font-semibold">Work Samples</h2>
        {!readOnly && (
          <button
            onClick={() => setShowUploader(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#E76F51] text-white rounded-lg hover:bg-[#D35F41] transition-all font-semibold text-sm"
          >
            <Upload size={18} />
            Share Update
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Samples Grid */}
      {samples.length > 0 ? (
        <div className="space-y-4">
          {samples.map((sample) => (
            <div key={sample.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 p-4">
              <div className="flex gap-4">
                {/* Image */}
                <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={sample.url}
                    alt="Work sample"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setSelectedImage(sample)}
                    className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/40 transition-all"
                  >
                    <Eye size={20} className="text-white opacity-0 hover:opacity-100" />
                  </button>
                </div>

                {/* Details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <textarea
                      placeholder="Add caption..."
                      value={sample.caption || ""}
                      onChange={(e) => updateCaption(sample.id, e.target.value)}
                      maxLength={200}
                      disabled={readOnly}
                      className="flex-1 px-2 py-1 text-sm border border-gray-200 rounded-lg text-[#2D2D2D] placeholder-gray-400 resize-none disabled:bg-gray-50 disabled:cursor-not-allowed focus:outline-none focus:border-[#E76F51]"
                      rows={2}
                    />
                    {!readOnly && (
                      <button
                        onClick={() => handleDelete(sample)}
                        disabled={deleting === sample.id}
                        className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                      >
                        {deleting === sample.id ? (
                          <Loader size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    {!readOnly && (
                      <select
                        value={sample.stage}
                        onChange={(e) => updateStage(sample.id, e.target.value)}
                        className="px-3 py-1 text-xs border border-gray-200 rounded-lg text-[#2D2D2D] bg-white focus:outline-none focus:border-[#E76F51]"
                      >
                        <option value="in-progress">In Progress</option>
                        <option value="final">Final</option>
                      </select>
                    )}
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      sample.stage === "final"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}>
                      {sample.stage === "final" ? "✓ Final" : "🔨 In Progress"}
                    </span>
                    <span className="text-[#4B5563] text-xs">
                      {sample.uploadedAt?.toLocaleDateString?.() || "Today"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-2xl border border-gray-100">
          <Upload className="mx-auto mb-2 text-gray-300" size={32} />
          <p className="text-[#4B5563] font-semibold">No updates yet</p>
          <p className="text-[#4B5563] text-sm">Share work in progress or final samples</p>
        </div>
      )}

      {/* Upload Modal */}
      {showUploader && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 max-h-96 overflow-y-auto">
            <h2 className="text-[#2D2D2D] text-xl font-semibold mb-6">Share Work Update</h2>

            <ImageUploader
              uploadPath={`work-samples/${designerId}/${orderId}`}
              buttonText="Upload Work Sample"
              onUploadSuccess={handleUploadSuccess}
              onUploadError={(err) => {
                setError(err);
                setTimeout(() => setError(""), 3000);
              }}
              showPreview={true}
              disabled={uploading}
            />

            <button
              onClick={() => setShowUploader(false)}
              className="w-full mt-4 py-2 border border-gray-200 rounded-lg text-[#2D2D2D] hover:bg-gray-50 transition-all font-semibold"
            >
              Cancel
            </button>

            <p className="text-[#4B5563] text-xs text-center mt-4">
              Share progress updates or final work with your customer
            </p>
          </div>
        </div>
      )}

      {/* Image Viewer Modal */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 font-semibold"
            >
              Close
            </button>
            <img
              src={selectedImage.url}
              alt="Work sample"
              className="w-full rounded-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkSamplesUploader;
