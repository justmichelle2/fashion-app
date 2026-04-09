import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Trash2, AlertCircle, CheckCircle, Loader } from "lucide-react";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { uploadPortfolioImage, deleteImage } from "../services/imageUploadService";
import { db } from "../firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function DesignerPortfolio() {
  const navigate = useNavigate();
  const { currentUser, userProfile } = useContext(AuthContext);
  const [portfolioImages, setPortfolioImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingDesign, setUploadingDesign] = useState(false);
  const [designError, setDesignError] = useState("");
  const [designSuccess, setDesignSuccess] = useState("");
  const [deleting, setDeleting] = useState(null);

  // Load portfolio from Firestore on mount
  useEffect(() => {
    if (!currentUser?.uid) {
      setLoading(false);
      return;
    }

    const loadPortfolio = async () => {
      try {
        setLoading(true);
        const portfolioRef = doc(db, "designerPortfolios", currentUser.uid);
        const portfolioDoc = await getDoc(portfolioRef);
        
        if (portfolioDoc.exists()) {
          const items = portfolioDoc.data().items || [];
          setPortfolioImages(items);
          console.log(`Loaded ${items.length} portfolio images`);
        } else {
          setPortfolioImages([]);
        }
      } catch (err) {
        console.error("Error loading portfolio:", err);
        setDesignError("Failed to load portfolio");
      } finally {
        setLoading(false);
      }
    };

    loadPortfolio();
  }, [currentUser?.uid]);

  // Save portfolio to Firestore
  const savePortfolioToFirestore = async (updatedImages) => {
    if (!currentUser?.uid) {
      throw new Error("User ID is required to save portfolio");
    }

    try {
      const portfolioRef = doc(db, "designerPortfolios", currentUser.uid);
      await setDoc(portfolioRef, {
        designerId: currentUser.uid,
        items: updatedImages,
        updatedAt: new Date(),
      }, { merge: true });
      console.log("✓ Portfolio saved to Firestore");
    } catch (err) {
      console.error("✗ Error saving portfolio:", err);
      throw new Error(`Failed to save portfolio: ${err.message}`);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20 pb-20">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please log in as a designer to manage your portfolio</p>
          <button
            onClick={() => navigate("/designer-login")}
            className="bg-[#E63946] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#D55B3A]"
          >
            Go to Designer Login
          </button>
        </div>
      </div>
    );
  }

  const handleDesignUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setDesignError("Please upload a valid image file (JPG, PNG, or WebP)");
      setTimeout(() => setDesignError(""), 3000);
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setDesignError("File size must be less than 5MB");
      setTimeout(() => setDesignError(""), 3000);
      return;
    }

    try {
      setUploadingDesign(true);
      setDesignError("");
      console.log("Starting portfolio image upload...");

      // Upload to Firebase Storage
      console.log("Uploading to Firebase Storage...");
      const result = await uploadPortfolioImage(file, currentUser.uid);
      console.log("Upload successful:", result);
      
      // Add to portfolio
      const newItem = {
        id: result.fileName,
        url: result.url,
        path: result.path,
        uploadedAt: new Date().toISOString(),
      };
      
      console.log("Adding item to portfolio:", newItem);
      const updatedPortfolio = [newItem, ...portfolioImages];
      setPortfolioImages(updatedPortfolio);
      
      // Save to Firestore
      console.log("Saving to Firestore...");
      await savePortfolioToFirestore(updatedPortfolio);
      console.log("Firestore save successful");
      
      setDesignSuccess(`Design uploaded successfully!`);
      setTimeout(() => setDesignSuccess(""), 3000);
      
      // Reset file inputs
      const mainInput = document.getElementById("design-upload-main");
      const emptyInput = document.getElementById("design-upload-empty");
      if (mainInput) mainInput.value = "";
      if (emptyInput) emptyInput.value = "";

      setUploadingDesign(false);
      console.log("Upload complete");
    } catch (error) {
      console.error("Upload error:", error);
      setDesignError(error.message || "Failed to upload design. Please try again.");
      setUploadingDesign(false);
    }
  };

  const handleDeleteDesign = async (index) => {
    const item = portfolioImages[index];
    setDeleting(index);
    
    try {
      // Delete from Firebase Storage
      if (item.path) {
        await deleteImage(item.path);
      }
      
      // Update state
      const updated = portfolioImages.filter((_, i) => i !== index);
      setPortfolioImages(updated);
      
      // Save to Firestore
      await savePortfolioToFirestore(updated);
      
      setDesignSuccess("Design deleted successfully!");
      setTimeout(() => setDesignSuccess(""), 3000);
    } catch (error) {
      setDesignError(error.message || "Failed to delete design");
      setTimeout(() => setDesignError(""), 3000);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-24">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white rounded-lg transition"
          >
            <ArrowLeft size={24} className="text-[#2D2D2D]" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-[#2D2D2D]">Portfolio</h1>
            <p className="text-[#2D3436] text-sm">Manage your design collection</p>
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
          <h2 className="text-[#2D2D2D] font-bold text-lg mb-4">Upload Design</h2>

          {designError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm flex gap-3">
              <AlertCircle size={20} className="flex-shrink-0" />
              {designError}
            </div>
          )}

          {designSuccess && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm flex gap-3">
              <CheckCircle size={20} className="flex-shrink-0" />
              {designSuccess}
            </div>
          )}

          <label className="block cursor-pointer">
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-[#E63946] hover:bg-[#E63946]/5 transition-all">
              <Upload size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-[#2D2D2D] font-bold text-lg mb-1">Click to upload design</p>
              <p className="text-[#2D3436] text-sm mb-3">or drag and drop</p>
              <p className="text-[#2D3436] text-xs">JPG, PNG, or WebP (max 5MB)</p>
              <input
                id="design-upload-main"
                type="file"
                accept="image/*"
                onChange={handleDesignUpload}
                disabled={uploadingDesign}
                className="hidden"
              />
            </div>
          </label>

          {uploadingDesign && (
            <div className="mt-4 flex items-center gap-2 text-[#E63946]">
              <div className="animate-spin">
                <div className="w-5 h-5 border-2 border-gray-200 border-t-[#E63946] rounded-full"></div>
              </div>
              <span className="font-semibold">Uploading...</span>
            </div>
          )}
        </div>

        {/* Design Tips */}
        <div className="bg-[#E63946]/5 border border-[#E63946]/20 rounded-3xl p-6 mb-6">
          <h3 className="text-[#2D2D2D] font-bold mb-4 flex items-center gap-2">
            📸 Design Upload Guidelines
          </h3>
          <ul className="space-y-3 text-[#2D3436] text-sm">
            <li className="flex gap-3">
              <span className="text-[#E63946] font-bold">•</span>
              <span>Use high-quality, well-lit photos of your work</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#E63946] font-bold">•</span>
              <span>Upload at least 5 designs to showcase your skills</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#E63946] font-bold">•</span>
              <span>Include photos from different angles when possible</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#E63946] font-bold">•</span>
              <span>Use consistent styling in your portfolio images</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#E63946] font-bold">•</span>
              <span>Make sure designs clearly show the craftsmanship and details</span>
            </li>
          </ul>
        </div>

        {/* Portfolio Gallery */}
        <div className="bg-[#2D2D2D]/70 rounded-3xl p-6 shadow-[0_8px_24px_rgba(45,45,45,0.35)] border border-[rgba(45,45,45,0.1)] backdrop-blur-lg">
          <h2 className="text-white font-bold text-lg mb-4">
            My Designs ({portfolioImages.length})
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-[#E63946]/30 border-t-[#E63946] rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[#2D3436]">Loading portfolio...</p>
            </div>
          ) : portfolioImages.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {portfolioImages.map((item, index) => (
                <div key={item.id || index} className="relative group">
                  <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-sm">
                    <img
                      src={item.url || item}
                      alt={`Design ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => handleDeleteDesign(index)}
                      disabled={deleting === index}
                      className="bg-red-600 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-red-700 transition flex items-center gap-2 disabled:opacity-50"
                    >
                      {deleting === index ? (
                        <>
                          <Loader size={16} className="animate-spin" /> Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 size={16} /> Delete
                        </>
                      )}
                    </button>
                  </div>

                  {/* Label */}
                  <div className="mt-3">
                    <p className="text-white font-semibold text-sm">Design {index + 1}</p>
                    <p className="text-white/75 text-xs">Click to view details</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center border-2 border-dashed border-gray-300 rounded-2xl">
              <Upload size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-white/85 text-lg mb-4">No designs uploaded yet</p>
              <label className="cursor-pointer inline-block">
                <span className="bg-[#E63946] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#D55B3A] transition inline-block">
                  Upload your first design
                </span>
                <input
                  id="design-upload-empty"
                  type="file"
                  accept="image/*"
                  onChange={handleDesignUpload}
                  disabled={uploadingDesign}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>

        {/* Stats */}
        {portfolioImages.length > 0 && (
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
              <p className="text-[#E63946] font-bold text-2xl">{portfolioImages.length}</p>
              <p className="text-[#2D3436] text-xs mt-1">Designs</p>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
              <p className="text-[#D4AF37] font-bold text-2xl">{Math.min(portfolioImages.length * 20, 100)}%</p>
              <p className="text-[#2D3436] text-xs mt-1">Profile Complete</p>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
              <p className="text-[#D4AF37] font-bold text-2xl">#1</p>
              <p className="text-[#2D3436] text-xs mt-1">Trending</p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
