import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, AlertCircle, Upload, Image as ImageIcon, X } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { getDesignerById } from "../services/designerService";
import { db } from "../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { uploadImage } from "../utils/storageService";

const INITIAL_FORM_DATA = {
  title: "",
  description: "",
  garmentType: "custom",
  budget: "",
  preferredDeadline: "",
  specifications: {
    color: "",
    fabric: "",
    style: "",
    additionalNotes: "",
  },
};

export default function BookTailoring() {
  const { designerId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  const [step, setStep] = useState("booking"); // booking, review, success
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingInspo, setUploadingInspo] = useState(false);
  const [designer, setDesigner] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [successId, setSuccessId] = useState("");
  const [inspoFiles, setInspoFiles] = useState([]);
  const [inspoPreviewNames, setInspoPreviewNames] = useState([]);

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    loadDesignerProfile();
  }, [designerId, currentUser, navigate]);

  const loadDesignerProfile = async () => {
    if (!designerId) {
      setError("Designer not found");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const designer = await getDesignerById(designerId);
      setDesigner(designer);
      setError("");
    } catch (err) {
      console.error("Error loading designer:", err);
      setError("Failed to load designer profile");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("spec_")) {
      const specKey = name.replace("spec_", "");
      setFormData((prev) => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [specKey]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    setError("");
    setSuccessMessage("");
  };

  const handleInspoFilesChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) {
      setInspoFiles([]);
      setInspoPreviewNames([]);
      return;
    }

    setInspoFiles(files);
    setInspoPreviewNames(files.map((file) => file.name));
    setError("");
    setSuccessMessage("");
  };

  const removeInspoFile = (fileIndex) => {
    const nextFiles = inspoFiles.filter((_, index) => index !== fileIndex);
    setInspoFiles(nextFiles);
    setInspoPreviewNames(nextFiles.map((file) => file.name));
  };

  const resetBookingForm = () => {
    setFormData(INITIAL_FORM_DATA);
    setInspoFiles([]);
    setInspoPreviewNames([]);
  };

  // Image uploads disabled due to Firebase Storage CORS issues
  // To be implemented with server-side backend in future
  // const uploadInspirationImages = async () => {
  //   if (!inspoFiles.length || !currentUser?.uid) {
  //     return [];
  //   }
  //
  //   setUploadingInspo(true);
  //   const uploaded = [];
  //
  //   try {
  //     for (const file of inspoFiles) {
  //       try {
  //         const result = await uploadImage(file, `orders/inspiration/${currentUser.uid}/${designerId}`);
  //         if (result.success) {
  //           uploaded.push({
  //             url: result.url,
  //             fileName: result.fileName,
  //           });
  //         } else {
  //           console.warn("Failed to upload inspiration image:", result.error);
  //         }
  //       } catch (err) {
  //         console.warn("Error uploading inspiration image:", err);
  //       }
  //     }
  //
  //     return uploaded;
  //   } finally {
  //     setUploadingInspo(false);
  //   }
  // };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError("Please enter a title for your project");
      return false;
    }
    if (!formData.description.trim()) {
      setError("Please describe your design requirements");
      return false;
    }
    if (!formData.budget || parseFloat(formData.budget) <= 0) {
      setError("Please enter a valid budget");
      return false;
    }
    if (!formData.preferredDeadline) {
      setError("Please select a deadline");
      return false;
    }

    const deadline = new Date(formData.preferredDeadline);
    if (deadline < new Date()) {
      setError("Deadline must be in the future");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser?.uid) {
      setError("Please log in to submit a booking request.");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      console.log("Starting booking submission...");
      
      // Skip image uploads due to CORS issues - will implement server-side upload later
      const uploadedInspirationImages = [];
      if (inspoFiles.length > 0) {
        console.log("Image uploads skipped (will implement server upload later)");
      }

      // Create order
      console.log("Creating order in Firestore...");
      const orderRef = collection(db, "orders");
      const orderDocRef = await addDoc(orderRef, {
        customerId: currentUser.uid,
        designerId,
        designerName: designer?.businessName || designer?.name || "Designer",
        customerName: currentUser.displayName || "Customer",
        title: formData.title,
        description: formData.description,
        garmentType: formData.garmentType,
        price: parseFloat(formData.budget),
        budget: parseFloat(formData.budget),
        deadlineDate: new Date(formData.preferredDeadline),
        specifications: formData.specifications,
        inspirationImages: uploadedInspirationImages,
        notes: formData.specifications?.additionalNotes || "",
        status: "pending",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      console.log("Order created with ID:", orderDocRef.id);

      // Create booking inquiry
      console.log("Creating booking inquiry...");
      const inquiryRef = collection(db, "bookingInquiries");
      await addDoc(inquiryRef, {
        customerId: currentUser.uid,
        designerId: designerId,
        designerName: designer?.businessName || designer?.name || "Designer",
        customerName: currentUser.displayName || "Customer",
        title: formData.title,
        description: formData.description,
        garmentType: formData.garmentType,
        budget: parseFloat(formData.budget),
        preferredDeadline: new Date(formData.preferredDeadline),
        inspirationImages: uploadedInspirationImages,
        specifications: formData.specifications,
        linkedOrderId: orderDocRef.id,
        status: "pending",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      console.log("Booking inquiry created successfully");

      setSuccessId(orderDocRef.id);
      setSuccessMessage("Booking submitted successfully.");
      resetBookingForm();
      setStep("success");
    } catch (err) {
      console.error("Error creating booking inquiry:", err);
      setError(err.message || "Failed to create booking inquiry. Please check browser console for details.");
    } finally {
      setSubmitting(false);
    }
  };

  const garmentTypes = [
    { value: "custom", label: "Custom Design" },
    { value: "dress", label: "Dress" },
    { value: "suit", label: "Suit" },
    { value: "traditional", label: "Traditional Wear" },
    { value: "casual", label: "Casual Wear" },
    { value: "wedding", label: "Wedding Dress" },
    { value: "formal", label: "Formal Wear" },
    { value: "alterations", label: "Alterations" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E76F51] mx-auto mb-4"></div>
          <p className="text-[#4B5563]">Loading designer profile...</p>
        </div>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 pb-24">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Check size={32} className="text-green-600" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-[#2D2D2D] mb-2">Booking Inquiry Sent!</h1>
          <p className="text-[#4B5563] mb-6">
            Your inquiry has been sent to {designer?.businessName || designer?.name}. 
            They will review it and respond within 24 hours.
          </p>

          {successMessage && (
            <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {successMessage}
            </div>
          )}

          <div className="bg-[#EAB308]/10 border border-[#EAB308] rounded-lg p-4 mb-6">
            <p className="text-sm text-[#2D2D2D] mb-1 font-semibold">Inquiry ID</p>
            <p className="text-xs text-[#4B5563] font-mono">{successId}</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate("/customer/home")}
              className="w-full bg-[#E76F51] text-white py-3 rounded-lg font-semibold hover:bg-[#D55B3A] transition"
            >
              Back to Home
            </button>
            <button
              onClick={() => navigate("/customer/orders")}
              className="w-full border-2 border-[#E76F51] text-[#E76F51] py-3 rounded-lg font-semibold hover:bg-[#E76F51]/5 transition"
            >
              View My Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl overflow-hidden pb-24">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#E76F51] to-[#F4A261] px-6 py-8 text-white">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white/20 rounded-lg transition"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">Book Tailoring</h1>
              <p className="text-white/90 text-sm">
                {designer?.businessName || designer?.name || "Designer"}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project Title */}
            <div>
              <label className="block text-[#2D2D2D] text-sm font-semibold mb-2">
                Project Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Wedding Dress, Business Suit"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E76F51] focus:border-transparent"
              />
            </div>

            {/* Garment Type */}
            <div>
              <label className="block text-[#2D2D2D] text-sm font-semibold mb-2">
                Garment Type *
              </label>
              <select
                name="garmentType"
                value={formData.garmentType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E76F51] focus:border-transparent"
              >
                {garmentTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-[#2D2D2D] text-sm font-semibold mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the design you want in detail..."
                rows="4"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E76F51] focus:border-transparent resize-none"
              />
            </div>

            {/* Budget */}
            <div>
              <label className="block text-[#2D2D2D] text-sm font-semibold mb-2">
                Budget (GHS) *
              </label>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                placeholder="Enter your budget"
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E76F51] focus:border-transparent"
              />
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-[#2D2D2D] text-sm font-semibold mb-2">
                Preferred Deadline *
              </label>
              <input
                type="datetime-local"
                name="preferredDeadline"
                value={formData.preferredDeadline}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E76F51] focus:border-transparent"
              />
            </div>

            {/* Specifications */}
            <div className="space-y-4">
              <h3 className="text-[#2D2D2D] font-semibold">Specifications (Optional)</h3>
              
              <input
                type="text"
                name="spec_color"
                value={formData.specifications.color}
                onChange={handleInputChange}
                placeholder="Color preferences"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E76F51] focus:border-transparent"
              />

              <input
                type="text"
                name="spec_fabric"
                value={formData.specifications.fabric}
                onChange={handleInputChange}
                placeholder="Fabric type"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E76F51] focus:border-transparent"
              />

              <input
                type="text"
                name="spec_style"
                value={formData.specifications.style}
                onChange={handleInputChange}
                placeholder="Style or design inspiration"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E76F51] focus:border-transparent"
              />

              <textarea
                name="spec_additionalNotes"
                value={formData.specifications.additionalNotes}
                onChange={handleInputChange}
                placeholder="Any additional notes..."
                rows="3"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E76F51] focus:border-transparent resize-none"
              />
            </div>

            {/* Inspiration Images */}
            <div className="space-y-3">
              <h3 className="text-[#2D2D2D] font-semibold">Upload Inspiration (Optional)</h3>
              <label className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center gap-3 cursor-pointer hover:border-[#E76F51] transition">
                <Upload size={18} className="text-[#E76F51]" />
                <span className="text-sm text-[#4B5563]">Upload inspo images (max 5MB each)</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleInspoFilesChange}
                  className="hidden"
                  disabled={submitting || uploadingInspo}
                />
              </label>

              {inspoPreviewNames.length > 0 && (
                <div className="space-y-2">
                  {inspoPreviewNames.map((fileName, index) => (
                    <div key={`${fileName}-${index}`} className="flex items-center justify-between gap-3 p-2 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 min-w-0">
                        <ImageIcon size={16} className="text-[#E76F51] flex-shrink-0" />
                        <span className="text-sm text-[#2D2D2D] truncate">{fileName}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeInspoFile(index)}
                        className="p-1 rounded hover:bg-gray-200 transition"
                        aria-label={`Remove ${fileName}`}
                      >
                        <X size={14} className="text-[#4B5563]" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || uploadingInspo}
              className="w-full bg-[#E76F51] text-white py-4 rounded-lg font-semibold hover:bg-[#D55B3A] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting || uploadingInspo ? "Sending..." : "Send Inquiry"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
