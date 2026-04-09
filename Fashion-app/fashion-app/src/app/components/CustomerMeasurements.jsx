import { useEffect, useState } from "react";
import { Ruler, Image as ImageIcon, FileText, Eye, Download, AlertCircle } from "lucide-react";
import { getDesignerOrdersMeasurements, markMeasurementsViewed } from "../services/measurementsService";

export function CustomerMeasurements({ designerId, selectedCustomerId, onMeasurementsLoad }) {
  const [measurements, setMeasurements] = useState(null);
  const [allCustomersMeasurements, setAllCustomersMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(selectedCustomerId);
  const [viewedStatus, setViewedStatus] = useState({});

  useEffect(() => {
    const loadMeasurements = async () => {
      setLoading(true);
      setError("");
      try {
        const customersMeasurements = await getDesignerOrdersMeasurements(designerId);
        setAllCustomersMeasurements(customersMeasurements);
        onMeasurementsLoad?.(customersMeasurements.length);

        if (customersMeasurements.length > 0) {
          const firstCustomer = selectedCustomerId || customersMeasurements[0].customerId;
          setSelectedCustomer(firstCustomer);
          const customer = customersMeasurements.find(m => m.customerId === firstCustomer);
          setMeasurements(customer);
          
          // Mark as viewed
          if (customer && designerId) {
            await markMeasurementsViewed(customer.customerId, designerId);
          }
        }
      } catch (err) {
        setError("Failed to load measurements");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadMeasurements();
  }, [designerId, selectedCustomerId]);

  const handleSelectCustomer = async (customerId) => {
    const customer = allCustomersMeasurements.find(m => m.customerId === customerId);
    setSelectedCustomer(customerId);
    setMeasurements(customer);

    if (customer && designerId) {
      await markMeasurementsViewed(customerId, designerId);
    }
  };

  const downloadMeasurements = () => {
    if (!measurements) return;

    const text = `
Customer Measurements Report
============================

Customer: ${measurements.customerName || "Unknown"}
Order ID: ${measurements.orderId}
Date: ${measurements.uploadedAt?.toLocaleDateString() || "N/A"}

BODY MEASUREMENTS (cm)
---------------------
Height: ${measurements.height || "N/A"}
Weight: ${measurements.weight || "N/A"}
Bust/Chest: ${measurements.bust || "N/A"}
Waist: ${measurements.waist || "N/A"}
Hips: ${measurements.hips || "N/A"}
Shoulder: ${measurements.shoulder || "N/A"}
Sleeve Length: ${measurements.sleeve || "N/A"}
Armhole: ${measurements.armhole || "N/A"}

ADDITIONAL DETAILS
------------------
Body Type: ${measurements.bodyType || "N/A"}
Notes: ${measurements.notes || "N/A"}
Special Requirements: ${measurements.specialRequirements || "N/A"}
    `.trim();

    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
    element.setAttribute("download", `measurements-${measurements.customerId}.txt`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin">
          <div className="w-8 h-8 border-3 border-gray-200 border-t-[#E76F51] rounded-full"></div>
        </div>
      </div>
    );
  }

  if (allCustomersMeasurements.length === 0) {
    return (
      <div className="text-center py-12">
        <Ruler size={40} className="mx-auto mb-3 text-gray-300" />
        <p className="text-[#4B5563] font-semibold">No customer measurements yet</p>
        <p className="text-[#4B5563] text-sm mt-1 mb-4">
          Measurements will appear here when customers with active orders upload them
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left text-sm">
          <p className="text-blue-900 font-semibold mb-2">How this works:</p>
          <ol className="text-blue-800 space-y-1 ml-4">
            <li>1. Customer books you and creates an order</li>
            <li>2. They upload their measurements &amp; body images</li>
            <li>3. You will see them here automatically</li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Customer List */}
      <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <h3 className="text-[#2D2D2D] font-semibold">Customers</h3>
          <p className="text-[#4B5563] text-xs mt-1">
            {allCustomersMeasurements.length} customer{allCustomersMeasurements.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="overflow-y-auto max-h-96">
          {allCustomersMeasurements.map((customer) => (
            <button
              key={customer.customerId}
              onClick={() => handleSelectCustomer(customer.customerId)}
              className={`w-full px-4 py-3 border-b border-gray-100 text-left transition-all ${
                selectedCustomer === customer.customerId
                  ? "bg-[#E76F51] text-white"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm truncate">{customer.customerName}</p>
                  <p className="text-xs opacity-75 truncate">{customer.orderId}</p>
                </div>
                <Eye size={14} className="flex-shrink-0" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Measurements Detail */}
      <div className="lg:col-span-2 space-y-6">
        {measurements ? (
          <>
            {/* Header */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-[#2D2D2D] text-xl font-semibold">
                    {measurements.customerName}
                  </h2>
                  <p className="text-[#4B5563] text-sm mt-1">
                    Uploaded: {measurements.uploadedAt?.toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={downloadMeasurements}
                  className="px-4 py-2 bg-[#E76F51] text-white rounded-lg hover:bg-[#D35F41] transition-all flex items-center gap-2 font-semibold text-sm"
                >
                  <Download size={16} />
                  Download
                </button>
              </div>

              {measurements.viewedBy && measurements.viewedBy.length > 0 && (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                  <Eye size={12} />
                  Viewed
                </div>
              )}
            </div>

            {/* Measurements Grid */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="text-[#2D2D2D] font-semibold mb-4 flex items-center gap-2">
                <Ruler size={18} />
                Body Measurements
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Height", value: measurements.height, unit: "cm" },
                  { label: "Weight", value: measurements.weight, unit: "kg" },
                  { label: "Bust/Chest", value: measurements.bust, unit: "cm" },
                  { label: "Waist", value: measurements.waist, unit: "cm" },
                  { label: "Hips", value: measurements.hips, unit: "cm" },
                  { label: "Shoulder", value: measurements.shoulder, unit: "cm" },
                  { label: "Sleeve Length", value: measurements.sleeve, unit: "cm" },
                  { label: "Armhole", value: measurements.armhole, unit: "cm" }
                ].map((measurement, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-[#4B5563] text-xs mb-1">{measurement.label}</p>
                    <p className="text-[#2D2D2D] font-semibold text-lg">
                      {measurement.value || "—"}
                      {measurement.value && <span className="text-xs ml-1 opacity-75">{measurement.unit}</span>}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Body Type */}
            {measurements.bodyType && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="text-[#2D2D2D] font-semibold mb-3">Body Type</h3>
                <p className="text-[#2D2D2D] font-semibold px-3 py-2 bg-orange-50 rounded-lg inline-block">
                  {measurements.bodyType}
                </p>
              </div>
            )}

            {/* Notes */}
            {(measurements.notes || measurements.specialRequirements) && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="text-[#2D2D2D] font-semibold mb-4 flex items-center gap-2">
                  <FileText size={18} />
                  Additional Notes
                </h3>

                <div className="space-y-4">
                  {measurements.notes && (
                    <div>
                      <p className="text-[#4B5563] text-sm font-semibold mb-2">Notes</p>
                      <p className="text-[#2D2D2D] text-sm">{measurements.notes}</p>
                    </div>
                  )}

                  {measurements.specialRequirements && (
                    <div>
                      <p className="text-[#4B5563] text-sm font-semibold mb-2">Special Requirements</p>
                      <p className="text-[#2D2D2D] text-sm">{measurements.specialRequirements}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Images */}
            {(measurements.frontImage || measurements.sideImage || measurements.backImage) && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="text-[#2D2D2D] font-semibold mb-4 flex items-center gap-2">
                  <ImageIcon size={18} />
                  Reference Images
                </h3>

                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Front", src: measurements.frontImage },
                    { label: "Side", src: measurements.sideImage },
                    { label: "Back", src: measurements.backImage }
                  ].map((image, idx) => (
                    <div key={idx}>
                      <p className="text-[#4B5563] text-xs font-semibold mb-2">{image.label}</p>
                      {image.src ? (
                        <img
                          src={image.src}
                          alt={image.label}
                          className="w-full h-40 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-[#4B5563] text-xs">No image</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-2xl p-12 border border-gray-100 text-center">
            <AlertCircle size={40} className="mx-auto mb-3 text-gray-300" />
            <p className="text-[#4B5563]">Select a customer to view measurements</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerMeasurements;
