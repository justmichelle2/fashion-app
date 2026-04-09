import { useState, useEffect } from "react";
import { Plus, Trash2, Loader } from "lucide-react";
import ImageUploader from "./ImageUploader";
import { uploadPortfolioImage, deleteImage } from "../services/imageUploadService";
import { db } from "../firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";

export function PortfolioUploader({ designerId, onPortfolioUpdate, className = "" }) {
  const [portfolio, setPortfolio] = useState([]);
  const [showUploader, setShowUploader] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load portfolio from Firestore on mount
  useEffect(() => {
    if (!designerId) {
      setLoading(false);
      return;
    }

    const loadPortfolio = async () => {
      try {
        setLoading(true);
        const portfolioRef = doc(db, "designerPortfolios", designerId);
        const portfolioDoc = await getDoc(portfolioRef);
        
        if (portfolioDoc.exists()) {
          const items = portfolioDoc.data().items || [];
          setPortfolio(items);
          console.log(`Loaded ${items.length} portfolio items for designer ${designerId}`);
        } else {
          console.log("No portfolio found, starting fresh");
          setPortfolio([]);
        }
      } catch (err) {
        console.error("Error loading portfolio:", err);
        setError("Failed to load portfolio");
        setTimeout(() => setError(""), 3000);
      } finally {
        setLoading(false);
      }
    };

    loadPortfolio();
  }, [designerId]);

  // Save portfolio to Firestore
  const savePortfolioToFirestore = async (updatedPortfolio) => {
    if (!designerId) return;

    try {
      const portfolioRef = doc(db, "designerPortfolios", designerId);
      await setDoc(portfolioRef, {
        designerId,
        items: updatedPortfolio,
        updatedAt: new Date(),
      }, { merge: true });
      console.log("Portfolio saved to Firestore");
    } catch (err) {
      console.error("Error saving portfolio:", err);
      setError("Failed to save portfolio");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleUploadSuccess = async (result) => {
    const newItem = {
      id: result.fileName,
      url: result.url,
      path: result.path,
      uploadedAt: new Date().toISOString(),
      title: "",
      description: "",
    };
    
    const updatedPortfolio = [newItem, ...portfolio];
    setPortfolio(updatedPortfolio);
    setShowUploader(false);
    setUploading(false);
    
    // Save to Firestore
    await savePortfolioToFirestore(updatedPortfolio);
    onPortfolioUpdate?.(updatedPortfolio);
  };

  const handleDelete = async (item) => {
    setDeleting(item.id);
    try {
      await deleteImage(item.path);
      const updated = portfolio.filter(p => p.id !== item.id);
      setPortfolio(updated);
      
      // Save to Firestore
      await savePortfolioToFirestore(updated);
      onPortfolioUpdate?.(updated);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(""), 3000);
    } finally {
      setDeleting(null);
    }
  };

  const updateItemTitle = async (id, title) => {
    const updated = portfolio.map(p => 
      p.id === id ? { ...p, title } : p
    );
    setPortfolio(updated);
    
    // Save to Firestore
    await savePortfolioToFirestore(updated);
  };

  const updateItemDescription = async (id, description) => {
    const updated = portfolio.map(p => 
      p.id === id ? { ...p, description } : p
    );
    setPortfolio(updated);
    
    // Save to Firestore
    await savePortfolioToFirestore(updated);
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[#2D2D2D] text-2xl font-semibold">Portfolio</h2>
        <button
          onClick={() => setShowUploader(true)}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-[#E76F51] text-white rounded-lg hover:bg-[#D35F41] transition-all font-semibold disabled:opacity-50"
        >
          <Plus size={20} />
          Add Work
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-[#E76F51]/30 border-t-[#E76F51] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#4B5563]">Loading portfolio...</p>
        </div>
      ) : portfolio.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {portfolio.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              {/* Image */}
              <div className="relative h-32 overflow-hidden bg-gray-100">
                <img
                  src={item.url}
                  alt={item.title || "Portfolio item"}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(item)}
                  disabled={deleting === item.id}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all disabled:opacity-50"
                >
                  {deleting === item.id ? (
                    <Loader size={16} className="animate-spin" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                </button>
              </div>

              {/* Details */}
              <div className="p-4">
                <input
                  type="text"
                  placeholder="Project title"
                  value={item.title || ""}
                  onChange={(e) => updateItemTitle(item.id, e.target.value)}
                  className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm font-semibold text-[#2D2D2D] placeholder-gray-400 mb-2 focus:outline-none focus:border-[#E76F51]"
                />
                <textarea
                  placeholder="Project description"
                  value={item.description || ""}
                  onChange={(e) => updateItemDescription(item.id, e.target.value)}
                  maxLength={200}
                  className="w-full px-2 py-1 border border-gray-200 rounded-lg text-xs text-[#4B5563] placeholder-gray-400 resize-none focus:outline-none focus:border-[#E76F51]"
                  rows={3}
                />
                <p className="text-[#4B5563] text-xs mt-2">
                  {item.description?.length || 0}/200
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100">
          <p className="text-[#4B5563] font-semibold mb-2">No portfolio items yet</p>
          <p className="text-[#4B5563] text-sm mb-4">Showcase your best work to attract customers</p>
          <button
            onClick={() => setShowUploader(true)}
            className="px-6 py-2 bg-[#E76F51] text-white rounded-lg hover:bg-[#D35F41] transition-all font-semibold"
          >
            Add First Work
          </button>
        </div>
      )}

      {/* Upload Modal */}
      {showUploader && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 max-h-96 overflow-y-auto">
            <h2 className="text-[#2D2D2D] text-xl font-semibold mb-6">Add to Portfolio</h2>

            <ImageUploader
              uploadPath={`portfolios/${designerId}`}
              buttonText="Upload Portfolio Image"
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
              Recommended: High-quality images showing finished work
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default PortfolioUploader;
